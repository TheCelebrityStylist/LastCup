"use client";

import { useEffect, useMemo, useState } from "react";
import {
  calculateWhatIfDrink,
  commonDrinks,
  defaultSettings,
  formatDecimalHour,
  getCaffeineState,
  type LoggedDrink,
  type Sensitivity,
  type UserSettings,
} from "@/lib/caffeine";

type Tab = "today" | "history" | "settings";
type Plan = "monthly" | "lifetime";

const STORAGE_KEY = "last-cup-web-v2";
const FREE_DRINK_LIMIT = 3;

function getCurrentDecimalHour() {
  const now = new Date();
  return now.getHours() + now.getMinutes() / 60;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning.";
  if (hour < 18) return "Good afternoon.";
  return "Good evening.";
}

function isToday(iso: string) {
  return new Date(iso).toDateString() === new Date().toDateString();
}

function createDrink(name: string, caffeineMg: number, hour: number): LoggedDrink {
  return {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    name,
    caffeineMg,
    consumedHour: Math.floor(hour),
    consumedMinute: Math.round((hour % 1) * 60),
    createdAt: new Date().toISOString(),
  };
}

function toneClass(tone: string) {
  if (tone === "positive") return "text-[#37B37E]";
  if (tone === "danger") return "text-[#D95C4A]";
  if (tone === "caution") return "text-[#F29D38]";
  return "text-[#F29D38]";
}

function loadStoredState() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as { drinks: LoggedDrink[]; settings: UserSettings; premiumPreview: boolean };
  } catch {
    return null;
  }
}

export default function WebAppClient() {
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<Tab>("today");
  const [drinks, setDrinks] = useState<LoggedDrink[]>([]);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [selected, setSelected] = useState(commonDrinks[3].name);
  const [whatIfSelected, setWhatIfSelected] = useState(commonDrinks[3].name);
  const [hour, setHour] = useState(15);
  const [customMg, setCustomMg] = useState(commonDrinks[3].caffeineMg);
  const [premiumPreview, setPremiumPreview] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<Plan | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    const stored = loadStoredState();
    if (stored) {
      setDrinks(Array.isArray(stored.drinks) ? stored.drinks : []);
      setSettings(stored.settings || defaultSettings);
      setPremiumPreview(Boolean(stored.premiumPreview));
    }
    setHour(Math.round(getCurrentDecimalHour()));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ drinks, settings, premiumPreview }));
  }, [drinks, settings, premiumPreview, mounted]);

  const todayDrinks = useMemo(() => drinks.filter((drink) => isToday(drink.createdAt)), [drinks]);
  const selectedDrink = commonDrinks.find((drink) => drink.name === selected) || commonDrinks[0];
  const whatIfDrink = commonDrinks.find((drink) => drink.name === whatIfSelected) || commonDrinks[0];
  const currentHour = mounted ? getCurrentDecimalHour() : 15;
  const state = useMemo(() => getCaffeineState(todayDrinks, currentHour, settings), [todayDrinks, currentHour, settings]);
  const whatIf = useMemo(() => calculateWhatIfDrink(todayDrinks, whatIfDrink, currentHour, settings), [todayDrinks, whatIfDrink, currentHour, settings]);
  const canAddMore = premiumPreview || todayDrinks.length < FREE_DRINK_LIMIT;

  useEffect(() => {
    setCustomMg(selectedDrink.caffeineMg);
  }, [selectedDrink.caffeineMg]);

  function addDrink() {
    if (!canAddMore) return;
    setDrinks((items) => [createDrink(selectedDrink.name, customMg, hour), ...items]);
  }

  function tryExampleDay() {
    const now = new Date().toISOString();
    setDrinks([
      { id: "example-latte", name: "Latte", caffeineMg: 120, consumedHour: 14, consumedMinute: 30, createdAt: now },
      { id: "example-coffee", name: "Coffee", caffeineMg: 95, consumedHour: 9, consumedMinute: 0, createdAt: now },
    ]);
  }

  function resetData() {
    setDrinks([]);
    setSettings(defaultSettings);
    setPremiumPreview(false);
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
  }

  async function startCheckout(plan: Plan) {
    setCheckoutError(null);
    setCheckoutLoading(plan);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await response.json();
      if (!response.ok || !data.url) {
        setCheckoutError(data.error || "Checkout is not configured yet. Add Stripe price IDs in Vercel.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setCheckoutError("Checkout is not available right now. Please try again later.");
    } finally {
      setCheckoutLoading(null);
    }
  }

  const activePercent = Math.min(100, Math.max(0, state.totalMg ? Math.round((state.activeMg / state.totalMg) * 100) : 0));
  const timelineStart = 7;
  const timelineEnd = 24;
  const currentPosition = Math.min(100, Math.max(0, ((currentHour - timelineStart) / (timelineEnd - timelineStart)) * 100));
  const bedtimeDecimal = settings.bedtimeHour + settings.bedtimeMinute / 60;
  const bedtimePosition = Math.min(100, Math.max(0, ((bedtimeDecimal - timelineStart) / (timelineEnd - timelineStart)) * 100));

  return (
    <div className="min-h-screen bg-[#f7f2e9] text-[#15120f]">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-[#f7f2e9]/90 px-5 py-4 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <a href="/" className="text-xl font-black tracking-[-0.04em]">Last Cup</a>
          <nav className="flex items-center gap-2 rounded-full bg-white/70 p-1 text-sm font-black shadow-xl shadow-black/5">
            {(["today", "history", "settings"] as Tab[]).map((item) => (
              <button
                key={item}
                onClick={() => setTab(item)}
                className={`rounded-full px-4 py-2 capitalize transition ${tab === item ? "bg-[#15120f] text-white" : "text-[#6b6256] hover:bg-black/5"}`}
              >
                {item}
              </button>
            ))}
          </nav>
          <button onClick={() => setTab("settings")} className="hidden rounded-full bg-[#15120f] px-5 py-3 text-sm font-black text-white md:inline-flex">
            Upgrade
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-6 md:px-8 md:py-10">
        {tab === "today" && (
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <section className="rounded-[2.5rem] bg-[#15120f] p-7 text-white shadow-2xl shadow-black/20 md:p-9 lg:sticky lg:top-24 lg:h-fit">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-white/40">Coffee Clock</p>
              <p className="mt-10 text-lg font-bold text-white/45">{getGreeting()}</p>
              <h1 className="mt-3 text-5xl font-black leading-[0.9] tracking-[-0.06em] md:text-6xl">
                Should you have another coffee?
              </h1>

              <div className="mt-8 rounded-[2rem] bg-white p-6 text-[#15120f] shadow-2xl shadow-black/20">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a8175]">Recommendation</p>
                <p className={`mt-3 text-5xl font-black tracking-[-0.055em] ${toneClass(state.recommendation.tone)}`}>{state.recommendation.verdict}</p>
                <p className="mt-4 text-lg leading-8 text-[#6b6256]">{state.recommendation.explanation}</p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-[#f7f2e9] p-4">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#8a8175]">Clear around</p>
                    <p className="mt-1 text-3xl font-black">{state.clearTimeLabel}</p>
                  </div>
                  <div className="rounded-2xl bg-[#f7f2e9] p-4">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#8a8175]">Next</p>
                    <p className="mt-1 text-3xl font-black">{state.recommendation.nextChoice}</p>
                  </div>
                </div>
              </div>

              {todayDrinks.length === 0 && (
                <button onClick={tryExampleDay} className="mt-5 w-full rounded-2xl bg-white/10 px-5 py-4 font-black text-white transition hover:bg-white/15">
                  Try example day
                </button>
              )}
            </section>

            <section className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Metric label="Active estimate" value={`${state.activeMg} mg`} />
                <Metric label="Clear around" value={state.clearTimeLabel} />
                <Metric label="Logged today" value={`${todayDrinks.length}/${premiumPreview ? "∞" : FREE_DRINK_LIMIT}`} />
              </div>

              <div className="rounded-[2.5rem] bg-white p-6 shadow-2xl shadow-black/5 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-[#8a8175]">Timeline</p>
                    <h2 className="mt-2 text-3xl font-black tracking-[-0.04em]">Your Coffee Clock</h2>
                  </div>
                  <div className="rounded-full bg-[#f7f2e9] px-4 py-2 text-sm font-black text-[#6b6256]">{activePercent}% active</div>
                </div>
                <div className="relative mt-10 h-36 rounded-[2rem] bg-[#f7f2e9] p-6">
                  <div className="absolute left-6 right-6 top-1/2 h-3 -translate-y-1/2 rounded-full bg-[#eadfce]" />
                  <div className="absolute left-6 top-1/2 h-3 -translate-y-1/2 rounded-full bg-[#f29d38]" style={{ width: `calc((100% - 3rem) * ${activePercent / 100})` }} />
                  <div className="absolute top-8 h-20 w-[3px] rounded-full bg-[#15120f]" style={{ left: `calc(1.5rem + (100% - 3rem) * ${currentPosition / 100})` }}>
                    <span className="absolute -left-8 -top-7 w-20 text-center text-xs font-black text-[#15120f]">Now</span>
                  </div>
                  <div className="absolute top-8 h-20 w-[3px] rounded-full bg-[#d95c4a]" style={{ left: `calc(1.5rem + (100% - 3rem) * ${bedtimePosition / 100})` }}>
                    <span className="absolute -left-10 top-24 w-24 text-center text-xs font-black text-[#d95c4a]">Bedtime</span>
                  </div>
                  {todayDrinks.map((drink) => {
                    const position = Math.min(100, Math.max(0, ((drink.consumedHour + drink.consumedMinute / 60 - timelineStart) / (timelineEnd - timelineStart)) * 100));
                    return (
                      <div key={drink.id} className="absolute top-[calc(50%-1.1rem)] h-9 w-9 rounded-full border-4 border-white bg-[#15120f] shadow-xl shadow-black/10" style={{ left: `calc(1.5rem + (100% - 3rem) * ${position / 100} - 1.1rem)` }} title={`${drink.name} ${drink.caffeineMg}mg`} />
                    );
                  })}
                </div>
                <p className="mt-5 text-sm font-bold leading-6 text-[#6b6256]">Estimate only. Caffeine sensitivity varies by person. Last Cup is not medical advice.</p>
              </div>

              <div className="rounded-[2.5rem] bg-white p-6 shadow-2xl shadow-black/5 md:p-8">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-3xl font-black tracking-[-0.04em]">Add a drink</h2>
                  {!premiumPreview && <span className="rounded-full bg-[#f7f2e9] px-4 py-2 text-sm font-black text-[#6b6256]">{FREE_DRINK_LIMIT - todayDrinks.length} free left</span>}
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-[1fr_0.7fr_0.7fr]">
                  <label>
                    <span className="mb-2 block text-sm font-black uppercase tracking-wide text-[#8a8175]">Drink</span>
                    <select value={selected} onChange={(e) => setSelected(e.target.value)} className="w-full rounded-2xl border border-black/10 bg-[#f7f2e9] p-4 text-lg font-black outline-none">
                      {commonDrinks.map((drink) => <option key={drink.name}>{drink.name}</option>)}
                    </select>
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-black uppercase tracking-wide text-[#8a8175]">Caffeine</span>
                    <input type="number" min="0" max="400" value={customMg} onChange={(e) => setCustomMg(Number(e.target.value))} className="w-full rounded-2xl border border-black/10 bg-[#f7f2e9] p-4 text-lg font-black outline-none" />
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-black uppercase tracking-wide text-[#8a8175]">Time</span>
                    <input type="range" min="6" max="23" value={hour} onChange={(e) => setHour(Number(e.target.value))} className="w-full accent-[#15120f]" />
                    <p className="mt-2 text-2xl font-black">{String(hour).padStart(2, "0")}:00</p>
                  </label>
                </div>

                {canAddMore ? (
                  <button onClick={addDrink} className="mt-6 rounded-2xl bg-[#15120f] px-6 py-4 font-black text-white">Add drink</button>
                ) : (
                  <div className="mt-6 rounded-[1.5rem] bg-[#15120f] p-5 text-white">
                    <p className="text-xl font-black">Today’s free logs are used.</p>
                    <p className="mt-2 text-white/60">Upgrade to track unlimited drinks and see your full Coffee Clock.</p>
                    <button onClick={() => setTab("settings")} className="mt-4 rounded-2xl bg-white px-5 py-3 font-black text-[#15120f]">Unlock Premium</button>
                  </div>
                )}
              </div>

              <div className="rounded-[2.5rem] bg-white p-6 shadow-2xl shadow-black/5 md:p-8">
                <h2 className="text-3xl font-black tracking-[-0.04em]">Planning another drink?</h2>
                <p className="mt-3 leading-7 text-[#6b6256]">See what your next cup may do before you drink it.</p>
                <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr]">
                  <select value={whatIfSelected} onChange={(e) => setWhatIfSelected(e.target.value)} className="rounded-2xl border border-black/10 bg-[#f7f2e9] p-4 text-lg font-black outline-none">
                    {commonDrinks.map((drink) => <option key={drink.name}>{drink.name}</option>)}
                  </select>
                  <div className="rounded-2xl bg-[#f7f2e9] p-4">
                    <p className="text-sm font-black uppercase tracking-[0.16em] text-[#8a8175]">If you add it now</p>
                    <p className="mt-1 text-3xl font-black">{whatIf.nextClearTime}</p>
                  </div>
                </div>
                {!premiumPreview && (
                  <div className="mt-5 rounded-[1.5rem] border border-black/10 bg-[#fffaf1] p-5">
                    <p className="font-black">Premium unlocks full what-if planning.</p>
                    <p className="mt-2 text-[#6b6256]">Preview clear time now. Upgrade for unlimited scenarios, history, and sensitivity controls.</p>
                  </div>
                )}
              </div>

              <DrinkLog drinks={todayDrinks} setDrinks={setDrinks} />
            </section>
          </div>
        )}

        {tab === "history" && (
          <section className="mx-auto max-w-5xl rounded-[2.5rem] bg-white p-8 shadow-2xl shadow-black/5">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#8f6a38]">Saved on this browser</p>
            <h1 className="mt-3 text-5xl font-black tracking-[-0.055em]">History</h1>
            {premiumPreview ? (
              <DrinkLog drinks={drinks} setDrinks={setDrinks} />
            ) : (
              <div className="mt-8 rounded-[2rem] bg-[#15120f] p-7 text-white">
                <h2 className="text-3xl font-black">Unlock full history.</h2>
                <p className="mt-3 max-w-xl leading-8 text-white/60">Free shows today. Premium unlocks previous days, weekly patterns, and full Coffee Clock history.</p>
                <button onClick={() => setTab("settings")} className="mt-6 rounded-2xl bg-white px-6 py-4 font-black text-[#15120f]">View Premium</button>
              </div>
            )}
          </section>
        )}

        {tab === "settings" && (
          <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-[2.5rem] bg-white p-8 shadow-2xl shadow-black/5">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#8f6a38]">Settings</p>
              <h1 className="mt-3 text-5xl font-black tracking-[-0.055em]">Personalize your Coffee Clock.</h1>
              <div className="mt-8 grid gap-5">
                <label>
                  <span className="mb-2 block text-sm font-black uppercase tracking-wide text-[#8a8175]">Bedtime hour</span>
                  <input type="number" min="18" max="23" value={settings.bedtimeHour} onChange={(e) => setSettings((current) => ({ ...current, bedtimeHour: Number(e.target.value) }))} className="w-full rounded-2xl border border-black/10 bg-[#f7f2e9] p-4 text-lg font-black outline-none" />
                </label>
                <label>
                  <span className="mb-2 block text-sm font-black uppercase tracking-wide text-[#8a8175]">Sensitivity</span>
                  <select value={settings.sensitivity} disabled={!premiumPreview} onChange={(e) => setSettings((current) => ({ ...current, sensitivity: e.target.value as Sensitivity }))} className="w-full rounded-2xl border border-black/10 bg-[#f7f2e9] p-4 text-lg font-black outline-none disabled:opacity-50">
                    <option value="low">Low</option>
                    <option value="average">Average</option>
                    <option value="high">High</option>
                  </select>
                  {!premiumPreview && <p className="mt-2 text-sm font-bold text-[#6b6256]">Sensitivity controls are part of Premium. Average is used for the free version.</p>}
                </label>
                <button onClick={resetData} className="rounded-2xl bg-[#f7f2e9] px-5 py-4 font-black text-[#15120f]">Reset data</button>
              </div>
            </div>
            <div className="rounded-[2.5rem] bg-[#15120f] p-8 text-white shadow-2xl shadow-black/20">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-white/40">Premium</p>
              <h2 className="mt-4 text-5xl font-black leading-[0.95] tracking-[-0.055em]">Unlock your full Coffee Clock.</h2>
              <p className="mt-5 text-lg leading-8 text-white/60">Save more drinks, plan your next cup, and see how caffeine moves through your day.</p>
              <div className="mt-8 grid gap-3">
                {["Unlimited drinks", "Full timeline", "What-if planner", "Advanced history", "Sensitivity controls"].map((item) => (
                  <div key={item} className="rounded-2xl bg-white/10 p-4 font-black">{item}</div>
                ))}
              </div>
              <div className="mt-8 grid gap-3 md:grid-cols-2">
                <button onClick={() => startCheckout("monthly")} className="rounded-2xl bg-white px-5 py-4 font-black text-[#15120f]">
                  {checkoutLoading === "monthly" ? "Opening…" : "€2.99/month"}
                </button>
                <button onClick={() => startCheckout("lifetime")} className="rounded-2xl bg-[#f29d38] px-5 py-4 font-black text-[#15120f]">
                  {checkoutLoading === "lifetime" ? "Opening…" : "€29 lifetime"}
                </button>
              </div>
              {checkoutError && <p className="mt-4 rounded-2xl bg-white/10 p-4 text-sm font-bold text-white/80">{checkoutError}</p>}
              <button onClick={() => setPremiumPreview((value) => !value)} className="mt-5 text-sm font-black text-white/45 underline">
                {premiumPreview ? "Turn off local premium preview" : "Enable local premium preview for testing"}
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-2xl shadow-black/5">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a8175]">{label}</p>
      <p className="mt-2 text-4xl font-black tracking-[-0.05em]">{value}</p>
    </div>
  );
}

function DrinkLog({ drinks, setDrinks }: { drinks: LoggedDrink[]; setDrinks: React.Dispatch<React.SetStateAction<LoggedDrink[]>> }) {
  return (
    <div className="rounded-[2.5rem] bg-white p-6 shadow-2xl shadow-black/5 md:p-8">
      <h2 className="text-3xl font-black tracking-[-0.04em]">Drinks</h2>
      <div className="mt-5 grid gap-3">
        {drinks.length === 0 ? (
          <p className="rounded-2xl bg-[#f7f2e9] p-5 font-bold text-[#6b6256]">No drinks logged yet.</p>
        ) : (
          drinks.map((drink) => (
            <div key={drink.id} className="flex items-center justify-between gap-4 rounded-2xl bg-[#f7f2e9] p-5">
              <div>
                <p className="font-black">{drink.name}</p>
                <p className="text-sm font-bold text-[#8a8175]">
                  {String(drink.consumedHour).padStart(2, "0")}:{String(drink.consumedMinute).padStart(2, "0")}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-xl font-black">{drink.caffeineMg} mg</p>
                <button onClick={() => setDrinks((items) => items.filter((item) => item.id !== drink.id))} className="rounded-full bg-white px-3 py-2 text-sm font-black text-[#6b6256]">Remove</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}