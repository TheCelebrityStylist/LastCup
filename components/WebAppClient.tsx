"use client";

import { useMemo, useState } from "react";
import { commonDrinks, getClearTimeLabel, getRecommendation } from "@/lib/caffeine";

type LoggedDrink = {
  id: string;
  name: string;
  caffeineMg: number;
  hour: number;
};

export default function WebAppClient() {
  const [drinks, setDrinks] = useState<LoggedDrink[]>([]);
  const [selected, setSelected] = useState(commonDrinks[2].name);
  const [hour, setHour] = useState(new Date().getHours());

  const currentDrink = commonDrinks.find((drink) => drink.name === selected) || commonDrinks[0];

  const totalMg = drinks.reduce((sum, drink) => sum + drink.caffeineMg, 0);
  const latestHour = drinks.length ? Math.max(...drinks.map((drink) => drink.hour)) : hour;
  const result = useMemo(() => {
    const caffeine = drinks.length ? Math.max(totalMg, currentDrink.caffeineMg) : currentDrink.caffeineMg;
    return {
      clearTime: getClearTimeLabel(caffeine, latestHour),
      ...getRecommendation(caffeine, latestHour),
    };
  }, [currentDrink.caffeineMg, drinks.length, latestHour, totalMg]);

  function addDrink() {
    setDrinks((items) => [
      ...items,
      {
        id: crypto.randomUUID(),
        name: currentDrink.name,
        caffeineMg: currentDrink.caffeineMg,
        hour,
      },
    ]);
  }

  return (
    <div className="min-h-screen bg-[#f7f2e9] text-[#15120f]">
      <main className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="rounded-[2.5rem] bg-[#15120f] p-7 text-white shadow-2xl shadow-black/20 lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)]">
          <a href="/" className="text-sm font-black uppercase tracking-[0.2em] text-white/45">Last Cup</a>
          <h1 className="mt-12 text-5xl font-black leading-[0.92] tracking-[-0.06em]">
            Your coffee decision dashboard.
          </h1>
          <p className="mt-5 text-lg leading-8 text-white/60">
            This is the first web app version: log drinks, see your decision, and upgrade for full Premium later.
          </p>

          <div className="mt-10 rounded-[2rem] bg-white p-6 text-[#15120f]">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a8175]">Recommendation</p>
            <p className="mt-3 text-5xl font-black tracking-[-0.05em] text-[#f2a23a]">{result.verdict}</p>
            <p className="mt-4 leading-7 text-[#6b6256]">{result.explanation}</p>
          </div>
        </aside>

        <section className="grid gap-6">
          <div className="rounded-[2.5rem] bg-white p-6 shadow-2xl shadow-black/5 md:p-8">
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#8a8175]">Active estimate</p>
                <p className="mt-2 text-5xl font-black tracking-[-0.05em]">{totalMg || currentDrink.caffeineMg} mg</p>
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#8a8175]">Clear around</p>
                <p className="mt-2 text-5xl font-black tracking-[-0.05em]">{result.clearTime}</p>
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#8a8175]">Logged today</p>
                <p className="mt-2 text-5xl font-black tracking-[-0.05em]">{drinks.length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-white p-6 shadow-2xl shadow-black/5 md:p-8">
            <h2 className="text-3xl font-black tracking-[-0.04em]">Add a drink</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label>
                <span className="mb-2 block text-sm font-black uppercase tracking-wide text-[#8a8175]">Drink</span>
                <select value={selected} onChange={(e) => setSelected(e.target.value)} className="w-full rounded-2xl border border-black/10 bg-[#f7f2e9] p-4 text-lg font-black outline-none">
                  {commonDrinks.map((drink) => <option key={drink.name}>{drink.name}</option>)}
                </select>
              </label>
              <label>
                <span className="mb-2 block text-sm font-black uppercase tracking-wide text-[#8a8175]">Time</span>
                <input type="range" min="6" max="22" value={hour} onChange={(e) => setHour(Number(e.target.value))} className="w-full accent-[#15120f]" />
                <p className="mt-2 text-2xl font-black">{String(hour).padStart(2, "0")}:00</p>
              </label>
            </div>
            <button onClick={addDrink} className="mt-6 rounded-2xl bg-[#15120f] px-6 py-4 font-black text-white">Add drink</button>
          </div>

          <div className="rounded-[2.5rem] bg-white p-6 shadow-2xl shadow-black/5 md:p-8">
            <h2 className="text-3xl font-black tracking-[-0.04em]">Today</h2>
            <div className="mt-5 grid gap-3">
              {drinks.length === 0 ? (
                <p className="rounded-2xl bg-[#f7f2e9] p-5 font-bold text-[#6b6256]">No drinks logged yet. Add one above.</p>
              ) : (
                drinks.map((drink) => (
                  <div key={drink.id} className="flex items-center justify-between rounded-2xl bg-[#f7f2e9] p-5">
                    <div>
                      <p className="font-black">{drink.name}</p>
                      <p className="text-sm font-bold text-[#8a8175]">{String(drink.hour).padStart(2, "0")}:00</p>
                    </div>
                    <p className="text-xl font-black">{drink.caffeineMg} mg</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
