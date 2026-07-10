export type DrinkPreset = {
  name: string;
  caffeineMg: number;
  category: "coffee" | "tea" | "energy" | "custom";
};

export type LoggedDrink = {
  id: string;
  name: string;
  caffeineMg: number;
  consumedHour: number;
  consumedMinute: number;
  createdAt: string;
};

export type Sensitivity = "low" | "average" | "high";

export type UserSettings = {
  bedtimeHour: number;
  bedtimeMinute: number;
  sensitivity: Sensitivity;
};

export type Recommendation = {
  verdict: "Add your first drink" | "Yes" | "Probably" | "Better not" | "Switch to decaf";
  tone: "empty" | "positive" | "balanced" | "caution" | "danger";
  explanation: string;
  nextChoice: string;
};

export type CaffeineState = {
  activeMg: number;
  totalMg: number;
  clearTimeLabel: string;
  clearHourDecimal: number;
  bedtimeLabel: string;
  recommendation: Recommendation;
};

export const commonDrinks: DrinkPreset[] = [
  { name: "Espresso", caffeineMg: 64, category: "coffee" },
  { name: "Coffee", caffeineMg: 95, category: "coffee" },
  { name: "Americano", caffeineMg: 95, category: "coffee" },
  { name: "Latte", caffeineMg: 120, category: "coffee" },
  { name: "Cappuccino", caffeineMg: 80, category: "coffee" },
  { name: "Flat White", caffeineMg: 130, category: "coffee" },
  { name: "Cold Brew", caffeineMg: 180, category: "coffee" },
  { name: "Black Tea", caffeineMg: 45, category: "tea" },
  { name: "Green Tea", caffeineMg: 30, category: "tea" },
  { name: "Matcha", caffeineMg: 70, category: "tea" },
  { name: "Energy Drink", caffeineMg: 160, category: "energy" },
  { name: "Pre-workout", caffeineMg: 200, category: "energy" },
  { name: "Custom", caffeineMg: 100, category: "custom" },
];

export const defaultSettings: UserSettings = {
  bedtimeHour: 22,
  bedtimeMinute: 30,
  sensitivity: "average",
};

export function getHalfLifeHours(sensitivity: Sensitivity) {
  if (sensitivity === "low") return 4;
  if (sensitivity === "high") return 7;
  return 5.5;
}

export function toDecimalHour(hour: number, minute = 0) {
  return hour + minute / 60;
}

export function formatDecimalHour(decimalHour: number) {
  const normalized = ((decimalHour % 24) + 24) % 24;
  let hour = Math.floor(normalized);
  let minute = Math.round((normalized - hour) * 60);

  if (minute === 60) {
    minute = 0;
    hour = (hour + 1) % 24;
  }

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function hoursToThreshold(caffeineMg: number, thresholdMg = 20, halfLifeHours = 5.5) {
  if (caffeineMg <= thresholdMg) return 0;
  return (Math.log(thresholdMg / caffeineMg) / Math.log(0.5)) * halfLifeHours;
}

export function calculateRemainingCaffeine(caffeineMg: number, consumedAtHour: number, currentHour: number, halfLifeHours = 5.5) {
  let elapsed = currentHour - consumedAtHour;
  if (elapsed < 0) elapsed += 24;
  return caffeineMg * Math.pow(0.5, elapsed / halfLifeHours);
}

export function calculateActiveCaffeine(drinks: LoggedDrink[], currentHour: number, settings: UserSettings) {
  const halfLife = getHalfLifeHours(settings.sensitivity);
  return drinks.reduce((sum, drink) => {
    const consumedAt = toDecimalHour(drink.consumedHour, drink.consumedMinute);
    return sum + calculateRemainingCaffeine(drink.caffeineMg, consumedAt, currentHour, halfLife);
  }, 0);
}

export function calculateDailyTotal(drinks: LoggedDrink[]) {
  return drinks.reduce((sum, drink) => sum + drink.caffeineMg, 0);
}

export function estimateClearTime(drinks: LoggedDrink[], currentHour: number, settings: UserSettings, thresholdMg = 20) {
  const halfLife = getHalfLifeHours(settings.sensitivity);
  const active = calculateActiveCaffeine(drinks, currentHour, settings);
  if (active <= thresholdMg) return currentHour;

  const additionalHours = hoursToThreshold(active, thresholdMg, halfLife);
  return currentHour + additionalHours;
}

export function getRecommendation(activeMg: number, clearHourDecimal: number, settings: UserSettings): Recommendation {
  const bedtime = toDecimalHour(settings.bedtimeHour, settings.bedtimeMinute);
  const clearComparedToBedtime = clearHourDecimal - bedtime;

  if (activeMg <= 0) {
    return {
      verdict: "Add your first drink",
      tone: "empty",
      explanation: "Last Cup needs today’s caffeine to estimate your Coffee Clock.",
      nextChoice: "Log a drink",
    };
  }

  if (activeMg <= 35 && clearComparedToBedtime <= 0) {
    return {
      verdict: "Yes",
      tone: "positive",
      explanation: "A small coffee is unlikely to affect your usual bedtime, based on this estimate.",
      nextChoice: "Small coffee",
    };
  }

  if (clearComparedToBedtime <= -1) {
    return {
      verdict: "Probably",
      tone: "balanced",
      explanation: "Your current caffeine may be low enough before bedtime, depending on sensitivity.",
      nextChoice: "Keep it small",
    };
  }

  if (clearComparedToBedtime <= 1) {
    return {
      verdict: "Better not",
      tone: "caution",
      explanation: "You may still have caffeine active close to your usual bedtime. A smaller drink is safer.",
      nextChoice: "Tea or decaf",
    };
  }

  return {
    verdict: "Switch to decaf",
    tone: "danger",
    explanation: "Another caffeinated drink would likely push your clear time too late tonight.",
    nextChoice: "Decaf",
  };
}

export function getCaffeineState(drinks: LoggedDrink[], currentHour: number, settings: UserSettings): CaffeineState {
  const activeMg = Math.round(calculateActiveCaffeine(drinks, currentHour, settings));
  const totalMg = calculateDailyTotal(drinks);
  const clearHourDecimal = estimateClearTime(drinks, currentHour, settings);
  const recommendation = getRecommendation(activeMg, clearHourDecimal, settings);

  return {
    activeMg,
    totalMg,
    clearHourDecimal,
    clearTimeLabel: activeMg > 0 ? formatDecimalHour(clearHourDecimal) : "—",
    bedtimeLabel: `${String(settings.bedtimeHour).padStart(2, "0")}:${String(settings.bedtimeMinute).padStart(2, "0")}`,
    recommendation,
  };
}

export function calculateWhatIfDrink(drinks: LoggedDrink[], preset: DrinkPreset, currentHour: number, settings: UserSettings) {
  const hypothetical: LoggedDrink = {
    id: "what-if",
    name: preset.name,
    caffeineMg: preset.caffeineMg,
    consumedHour: Math.floor(currentHour),
    consumedMinute: Math.round((currentHour % 1) * 60),
    createdAt: new Date().toISOString(),
  };

  const current = getCaffeineState(drinks, currentHour, settings);
  const next = getCaffeineState([...drinks, hypothetical], currentHour, settings);

  return {
    currentClearTime: current.clearTimeLabel,
    nextClearTime: next.clearTimeLabel,
    activeAfter: next.activeMg,
    recommendation: next.recommendation,
  };
}

export function getClearTimeLabel(caffeineMg: number, consumedHour: number, thresholdMg = 20, halfLifeHours = 5.5) {
  const hours = hoursToThreshold(caffeineMg, thresholdMg, halfLifeHours);
  return formatDecimalHour(consumedHour + hours);
}

export function getRecommendationLegacy(caffeineMg: number, consumedHour: number, bedtime = 22.5) {
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

export const getRecommendationForSingleDrink = getRecommendationLegacy;
export const getRecommendation = getRecommendationLegacy;