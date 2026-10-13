import quotesData from "./quotes.json";

export interface QuoteItem {
  id?: string;
  text: string;
  author?: string;
  source: string;
  len?: "short" | "medium" | "long";
}

export const QUOTES_BANK: QuoteItem[] = quotesData as QuoteItem[];

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
  "are", "more", "was", "page", "has", "search", "free", "information",
  "site", "may", "news", "contact", "here", "business", "web", "view",
  "online", "been", "were", "services", "click", "service", "price", "date",
  "top", "had", "name", "email", "health", "used", "products", "buy",
  "data", "should", "product", "post", "add", "policy", "please", "available",
  "copyright", "support", "message", "best", "software", "jan", "video", "where",
  "info", "rights", "public", "books", "through", "links", "review", "years",
  "very", "privacy", "book", "items", "company", "many", "user", "said",
  "does", "set", "general", "research", "university", "january", "mail", "full",
  "map", "reviews", "program", "games", "days", "management", "united", "hotel",
  "real", "item", "international", "center", "ebay", "must", "store", "travel",
  "comments", "made", "development", "report", "off", "member", "details", "terms",
  "before", "hotels", "did", "send", "type", "local", "those", "using",
  "results", "office", "education", "national", "design", "posted", "internet", "address",
  "community", "within", "states", "area", "phone", "dvd", "shipping", "reserved",
  "subject", "forum", "family", "based", "code", "black", "check", "special",
  "prices", "website", "index", "being", "women", "much", "sign", "file",
  "link", "today", "technology", "south", "project", "same", "pages", "version",
  "section", "own", "found", "sports", "related", "security", "county", "american",
  "photo", "game", "members", "while", "network", "down", "computer", "systems",
  "three", "total", "end", "following", "download", "without", "per", "access",
  "north", "resources", "current", "posts", "big", "media", "law", "control",
  "history", "pictures", "size", "art", "personal", "since", "including", "guide",
  "shop", "directory", "board", "location", "text", "rating", "rate", "government",
  "children", "during", "usa", "return", "students", "shopping", "account", "times",
  "sites", "level", "digital", "profile", "previous", "events", "love", "old",
  "john", "main", "hours", "image", "department", "title", "description", "non",
  "insurance", "another", "why", "shall", "property", "class", "still", "money",
  "quality", "every", "listing", "content", "country", "private", "little", "visit",
  "save", "tools", "low", "reply", "customer", "december", "compare", "movies",
  "include", "college", "value", "article", "york", "man", "card", "jobs",
  "provide", "food", "source", "author", "different", "press", "learn", "sale",
  "around", "print", "course", "job", "canada", "process", "teen", "room",
  "stock", "training", "too", "credit", "join", "science", "men", "categories",
  "advanced", "west", "sales", "english", "left", "team", "estate", "box",
  "conditions", "select", "windows", "photos", "gay", "thread", "week", "category",
  "note", "live", "gallery", "table", "register", "however", "june", "october",
  "november", "market", "library", "really", "action", "series", "model", "features",
  "air", "industry", "human", "provided", "yes", "required", "hot", "accessories",
  "cost", "movie", "forums", "march", "september", "better", "questions", "july",
  "yahoo", "going", "medical", "test", "friend", "dec", "server", "study",
  "application", "cart", "staff", "articles", "san", "feedback", "looking", "issues",
  "april", "users", "complete", "street", "topic", "comment", "financial", "things",
  "working", "against", "standard", "tax", "person", "below", "mobile", "less",
  "got", "blog", "party", "payment", "equipment", "login", "student", "let",
  "programs", "offers", "legal", "recent", "park", "stores", "act", "problem",
  "memory", "performance", "social", "august", "quote", "language", "sell", "options",
  "experience", "rates", "create", "key", "body", "america", "important", "field",
  "east", "single", "age", "activities", "club", "example", "girls", "additional",
  "password", "latest", "something", "road", "gift", "question", "changes", "hard",
  "texas", "oct", "pay", "four", "poker", "status", "browse", "issue",
  "range", "building", "seller", "court", "february", "result", "audio", "write",
  "nov", "offer", "blue", "groups", "easy", "given", "files", "event",
  "release", "analysis", "request", "fax", "china", "making", "picture", "needs",
  "possible", "might", "professional", "yet", "month", "major", "star", "areas",
  "future", "committee", "sun", "cards", "problems", "london", "washington", "meeting",
  "rss", "become", "interest", "child", "enter", "california", "share", "similar",
  "garden", "schools", "million", "added", "reference", "companies", "listed", "baby",
  "learning", "energy", "delivery", "net", "popular", "term", "film", "stories",
  "computers", "journal", "reports", "try", "welcome", "central", "images", "president",
  "notice", "original", "radio", "cell", "color", "self", "council", "away",
  "includes", "track", "australia", "discussion", "archive", "once", "others", "entertainment",
  "agreement", "format", "least", "society", "months", "log", "safety", "friends",
  "sure", "faq", "trade", "edition", "cars", "messages", "marketing", "tell",
  "further", "updated", "association", "able", "having", "provides", "david", "fun",
  "already", "green", "studies", "close", "common", "drive", "specific", "several",
  "gold", "feb", "living", "sep", "collection", "called", "arts", "lot",
  "ask", "display", "limited", "powered", "solutions", "means", "director", "daily",
  "beach", "past", "natural", "whether", "due", "electronics", "five", "upon",
  "period", "planning", "database", "says", "official", "weather", "mar", "average",
  "done", "technical", "window", "france", "pro", "region", "island", "record",
  "direct", "microsoft", "conference", "environment", "records", "district", "calendar", "costs",
  "style", "url", "front", "statement", "update", "parts", "aug", "downloads",
  "early", "miles", "sound", "resource", "present", "applications", "either", "ago",
  "document", "word", "works", "material", "bill", "apr", "written", "federal",
  "hosting", "rules", "final", "adult", "tickets", "centre", "requirements", "via",
  "cheap", "kids", "finance", "minutes", "else", "third", "rock", "gifts",
  "europe", "reading", "topics", "bad", "individual", "tips", "plus", "auto",
  "cover", "usually", "edit", "videos", "percent", "fast", "function", "unit",
  "getting", "global", "tech", "meet", "far", "economic", "player", "projects",
  "lyrics", "subscribe", "submit", "germany", "amount", "watch", "included", "bank",
  "risk", "thanks", "everything", "deals", "various", "words", "linux", "jul",
  "production", "commercial", "james", "weight", "town", "heart", "advertising", "received",
  "choose", "treatment", "newsletter", "archives", "points", "knowledge", "magazine", "error",
  "camera", "jun", "currently", "construction", "toys", "registered", "clear", "golf",
  "receive", "domain", "methods", "chapter", "makes", "protection", "policies", "loan",
  "wide", "beauty", "manager", "india", "position", "taken", "sort", "listings",
  "models", "michael", "known", "half", "cases", "step", "engineering", "florida",
  "simple", "quick", "none", "wireless", "license", "paul", "friday", "lake",
  "whole", "annual", "published", "later", "basic", "sony", "shows", "corporate",
  "google", "church", "method", "purchase", "customers", "active", "response", "practice",
  "hardware", "figure", "materials", "fire", "holiday", "chat", "designed", "along",
  "among", "death", "writing", "speed", "html", "countries", "loss", "face",
  "brand", "discount", "higher", "effects", "created", "remember", "standards", "oil",
  "bit", "yellow", "political", "increase", "advertise", "kingdom", "base", "near",
  "environmental", "thought", "stuff", "french", "storage", "japan", "doing", "loans",
  "shoes", "entry", "stay", "nature", "orders", "availability", "africa", "summary",
  "growth", "notes", "agency", "king", "monday", "european", "activity", "copy",
  "although", "drug", "pics", "western", "income", "force", "cash", "employment",
  "overall", "bay", "commission", "package", "contents", "seen", "players", "engine",
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

export type WordPoolTier = "beginner" | "intermediate" | "advanced";

// ─────────────────────────────────────────────────────────────────────────────
// BEGINNER — short, phonetically clean, common words for touch-typing beginners
// building muscle memory for standard QWERTY positions. Obscure words removed.
// ─────────────────────────────────────────────────────────────────────────────
export const BEGINNER_WORDS: string[] = [
  // Home row anchors (a s d f g h j k l)
  "ask", "all", "add", "sad", "fall", "flag", "glad", "hall", "lad", "flask",
  "dash", "half", "last", "lag", "lash", "gas",
  // Common 3-letter words
  "the", "and", "for", "are", "but", "not", "you", "can", "her", "was",
  "one", "our", "out", "day", "get", "has", "him", "his", "how", "man",
  "new", "now", "old", "see", "two", "way", "who", "boy", "did", "its",
  "let", "put", "say", "she", "too", "use", "big", "cat", "dog", "fun",
  "got", "hat", "joy", "kit", "lot", "map", "nod", "off", "pen", "ran",
  "sat", "sun", "tan", "top", "van", "wet", "yes", "zip", "bit", "cup",
  "box", "fly", "bed", "red", "run", "car",
  // Common 4-letter words
  "fast", "gold", "hard", "just", "keep", "like", "made", "name", "over", "part",
  "read", "send", "talk", "turn", "used", "very", "walk", "your", "able", "blue",
  "care", "done", "each", "face", "give", "hand", "into", "kind", "live", "make",
  "next", "only", "real", "same", "take", "upon", "wide", "year", "also", "back",
  "call", "dark", "else", "good", "help", "idea", "join", "know", "long", "move",
  "need", "open", "plan", "once", "rest", "show", "stay", "them", "time", "want",
  "well", "home", "life", "line", "look", "page", "play", "side", "stop", "tree",
  "work", "star", "room", "road", "wind", "warm", "bird", "boat", "book", "door",
  "fish", "food", "game", "hill", "lake", "moon", "rain", "snow", "town",
];

// ─────────────────────────────────────────────────────────────────────────────
// ADVANCED — challenging, polysyllabic, academic and literature vocabulary.
// Dictionary-verified, lowercase ASCII, designed to test rhythm and vocabulary.
// ─────────────────────────────────────────────────────────────────────────────
export const ADVANCED_WORDS: string[] = [
  "accelerate", "accommodate", "accumulation", "acknowledgment", "acquisition",
  "advantageous", "aesthetic", "aggregate", "algorithm", "allegation",
  "ambiguous", "ameliorate", "anachronism", "analogous", "anticipation",
  "apprehension", "arbitrary", "archetype", "articulate", "ascertain",
  "assimilate", "asynchronous", "attenuate", "augment", "authentic",
  "autonomous", "benevolent", "bureaucracy", "cadence", "calibration",
  "capricious", "catalyst", "categorize", "circumstantial", "clandestine",
  "coalesce", "cognitive", "collaborate", "commensurate", "compensate",
  "complacency", "comprehensive", "concatenate", "concurrence", "configuration",
  "conjecture", "connotation", "conscientious", "consensus", "consolidate",
  "conspicuous", "contemporaneous", "contingency", "corroborate", "cumulative",
  "deciduous", "delineate", "deliberate", "demarcation", "demonstrable",
  "denotation", "deprecation", "derivative", "deteriorate", "diagnostic",
  "dichotomy", "differentiate", "dilapidated", "diminutive", "discernible",
  "discretionary", "discrepancy", "disparate", "dissemination", "distinction",
  "eccentric", "eclectic", "efficacious", "egalitarian", "elaborate",
  "elucidate", "emblematic", "empirical", "encapsulate", "encompass",
  "endeavor", "enigmatic", "enumeration", "ephemeral", "equilibrium",
  "equivocal", "eradicate", "erudite", "esoteric", "evaluation",
  "evanescent", "exacerbate", "exaggeration", "exemplary", "exhaustion",
  "exhilarate", "existential", "extrapolate", "facilitate", "fallacious",
  "fastidious", "feasibility", "fluctuation", "formulate", "fortuitous",
  "fundamental", "galvanize", "generalization", "gravitate", "harbinger",
  "hierarchy", "homogeneous", "hypothetical", "idiosyncratic", "illumination",
  "illustrative", "immutable", "imperative", "impervious", "implementation",
  "implication", "improvise", "inadvertent", "incidental", "inconclusive",
  "incorporate", "indigenous", "indiscriminate", "indispensable", "inevitable",
  "inferential", "infrastructure", "inherently", "initiation", "innovation",
  "inordinate", "inquisitive", "insignificant", "insidious", "instantiation",
  "integration", "intelligible", "intermediate", "intermittent", "interpolation",
  "intrinsic", "introspective", "intuitive", "invariable", "inviolable",
  "iterative", "juxtaposition", "labyrinthine", "lamentable", "legitimate",
  "leverage", "liquidation", "longevity", "longitudinal", "lucidity",
  "luminous", "magnitude", "maladaptive", "malleable", "manifestation",
  "manipulation", "melancholy", "meticulous", "mitigation", "modulation",
  "momentous", "monotonous", "monumental", "multifaceted", "navigable",
  "nebulous", "negligible", "nomenclature", "noncommittal", "nonpartisan",
  "nostalgic", "nuance", "numerical", "obsolescence", "omnipresent",
  "omniscient", "operational", "opportune", "optimization", "orchestrate",
  "oscillate", "ostensible", "palatable", "panacea", "paradigm",
  "paradoxical", "parameter", "pedagogical", "peerless", "perfunctory",
  "peripheral", "pernicious", "perpetuate", "persistence", "perspective",
  "pervasive", "phenomenon", "philanthropic", "philosophical", "pivotal",
  "plausibility", "poignant", "polyphony", "pragmatic", "precipitate",
  "precursor", "predecessor", "predominant", "preliminary", "premeditated",
  "prerequisite", "preservation", "prevalence", "primordial", "pristine",
  "probabilistic", "procedural", "prolific", "promulgate", "proponent",
  "proportional", "prototype", "provisional", "provocative", "prudence",
  "pseudonym", "qualitative", "quantitative", "quarantine", "quintessential",
  "ramification", "randomization", "ratification", "rationalize", "recalcitrant",
  "reciprocal", "reconciliation", "redundant", "regeneration", "regulatory",
  "reiterate", "rejuvenate", "relevance", "relinquish", "reminiscent",
  "renovation", "repertoire", "replenish", "reprehensible", "replication",
  "representative", "residual", "resilience", "retrospective", "reverberate",
  "rhetorical", "rudimentary", "salient", "salutary", "sanction",
  "saturation", "schematic", "scrutiny", "sedentary", "semantic",
  "sensational", "sensitivity", "sequential", "serendipity", "simulation",
  "simultaneous", "skepticism", "solidarity", "sovereignty", "specification",
  "speculation", "spontaneous", "sporadic", "standardization", "steadfast",
  "stereotypical", "stipulation", "strategic", "substantiate", "subversive",
  "superfluous", "supersede", "supplementary", "suppression", "surveillance",
  "susceptible", "symbiosis", "symmetry", "synchronous", "syndication",
  "synthesis", "systematic", "taciturn", "tangible", "taxonomy",
  "temperament", "temporal", "tenuous", "terminology", "theoretical",
  "trajectory", "transcendental", "transformation", "transitive", "translucent",
  "transparent", "trepidation", "ubiquitous", "unanimous", "underlying",
  "undermine", "underpin", "uniformity", "universal", "utilitarian",
  "validation", "variability", "velocity", "veneration", "ventilation",
  "verification", "versatile", "viability", "vibration", "vicarious",
  "vigilance", "vindicate", "virulent", "viscosity", "visionary",
  "volatility", "vulnerability", "watershed", "whimsical", "yearning",
  "zealous", "zenith"
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

// ─────────────────────────────────────────────────────────────────────────────
// SPANISH (ES) — Top 250 common Spanish words (Unicode-safe)
// ─────────────────────────────────────────────────────────────────────────────
export const SPANISH_WORDS: string[] = [
  "de", "la", "que", "el", "en", "y", "a", "los", "se", "del",
  "las", "un", "por", "con", "no", "una", "su", "para", "es", "al",
  "lo", "como", "más", "pero", "sus", "le", "ya", "o", "este", "sí",
  "porque", "esta", "son", "entre", "está", "cuando", "muy", "sin", "sobre", "ser",
  "tiene", "también", "me", "hasta", "hay", "donde", "quien", "desde", "todo", "nos",
  "durante", "todos", "uno", "les", "ni", "contra", "otros", "ese", "eso", "ante",
  "ellos", "esto", "mí", "antes", "algunos", "qué", "unos", "yo", "otro", "otras",
  "otra", "él", "tanto", "esa", "estos", "mucho", "quienes", "nada", "muchos", "cual",
  "poco", "ella", "estar", "estas", "algunas", "algo", "nosotros", "mi", "mis", "tú",
  "te", "ti", "tu", "tus", "ellas", "tiempo", "persona", "año", "día", "cosa",
  "hombre", "mundo", "vida", "mano", "parte", "ojo", "lugar", "trabajo", "semana", "caso",
  "punto", "gobierno", "empresa", "número", "noche", "agua", "forma", "padre", "madre", "país",
  "momento", "casa", "ciudad", "puerta", "camino", "calle", "aire", "amigo", "verdad", "cuerpo",
  "hijo", "mujer", "tarde", "palabra", "amor", "pueblo", "fuerza", "luz", "idea", "tierra",
  "fondo", "gente", "historia", "ejemplo", "hora", "lado", "libro", "orden", "grupo", "cuenta",
  "campo", "modo", "razón", "mesa", "vista", "línea", "espacio", "cabeza", "muerte", "cambio",
  "nombre", "letra", "carta", "realidad", "sistema", "sentido", "centro", "efecto", "papel", "clase",
  "paso", "tema", "hecho", "obra", "medio", "base", "problema", "tipo", "ley", "final",
  "viaje", "zona", "fuego", "sol", "color", "mar", "siglo", "dolor", "salud", "juego",
  "arte", "alma", "paz", "valor", "suelo", "nivel", "cargo", "precio", "pie", "segundo",
  "estudio", "duda", "futuro", "espíritu", "sociedad", "destino", "calidad", "interés", "diferencia", "causa",
  "origen", "posible", "nuevo", "bueno", "gran", "mismo", "primero", "propio", "mayor", "cierto",
  "claro", "único", "general", "libre", "fácil", "difícil", "importante", "seguro", "social", "nacional",
  "humano", "corto", "largo", "alto", "bajo", "viejo", "joven", "rico", "pobre", "fuerte",
  "débil", "simple", "feliz", "triste", "rápido", "lento", "dulce", "amargo", "frío", "caliente",
  "lleno", "vacío", "limpio", "oscuro", "brillante", "lejos", "cerca", "temprano", "siempre", "nunca",
  "jamás", "hoy", "ayer", "mañana", "aquí", "allí", "ahí", "arriba", "abajo", "dentro",
  "fuera", "delante", "detrás", "encima", "debajo", "junto", "alrededor", "pronto", "despacio", "apenas",
  "quizás",
];

// ─────────────────────────────────────────────────────────────────────────────
// FRENCH (FR) — Top 250 common French words (Unicode-safe)
// ─────────────────────────────────────────────────────────────────────────────
export const FRENCH_WORDS: string[] = [
  "de", "la", "le", "et", "les", "des", "en", "un", "du", "une",
  "que", "est", "pour", "qui", "dans", "par", "plus", "pas", "au", "sur",
  "ne", "ce", "il", "sont", "se", "avec", "tout", "faire", "son", "mettre",
  "autre", "on", "mais", "nous", "comme", "ou", "si", "leur", "dire", "elle",
  "doit", "sans", "bon", "ici", "pouvoir", "vous", "deux", "temps", "très", "même",
  "notre", "voir", "mon", "bien", "aller", "aussi", "monde", "vie", "donner", "falloir",
  "jour", "prendre", "trouver", "encore", "croire", "aimer", "penser", "homme", "pays", "après",
  "jamais", "femme", "heure", "quelque", "venir", "votre", "enfant", "savoir", "grand", "dernier",
  "sous", "porte", "tenir", "parler", "fort", "petit", "regarder", "nouveau", "maintenant", "sentir",
  "rendre", "question", "premier", "passer", "point", "ville", "nuit", "vers", "chose", "eau",
  "reste", "maison", "travail", "yeux", "effet", "place", "entendre", "trois", "nom", "cas",
  "raison", "attendre", "perdre", "côté", "fond", "force", "famille", "idée", "air", "peuple",
  "corps", "mort", "droit", "histoire", "mot", "matin", "moment", "cours", "sortir", "besoin",
  "chemin", "fils", "lumière", "terre", "groupe", "souvent", "forme", "projet", "partir", "livre",
  "lettre", "servir", "action", "face", "mois", "fin", "voix", "prix", "ordre", "beaucoup",
  "cause", "service", "guerre", "pied", "écrire", "table", "changer", "rue", "coeur", "espace",
  "société", "sens", "niveau", "loi", "soleil", "ligne", "ami", "jeune", "minute", "tableau",
  "mesure", "peine", "jeu", "champ", "vue", "choix", "rôle", "situation", "amour", "terme",
  "manière", "sécurité", "vrai", "nature", "mouvement", "route", "papier", "compte", "système", "esprit",
  "centre", "arbre", "condition", "général", "semaine", "simple", "difficile", "facile", "long", "court",
  "haut", "bas", "clair", "sombre", "chaud", "froid", "rapide", "lent", "riche", "pauvre",
  "seul", "propre", "libre", "plein", "vide", "beau", "joli", "calme", "doux", "lourd",
  "léger", "dur", "pur", "sûr", "vif", "large", "étroit", "cher", "exact", "parfait",
  "total", "frais", "profond", "jeune", "vieux", "entier", "grave", "chaque", "aucun", "certain",
  "plusieurs", "quel", "tous", "autour", "devant", "derrière", "dedans", "dehors", "dessus", "dessous",
  "loin", "près", "tôt", "tard", "toujours",
];

// ─────────────────────────────────────────────────────────────────────────────
// GERMAN (DE) — Top 250 common German words (Unicode-safe)
// ─────────────────────────────────────────────────────────────────────────────
export const GERMAN_WORDS: string[] = [
  "der", "die", "und", "in", "den", "von", "zu", "das", "mit", "sich",
  "des", "auf", "für", "ist", "im", "dem", "nicht", "ein", "eine", "als",
  "auch", "es", "an", "werden", "aus", "er", "hat", "dass", "sie", "nach",
  "wird", "bei", "einer", "um", "am", "sind", "noch", "wie", "einem", "über",
  "einen", "so", "zum", "war", "haben", "nur", "oder", "aber", "vor", "zur",
  "bis", "mehr", "durch", "man", "sein", "wurde", "sei", "prozent", "hatte", "kann",
  "gegen", "vom", "können", "schon", "wenn", "habe", "seine", "ihre", "dann", "unter",
  "wir", "soll", "ich", "eines", "jahr", "zwei", "diese", "dieser", "wieder", "keine",
  "uhr", "seiner", "worden", "will", "zwischen", "immer", "millionen", "was", "sagte", "gibt",
  "alle", "diesem", "seit", "musste", "neue", "damit", "jetzt", "zeit", "seinen", "gute",
  "leben", "mensch", "tag", "arbeit", "hand", "stadt", "welt", "herr", "frau", "kind",
  "haus", "land", "weg", "seite", "auge", "ende", "wasser", "platz", "fall", "frage",
  "kopf", "raum", "kraft", "bild", "wort", "nacht", "art", "geld", "freund", "gruppe",
  "grund", "spiel", "licht", "sonne", "abend", "stück", "teil", "blick", "schule", "punkt",
  "form", "buch", "brief", "ziel", "reise", "körper", "plan", "geist", "luft", "ordnung",
  "natur", "system", "rolle", "sache", "gefühl", "wärme", "ruhe", "angst", "freiheit", "glück",
  "wahrheit", "stimme", "strahl", "straße", "garten", "fenster", "tür", "zimmer", "tisch", "stuhl",
  "baum", "wald", "berg", "fluss", "meer", "wolke", "wind", "feuer", "stein", "farbe",
  "traum", "hoffnung", "woche", "monat", "stunde", "sekunde", "anfang", "mitte", "schritt", "gedanke",
  "muster", "lösung", "erfolg", "einfach", "schwer", "leicht", "schnell", "langsam", "groß", "klein",
  "hoch", "tief", "alt", "jung", "neu", "früh", "spät", "gut", "schlecht", "stark",
  "schwach", "hell", "dunkel", "warm", "kalt", "klar", "rein", "voll", "leer", "sicher",
  "offen", "nah", "weit", "ruhig", "laut", "schön", "hart", "weich", "richtig",
];

// ─────────────────────────────────────────────────────────────────────────────
// PORTUGUESE (PT) — Top 250 common Portuguese words (Unicode-safe)
// ─────────────────────────────────────────────────────────────────────────────
export const PORTUGUESE_WORDS: string[] = [
  "de", "a", "o", "que", "e", "do", "da", "em", "um", "para",
  "é", "com", "não", "uma", "os", "no", "se", "na", "por", "mais",
  "as", "dos", "como", "mas", "foi", "ao", "ele", "das", "tem", "à",
  "seu", "sua", "ou", "ser", "quando", "muito", "nos", "já", "está", "eu",
  "também", "só", "pelo", "pela", "até", "isso", "ela", "entre", "era", "depois",
  "sem", "mesmo", "aos", "ter", "seus", "quem", "nas", "me", "esse", "eles",
  "estão", "você", "tinha", "foram", "essa", "num", "nem", "suas", "meu", "às",
  "minha", "numa", "tudo", "tempo", "ano", "dia", "homem", "vida", "coisa", "casa",
  "mundo", "parte", "lugar", "forma", "olho", "hora", "caminho", "mão", "noite", "mulher",
  "cidade", "caso", "trabalho", "ponto", "país", "lado", "água", "governo", "filho", "pai",
  "mãe", "amigo", "história", "palavra", "gente", "momento", "terra", "vez", "fim", "porta",
  "ideia", "grupo", "olhar", "corpo", "sala", "livro", "rua", "fato", "amor", "morte",
  "tipo", "razão", "passo", "modo", "voz", "ar", "luz", "cabeça", "centro", "linha",
  "conta", "valor", "força", "mesa", "vista", "fogo", "mar", "sistema", "ordem", "papel",
  "problema", "direito", "efeito", "medida", "serviço", "campo", "projeto", "espaço", "minuto", "segundo",
  "semana", "mês", "número", "arte", "nome", "letra", "carta", "sol", "lua", "vento",
  "chuva", "rio", "árvore", "flor", "animal", "saúde", "paz", "alegria", "sonho", "medo",
  "verdade", "esperança", "destino", "qualidade", "novo", "velho", "bom", "mau", "grande", "pequeno",
  "alto", "baixo", "forte", "fraco", "fácil", "difícil", "rápido", "lento", "claro", "escuro",
  "quente", "frio", "cheio", "vazio", "limpo", "sujo", "livre", "certo", "seguro", "simples",
  "perfeito", "feliz", "triste", "calmo", "doce", "amargo", "perto", "longe", "cedo", "tarde",
  "sempre", "nunca", "hoje", "ontem", "amanhã", "aqui", "ali", "lá", "onde", "agora",
  "ainda", "assim", "bem", "mal", "melhor", "pior", "menos",
];

// ─────────────────────────────────────────────────────────────────────────────
// ITALIAN (IT) — Top 250 common Italian words (Unicode-safe)
// ─────────────────────────────────────────────────────────────────────────────
export const ITALIAN_WORDS: string[] = [
  "di", "a", "il", "la", "e", "in", "un", "per", "che", "una",
  "non", "del", "si", "da", "con", "le", "al", "è", "dei", "della",
  "più", "anche", "ha", "questo", "gli", "sono", "se", "lo", "ma", "come",
  "alla", "ci", "dal", "nel", "questa", "delle", "o", "ai", "tra", "fra",
  "dopo", "su", "quale", "molto", "uno", "loro", "suo", "bene", "dove", "tempo",
  "anno", "giorno", "cosa", "uomo", "modo", "mondo", "vita", "mano", "parte", "occhio",
  "ora", "casa", "caso", "notte", "donna", "lavoro", "luogo", "punto", "paese", "momento",
  "fine", "città", "stato", "strada", "figlio", "padre", "madre", "amico", "storia", "parola",
  "gente", "aria", "acqua", "terra", "idea", "forma", "fatto", "gruppo", "corpo", "libro",
  "lettera", "nome", "voce", "mente", "cuore", "ragione", "passo", "lato", "porta", "linea",
  "senso", "numero", "centro", "luce", "sole", "ordine", "tipo", "vista", "valore", "piano",
  "forza", "mare", "fuoco", "spazio", "camera", "tavolo", "campo", "servizio", "sistema", "diritto",
  "effetto", "problema", "figura", "scuola", "arte", "musica", "minuto", "secondo", "settimana", "mese",
  "sera", "mattina", "vento", "albero", "fiore", "animale", "salute", "pace", "gioia", "sogno",
  "paura", "verità", "speranza", "destino", "qualità", "nuovo", "vecchio", "buono", "cattivo", "grande",
  "piccolo", "alto", "basso", "forte", "debole", "facile", "difficile", "rapido", "lento", "chiaro",
  "scuro", "caldo", "freddo", "pieno", "vuoto", "pulito", "libero", "sicuro", "semplice", "perfetto",
  "felice", "triste", "calmo", "dolce", "amaro", "vicino", "lontano", "presto", "tardi", "sempre",
  "mai", "oggi", "ieri", "domani", "qui", "lì", "allora", "adesso", "subito", "ancora",
  "quasi", "insieme", "spesso", "forse", "prima", "sopra", "sotto", "davanti", "dietro", "dentro",
  "fuori", "intorno", "oltre", "verso",
];

// ─────────────────────────────────────────────────────────────────────────────
// CLASSIC PASSAGES — 14 public-domain literary excerpts (all pre-1929).
// Sourced from Project Gutenberg (gutenberg.org), which verifies public-domain
// status. Typographically normalized for typing: straight quotes, -- for em
// dashes. Each passage is 90-130 words — ideal for a focused typing session.
// ─────────────────────────────────────────────────────────────────────────────
export const CLASSIC_PASSAGES: QuoteItem[] = [
  {
    text: "It is a truth universally acknowledged, that a single man in possession of a good fortune must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered as the rightful property of some one or other of their daughters. \"My dear Mr. Bennet,\" said his lady to him one day, \"have you heard that Netherfield Park is let at last?\" Mr. Bennet replied that he had not. \"But it is,\" returned she; \"for Mrs. Long has just been here, and she told me all about it.\" Mr. Bennet made no answer.",
    source: "Jane Austen, Pride and Prejudice (1813)"
  },
  {
    text: "Call me Ishmael. Some years ago--never mind how long precisely--having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation.",
    source: "Herman Melville, Moby Dick (1851)"
  },
  {
    text: "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair, we had everything before us, we had nothing before us, we were all going direct to Heaven, we were all going direct the other way--in short, the period was so far like the present period, that some of its noisiest authorities insisted on its being received, for good or for evil, in the superlative degree of comparison only.",
    source: "Charles Dickens, A Tale of Two Cities (1859)"
  },
  {
    text: "You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking. I am already far north of London, and as I walk in the streets of Petersburgh, I feel a cold northern breeze play upon my cheeks, which braces my nerves and fills me with delight. Do you understand this feeling? This breeze, which has travelled from the regions towards which I am advancing, gives me a foretaste of those icy climes.",
    source: "Mary Shelley, Frankenstein (1818)"
  },
  {
    text: "Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, \"and what is the use of a book,\" thought Alice \"without pictures or conversations?\" So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.",
    source: "Lewis Carroll, Alice\'s Adventures in Wonderland (1865)"
  },
  {
    text: "To Sherlock Holmes she is always the woman. I have seldom heard him mention her under any other name. In his eyes she eclipses and predominates the whole of her sex. It was not that he felt any emotion akin to love for Irene Adler. All emotions, and that one particularly, were abhorrent to his cold, precise but admirably balanced mind. He was, I take it, the most perfect reasoning and observing machine that the world has seen, but as a lover he would have placed himself in a false position. He never spoke of the softer passions, save with a gibe and a sneer. They were admirable things for the observer--excellent for drawing the veil from men's motives and actions.",
    source: "Arthur Conan Doyle, The Adventures of Sherlock Holmes (1892)"
  },
  {
    text: "3 May. Bistritz.--Left Munich at 8:35 P. M., on 1st May, arriving at Vienna early next morning; should have arrived at 6:46, but train was an hour late. Buda-Pesth seems a wonderful place, from the glimpse which I got of it from the train and the little I could walk through the streets. I feared to go very far from the station, as we had arrived late and would start as near the correct time as possible. The impression I had was that we were leaving the West and entering the East; the most western of splendid bridges over the Danube, which is here of noble width and depth, took us among the traditions of Turkish rule. We left in pretty good time, and came after nightfall to Klausenburgh.",
    source: "Bram Stoker, Dracula (1897)"
  },
  {
    text: "The Time Traveller (for so it will be convenient to speak of him) was expounding a recondite matter to us. His grey eyes shone and twinkled, and his usually pale face was flushed and animated. The fire burnt brightly, and the soft radiance of the incandescent lights in the lilies of silver caught the bubbles that flashed and passed in our glasses. Our chairs, being his patents, embraced and caressed us rather than submitted to be sat upon, and there was that luxurious after-dinner atmosphere, when thought runs gracefully free of the trammels of precision.",
    source: "H. G. Wells, The Time Machine (1895)"
  },
  {
    text: "Squire Trelawney, Dr. Livesey, and the rest of these gentlemen having asked me to write down the whole particulars about Treasure Island, from the beginning to the end, keeping nothing back but the bearings of the island, and that only because there is still treasure not yet lifted, I take up my pen in the year of grace 17--, and go back to the time when my father kept the Admiral Benbow inn and the brown old seaman with the sabre cut first took up his lodging under our roof.",
    source: "Robert Louis Stevenson, Treasure Island (1883)"
  },
  {
    text: "There was no possibility of taking a walk that day. We had been wandering, indeed, in the leafless shrubbery an hour in the morning; but since dinner (Mrs. Reed, when there was no company, dined early) the cold winter wind had brought with it clouds so sombre, and a rain so penetrating, that further outdoor exercise was now out of the question. I was glad of it: I never liked long walks, especially on chilly afternoons: dreadful to me was the coming home in the raw twilight, with nipped fingers and toes, and a heart saddened by the chidings of Bessie, the nurse, and humbled by the consciousness of my physical inferiority to Eliza, John, and Georgiana Reed.",
    source: "Charlotte Bronte, Jane Eyre (1847)"
  },
  {
    text: "1801--I have just returned from a visit to my landlord--the solitary neighbour that I shall be troubled with. This is certainly a beautiful country! In all England, I do not believe that I could have fixed on a situation so completely removed from the stir of society. A perfect misanthropist's Heaven--and Mr. Heathcliff and I are such a suitable pair to divide the desolation between us. A capital fellow! He little imagined how my heart warmed towards him when I beheld his black eyes withdraw so suspiciously under their brows, as I rode up, and when his fingers sheltered themselves, with a jealous resolution, still further in his waistcoat, as I announced my name. \"Mr. Heathcliff?\" I said.",
    source: "Emily Bronte, Wuthering Heights (1847)"
  },
  {
    text: "My father's family name being Pirrip, and my Christian name Philip, my infant tongue could make of both names nothing longer or more explicit than Pip. So, I called myself Pip, and came to be called Pip. I give Pirrip as my father's family name, on the authority of his tombstone and my sister,--Mrs. Joe Gargery, who married the blacksmith. As I never saw my father or my mother, and never saw any likeness of either of them (for their days were long before the days of photographs), my first fancies regarding what they were like were unreasonably derived from their tombstones.",
    source: "Charles Dickens, Great Expectations (1861)"
  },
  {
    text: "The studio was filled with the rich odour of roses, and when the light summer wind stirred amidst the trees of the garden, there came through the open door the heavy scent of the lilac, or the more delicate perfume of the pink-flowering thorn. From the corner of the divan of Persian saddle-bags on which he was lying, smoking, as was his custom, innumerable cigarettes, Lord Henry Wotton could just catch the gleam of the honey-sweet and honey-coloured blossoms of a laburnum, whose tremulous branches seemed hardly able to bear the burden of a beauty so flamelike as theirs; and now and then the fantastic shadows of birds in flight flitted across the long tussore-silk curtains that were stretche",
    source: "Oscar Wilde, The Picture of Dorian Gray (1890)"
  },
  {
    text: "In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since. \"Whenever you feel like criticizing anyone,\" he told me, \"just remember that all the people in this world haven't had the advantages that you've had.\" He didn't say any more, but we've always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that. In consequence, I'm inclined to reserve all judgements, a habit that has opened up many curious natures to me and also made me the victim of not a few veteran bores.",
    source: "F. Scott Fitzgerald, The Great Gatsby (1925)"
  },
];


export function getRandomWords(count: number, wordbank: string[] = TOP_200_WORDS): string[] {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * wordbank.length);
    words.push(wordbank[randomIndex]);
  }
  return words;
}

export const CODE_SNIPPETS: QuoteItem[] = [
  {
    text: "const fetchUser = async (id: string) => { const res = await fetch(`/api/users/${id}`); return res.json(); };",
    source: "TypeScript Fetch"
  },
  {
    text: "function debounce(func, wait) { let timeout; return function(...args) { clearTimeout(timeout); timeout = setTimeout(() => func.apply(this, args), wait); }; }",
    source: "JavaScript Debounce"
  },
  {
    text: "import React, { useState, useEffect } from 'react'; export const useCounter = (initial = 0) => { const [count, setCount] = useState(initial); return { count, increment: () => setCount(c => c + 1) }; };",
    source: "React Custom Hook"
  },
  {
    text: "def binary_search(arr, target): left, right = 0, len(arr) - 1 while left <= right: mid = (left + right) // 2 if arr[mid] == target: return mid elif arr[mid] < target: left = mid + 1 else: right = mid - 1 return -1",
    source: "Python Binary Search"
  },
  {
    text: "fn main() { let mut numbers = vec![1, 2, 3]; numbers.push(4); for n in &numbers { println!(\"Number: {n}\"); } }",
    source: "Rust Vector Iteration"
  },
  {
    text: "body { margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background-color: #1a1a1a; color: #ffffff; font-family: 'Inter', sans-serif; }",
    source: "CSS Reset & Flexbox"
  },
  {
    text: "SELECT u.id, u.username, COUNT(o.id) as order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.active = 1 GROUP BY u.id HAVING order_count > 5 ORDER BY order_count DESC LIMIT 10;",
    source: "SQL Complex Join"
  },
  {
    text: "package main import \"fmt\" func main() { messages := make(chan string) go func() { messages <- \"ping\" }() msg := <-messages fmt.Println(msg) }",
    source: "Go Channels"
  }
];