export type Project = {
  short: string;
  name: string;
  tagline: string;
  description: string;
  tech: string[];
  status: "live" | "dev";
  url?: string;
  repo?: string;
};

export const projects: Project[] = [
  {
    short: "PULSE",
    name: "Pulse",
    tagline: "Neural mesh terminal",
    description:
      "A real-time collective-voting social experiment. Many people, one shared signal, rendered as a living mesh that shifts as the crowd moves.",
    tech: ["React", "Socket.io", "Node.js", "MongoDB"],
    status: "live",
    url: "https://pulse.tradyai.live",
    repo: "https://github.com/Kvy202/PULSE",
  },
  {
    short: "MIRROR",
    name: "Mirror",
    tagline: "The crowd is reading you",
    description:
      "A behavioural insight engine that reflects crowd psychology and social patterns back at the visitor.",
    tech: ["React", "Node.js", "MongoDB"],
    status: "live",
    url: "https://mirror.tradyai.live",
    repo: "https://github.com/Kvy202/MIRROR",
  },
  {
    short: "TRADY",
    name: "Trady",
    tagline: "AI trading assistant",
    description:
      "A personal AI trading assistant: FastAPI backend on AWS, a native Android app, and Gemini-powered market reasoning.",
    tech: ["FastAPI", "Python", "Kotlin", "AWS", "Gemini"],
    status: "dev",
    repo: "https://github.com/Kvy202/Trady",
  },
  {
    short: "HL-BOT",
    name: "Hyperliquid bot",
    tagline: "Risk-managed AI trading bot",
    description:
      "A risk-managed AI trading bot on Hyperliquid (official SDK): ML/DL signals, modular exchange adapters, and safety-first guardrails — running on AWS.",
    tech: ["Python", "Hyperliquid", "ML / DL", "AWS"],
    status: "live",
    repo: "https://github.com/Kvy202/Ai-Trading-Bot-HQ",
  },
  {
    short: "CHESS",
    name: "Chess",
    tagline: "Adaptive-AI multiplayer chess",
    description:
      "Full-stack chess with accounts, online & local multiplayer, live Stockfish analysis, and an AI that scales to your skill — plus an XP-based leveling system.",
    tech: ["React", "TypeScript", "Node.js", "WebSocket", "Stockfish"],
    status: "live",
    url: "https://chess.tradyai.live",
    repo: "https://github.com/Kvy202/Chess",
  },
];
