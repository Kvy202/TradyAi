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
    repo: "https://github.com/Kvy202",
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
    tagline: "Decentralised trading automation",
    description:
      "An automated trading bot with support for the Hyperliquid decentralised exchange.",
    tech: ["Python", "Hyperliquid", "Web3"],
    status: "dev",
    repo: "https://github.com/Kvy202",
  },
  {
    short: "CHESS",
    name: "Chess",
    tagline: "Realtime multiplayer chess",
    description:
      "A realtime multiplayer chess app — live games synced over WebSockets.",
    tech: ["React", "WebSocket", "Node.js"],
    status: "dev",
    repo: "https://github.com/Kvy202",
  },
];
