import { useState } from "react";
import {
  callGeminiAPI,
  extractResponseText,
  getErrorMessage,
  isAPIConfigured,
} from "./api-client.js";
import "./App.css";

const FPL_2025_BASE = 15060;
const FPL_2025_PERSON = 5380;

const PROGRAMS = [
  {
    id: "snap",
    name: "SNAP Food Assistance",
    threshold: 130,
    description: "Monthly help for groceries through Ohio's food assistance program.",
    docs: ["Photo ID", "Proof of income", "Social Security numbers", "Rent or utility statement"],
    nextStep: "Start an application through the Ohio Benefits portal and prepare income verification.",
  },
  {
    id: "medicaid",
    name: "Medicaid Health Coverage",
    threshold: 138,
    description: "Health coverage support for adults, children, seniors, and households with special medical needs.",
    docs: ["Photo ID", "Proof of income", "Residency verification", "Insurance information if available"],
    nextStep: "Complete a benefits application and flag any disability or pregnancy-related needs during intake.",
  },
  {
    id: "owf",
    name: "Ohio Works First Cash Assistance",
    threshold: 50,
    description: "Temporary cash assistance for qualifying families with children.",
    docs: ["Photo ID", "Birth certificates", "Income verification", "Child support information if applicable"],
    nextStep: "Expect work and participation requirements to be reviewed as part of intake.",
  },
  {
    id: "childcare",
    name: "Publicly Funded Child Care",
    threshold: 142,
    description: "Help with child care costs for working parents, training participants, and eligible caregivers.",
    docs: ["Work or school schedule", "Income verification", "Child identity records"],
    nextStep: "Bring employment, training, or school details so ACDJFS can review care needs quickly.",
  },
];

const conditionOptions = [
  { key: "isPregnant", label: "Pregnant household member" },
  { key: "hasChildren", label: "Children in the household" },
  { key: "needsChildCare", label: "Needs child care to work, train, or attend school" },
  { key: "isSenior", label: "Adult age 60 or older" },
  { key: "isDisabled", label: "Person with a disability or ongoing medical limitation" },
  { key: "needsJobSupport", label: "Needs employment or self-sufficiency support" },
];

const countyAnchors = [
  "County-service credible",
  "SNAP, Medicaid, cash assistance, and child care in one path",
  "Built to reduce intake confusion for Ashtabula County residents",
];

function fplPercent(monthlyIncome, householdSize) {
  const annualIncome = Number(monthlyIncome || 0) * 12;
  const base = FPL_2025_BASE + Math.max(0, Number(householdSize || 1) - 1) * FPL_2025_PERSON;
  if (!base) {
    return 0;
  }
  return (annualIncome / base) * 100;
}

function pickPrograms(form) {
  const percent = fplPercent(form.monthlyIncome, form.householdSize);

  return PROGRAMS.filter((program) => {
    if (program.id === "medicaid" && form.isPregnant) {
      return true;
    }
    if (program.id === "medicaid" && form.isDisabled) {
      return true;
    }
    if (program.id === "childcare" && !form.needsChildCare) {
      return false;
    }
    if (program.id === "owf" && !form.hasChildren) {
      return false;
    }
    return percent <= program.threshold;
  });
}

function buildFallbackGuidance(form, matches) {
  const resident = form.residentName || "This household";
  const householdSummary = `${form.householdSize}-person household with about $${Number(
    form.monthlyIncome || 0,
  ).toLocaleString()} in monthly income`;

  if (!matches.length) {
    return `${resident} may still benefit from talking with Ashtabula County Department of Job and Family Services even though this early estimate did not flag a clear match. Case-specific facts like medical needs, child support, expenses, pregnancy, or changing work status can affect the final review. Use this result as a prep tool, then continue with county intake for a full determination.`;
  }

  return `${resident} appears worth screening further with ACDJFS based on a ${householdSummary}. The strongest next step is to gather the document checklist below, start with the Ohio Benefits portal, and let county staff review details that this quick estimate cannot fully capture. This tool is designed to support access, not replace an official determination.`;
}

function App() {
  const [residentName, setResidentName] = useState("");
  const [householdSize, setHouseholdSize] = useState(1);
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [zipCode, setZipCode] = useState("44004");
  const [conditions, setConditions] = useState({
    isPregnant: false,
    hasChildren: false,
    needsChildCare: false,
    isSenior: false,
    isDisabled: false,
    needsJobSupport: false,
  });
  const [guidance, setGuidance] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const wordmarkSrc = `${import.meta.env.BASE_URL}acdjfs-wordmark.png`;
  const sealSrc = `${import.meta.env.BASE_URL}acdjfs-logo.png`;
  const aiReady = isAPIConfigured();

  const formState = {
    residentName,
    householdSize,
    monthlyIncome,
    zipCode,
    ...conditions,
  };

  const matches = pickPrograms(formState);
  const incomePercent = Math.round(fplPercent(monthlyIncome, householdSize));
  const documents = [...new Set(matches.flatMap((program) => program.docs))];

  const handleToggle = (key) => {
    setConditions((current) => ({ ...current, [key]: !current[key] }));
  };

  const generateGuidance = async () => {
    setHasRun(true);
    setLoading(true);
    setError("");

    const fallback = buildFallbackGuidance(formState, matches);

    if (!aiReady) {
      setGuidance(fallback);
      setLoading(false);
      return;
    }

    try {
      const prompt = `
You are writing a resident-facing summary for the Ashtabula County Department of Job and Family Services.

Organization mission:
- Promote well-being and self-sufficiency
- Alleviate conditions of poverty
- Improve health and safety

Resident facts:
- Household size: ${householdSize}
- Monthly income: $${monthlyIncome || 0}
- ZIP code: ${zipCode}
- Conditions: ${conditionOptions
  .filter((item) => conditions[item.key])
  .map((item) => item.label)
  .join(", ") || "No extra conditions selected"}
- Potential programs: ${matches.map((program) => program.name).join(", ") || "No clear preliminary matches"}

Write under 120 words.
Tone: official, helpful, county-service credible.
Mention that this is a preliminary screener and that ACDJFS makes the final determination.
Reference one useful next step such as gathering documents or using the Ohio Benefits portal.
`.trim();

      const response = await callGeminiAPI(prompt);
      setGuidance(extractResponseText(response).trim() || fallback);
    } catch (err) {
      setError(getErrorMessage(err));
      setGuidance(fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResidentName("");
    setHouseholdSize(1);
    setMonthlyIncome("");
    setZipCode("44004");
    setConditions({
      isPregnant: false,
      hasChildren: false,
      needsChildCare: false,
      isSenior: false,
      isDisabled: false,
      needsJobSupport: false,
    });
    setGuidance("");
    setError("");
    setHasRun(false);
  };

  return (
    <div className="page-shell">
      <div className="page-pattern" aria-hidden="true" />

      <main className="page">
        <section className="hero-panel">
          <div className="hero-copy">
            <div className="brand-strip">
              <img className="wordmark" src={wordmarkSrc} alt="Ashtabula County Job & Family Services" />
              <div className="seal-badge">
                <img src={sealSrc} alt="ACDJFS seal mark" />
              </div>
            </div>

            <p className="eyebrow">Ashtabula County Department of Job and Family Services</p>
            <h1>Ashtabula County Eligibility Screener</h1>
            <p className="hero-tagline">Find Benefits. Get Help. Move Forward.</p>
            <p className="hero-lead">
              A county-branded intake demo focused on SNAP, Medicaid, Ohio Works First,
              and child care support for residents who need a clearer first step.
            </p>

            <div className="anchor-list">
              {countyAnchors.map((item) => (
                <span className="anchor-pill" key={item}>
                  {item}
                </span>
              ))}
            </div>

            <div className="mission-card">
              <p className="mission-label">Mission alignment</p>
              <p>
                Provide superior service, promote well-being and self-sufficiency,
                alleviate conditions of poverty, and improve health and safety.
              </p>
            </div>
          </div>

          <aside className="hero-side">
            <div className="side-card">
              <p className="eyebrow eyebrow-light">Programs in scope</p>
              <h2>One county path for multiple benefits</h2>
              <ul className="program-pills">
                <li>SNAP food assistance</li>
                <li>Medicaid coverage</li>
                <li>Ohio Works First</li>
                <li>Publicly funded child care</li>
              </ul>
              <p className="side-note">
                Built to reduce intake confusion before a resident reaches official county review.
              </p>
            </div>
          </aside>
        </section>

        <section className="workspace">
          <section className="intake-card">
            <div className="section-head">
              <p className="eyebrow">Preliminary Intake</p>
              <h2>Start with the household basics</h2>
              <p>
                This quick screener gives residents a more useful starting point while making
                it clear that ACDJFS completes the official determination.
              </p>
            </div>

            <div className="field-grid">
              <label className="field">
                <span>Resident or household name</span>
                <input
                  type="text"
                  value={residentName}
                  onChange={(event) => setResidentName(event.target.value)}
                  placeholder="Optional"
                />
              </label>

              <div className="field-row">
                <label className="field">
                  <span>Household size</span>
                  <input
                    type="number"
                    min="1"
                    value={householdSize}
                    onChange={(event) => setHouseholdSize(Number(event.target.value || 1))}
                  />
                </label>

                <label className="field">
                  <span>ZIP code</span>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(event) => setZipCode(event.target.value)}
                    placeholder="44004"
                  />
                </label>
              </div>

              <label className="field">
                <span>Monthly income before taxes</span>
                <input
                  type="number"
                  min="0"
                  value={monthlyIncome}
                  onChange={(event) => setMonthlyIncome(event.target.value)}
                  placeholder="0"
                />
              </label>
            </div>

            <div className="conditions-panel">
              <div className="conditions-head">
                <h3>Household circumstances</h3>
                <p>Select anything that should affect the preliminary county review.</p>
              </div>
              <div className="conditions-grid">
                {conditionOptions.map((option) => (
                  <button
                    type="button"
                    key={option.key}
                    className={`condition-chip ${conditions[option.key] ? "condition-chip-active" : ""}`}
                    onClick={() => handleToggle(option.key)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="cta-row">
              <button type="button" className="primary-cta" onClick={generateGuidance} disabled={loading}>
                {loading ? "Reviewing county guidance..." : "Review preliminary eligibility"}
              </button>
              <button type="button" className="secondary-cta" onClick={handleReset}>
                Reset
              </button>
            </div>

            <p className="helper-copy">
              {aiReady
                ? "AI guidance is enabled for the resident summary."
                : "No API key detected, so the site uses the built-in county guidance summary."}
            </p>
            {error ? <div className="notice notice-error">{error}</div> : null}
          </section>

          <section className="results-column">
            <div className="snapshot-card">
              <p className="eyebrow">Household Snapshot</p>
              <h3>Preliminary county estimate</h3>
              <dl className="snapshot-grid">
                <div>
                  <dt>ZIP</dt>
                  <dd>{zipCode || "Not entered"}</dd>
                </div>
                <div>
                  <dt>Household</dt>
                  <dd>{householdSize}</dd>
                </div>
                <div>
                  <dt>Monthly income</dt>
                  <dd>${Number(monthlyIncome || 0).toLocaleString()}</dd>
                </div>
                <div>
                  <dt>Approx. FPL</dt>
                  <dd>{Number.isFinite(incomePercent) ? `${incomePercent}%` : "N/A"}</dd>
                </div>
              </dl>
            </div>

            <div className="results-card">
              <div className="results-head">
                <p className="eyebrow">Potential Programs</p>
                <h3>What this household may want to screen for next</h3>
              </div>

              {matches.length ? (
                <div className="match-list">
                  {matches.map((program) => (
                    <article className="match-card" key={program.id}>
                      <h4>{program.name}</h4>
                      <p>{program.description}</p>
                      <p className="next-step">{program.nextStep}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="empty-card">
                  <p>
                    No strong preliminary match was flagged yet, but residents should still
                    contact ACDJFS when circumstances are changing or hard to summarize in a quick form.
                  </p>
                </div>
              )}

              <div className="guidance-card">
                <h4>Resident guidance</h4>
                <p>
                  {hasRun
                    ? guidance
                    : "Run the screener to generate a county-style summary that explains the next likely step."}
                </p>
              </div>

              <div className="documents-card">
                <h4>Likely documents to gather</h4>
                {documents.length ? (
                  <ul>
                    {documents.map((doc) => (
                      <li key={doc}>{doc}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Document suggestions will appear after a preliminary review.</p>
                )}
              </div>

              <div className="portal-card">
                <h4>Official next step</h4>
                <p>
                  Continue to the Ohio Benefits self-service portal for applications and then
                  follow county intake instructions from ACDJFS.
                </p>
                <a href="https://ssp.benefits.ohio.gov/" target="_blank" rel="noreferrer">
                  Open Ohio Benefits Portal
                </a>
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default App;
