import { useMemo, useState } from "react";
import "./App.css";

const CARGO_LANES = {
  breakbulk: {
    label: "Breakbulk / Steel / Project Freight",
    baseFee: 2800,
    handlingRate: 6.8,
    storageRate: 0.12,
    inlandRate: 245,
    leadDays: 5,
    fit: "Built for heavy-lift cargo, steel movements, and vessel-linked dock coordination.",
  },
  container: {
    label: "Container Deconsolidation",
    baseFee: 1950,
    handlingRate: 5.2,
    storageRate: 0.09,
    inlandRate: 215,
    leadDays: 4,
    fit: "Supports warehouse receiving, cross-dock prep, and onward truck scheduling.",
  },
  rail: {
    label: "Rail-to-Truck Transload",
    baseFee: 2300,
    handlingRate: 5.9,
    storageRate: 0.07,
    inlandRate: 260,
    leadDays: 4,
    fit: "Designed for Port of Ashtabula cargo that needs fast yard turns and rail coordination.",
  },
  warehouse: {
    label: "Warehouse Distribution Program",
    baseFee: 1750,
    handlingRate: 4.4,
    storageRate: 0.15,
    inlandRate: 185,
    leadDays: 3,
    fit: "Best for staged inventory, order release planning, and steady outbound fulfillment.",
  },
};

const SERVICE_BUNDLES = {
  forwarding: {
    label: "Freight Forwarding Core",
    multiplier: 1,
    adminFee: 0,
    leadAdjust: 0,
  },
  agency: {
    label: "Forwarding + Vessel Agency",
    multiplier: 1.1,
    adminFee: 900,
    leadAdjust: 1,
  },
  integrated: {
    label: "Integrated Port Operations",
    multiplier: 1.18,
    adminFee: 1600,
    leadAdjust: 2,
  },
};

const COMPLIANCE_LEVELS = {
  standard: {
    label: "Standard Documentation",
    fee: 350,
  },
  customs: {
    label: "Customs + Clearance Support",
    fee: 780,
  },
  marine: {
    label: "APIS / AMS / ACI / ENOA-D Coverage",
    fee: 1325,
  },
};

const TURNAROUND_OPTIONS = {
  standard: {
    label: "Standard Port Window",
    multiplier: 1,
    leadAdjust: 0,
  },
  priority: {
    label: "Priority Turn",
    multiplier: 1.12,
    leadAdjust: -1,
  },
  surge: {
    label: "Surge Coverage",
    multiplier: 1.22,
    leadAdjust: -2,
  },
};

const DEFAULT_FORM = {
  cargoLane: "breakbulk",
  tonnage: 1600,
  storageDays: 6,
  truckloads: 14,
  serviceBundle: "agency",
  complianceLevel: "customs",
  turnaround: "standard",
};

const OPERATION_SIGNALS = [
  {
    label: "World Shipping heritage",
    value: "Port-side logistics since 1960",
  },
  {
    label: "Operational footprint",
    value: "Freight forwarding, warehousing, rail, and truck",
  },
  {
    label: "Port strength",
    value: "Great Lakes vessel agency at Ashtabula",
  },
];

const PORT_CAPABILITIES = [
  "Freight forwarding for inbound and outbound cargo through World Shipping's Port of Ashtabula operation",
  "Warehousing and distribution support for staged inventory, industrial freight, and port-side release timing",
  "Rail and truck coordination for Great Lakes-linked cargo programs moving through Ashtabula",
  "Agency and compliance support for vessel calls and documentation-heavy moves tied to the port",
];

const integer = new Intl.NumberFormat("en-US");
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const validateForm = (form) => {
  if (!Number.isFinite(form.tonnage) || form.tonnage < 100 || form.tonnage > 50000) {
    return "Tonnage must be between 100 and 50,000 tons.";
  }
  if (!Number.isFinite(form.storageDays) || form.storageDays < 0 || form.storageDays > 60) {
    return "Storage days must be between 0 and 60.";
  }
  if (!Number.isFinite(form.truckloads) || form.truckloads < 1 || form.truckloads > 400) {
    return "Truckloads must be between 1 and 400.";
  }
  return "";
};

const calculateEstimate = (form) => {
  const lane = CARGO_LANES[form.cargoLane];
  const bundle = SERVICE_BUNDLES[form.serviceBundle];
  const compliance = COMPLIANCE_LEVELS[form.complianceLevel];
  const turnaround = TURNAROUND_OPTIONS[form.turnaround];

  const handling = lane.baseFee + form.tonnage * lane.handlingRate;
  const storage = form.tonnage * form.storageDays * lane.storageRate;
  const inland = form.truckloads * lane.inlandRate;
  const subtotal = handling + storage + inland + bundle.adminFee + compliance.fee;
  const total = subtotal * bundle.multiplier * turnaround.multiplier;
  const perTon = total / form.tonnage;
  const lowRange = total * 0.94;
  const highRange = total * 1.07;

  const days = clamp(
    lane.leadDays + bundle.leadAdjust + turnaround.leadAdjust,
    1,
    14
  );

  return {
    handling,
    storage,
    inland,
    compliance: compliance.fee,
    admin: bundle.adminFee,
    subtotal,
    total,
    perTon,
    lowRange,
    highRange,
    turnaroundText: `${days}-${days + 2} business days`,
    narrative: `${lane.fit} ${bundle.label} gives this move the right coordination layer for World Shipping's Port of Ashtabula operation.`,
  };
};

function App() {
  const assetBase = import.meta.env.BASE_URL;
  const [form, setForm] = useState(DEFAULT_FORM);
  const [error, setError] = useState("");
  const estimate = useMemo(() => calculateEstimate(form), [form]);

  const handleNumberChange = (field) => (event) => {
    const value = Number(event.target.value);
    setForm((current) => ({
      ...current,
      [field]: Number.isNaN(value) ? 0 : value,
    }));
  };

  const handleSelectChange = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(validateForm(form));
  };

  const handleReset = () => {
    setForm(DEFAULT_FORM);
    setError("");
  };

  return (
    <div className="port-shell">
      <div className="port-backdrop" aria-hidden="true" />

      <header className="port-header">
        <div className="port-header-inner">
          <div className="brand-lockup">
            <div className="brand-mark brand-mark-image">
              <img src={`${assetBase}world-shipping-logo.png`} alt="World Shipping, Inc." />
            </div>
            <div>
              <p className="brand-overline">World Shipping, Inc.</p>
              <h1 className="brand-title">Port of Ashtabula Operations</h1>
            </div>
          </div>
          <p className="header-note">World Shipping / Port of Ashtabula freight forwarding, warehousing, truck, rail, and vessel agency coordination</p>
        </div>
      </header>

      <main className="port-main">
        <div className="port-content">
          <section className="hero">
            <p className="hero-eyebrow">World Shipping Inventory Flow</p>
            <h2 className="hero-title">Budget port-side cargo programs like World Shipping&apos;s Ashtabula team would.</h2>
            <p className="hero-copy">
              BoxFlow is positioned for World Shipping&apos;s Port of Ashtabula footprint: a
              maritime-forward planning tool for warehousing, distribution, rail coordination, and
              vessel-linked cargo handling built around the buyer&apos;s actual operating context.
            </p>
            <p className="hero-subcopy">
              Demo this as an internal planning surface for scoping freight programs before a live quote,
              berth confirmation, or shipper-specific operating review.
            </p>

            <div className="hero-signal-grid">
              {OPERATION_SIGNALS.map((signal) => (
                <article key={signal.label} className="signal-card">
                  <span>{signal.label}</span>
                  <strong>{signal.value}</strong>
                </article>
              ))}
            </div>
          </section>

          <section className="credibility-strip">
            <article>
              <span className="strip-kicker">Target buyer</span>
              <p>World Shipping, Inc. at the Port of Ashtabula</p>
            </article>
            <article>
              <span className="strip-kicker">Why it fits</span>
              <p>Great Lakes logistics heritage, warehousing and distribution depth, and vessel agency expertise.</p>
            </article>
            <article>
              <span className="strip-kicker">Use case</span>
              <p>Lane planning, cargo budgeting, and internal operations scoping before a final live quote for Port of Ashtabula moves.</p>
            </article>
          </section>

          <section className="estimator-layout">
            <form className="panel estimator-panel" onSubmit={handleSubmit}>
              <div className="panel-heading">
                <p className="panel-kicker">Operations intake</p>
                <h3>Build a Port of Ashtabula estimate</h3>
                <p>
                  Model the mix of cargo handling, storage, inland movement, and compliance support
                  World Shipping would coordinate around the port.
                </p>
              </div>

              {error ? (
                <div className="form-error" role="alert">
                  {error}
                </div>
              ) : null}

              <div className="field-grid">
                <label className="field field-wide">
                  <span>Cargo lane</span>
                  <select value={form.cargoLane} onChange={handleSelectChange("cargoLane")}>
                    {Object.entries(CARGO_LANES).map(([value, lane]) => (
                      <option key={value} value={value}>
                        {lane.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field">
                  <span>Tonnage</span>
                  <input
                    type="number"
                    min="100"
                    max="50000"
                    step="50"
                    value={form.tonnage}
                    onChange={handleNumberChange("tonnage")}
                  />
                </label>

                <label className="field">
                  <span>Storage days</span>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    step="1"
                    value={form.storageDays}
                    onChange={handleNumberChange("storageDays")}
                  />
                </label>

                <label className="field">
                  <span>Truckloads</span>
                  <input
                    type="number"
                    min="1"
                    max="400"
                    step="1"
                    value={form.truckloads}
                    onChange={handleNumberChange("truckloads")}
                  />
                </label>

                <label className="field field-wide">
                  <span>Service bundle</span>
                  <select value={form.serviceBundle} onChange={handleSelectChange("serviceBundle")}>
                    {Object.entries(SERVICE_BUNDLES).map(([value, bundle]) => (
                      <option key={value} value={value}>
                        {bundle.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field field-wide">
                  <span>Compliance support</span>
                  <select
                    value={form.complianceLevel}
                    onChange={handleSelectChange("complianceLevel")}
                  >
                    {Object.entries(COMPLIANCE_LEVELS).map(([value, level]) => (
                      <option key={value} value={value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field field-wide">
                  <span>Turnaround lane</span>
                  <select value={form.turnaround} onChange={handleSelectChange("turnaround")}>
                    {Object.entries(TURNAROUND_OPTIONS).map(([value, option]) => (
                      <option key={value} value={value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="form-meta">
                <span>{integer.format(form.tonnage)} tons in scope</span>
                <span>{integer.format(form.truckloads)} truckloads modeled</span>
                <span>{form.storageDays} storage days assumed</span>
              </div>

              <div className="form-actions">
                <button type="submit" className="primary-button">
                  Refresh estimate
                </button>
                <button type="button" className="secondary-button" onClick={handleReset}>
                  Reset defaults
                </button>
              </div>
            </form>

            <section className="panel estimate-panel" aria-live="polite">
              <div className="panel-heading">
                <p className="panel-kicker">Preliminary operating estimate</p>
                <h3>{currency.format(estimate.total)}</h3>
                <p className="estimate-unit">{currency.format(estimate.perTon)} per ton modeled</p>
              </div>

              <div className="estimate-highlight-grid">
                <article>
                  <span>Turnaround</span>
                  <strong>{estimate.turnaroundText}</strong>
                </article>
                <article>
                  <span>Budget range</span>
                  <strong>
                    {currency.format(estimate.lowRange)} - {currency.format(estimate.highRange)}
                  </strong>
                </article>
              </div>

              <ul className="cost-list">
                <li>
                  <span>Handling + dock coordination</span>
                  <strong>{currency.format(estimate.handling)}</strong>
                </li>
                <li>
                  <span>Storage program</span>
                  <strong>{currency.format(estimate.storage)}</strong>
                </li>
                <li>
                  <span>Inland move planning</span>
                  <strong>{currency.format(estimate.inland)}</strong>
                </li>
                <li>
                  <span>Compliance support</span>
                  <strong>{currency.format(estimate.compliance)}</strong>
                </li>
                <li>
                  <span>Operations admin</span>
                  <strong>{currency.format(estimate.admin)}</strong>
                </li>
              </ul>

              <p className="estimate-narrative">{estimate.narrative}</p>
              <p className="estimate-note">
                Planning estimate only. Final pricing should be confirmed after cargo profile review,
                berth timing, shipper details, and inland route verification.
              </p>
            </section>
          </section>

          <section className="capability-grid">
            {PORT_CAPABILITIES.map((capability) => (
              <article key={capability} className="capability-card">
                <p>{capability}</p>
              </article>
            ))}
          </section>
        </div>
      </main>

      <footer className="port-footer">
        <div className="port-footer-inner">
          <p className="footer-brand">World Shipping, Inc. | Port of Ashtabula | The World Group</p>
          <p className="footer-note">
            World Shipping heritage since 1960 across freight forwarding, vessel agency, and
            port-linked warehousing for Ashtabula operations.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
