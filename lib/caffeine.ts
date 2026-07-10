export type DrinkInput = {
  name: string;
  caffeineMg: number;
  consumedHour: number;
};

export function hoursToThreshold(caffeineMg: number, thresholdMg = 20, halfLifeHours = 5.5) {
  if (caffeineMg <= thresholdMg) return 0;
  return (Math.log(thresholdMg / caffeineMg) / Math.log(0.5)) * halfLifeHours;
}

export function getClearTimeLabel(caffeineMg: number, consumedHour: number, thresholdMg = 20, halfLifeHours = 5.5) {
  const hours = hoursToThreshold(caffeineMg, thresholdMg, halfLifeHours);
  const raw = consumedHour + hours;
  const finalHour = ((Math.floor(raw) % 24) + 24) % 24;
  const finalMinute = Math.round((raw % 1) * 60);

  return `${String(finalHour).padStart(2, "0")}:${String(finalMinute).padStart(2, "0")}`;
}

export function getRecommendation(caffeineMg: number, consumedHour: number, bedtime = 22.5) {
  const clearHours = consumedHour + hoursToThreshold(caffeineMg);

  if (caffeineMg <= 35) {
    return {
      verdict: "Probably okay",
      tone: "positive",
      explanation: "This is a relatively low amount of caffeine for most people.",
    };
  }

  if (clearHours <= bedtime) {
    return {
      verdict: "Likely okay",
      tone: "balanced",
      explanation: "This may clear before your usual bedtime, depending on sensitivity.",
    };
  }

  return {
    verdict: "Probably not",
    tone: "caution",
    explanation: "This may still be active close to bedtime. A smaller or decaf option is safer.",
  };
}

export const commonDrinks = [
  { name: "Espresso", caffeineMg: 64 },
  { name: "Coffee", caffeineMg: 95 },
  { name: "Latte", caffeineMg: 120 },
  { name: "Flat White", caffeineMg: 130 },
  { name: "Matcha", caffeineMg: 70 },
  { name: "Energy Drink", caffeineMg: 160 },
  { name: "Pre-workout", caffeineMg: 200 },
];
