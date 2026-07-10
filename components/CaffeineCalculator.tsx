"use client";

import { useMemo, useState } from "react";
import { commonDrinks, getClearTimeLabel, getRecommendation } from "@/lib/caffeine";

export default function CaffeineCalculator() {
  const [drinkName, setDrinkName] = useState("Latte");
  const [hour, setHour] = useState(15);
  const [customMg, setCustomMg] = useState(120);

  const selected = commonDrinks.find((drink) => drink.name === drinkName) || commonDrinks[0];
  const caffeineMg = drinkName === "Custom" ? customMg : selected.caffeineMg;

  const result = useMemo(() => {
    const clearTime = getClearTimeLabel(caffeineMg, hour);
    const recommendation = getRecommendation(caffeineMg, hour);
    return { clearTime, ...recommendation };
  }, [caffeineMg, hour]);

  return (
    <section className="rounded-[2.5rem] border border-black/10 bg-[#121212] p-4 text-white shadow-[0_40px_100px_rgba(0,0,0,0.18)] md:p-6">
      <div className="rounded-[2rem] bg-[#f7f2e9] p-6 text-[#15120f] md:p-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#8f6a38]">Coffee Clock</p>
            <h2 className="mt-3 max-w-xl text-4xl font-black leading-[0.95] tracking-[-0.05em] md:text-6xl">
              Calculate the cost of your next cup.
            </h2>
          </div>
          <p className="max-w-sm text-base leading-7 text-[#6b6256]">
            Pick a drink and time. Last Cup estimates when caffeine may be low enough for sleep.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-[2rem] bg-white p-5 shadow-2xl shadow-black/5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-black uppercase tracking-wide text-[#8a8175]">Drink</span>
                <select
                  value={drinkName}
                  onChange={(event) => setDrinkName(event.target.value)}
                  className="w-full rounded-2xl border border-black/10 bg-[#fbfaf7] p-4 text-lg font-black outline-none"
                >
                  {commonDrinks.map((drink) => (
                    <option key={drink.name} value={drink.name}>{drink.name}</option>
                  ))}
                  <option value="Custom">Custom</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-black uppercase tracking-wide text-[#8a8175]">Time</span>
                <input
                  type="range"
                  min="6"
                  max="22"
                  value={hour}
                  onChange={(event) => setHour(Number(event.target.value))}
                  className="w-full accent-[#121212]"
                />
                <div className="mt-2 text-2xl font-black">{String(hour).padStart(2, "0")}:00</div>
              </label>
            </div>

            <label className="mt-6 block">
              <span className="mb-2 block text-sm font-black uppercase tracking-wide text-[#8a8175]">Caffeine estimate</span>
              <input
                type="range"
                min="20"
                max="260"
                value={caffeineMg}
                onChange={(event) => {
                  setDrinkName("Custom");
                  setCustomMg(Number(event.target.value));
                }}
                className="w-full accent-[#121212]"
              />
              <div className="mt-2 text-2xl font-black">{caffeineMg} mg</div>
            </label>
          </div>

          <div className="rounded-[2rem] bg-[#121212] p-6 text-white shadow-2xl shadow-black/10">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-white/45">Recommendation</p>
            <p className="mt-3 text-5xl font-black tracking-[-0.05em] text-[#f2a23a] md:text-6xl">{result.verdict}</p>
            <p className="mt-5 text-lg leading-8 text-white/65">{result.explanation}</p>

            <div className="mt-8 grid gap-3">
              <div className="rounded-3xl bg-white/8 p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/45">Estimated clear time</p>
                <p className="mt-2 text-4xl font-black">{result.clearTime}</p>
              </div>
              <div className="rounded-3xl bg-white/8 p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/45">Your input</p>
                <p className="mt-2 text-2xl font-black">{drinkName} · {caffeineMg} mg · {String(hour).padStart(2, "0")}:00</p>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm leading-6 text-[#7a7168]">
          Estimates only. Caffeine sensitivity varies by person. Last Cup is not medical advice.
        </p>
      </div>
    </section>
  );
}
