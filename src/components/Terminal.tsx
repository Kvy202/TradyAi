import { useEffect, useRef, useState } from "react";
import { projects } from "../data/projects";
import { profile } from "../data/profile";
import "./Terminal.css";

type Line = { id: number; kind: "cmd" | "out" | "sys"; text: string };

const PROMPT = "tradyai:~$";

const HELP = [
  "available commands:",
  "  help            this list",
  "  ls / projects   list all projects + status",
  "  about / whoami  short bio",
  "  open <name>     open a project, or scroll to work/building/about",
  "  links / social  github, email, socials",
  "  clear           clear the screen",
];

const liveCount = projects.filter((p) => p.status === "live").length;
const devCount = projects.filter((p) => p.status === "dev").length;
const SECTIONS = ["top", "work", "building", "about", "contact"];

let counter = 0;
const mkLines = (texts: string[], kind: Line["kind"] = "out"): Line[] =>
  texts.map((t) => ({ id: ++counter, kind, text: t }));

export default function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>(() =>
    mkLines(["tradyai terminal — type 'help' to begin."], "sys"),
  );
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histPos, setHistPos] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  // Focus the input when opening; return focus to the launcher when closing.
  useEffect(() => {
    if (open) inputRef.current?.focus();
    else if (wasOpen.current) launcherRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  // Keep the output scrolled to the latest line.
  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, open]);

  const append = (newLines: Line[]) =>
    setLines((prev) => [...prev, ...newLines]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return false;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    return true;
  };

  const run = (raw: string) => {
    const trimmed = raw.trim();
    append(mkLines([`${PROMPT} ${raw}`], "cmd"));
    if (!trimmed) return;

    const [cmd, ...rest] = trimmed.split(/\s+/);
    const arg = rest.join(" ").toLowerCase();

    switch (cmd.toLowerCase()) {
      case "help":
        append(mkLines(HELP));
        break;

      case "ls":
      case "projects":
        append(
          mkLines(
            projects.map(
              (p) =>
                `${p.short.padEnd(8)}${(p.status === "live" ? "live" : "in dev").padEnd(8)}${p.tagline}`,
            ),
          ),
        );
        break;

      case "about":
      case "whoami":
        append(
          mkLines([
            `${profile.wordmark} — building AI systems for trading, crypto & market intelligence.`,
            `${liveCount} live, ${devCount} in dev. designed, built & deployed solo.`,
          ]),
        );
        break;

      case "links":
      case "social": {
        const out = [
          `github    ${profile.github}`,
          `email     ${profile.email}`,
        ];
        if (profile.x) out.push(`x         ${profile.x}`);
        if (profile.linkedin) out.push(`linkedin  ${profile.linkedin}`);
        append(mkLines(out));
        break;
      }

      case "open": {
        if (!arg) {
          append(mkLines(["usage: open <project|work|building|about>"]));
          break;
        }
        if (SECTIONS.includes(arg)) {
          const ok = scrollToSection(arg);
          append(
            mkLines([ok ? `→ scrolling to ${arg}` : `open: section "${arg}" not found`]),
          );
          if (ok) setOpen(false);
          break;
        }
        const proj = projects.find(
          (p) => p.short.toLowerCase() === arg || p.name.toLowerCase() === arg,
        );
        if (proj) {
          if (proj.url) {
            window.open(proj.url, "_blank", "noopener,noreferrer");
            append(mkLines([`→ opening ${proj.short} · ${proj.url}`]));
          } else {
            append(mkLines([`${proj.short} is in dev — no public URL yet`]));
          }
          break;
        }
        append(
          mkLines([
            `open: unknown target "${arg}". try a project name, or work/building/about.`,
          ]),
        );
        break;
      }

      case "clear":
        setLines([]);
        break;

      default:
        append(mkLines([`command not found: ${cmd} (try 'help')`]));
    }
  };

  const onSubmit = () => {
    const value = input;
    run(value);
    if (value.trim()) setCmdHistory((h) => [...h, value]);
    setInput("");
    setHistPos(-1);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!cmdHistory.length) return;
      const pos =
        histPos === -1 ? cmdHistory.length - 1 : Math.max(0, histPos - 1);
      setHistPos(pos);
      setInput(cmdHistory[pos]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histPos === -1) return;
      const pos = histPos + 1;
      if (pos >= cmdHistory.length) {
        setHistPos(-1);
        setInput("");
      } else {
        setHistPos(pos);
        setInput(cmdHistory[pos]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <>
      <button
        ref={launcherRef}
        className="term-launcher"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={open ? "Close terminal" : "Open terminal"}
        hidden={open}
      >
        <span aria-hidden="true">{"> _"}</span>
      </button>

      {open && (
        <section
          className="term-panel"
          role="dialog"
          aria-modal="false"
          aria-label="Interactive terminal"
        >
          <div className="term-head">
            <span>terminal</span>
            <button
              className="term-close"
              onClick={() => setOpen(false)}
              aria-label="Close terminal"
            >
              esc ✕
            </button>
          </div>

          <div
            className="term-output"
            ref={outputRef}
            role="log"
            aria-live="polite"
            aria-label="Terminal output"
          >
            {lines.map((l) => (
              <p key={l.id} className={`term-line is-${l.kind}`}>
                {l.text}
              </p>
            ))}
          </div>

          <label className="term-inputrow">
            <span className="term-prompt" aria-hidden="true">
              {PROMPT}
            </span>
            <input
              ref={inputRef}
              className="term-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              aria-label="Terminal input. Type a command and press Enter. Press Escape to close."
            />
          </label>
        </section>
      )}
    </>
  );
}
