import { useState } from "react";
import "./App.css";

const BOARD_GRADES = {
  e_flute: {
    label: "E-Flute (Lightweight eCommerce)",
    boardRate: 0.32,
    leadDays: 0,
  },
  b_flute: {
    label: "B-Flute (Retail Cartons)",
    boardRate: 0.37,
    leadDays: 0,
  },
  c_flute: {
    label: "C-Flute (Shipping Strength)",
    boardRate: 0.43,
    leadDays: 1,
  },
  bc_double_wall: {
    label: "BC Double Wall (Heavy Duty)",
    boardRate: 0.58,
    leadDays: 2,
  },
};

const BOX_STYLES = {
  rsc: {
    label: "RSC - Regular Slotted Container",
    styleFactor: 1,
    setupCharge: 45,
    leadDays: 0,
  },
  hsc: {
    label: "HSC - Half Slotted Container",
    styleFactor: 0.92,
    setupCharge: 55,
    leadDays: 0,
  },
  fol: {
    label: "FOL - Full Overlap Box",
    styleFactor: 1.1,
    setupCharge: 85,
    leadDays: 1,
  },
  die_cut_mailer: {
    label: "Die-Cut Mailer",
    styleFactor: 1.34,
    setupCharge: 185,
    leadDays: 2,
  },
};

const PRINT_LEVELS = {
  none: {
    label: "No Printing",
    perBoxRate: 0,
    setupCharge: 0,
    leadDays: 0,
  },
  one_color: {
    label: "1-Color Flexo",
    perBoxRate: 0.11,
    setupCharge: 95,
    leadDays: 1,
  },
  two_color: {
    label: "2-Color Flexo",
    perBoxRate: 0.19,
    setupCharge: 145,
    leadDays: 2,
  },
  full_coverage: {
    label: "High-Coverage Graphics",
    perBoxRate: 0.34,
    setupCharge: 260,
    leadDays: 4,
  },
};

const SERVICE_LEVELS = {
  standard: {
    label: "Standard Production",
    priceMultiplier: 1,
    leadOffset: 0,
  },
  priority: {
    label: "Priority Scheduling",
    priceMultiplier: 1.14,
    leadOffset: -2,
  },
  rush: {
    label: "Rush Lane",
    priceMultiplier: 1.28,
    leadOffset: -4,
  },
};

const DEFAULT_FORM = {
  length: 16,
  width: 12,
  height: 10,
  quantity: 2500,
  boxStyle: "rsc",
  boardGrade: "c_flute",
  printLevel: "one_color",
  serviceLevel: "standard",
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const integer = new Intl.NumberFormat("en-US");

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const getQuantityFactor = (quantity) => {
  if (quantity < 500) return 1.22;
  if (quantity < 1000) return 1.16;
  if (quantity < 2500) return 1.1;
  if (quantity < 5000) return 1.06;
  if (quantity < 10000) return 1.03;
  return 1;
};

const getBaseLeadDays = (quantity) => {
  if (quantity <= 1000) return 6;
  if (quantity <= 5000) return 9;
  if (quantity <= 15000) return 13;
  if (quantity <= 30000) return 17;
  return 22;
};

const getFreightCharge = (length, width, height, quantity) => {
  const cubicInches = length * width * height * quantity;
  const pallets = clamp(Math.ceil(cubicInches / 240000), 1, 26);
  return 85 + pallets * 42;
};

const validateInputs = (form) => {
  const { length, width, height, quantity } = form;

  if (!Number.isFinite(length) || !Number.isFinite(width) || !Number.isFinite(height)) {
    return "Enter valid dimensions in inches.";
  }
  if (!Number.isFinite(quantity)) {
    return "Enter a valid quantity.";
  }
  if (length < 4 || width < 4 || height < 2) {
    return "Minimum size is 4 x 4 x 2 inches.";
  }
  if (length > 120 || width > 120 || height > 96) {
    return "Maximum supported size is 120 x 120 x 96 inches.";
  }
  if (quantity < 100 || quantity > 500000) {
    return "Quantity must be between 100 and 500,000 units.";
  }

  return "";
};

const calculateQuote = (form) => {
  const board = BOARD_GRADES[form.boardGrade];
  const style = BOX_STYLES[form.boxStyle];
  const print = PRINT_LEVELS[form.printLevel];
  const service = SERVICE_LEVELS[form.serviceLevel];

  const quantityFactor = getQuantityFactor(form.quantity);
  const blankLength = 2 * (form.length + form.width) + 1.75;
  const blankWidth = form.height + form.width + 1;
  const boardSqFtPerBox = (blankLength * blankWidth) / 144;

  const materialCost =
    boardSqFtPerBox * form.quantity * board.boardRate * style.styleFactor * quantityFactor;
  const convertingCost = form.quantity * 0.14 * style.styleFactor * quantityFactor;
  const printCost = form.quantity * print.perBoxRate;
  const setupCost = style.setupCharge + print.setupCharge;
  const wasteRecovery = materialCost * 0.04;
  const freightCost = getFreightCharge(form.length, form.width, form.height, form.quantity);

  const subtotal = materialCost + convertingCost + printCost + setupCost + wasteRecovery;
  const totalPrice = subtotal * service.priceMultiplier + freightCost;
  const unitPrice = totalPrice / form.quantity;

  const lowPrice = totalPrice * 0.94;
  const highPrice = totalPrice * 1.06;

  const leadDays =
    getBaseLeadDays(form.quantity) +
    board.leadDays +
    style.leadDays +
    print.leadDays +
    service.leadOffset;

  const leadLow = clamp(Math.floor(leadDays - 1), 2, 45);
  const leadHigh = clamp(Math.ceil(leadDays + 2), leadLow + 1, 50);

  return {
    boardSqFtPerBox,
    materialCost,
    convertingCost,
    printCost,
    setupCost,
    wasteRecovery,
    freightCost,
    subtotal,
    totalPrice,
    unitPrice,
    lowPrice,
    highPrice,
    leadTimeText: `${leadLow}-${leadHigh} business days`,
  };
};

function App() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [quote, setQuote] = useState(() => calculateQuote(DEFAULT_FORM));
  const [error, setError] = useState("");

  const handleNumberChange = (field) => (event) => {
    const value = Number(event.target.value);
    setForm((previous) => ({
      ...previous,
      [field]: Number.isNaN(value) ? 0 : value,
    }));
  };

  const handleSelectChange = (field) => (event) => {
    setForm((previous) => ({
      ...previous,
      [field]: event.target.value,
    }));
  };

  const handleCalculate = (event) => {
    event.preventDefault();
    const validationError = validateInputs(form);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setQuote(calculateQuote(form));
  };

  const handleReset = () => {
    setForm(DEFAULT_FORM);
    setQuote(calculateQuote(DEFAULT_FORM));
    setError("");
  };

  return (
    <div className="site-shell">
      <div className="texture-overlay" aria-hidden="true" />

      <header className="top-bar">
        <div className="brand-lockup">
          <span className="brand-mark">NB</span>
          <div>
            <p className="brand-name">Northeast Box Co.</p>
            <p className="brand-region">Ashtabula County, Ohio</p>
          </div>
        </div>
        <p className="top-contact">Custom corrugated packaging for Northeast Ohio manufacturers</p>
      </header>

      <main className="main-content">
        <section className="hero-panel reveal reveal-1">
          <p className="eyebrow">BoxFlow Estimator</p>
          <h1>Professional Corrugated Box Quote Calculator</h1>
          <p className="hero-copy">
            Build a live estimate using real dimensions, board grades, print selections, and
            production lead-time lanes used by our Ashtabula County plant.
          </p>
          <div className="hero-stats">
            <article>
              <span>Plant Response</span>
              <strong>Same Business Day</strong>
            </article>
            <article>
              <span>Service Area</span>
              <strong>Northeast Ohio + Erie Corridor</strong>
            </article>
            <article>
              <span>Capabilities</span>
              <strong>RSC, FOL, Mailers, Flexo Print</strong>
            </article>
          </div>
        </section>

        <section className="estimator-grid">
          <form className="panel form-panel reveal reveal-2" onSubmit={handleCalculate}>
            <div className="panel-head">
              <h2>Build your quote</h2>
              <p>Enter inside dimensions and production preferences.</p>
            </div>

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <div className="field-grid">
              <label className="field">
                <span>Length (in)</span>
                <input
                  type="number"
                  min="4"
                  max="120"
                  step="0.25"
                  value={form.length}
                  onChange={handleNumberChange("length")}
                />
              </label>

              <label className="field">
                <span>Width (in)</span>
                <input
                  type="number"
                  min="4"
                  max="120"
                  step="0.25"
                  value={form.width}
                  onChange={handleNumberChange("width")}
                />
              </label>

              <label className="field">
                <span>Height (in)</span>
                <input
                  type="number"
                  min="2"
                  max="96"
                  step="0.25"
                  value={form.height}
                  onChange={handleNumberChange("height")}
                />
              </label>

              <label className="field">
                <span>Quantity</span>
                <input
                  type="number"
                  min="100"
                  max="500000"
                  step="100"
                  value={form.quantity}
                  onChange={handleNumberChange("quantity")}
                />
              </label>

              <label className="field field-full">
                <span>Box Style</span>
                <select value={form.boxStyle} onChange={handleSelectChange("boxStyle")}>
                  {Object.entries(BOX_STYLES).map(([value, option]) => (
                    <option key={value} value={value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field field-full">
                <span>Board Grade</span>
                <select value={form.boardGrade} onChange={handleSelectChange("boardGrade")}>
                  {Object.entries(BOARD_GRADES).map(([value, option]) => (
                    <option key={value} value={value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Printing</span>
                <select value={form.printLevel} onChange={handleSelectChange("printLevel")}>
                  {Object.entries(PRINT_LEVELS).map(([value, option]) => (
                    <option key={value} value={value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Lead-Time Lane</span>
                <select value={form.serviceLevel} onChange={handleSelectChange("serviceLevel")}>
                  {Object.entries(SERVICE_LEVELS).map(([value, option]) => (
                    <option key={value} value={value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="form-meta">
              <span>Material per box: {quote.boardSqFtPerBox.toFixed(2)} sq ft</span>
              <span>Estimated lot size: {integer.format(form.quantity)} units</span>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Calculate Quote
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleReset}>
                Reset
              </button>
            </div>
          </form>

          <section className="panel quote-panel reveal reveal-3" aria-live="polite">
            <p className="quote-eyebrow">Estimated Production Quote</p>
            <h3>{currency.format(quote.totalPrice)}</h3>
            <p className="quote-unit">{currency.format(quote.unitPrice)} per box</p>

            <div className="lead-time-box">
              <span>Lead Time</span>
              <strong>{quote.leadTimeText}</strong>
              <small>{SERVICE_LEVELS[form.serviceLevel].label}</small>
            </div>

            <div className="range-box">
              <span>Typical Price Range</span>
              <strong>
                {currency.format(quote.lowPrice)} - {currency.format(quote.highPrice)}
              </strong>
            </div>

            <ul className="cost-breakdown">
              <li>
                <span>Board Material</span>
                <strong>{currency.format(quote.materialCost)}</strong>
              </li>
              <li>
                <span>Converting + Assembly</span>
                <strong>{currency.format(quote.convertingCost)}</strong>
              </li>
              <li>
                <span>Printing</span>
                <strong>{currency.format(quote.printCost)}</strong>
              </li>
              <li>
                <span>Tooling + Setup</span>
                <strong>{currency.format(quote.setupCost)}</strong>
              </li>
              <li>
                <span>Waste Recovery</span>
                <strong>{currency.format(quote.wasteRecovery)}</strong>
              </li>
              <li>
                <span>Local Freight</span>
                <strong>{currency.format(quote.freightCost)}</strong>
              </li>
            </ul>

            <p className="quote-note">
              Pricing is an estimator for planning and budget. Final production quote is confirmed
              after dieline review and ship-to location verification.
            </p>
          </section>
        </section>

        <section className="service-strip reveal reveal-4">
          <article className="service-card">
            <h4>Local Manufacturing Reliability</h4>
            <p>
              In-county production support for food, industrial, and eCommerce packaging programs.
            </p>
          </article>
          <article className="service-card">
            <h4>Engineering-Ready Specs</h4>
            <p>
              Estimates include board usage and setup logic so procurement and ops teams can align
              quickly.
            </p>
          </article>
          <article className="service-card">
            <h4>Fast Revision Turnaround</h4>
            <p>
              Need strength upgrades or print changes? Update inputs and reprice in seconds.
            </p>
          </article>
        </section>
      </main>

      <footer className="footer">
        <p>Northeast Box Co. | Ashtabula County, OH | Custom Corrugated Packaging</p>
      </footer>
    </div>
  );
}

export default App;
