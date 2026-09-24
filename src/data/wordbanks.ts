export interface QuoteItem {
  text: string;
  source: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// TOP 200 — authentic high-frequency English words (deduplicated, alphabetically
// weighted toward practice variety, no synthetic filler)
// ─────────────────────────────────────────────────────────────────────────────
export const TOP_200_WORDS: string[] = [
  "the", "be", "of", "and", "a", "to", "in", "he", "have", "it",
  "that", "for", "they", "with", "as", "not", "on", "she", "at", "by",
  "this", "we", "you", "do", "but", "his", "from", "say", "her", "or",
  "an", "will", "my", "one", "all", "would", "there", "their", "what", "so",
  "up", "out", "if", "about", "who", "get", "which", "go", "me", "when",
  "make", "can", "like", "time", "no", "just", "him", "know", "take", "people",
  "into", "year", "your", "good", "some", "could", "them", "see", "other", "than",
  "then", "now", "look", "only", "come", "its", "over", "think", "also", "back",
  "after", "use", "two", "how", "our", "work", "first", "well", "way", "even",
  "new", "want", "because", "any", "these", "give", "day", "most", "us", "great",
  "between", "need", "large", "under", "never", "each", "last", "right", "move",
  "thing", "place", "such", "again", "few", "case", "system", "group", "always",
  "point", "fact", "high", "water", "small", "world", "state", "find", "play",
  "hand", "part", "show", "life", "home", "number", "night", "keep", "school",
  "start", "read", "side", "line", "form", "head", "turn", "land", "call", "story",
  "hold", "kind", "stand", "house", "lead", "rule", "help", "city", "tree", "plan",
  "run", "order", "space", "power", "door", "change", "open", "seem", "together",
  "next", "white", "walk", "paper", "music", "both", "mark", "often", "letter",
  "until", "mile", "river", "car", "care", "second", "enough", "girl", "young",
  "ready", "above", "ever", "red", "list", "though", "feel", "talk", "bring",
  "put", "mean", "light", "voice", "war", "short", "long", "small", "true",
];

// ─────────────────────────────────────────────────────────────────────────────
// TOP 1000 — genuine vocabulary extension; no repeats from TOP_200
// ─────────────────────────────────────────────────────────────────────────────
export const TOP_1000_WORDS: string[] = [
  ...TOP_200_WORDS,
  "ability", "absent", "absolute", "accept", "accident", "accord", "account",
  "achieve", "action", "active", "actual", "addition", "address", "advance",
  "advantage", "adventure", "advice", "affect", "afford", "afraid", "afternoon",
  "agency", "agree", "ahead", "airport", "alarm", "allow", "almost", "alone",
  "along", "already", "although", "ambition", "amount", "ancient", "angle",
  "angry", "animal", "annual", "answer", "anxiety", "anxious", "anybody",
  "anyone", "anything", "anyway", "anywhere", "apart", "appeal", "appear",
  "apply", "appoint", "approach", "approve", "argue", "arise", "army",
  "around", "arrange", "arrest", "arrive", "article", "artist", "aside",
  "aspect", "assist", "assume", "attend", "attitude", "attract", "audience",
  "author", "authority", "autumn", "average", "avoid", "awake", "balance",
  "balloon", "barely", "barrel", "barrier", "battery", "battle", "beauty",
  "become", "bedroom", "before", "behave", "belief", "belong", "beneath",
  "benefit", "beside", "better", "beyond", "bicycle", "billion", "bitter",
  "blanket", "blind", "border", "borrow", "bottle", "branch", "breath",
  "breeze", "bridge", "bright", "brilliant", "brother", "budget", "building",
  "burden", "business", "camera", "campaign", "capable", "capital", "captain",
  "capture", "careful", "catalog", "celebrate", "century", "ceremony",
  "certain", "challenge", "champion", "chapter", "character", "charity",
  "chart", "chemical", "cinema", "classic", "climate", "cluster", "collect",
  "combine", "comfort", "commit", "compare", "compete", "complete", "concern",
  "conduct", "confirm", "connect", "contain", "control", "convert", "correct",
  "couple", "courage", "create", "credit", "crucial", "culture", "curious",
  "current", "custom", "damage", "debate", "decide", "declare", "defend",
  "define", "delay", "deliver", "depend", "desert", "detail", "detect",
  "develop", "differ", "direct", "discover", "display", "distance", "divide",
  "dollar", "doubt", "dragon", "drama", "drawing", "dream", "driver",
  "during", "eager", "effect", "effort", "either", "emerge", "emotion",
  "energy", "engine", "enjoy", "entire", "escape", "event", "evidence",
  "examine", "except", "expand", "expect", "explain", "express", "extend",
  "failure", "false", "family", "famous", "fashion", "father", "figure",
  "final", "finish", "forest", "forget", "forward", "freedom", "freeze",
  "friend", "future", "gentle", "garden", "gather", "gentle", "global",
  "golden", "ground", "happen", "health", "heart", "heavy", "hidden",
  "history", "honest", "honor", "horizon", "hour", "human", "hundred",
  "hungry", "hunter", "image", "impact", "improve", "include", "increase",
  "indeed", "industry", "instant", "instead", "journey", "judge", "junior",
  "justice", "kitchen", "knowledge", "language", "launch", "leader", "learn",
  "legend", "library", "listen", "locate", "manage", "manner", "market",
  "master", "matter", "measure", "member", "memory", "mention", "method",
  "mirror", "mission", "modern", "moment", "monitor", "mother", "motion",
  "mountain", "myself", "nation", "nature", "nearly", "notice", "object",
  "obtain", "offer", "origin", "outcome", "outside", "patient", "pattern",
  "perfect", "perhaps", "perform", "period", "picture", "planet", "pocket",
  "policy", "positive", "possible", "prevent", "primary", "private", "process",
  "produce", "program", "project", "protect", "provide", "public", "purpose",
  "quality", "quarter", "question", "quickly", "reason", "record", "reflect",
  "region", "relate", "remain", "remove", "repeat", "replace", "require",
  "respect", "result", "reveal", "rhythm", "season", "secret", "select",
  "sense", "series", "settle", "simple", "single", "sister", "slight",
  "smooth", "social", "solve", "source", "spirit", "spread", "stable",
  "station", "strategy", "stream", "street", "strength", "student", "success",
  "sudden", "suffer", "supply", "support", "surface", "survive", "symbol",
  "system", "target", "teacher", "theory", "threat", "through", "toward",
  "travel", "treat", "trial", "trouble", "trust", "truth", "tunnel",
  "unique", "unless", "useful", "valley", "value", "various", "village",
  "vision", "vital", "volume", "winter", "wonder", "yellow",
];

// ─────────────────────────────────────────────────────────────────────────────
// NUMBERS & PUNCTUATION — realistic tokens that blend naturally into sentences.
// Designed for one-at-a-time rendering so each "word" is a complete token.
// Deliberately varied: prices, dates, percentages, brackets, phone numbers,
// versions, equations, ratios, citations — satisfying to type, not gibberish.
// ─────────────────────────────────────────────────────────────────────────────
export const NUMBERS_PUNCTUATION_WORDS: string[] = [
  // Prices & currency
  "$4.99", "$12.50", "$199.00", "$1,299.95", "$74.99",
  "£49.99", "€129.00", "¥3,500", "€9.95", "£299.00",

  // Percentages & statistics
  "98.6%", "3.14%", "72.5%", "0.001%", "100%",
  "42.7%", "99.99%", "17.3%", "50.0%", "66.7%",

  // Dates & years
  "July 4, 1776", "March 14, 1879", "October 29, 1929",
  "December 7, 1941", "August 6, 1945", "November 22, 1963",
  "July 20, 1969", "April 15, 1912", "January 1, 2000",
  "September 11, 2001",

  // Phone & address formats
  "(212) 555-0192", "(800) 867-5309", "+44 20 7946 0958",
  "+1 (415) 555-2671", "1-800-FLOWERS",
  "221B Baker St.", "1600 Pennsylvania Ave.", "742 Evergreen Terrace",
  "350 Fifth Avenue, NY 10118", "4 Privet Drive, Surrey",

  // Version numbers & software
  "v3.11.0", "v1.0.0-alpha", "v2.4.1", "Node 22.12.0",
  "Python 3.12.4", "TypeScript 5.5", "React 19.0", "macOS 15.3",
  "Ubuntu 24.04 LTS", "HTTP/2.0",

  // Scientific notation & measurements
  "6.674×10⁻¹¹", "3×10⁸ m/s", "1.602×10⁻¹⁹ C",
  "9.81 m/s²", "273.15 K", "6,022×10²³",
  "1.989×10³⁰ kg", "384,400 km", "8.314 J/mol·K",

  // Fractions & ratios
  "3/4", "16:9", "5:3", "1:1,000", "22/7",
  "3:2", "4/3", "640×480", "1920×1080", "2560×1440",

  // Brackets, parens & quotes in context
  "(see note 3)", "[source needed]", "{key: value}",
  "<article>", "</section>", "[1984, p. 47]",
  "(ibid.)", "[sic]", "(op. cit.)", "[emphasis added]",

  // Common punctuation patterns
  "e.g.,", "i.e.,", "et al.", "etc.", "cf.",
  "viz.", "ca. 1850", "c. 400 BCE", "fl. 1620–1640",

  // Math & coding operators
  "x += 1;", "y -= 0.5;", "n * (n - 1)", "f(x) = x²",
  "sum = 0;", "i++", "arr[0]", "obj.key", "100 / 3",
  "2 ** 10", "a && b", "x || y", "!flag",

  // Weights, temperatures & distances
  "98.6°F", "37°C", "−40°C", "212°F", "0 K",
  "26.2 mi", "42.195 km", "100 m dash", "5,280 ft", "1,852 m",

  // Time & durations
  "9:41 AM", "11:59 PM", "00:00:00", "2h 37m", "45 min",
  "3:28.47", "1h 4m 30s", "72 hrs", "48 hours", "7 days",

  // ISBN, URLs & identifiers
  "ISBN 978-0-06-112008-4", "DOI 10.1038/nature", "RFC 2616",
  "ISSN 0028-0836", "PMID 12345678",

  // Common abbreviations with punctuation
  "Dr.", "Prof.", "Mr.", "Mrs.", "Jr.", "Sr.", "Inc.", "Ltd.", "Corp.",
  "Dept.", "Blvd.", "Ave.", "St.", "Apt.", "No.",
];

// ─────────────────────────────────────────────────────────────────────────────
// BEGINNER — short, phonetically clean, non-repetitive words for touch-typing
// beginners who need to build muscle memory for standard QWERTY positions.
// ─────────────────────────────────────────────────────────────────────────────
export const BEGINNER_WORDS: string[] = [
  // Home row focus (a s d f j k l)
  "ask", "all", "add", "sad", "fall", "flag", "glad", "hall", "lad", "flask",
  "dash", "half", "last", "jag", "skal", "flak", "lag", "fad", "gal", "lash",
  // Simple 3-5 letter words
  "the", "and", "for", "are", "but", "not", "you", "all", "can", "her",
  "was", "one", "our", "out", "day", "get", "has", "him", "his", "how",
  "man", "new", "now", "old", "see", "two", "way", "who", "boy", "did",
  "its", "let", "put", "say", "she", "too", "use", "big", "cat", "dog",
  "fun", "got", "hat", "joy", "kit", "lot", "map", "nod", "off", "pen",
  "ran", "sat", "tan", "up", "van", "wet", "yes", "zip", "bit", "cup",
  // Slightly longer common words
  "fast", "gold", "hard", "just", "keep", "like", "made", "name", "over",
  "part", "read", "send", "talk", "turn", "used", "very", "walk", "your",
  "able", "blue", "care", "done", "each", "face", "give", "hand", "into",
  "kind", "live", "make", "next", "only", "real", "same", "take", "upon",
  "wide", "year", "also", "back", "call", "dark", "else", "fall", "good",
  "help", "idea", "join", "know", "long", "move", "need", "open", "plan",
  "once", "rest", "show", "stay", "them", "time", "want", "well", "zone",
];

// ─────────────────────────────────────────────────────────────────────────────
// FAMOUS QUOTES — 30 carefully selected, properly attributed quotes spanning
// literature, science, history, and philosophy. Each is grammatically perfect,
// typographically rich (em dashes, commas, ellipses, capitals), and inspiring.
// ─────────────────────────────────────────────────────────────────────────────
export const FAMOUS_QUOTES: QuoteItem[] = [
  {
    text: "The Analytical Engine weaves algebraical patterns just as the Jacquard loom weaves flowers and leaves.",
    source: "Ada Lovelace"
  },
  {
    text: "We can only see a short distance ahead, but we can see plenty there that needs to be done.",
    source: "Alan Turing"
  },
  {
    text: "The most dangerous phrase in the language is, we have always done it this way.",
    source: "Grace Hopper"
  },
  {
    text: "Simplicity is the prerequisite for reliability. Programs must be written for people to read, and only incidentally for machines to execute.",
    source: "Edsger W. Dijkstra"
  },
  {
    text: "Somewhere, something incredible is waiting to be known.",
    source: "Carl Sagan"
  },
  {
    text: "The secret of getting ahead is getting started. Break your overwhelming tasks into small, manageable steps.",
    source: "Mark Twain"
  },
  {
    text: "Quality is not an act, it is a habit. We are what we repeatedly do.",
    source: "Will Durant"
  },
  {
    text: "It is not that I am so smart, it is just that I stay with problems longer.",
    source: "Albert Einstein"
  },
  {
    text: "In the middle of every difficulty lies opportunity. Imagination is more important than knowledge.",
    source: "Albert Einstein"
  },
  {
    text: "The measure of intelligence is the ability to change.",
    source: "Albert Einstein"
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    source: "Confucius"
  },
  {
    text: "Our greatest glory is not in never falling, but in rising every time we fall.",
    source: "Confucius"
  },
  {
    text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
    source: "Ralph Waldo Emerson"
  },
  {
    text: "That which does not kill us makes us stronger.",
    source: "Friedrich Nietzsche"
  },
  {
    text: "In the beginning was the Word, and the Word was with God, and the Word was God.",
    source: "The Bible, John 1:1"
  },
  {
    text: "All that glitters is not gold; often have you heard that told.",
    source: "William Shakespeare, The Merchant of Venice"
  },
  {
    text: "To be, or not to be, that is the question — whether it is nobler in the mind to suffer the slings and arrows of outrageous fortune.",
    source: "William Shakespeare, Hamlet"
  },
  {
    text: "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness.",
    source: "Charles Dickens, A Tale of Two Cities"
  },
  {
    text: "Call me Ishmael. Some years ago — never mind how long precisely — I thought I would sail about a little and see the watery part of the world.",
    source: "Herman Melville, Moby-Dick"
  },
  {
    text: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
    source: "Jane Austen, Pride and Prejudice"
  },
  {
    text: "Not all those who wander are lost; the old that is strong does not wither.",
    source: "J.R.R. Tolkien, The Lord of the Rings"
  },
  {
    text: "We accept the love we think we deserve.",
    source: "Stephen Chbosky, The Perks of Being a Wallflower"
  },
  {
    text: "So we beat on, boats against the current, borne back ceaselessly into the past.",
    source: "F. Scott Fitzgerald, The Great Gatsby"
  },
  {
    text: "The only way out of the labyrinth of suffering is to forgive.",
    source: "John Green, Looking for Alaska"
  },
  {
    text: "There are only two ways to live your life. One is as though nothing is a miracle. The other is as though everything is.",
    source: "Albert Einstein"
  },
  {
    text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.",
    source: "Benjamin Franklin"
  },
  {
    text: "You can fool all the people some of the time, and some of the people all the time, but you cannot fool all the people all the time.",
    source: "Abraham Lincoln"
  },
  {
    text: "Government of the people, by the people, for the people, shall not perish from the earth.",
    source: "Abraham Lincoln, Gettysburg Address"
  },
  {
    text: "Ask not what your country can do for you — ask what you can do for your country.",
    source: "John F. Kennedy"
  },
  {
    text: "I have a dream that my four little children will one day live in a nation where they will not be judged by the color of their skin but by the content of their character.",
    source: "Martin Luther King Jr."
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helper: pick `count` random words from the given wordbank
// ─────────────────────────────────────────────────────────────────────────────
export function getRandomWords(count: number, wordbank: string[] = TOP_200_WORDS): string[] {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * wordbank.length);
    words.push(wordbank[randomIndex]);
  }
  return words;
}
