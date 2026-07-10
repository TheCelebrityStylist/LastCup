export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  keyword: string;
  readTime: string;
  publishedAt: string;
  sections: { heading: string; body: string[] }[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-long-does-caffeine-stay-in-your-system",
    title: "How Long Does Caffeine Stay in Your System?",
    description:
      "A practical guide to caffeine half-life, sleep timing, and how to decide when your last coffee should be.",
    keyword: "how long does caffeine stay in your system",
    readTime: "7 min read",
    publishedAt: "2026-07-10",
    sections: [
      {
        heading: "The short practical answer",
        body: [
          "For many people, caffeine can still be active for hours after the last cup. A common practical estimate is that a meaningful amount may remain five to eight hours later, depending on sensitivity, dose, timing, sleep pressure, medication, genetics, and tolerance.",
          "That is why a 15:30 latte can feel harmless in the moment but still matter at bedtime. The problem is not the coffee itself. The problem is that the consequence arrives too late to connect clearly to the decision."
        ]
      },
      {
        heading: "Why timing matters more than most people think",
        body: [
          "Caffeine is not an on/off switch. It declines gradually. If you drink a coffee in the afternoon, your body does not suddenly clear it before dinner. Last Cup turns that gradual decline into an understandable clear-time estimate.",
          "The goal is not to make people afraid of coffee. The goal is to make the last cup more intentional."
        ]
      },
      {
        heading: "How to use this in real life",
        body: [
          "If you sleep easily, your cutoff can be more flexible. If you struggle to fall asleep, wake during the night, or feel wired but tired, your cutoff should usually be earlier.",
          "Use the calculator to test your own daily pattern. The best caffeine rule is the one you can actually follow."
        ]
      }
    ]
  },
  {
    slug: "can-i-drink-coffee-at-4pm",
    title: "Can I Drink Coffee at 4 PM?",
    description:
      "A simple decision guide for afternoon coffee, caffeine clearance, and whether a 4 PM coffee is worth it.",
    keyword: "can I drink coffee at 4pm",
    readTime: "6 min read",
    publishedAt: "2026-07-10",
    sections: [
      {
        heading: "The honest answer",
        body: [
          "Sometimes yes, often no. The answer depends on what you drink, how much caffeine it contains, when you go to bed, and how sensitive you are.",
          "A small tea at 16:00 is very different from a large cold brew, energy drink, or pre-workout. Last Cup is built around this exact decision."
        ]
      },
      {
        heading: "Why 4 PM is the danger zone",
        body: [
          "For many people, late afternoon is close enough to bedtime that caffeine can still be relevant at night. It may not keep everyone awake, but it can make sleep feel lighter or delay the moment you feel naturally tired.",
          "If you need energy at 16:00, consider a smaller serving, a walk, water, food, daylight, or a decaf alternative."
        ]
      },
      {
        heading: "The better question",
        body: [
          "Instead of asking whether coffee at 4 PM is allowed, ask what it will cost. Will it help the next two hours but make tonight harder? If yes, the tradeoff may not be worth it."
        ]
      }
    ]
  },
  {
    slug: "best-time-to-drink-coffee-for-sleep",
    title: "The Best Time to Drink Coffee If You Care About Sleep",
    description:
      "How to choose your coffee window, avoid late caffeine, and use timing instead of restriction.",
    keyword: "best time to drink coffee for sleep",
    readTime: "8 min read",
    publishedAt: "2026-07-10",
    sections: [
      {
        heading: "Coffee timing beats coffee guilt",
        body: [
          "Most people do not need to quit coffee. They need better timing. The same drink can be helpful in the morning and disruptive late in the day.",
          "Last Cup focuses on the decision moment: whether your next cup still fits your sleep plan."
        ]
      },
      {
        heading: "Create a personal coffee window",
        body: [
          "A useful starting point is to keep stronger caffeine earlier in the day and reduce or avoid it in the afternoon. The exact cutoff depends on your bedtime and sensitivity.",
          "If you normally sleep at 22:30, a 15:00 coffee deserves more thought than a 09:00 coffee."
        ]
      },
      {
        heading: "Make the habit easy",
        body: [
          "The goal is not perfection. The goal is a repeatable habit: check your likely clear time before ordering another drink."
        ]
      }
    ]
  }
];

export function getPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
