const NUMBER_ICONS = [
  "1F96D", "1F34A", "1F34C", "1F347", "1F353", "1F360", "1F966", "1F955", "1F336", "1F33D",
  "1F95E", "1F351", "1F352", "1F348", "1F349", "1F34D", "1F34E", "1F350", "1F351", "1F352",
];

const COLOURS = [
  "from-amber-400 to-orange-400",
  "from-green-400 to-emerald-500",
  "from-violet-400 to-purple-500",
  "from-rose-400 to-pink-500",
  "from-sky-400 to-blue-500",
  "from-amber-400 to-yellow-400",
  "from-teal-400 to-cyan-500",
  "from-orange-400 to-red-400",
  "from-fuchsia-400 to-pink-400",
  "from-green-500 to-emerald-400",
];

const COUNTING_ITEMS = [
  "mango", "orange", "banana", "grape", "strawberry", "yam", "broccoli", "carrot", "pepper", "corn",
  "pancake", "peach", "cherry", "melon", "watermelon", "pineapple", "apple", "pear", "peach", "cherry",
];

const ONES: Record<number, string> = {
  1: "Ọkan", 2: "Èjì", 3: "Ẹta", 4: "Ẹrin", 5: "Àrún", 6: "Ẹfà", 7: "Èje", 8: "Ẹjọ", 9: "Ẹsàn",
};

const TEENS: Record<number, string> = {
  10: "Ẹwà", 11: "Mokanlá", 12: "Mejìlá", 13: "Mẹ́tàlá", 14: "Mẹ́rinlá", 15: "Márùn",
  16: "Mẹ́fàlá", 17: "Méjè", 18: "Mẹ́jọ", 19: "Mẹ́sàn",
};

const TENS: Record<number, string> = {
  2: "Ogún", 3: "Ọgbọn", 4: "Ọgbẹ̀rin", 5: "Ààdọ́ta", 6: "Ọgọ́fa",
  7: "Ọgọ́je", 8: "Ọgọ́jọ", 9: "Ọgọ́sàn",
};

function getYorubaNumber(value: number): string {
  if (value <= 9) return ONES[value];
  if (value <= 19) return TEENS[value];
  if (value === 100) return "Ọgọ́rùn-ún";
  if (value % 10 === 0) return TENS[value / 10];

  const tensWord = TENS[Math.floor(value / 10)] ?? "";
  const unitWord = ONES[value % 10] ?? "";
  return `${unitWord} l'${tensWord.toLowerCase()}`.trim();
}

function getEnglishNumber(value: number): string {
  const ones = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  if (value < 10) return ones[value];
  if (value < 20) return teens[value - 10];
  if (value < 100) {
    const tensValue = Math.floor(value / 10);
    const remainder = value % 10;
    return remainder === 0 ? tens[tensValue] : `${tens[tensValue]} ${ones[remainder]}`;
  }
  return "One Hundred";
}

export interface NumberData {
  numeral: string;
  word: string;
  yorubaWord: string;
  imageUrl: string;
  colour: string;
  itemName: string;
}

export const NUMBER_DATA: Record<string, NumberData> = Object.fromEntries(
  Array.from({ length: 100 }, (_, index) => {
    const value = index + 1;
    const iconIndex = (value - 1) % NUMBER_ICONS.length;
    const word = getEnglishNumber(value);

    return [String(value), {
      numeral: String(value),
      word,
      yorubaWord: getYorubaNumber(value) || word,
      imageUrl: `https://cdn.jsdelivr.net/npm/openmoji@15.0.0/color/svg/${NUMBER_ICONS[iconIndex]}.svg`,
      colour: COLOURS[(value - 1) % COLOURS.length],
      itemName: COUNTING_ITEMS[iconIndex],
    }];
  })
);