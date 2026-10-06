import privacyEn from "./legal/privacy.en.txt?raw";
import termsEn from "./legal/terms.en.txt?raw";

export const legalCopy = {
  en: {
    privacy: privacyEn,
    terms: termsEn,
    back: "Back to Aria",
  },
};

const sentenceEnd = /[.!?:]["”']?$/;

function isFreshBlock(line) {
  return /^(?:•|- |\d+(?:\.\d+)*\.?\s)/.test(line);
}

function joined(lines) {
  const blocks = [];
  let current = "";
  for (const line of lines) {
    if (!current) {
      current = line;
      continue;
    }
    if (isFreshBlock(line) || sentenceEnd.test(current)) {
      blocks.push(current);
      current = line;
    } else {
      current = `${current} ${line}`;
    }
  }
  if (current) blocks.push(current);
  return blocks;
}

export function legalDocument(raw) {
  const lines = raw
    .split("\n")
    .map((line) => line.replace(/\u200b/g, "").replace(/^`\s*/, "").trim())
    .filter(Boolean);
  const title = lines[0] || "";
  const dated = /^(עדכון|Last update)/.test(lines[1] || "");
  return {
    title,
    date: dated ? lines[1] : null,
    body: joined(lines.slice(dated ? 2 : 1)),
  };
}

const token =
  /https?:\/\/[^\s)\]]+|support@aria\.dating|\[Terms of Use\]|\[Privacy Policy\]/g;

export function legalParts(text) {
  const parts = [];
  let last = 0;
  for (const match of text.matchAll(token)) {
    const value = match[0];
    const index = match.index ?? 0;
    if (index > last) parts.push({ type: "text", value: text.slice(last, index) });
    if (value === "[Terms of Use]" || /terms-of-use/.test(value)) {
      parts.push({
        type: "hash",
        hash: "#terms",
        value: value.replace(/^\[|\]$/g, ""),
      });
    } else if (value === "[Privacy Policy]" || /privacy-policy/.test(value)) {
      parts.push({
        type: "hash",
        hash: "#privacy",
        value: value.replace(/^\[|\]$/g, ""),
      });
    } else if (value.includes("@")) {
      parts.push({ type: "mail", value });
    } else {
      parts.push({ type: "url", value });
    }
    last = index + value.length;
  }
  if (last < text.length) parts.push({ type: "text", value: text.slice(last) });
  return parts;
}
