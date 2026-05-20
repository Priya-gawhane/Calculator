"use client";

import { useState, useCallback } from "react";

const BUTTONS = [
  ["C", "⌫", "%", "÷"],
  ["sin", "cos", "tan", "√"],
  ["ln", "log", "π", "e"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["(", "0", ")", "="],
];

const SYMBOL_MAP: Record<string, string> = {
  "÷": "/",
  "×": "*",
  "−": "-",
  "√": "sqrt(",
  sin: "sin(",
  cos: "cos(",
  tan: "tan(",
  ln: "ln(",
  log: "log(",
  π: "pi",
  e: "e",
};

type ButtonType = "operator" | "function" | "special" | "digit" | "equals";

function getButtonType(btn: string): ButtonType {
  if (btn === "=") return "equals";
  if (["C", "⌫", "%"].includes(btn)) return "special";
  if (["÷", "×", "−", "+"].includes(btn)) return "operator";
  if (["sin", "cos", "tan", "ln", "log", "√", "π", "e", "(", ")"].includes(btn))
    return "function";
  return "digit";
}

export default function Calculator() {
  const [expression, setExpression] = useState("");
  const [display, setDisplay] = useState("0");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [justEvaluated, setJustEvaluated] = useState(false);

  const handleButton = useCallback(
    async (btn: string) => {
      setError(null);

      if (btn === "C") {
        setExpression("");
        setDisplay("0");
        setResult(null);
        setJustEvaluated(false);
        return;
      }

      if (btn === "=") {
        if (!expression) return;
        setLoading(true);
        try {
          const res = await fetch("http://localhost:8000/calculate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ expression }),
          });
          const data = await res.json();
          if (data.error) {
            setError(data.error);
          } else {
            const formatted =
              Number.isInteger(data.result)
                ? data.result.toString()
                : parseFloat(data.result.toFixed(10)).toString();
            setResult(formatted);
            setDisplay(formatted);
            setJustEvaluated(true);
          }
        } catch {
          setError("Cannot reach server. Is the backend running?");
        } finally {
          setLoading(false);
        }
        return;
      }

      if (btn === "⌫") {
        if (justEvaluated) {
          setExpression("");
          setDisplay("0");
          setResult(null);
          setJustEvaluated(false);
          return;
        }
        const newExpr = expression.slice(0, -1);
        setExpression(newExpr);
        setDisplay(newExpr || "0");
        return;
      }

      if (btn === "%") {
        const pct = expression ? `(${expression})/100` : "0";
        setExpression(pct);
        setDisplay(pct);
        return;
      }

      const mapped = SYMBOL_MAP[btn] ?? btn;
      const newExpr = justEvaluated && getButtonType(btn) === "digit"
        ? mapped
        : expression + mapped;

      setExpression(newExpr);
      setDisplay(newExpr || "0");
      setJustEvaluated(false);
      setResult(null);
    },
    [expression, justEvaluated]
  );

  const colorClass = (btn: string) => {
    const t = getButtonType(btn);
    if (t === "equals") return "btn-equals";
    if (t === "operator") return "btn-operator";
    if (t === "special") return "btn-special";
    if (t === "function") return "btn-function";
    return "btn-digit";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;600;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          min-height: 100vh;
          background: #0a0a0f;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          overflow: hidden;
        }

        .bg-glow {
          position: fixed;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(ellipse 60% 50% at 20% 20%, rgba(99,60,220,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 80% 80%, rgba(20,180,160,0.12) 0%, transparent 70%);
        }

        .wrapper {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .brand {
          text-align: center;
          letter-spacing: 0.3em;
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.25);
          text-transform: uppercase;
        }

        .calc-shell {
          width: 340px;
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 28px;
          padding: 1.5rem;
          backdrop-filter: blur(20px);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04) inset,
            0 40px 80px rgba(0,0,0,0.6);
        }

        /* ---- display ---- */
        .display {
          background: rgba(0,0,0,0.35);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 1.25rem 1.5rem;
          margin-bottom: 1.25rem;
          height: 110px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: stretch;
          gap: 4px;
          overflow: hidden;
        }

        .display-scroll-row {
          overflow-x: auto;
          overflow-y: hidden;
          display: flex;
          justify-content: flex-end;
          scrollbar-width: none;
        }
        .display-scroll-row::-webkit-scrollbar { display: none; }

        .display-expr {
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          color: rgba(255,255,255,0.35);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .display-main {
          font-family: 'DM Mono', monospace;
          font-size: clamp(28px, 8vw, 42px);
          font-weight: 300;
          color: #fff;
          letter-spacing: -0.02em;
          white-space: nowrap;
          line-height: 1.1;
          flex-shrink: 0;
          transition: color 0.2s;
        }

        .display-main.is-result {
          color: #7cf0d8;
        }

        .display-error {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          color: #ff7070;
          white-space: nowrap;
        }

        .loading-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #7cf0d8;
          animation: pulse 0.8s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }

        /* ---- grid ---- */
        .btn-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .btn {
          border: none;
          border-radius: 14px;
          height: 64px;
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.1s, background 0.15s, box-shadow 0.15s;
          position: relative;
          overflow: hidden;
          letter-spacing: -0.01em;
        }

        .btn:active { transform: scale(0.93); }

        .btn::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: rgba(255,255,255,0);
          transition: background 0.1s;
        }
        .btn:hover::after { background: rgba(255,255,255,0.07); }

        .btn-digit {
          background: rgba(255,255,255,0.08);
          color: #e8e8f0;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .btn-operator {
          background: rgba(120,90,255,0.22);
          color: #c4b8ff;
          border: 1px solid rgba(120,90,255,0.3);
        }

        .btn-special {
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.5);
          border: 1px solid rgba(255,255,255,0.07);
          font-size: 14px;
        }

        .btn-function {
          background: rgba(20,180,160,0.12);
          color: #7cf0d8;
          border: 1px solid rgba(20,180,160,0.2);
          font-size: 13px;
        }

        .btn-equals {
          background: linear-gradient(135deg, #7b5bff 0%, #4fc8b8 100%);
          color: #fff;
          border: none;
          box-shadow: 0 4px 20px rgba(123,91,255,0.4);
        }
        .btn-equals:hover::after { background: rgba(255,255,255,0.12); }

        .btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>

      <div className="bg-glow" />

      <div className="wrapper">
        <div className="brand">Scientific Calculator</div>

        <div className="calc-shell">
          {/* Display */}
          <div className="display">
            {expression && !justEvaluated && (
              <div className="display-scroll-row">
                <div className="display-expr">{expression}</div>
              </div>
            )}
            {loading ? (
              <div className="loading-dot" />
            ) : error ? (
              <>
                <div className="display-scroll-row">
                  <div className="display-expr">{expression}</div>
                </div>
                <div className="display-scroll-row">
                  <div className="display-error">{error}</div>
                </div>
              </>
            ) : (
              <div className="display-scroll-row">
                <div className={`display-main ${justEvaluated ? "is-result" : ""}`}>
                  {display === "" ? "0" : display}
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="btn-grid">
            {BUTTONS.flat().map((btn, i) => (
              <button
                key={i}
                className={`btn ${colorClass(btn)}`}
                onClick={() => handleButton(btn)}
                disabled={loading}
                aria-label={btn}
              >
                {btn}
              </button>
            ))}
          </div>
        </div>

        <div className="brand" style={{ opacity: 0.4 }}>
          Powered by FastAPI · Python
        </div>
      </div>
    </>
  );
}