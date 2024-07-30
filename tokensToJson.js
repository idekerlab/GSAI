import fs from "fs";

// Read the input file
const fileContents = fs.readFileSync("human_gene_symbol.txt", "utf8");

// Split into lines
const lines = fileContents.split("\n");

// Filter empty lines
const tokens = lines.filter((l) => l.trim() !== "");

// Build JSON array
const json = JSON.stringify(tokens);

// Write output file
fs.writeFileSync("tokens.json", json);

console.log("Tokens converted to JSON!");
