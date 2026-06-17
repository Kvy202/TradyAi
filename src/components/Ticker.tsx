import { useEffect, useState } from "react";
import "./Ticker.css";

type Coin = { sym: string; price: number; change: number };

const URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true";

const MAP: { id: string; sym: string }[] = [
  { id: "bitcoin", sym: "BTC" },
  { id: "ethereum", sym: "ETH" },
  { id: "solana", sym: "SOL" },
];

// In-memory cache for the session, so a remount doesn't refetch.
let cache: Coin[] | null = null;

function parse(json: unknown): Coin[] {
  const data = json as Record<string, { usd?: number; usd_24h_change?: number }>;
  return MAP.map(({ id, sym }) => {
    const d = data?.[id];
    if (!d || typeof d.usd !== "number") return null;
    return { sym, price: d.usd, change: d.usd_24h_change ?? 0 };
  }).filter((c): c is Coin => c !== null);
}

const fmtPrice = (n: number) =>
  n.toLocaleString("en-US", { maximumFractionDigits: n < 1 ? 4 : 0 });
const fmtChange = (n: number) => Math.abs(n).toFixed(1);

export default function Ticker() {
  const [coins, setCoins] = useState<Coin[] | null>(() => cache);
  const [status, setStatus] = useState<"loading" | "ok" | "error">(
    cache ? "ok" : "loading",
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const next = parse(await res.json());
        if (next.length !== MAP.length) throw new Error("incomplete response");
        cache = next;
        if (!cancelled) {
          setCoins(next);
          setStatus("ok");
        }
      } catch {
        if (cancelled) return;
        // Graceful failure: keep last good values if we have them, else hide.
        if (cache) {
          setCoins(cache);
          setStatus("ok");
        } else {
          setStatus("error");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // On failure with no cached data, hide the ticker entirely (never fake numbers).
  if (status === "error" || (status === "ok" && (!coins || !coins.length))) {
    return null;
  }

  if (status === "loading" || !coins) {
    return (
      <div className="tick" aria-hidden="true">
        <div className="tick-inner">
          <span className="tick-loading">markets loading…</span>
        </div>
      </div>
    );
  }

  // Repeat the 3 coins enough to fill the strip, then duplicate for a seamless loop.
  const seq = Array.from({ length: 6 }, () => coins).flat();
  const renderItem = (c: Coin, i: number) => (
    <span className="tick-item" key={i}>
      <span className="tick-sym">{c.sym}</span>
      <span className="tick-price">${fmtPrice(c.price)}</span>
      <span className={c.change >= 0 ? "tick-up" : "tick-down"}>
        {c.change >= 0 ? "▲" : "▼"} {fmtChange(c.change)}%
      </span>
    </span>
  );

  const summary = coins
    .map(
      (c) =>
        `${c.sym} $${fmtPrice(c.price)}, ${c.change >= 0 ? "up" : "down"} ${fmtChange(c.change)}% in 24 hours`,
    )
    .join(". ");

  return (
    <div className="tick" aria-label="Live crypto prices">
      <div className="tick-inner">
        <div className="tick-track" aria-hidden="true">
          <div className="tick-seq">{seq.map(renderItem)}</div>
          <div className="tick-seq">{seq.map(renderItem)}</div>
        </div>
      </div>
      <p className="sr-only">{summary}</p>
    </div>
  );
}
