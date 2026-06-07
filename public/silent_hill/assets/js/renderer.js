const FONT_IMAGE = "../../assets/js/font000.png";
const TABLE_FILE = "../../assets/js/sh2_table.txt";

const COLS = 100;
const CELL_W = 44;
const CELL_H = 64;

const bitmapText = document.getElementById("bitmapText");
const output = bitmapText;

const fontAtlas = new Image();
let unicodeToCharId = new Map();
const glyphWidthCache = new Map();

function getTemplateText(template) {
  return template.content.textContent.trim();
}

function getActiveTemplateText() {
  const activePages = Array.from(
    document.querySelectorAll("template.memo-page.active")
  );

  if (activePages.length > 0) {
    return activePages
      .map(getTemplateText)
      .filter(Boolean)
      .join("\n\n");
  }

  const firstPage = document.querySelector("template.memo-page");

  if (firstPage) {
    return getTemplateText(firstPage);
  }

  return "";
}

function getGlyphAdvance(charId) {
  if (glyphWidthCache.has(charId)) {
    return glyphWidthCache.get(charId);
  }

  const col = charId % COLS;
  const row = Math.floor(charId / COLS);

  const sx = col * CELL_W;
  const sy = row * CELL_H;

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = CELL_W;
  tempCanvas.height = CELL_H;

  const tempCtx = tempCanvas.getContext("2d");

  tempCtx.drawImage(
    fontAtlas,
    sx,
    sy,
    CELL_W,
    CELL_H,
    0,
    0,
    CELL_W,
    CELL_H
  );

  const imageData = tempCtx.getImageData(0, 0, CELL_W, CELL_H).data;

  let minX = CELL_W;
  let maxX = -1;

  for (let y = 0; y < CELL_H; y++) {
    for (let x = 0; x < CELL_W; x++) {
      const i = (y * CELL_W + x) * 4;

      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      const a = imageData[i + 3];

      if (a > 0 && (r > 8 || g > 8 || b > 8)) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
      }
    }
  }

  let advance;

  if (maxX === -1) {
    advance = CELL_W / 2;
  } else if (charId >= 0x00E0) {
    // Japanese/full-width table area: keep fixed width.
    advance = CELL_W;
  } else {
    // Latin/symbols: use actual visible width + padding.
    advance = Math.max(8, maxX - minX + 1 + 6);
  }

  glyphWidthCache.set(charId, advance);
  return advance;
}

function parseTable(text) {
  const map = new Map();
  const lines = text.split(/\r?\n/);

  for (const lineRaw of lines) {
    const line = lineRaw.trim();

    if (!line || !line.includes("=")) {
      continue;
    }

    const [codeHexRaw, valueRaw] = line.split("=", 2);

    const codeHex = codeHexRaw.trim();
    const value = valueRaw.trim();

    // Skip control codes like <NEWLINE>, <WAIT>, <STRING-END>
    if (value.startsWith("<") && value.endsWith(">")) {
      continue;
    }

    if (!value) {
      continue;
    }

    // Only normal 2-byte codes like B101=あ or 0409=水
    if (!/^[0-9A-Fa-f]{4}$/.test(codeHex)) {
      continue;
    }

    // SH2 table is little-endian:
    // B101 means bytes B1 01 => charId 0x01B1.
    const lo = parseInt(codeHex.slice(0, 2), 16);
    const hi = parseInt(codeHex.slice(2, 4), 16);
    const charId = (hi << 8) | lo;

    map.set(value, charId);
  }

  return map;
}

function appendGlyphToLine(ch, lineElement) {
  if (ch === " ") {
    const space = document.createElement("span");
    space.className = "sh2-space";
    space.textContent = " ";
    lineElement.appendChild(space);
    return;
  }

  const charId = unicodeToCharId.get(ch);

  if (charId === undefined) {
    const fallback = document.createElement("span");
    fallback.textContent = ch;
    fallback.style.color = "red";
    lineElement.appendChild(fallback);
    return;
  }

  const col = charId % COLS;
  const row = Math.floor(charId / COLS);

  const glyph = document.createElement("span");
  glyph.className = "sh2-glyph";

  // Real selectable/copyable text
  glyph.textContent = ch;

  // Visual bitmap slice
  glyph.style.backgroundPosition =
    `calc(-${col * CELL_W}px * var(--scale)) calc(-${row * CELL_H}px * var(--scale))`;

  const advance = getGlyphAdvance(charId);
  glyph.style.width = `calc(${advance}px * var(--scale))`;

  lineElement.appendChild(glyph);
}

function renderDomText(text) {
  output.innerHTML = "";

  const content = document.createElement("div");
  content.className = "sh2-content";

  const lines = text.split(/\r?\n/);

  for (const lineText of lines) {
    const line = document.createElement("div");
    line.className = "sh2-line";

    for (const ch of Array.from(lineText)) {
      appendGlyphToLine(ch, line);
    }

    content.appendChild(line);
  }

  output.appendChild(content);
  output.scrollTop = 0;
}

function renderActiveTemplates() {
  const text = getActiveTemplateText();
  renderDomText(text);
}

async function init() {
  const tableText = await fetch(TABLE_FILE).then(response => response.text());
  unicodeToCharId = parseTable(tableText);

  fontAtlas.src = FONT_IMAGE;

  await new Promise((resolve, reject) => {
    fontAtlas.onload = resolve;
    fontAtlas.onerror = reject;
  });

  renderActiveTemplates();
}

window.renderActiveTemplates = renderActiveTemplates;

init().catch(error => {
  console.error(error);
  alert(
    "Failed to load font000.png or sh2_table.txt. Use a local server and check filenames."
  );
});