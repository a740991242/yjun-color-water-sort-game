const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

function extractConst(name, nextName) {
  const start = html.indexOf(`const ${name} =`);
  const end = html.indexOf(`const ${nextName} =`, start);
  if (start < 0 || end < 0) throw new Error(`Cannot find ${name}`);
  const source = html.slice(start, end).replace(`const ${name} =`, "return ").trim().replace(/;\s*$/, "");
  return Function(source)();
}

function normalizeBottle(input) {
  if (Array.isArray(input)) {
    return { colors: [...input], capacity: 4, receiveOnly: false, pourOnly: false };
  }
  return {
    colors: [...(input.colors || [])],
    capacity: input.capacity || 4,
    receiveOnly: Boolean(input.receiveOnly),
    pourOnly: Boolean(input.pourOnly)
  };
}

function validateLevel(level, mode, index) {
  const bottles = level.bottles.map(normalizeBottle);
  const counts = new Map();
  const capacities = new Set(bottles.map((bottle) => bottle.capacity));
  const errors = [];

  bottles.forEach((bottle, bottleIndex) => {
    if (bottle.colors.length > bottle.capacity) {
      errors.push(`瓶子 ${bottleIndex + 1} 超出容量 ${bottle.colors.length}/${bottle.capacity}`);
    }
    bottle.colors.forEach((color) => counts.set(color, (counts.get(color) || 0) + 1));
  });

  counts.forEach((count, color) => {
    if (!capacities.has(count)) errors.push(`${color} 数量 ${count} 没有匹配容量`);
  });

  const emptySpace = bottles.reduce((sum, bottle) => sum + bottle.capacity - bottle.colors.length, 0);
  if (emptySpace <= 0) errors.push("没有空位，通常无法开始整理");

  if (errors.length) {
    console.log(`✗ ${mode} ${index + 1} ${level.title}`);
    errors.forEach((error) => console.log(`  - ${error}`));
    return false;
  }

  console.log(`✓ ${mode} ${index + 1} ${level.title}`);
  return true;
}

const easy = extractConst("LEVELS", "HARD_LEVELS");
const hard = extractConst("HARD_LEVELS", "MODES");
const results = [
  ...easy.map((level, index) => validateLevel(level, "简单", index)),
  ...hard.map((level, index) => validateLevel(level, "困难", index))
];

if (results.some((ok) => !ok)) {
  process.exitCode = 1;
}
