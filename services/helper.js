const fs = require("fs");

function createImageSlug(title) {
  const parts = title.toLowerCase().trim().split(".");
  if (parts.length < 2) return createSlug(title); // brak rozszerzenia

  const ext = parts.pop(); // ostatnia część = rozszerzenie
  const base = parts.join("."); // w razie gdyby było np. "nazwa.z.kropkami.jpg"

  const slug = createSlug(base);
  return `${slug}.${ext}`;
}

function createSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");
}


function saveTextFile(filename, content) {
    fs.writeFileSync(filename, content, "utf8");
    console.log(`Plik ${filename} zapisany.`);
}

module.exports = {
  saveTextFile,
  createSlug,
  createImageSlug
};