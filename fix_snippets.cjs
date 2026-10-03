const fs = require('fs');
let file = fs.readFileSync('src/data/wordbanks.ts', 'utf8');

const regex = /export const CODE_SNIPPETS[\s\S]*\}\n\];\n?$/m;

const replacement = `export const CODE_SNIPPETS: QuoteItem[] = [
  {
    text: "const fetchUser = async (id: string) => { const res = await fetch(\`/api/users/\${id}\`); return res.json(); };",
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
    text: "fn main() { let mut numbers = vec![1, 2, 3]; numbers.push(4); for n in &numbers { println!(\\"Number: {n}\\"); } }",
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
    text: "package main import \\"fmt\\" func main() { messages := make(chan string) go func() { messages <- \\"ping\\" }() msg := <-messages fmt.Println(msg) }",
    source: "Go Channels"
  }
];`;

file = file.replace(regex, replacement);
fs.writeFileSync('src/data/wordbanks.ts', file);
console.log("Fixed CODE_SNIPPETS in wordbanks.ts");
