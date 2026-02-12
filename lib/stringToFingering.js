//@ts-check

// ASCII format characters
const ASCII_VERTICAL = "|";
const ASCII_DASH = "-";
const ASCII_EQUALS = "=";
const ASCII_OPEN = "o";
const ASCII_MUTED = "x";
const ASCII_ROOT = "*";
const ASCII_GREY = "O";
const ASCII_BLUE = "+";

// Unicode format characters
const UNICODE_VERTICAL = "│";
const UNICODE_OPEN = "○";
const UNICODE_MUTED = "×";
const UNICODE_ROOT = "●";
const UNICODE_GREY = "□";
const UNICODE_BLUE = "■";

// Unicode box drawing characters for grid detection
// Includes both double-line (╒═╤╕) and light (┌─┬┐) box-drawing sets
const UNICODE_BOX_CHARS = "╒═╤╕├─┼┤└┴┘┌┬┐";

/**
 * Detect if the string uses Unicode format
 * @param {string} str
 * @returns {boolean}
 */
function isUnicodeFormat(str) {
  return (
    str.includes(UNICODE_VERTICAL) ||
    str.includes(UNICODE_OPEN) ||
    str.includes(UNICODE_ROOT) ||
    str.includes(UNICODE_MUTED) ||
    str.includes(UNICODE_GREY) ||
    str.includes(UNICODE_BLUE) ||
    [...UNICODE_BOX_CHARS].some(c => str.includes(c))
  );
}

/**
 * Find grid boundaries for Unicode format
 * Unicode grids use box-drawing characters with consistent spacing.
 * The grid line looks like: ╒═╤═╤═╤═╤═╕ or │ │ │ │ │ │
 * Separators are at even positions, cells (where notes go) are at odd positions.
 * @param {string[]} lines
 * @param {number} firstGridRowIdx
 * @returns {{ startCol: number, endCol: number, numStrings: number }}
 */
function findUnicodeGridBoundaries(lines, firstGridRowIdx) {
  const firstLine = lines[firstGridRowIdx];
  let minPos = Infinity;
  let maxPos = -1;

  // Analyze only the first grid line to find boundaries
  for (let j = 0; j < firstLine.length; j++) {
    const char = firstLine[j];
    if (char === UNICODE_VERTICAL || "╒╤╕├┼┤└┴┘═─┌┬┐".includes(char)) {
      if (j < minPos) minPos = j;
      if (j > maxPos) maxPos = j;
    }
  }

  if (minPos === Infinity || maxPos === -1) {
    return { startCol: 0, endCol: 0, numStrings: 0 };
  }

  // In Unicode format, grid cells are spaced every 2 characters
  // For a grid spanning positions 2-12 (width 11), we have 6 positions: 2,4,6,8,10,12
  // Which maps to 6 strings
  const numStrings = Math.floor((maxPos - minPos) / 2) + 1;
  return { startCol: minPos, endCol: maxPos, numStrings };
}

/**
 * Map a character position to a string number for Unicode format (1-6, right to left)
 * @param {number} charPos - Character position in the line
 * @param {number} startCol - Start column of the grid
 * @param {number} numStrings - Number of strings
 * @returns {number} String number (1-6) or -1 if out of bounds
 */
function unicodeCharPosToStringNum(charPos, startCol, numStrings) {
  // In Unicode format, positions are at startCol, startCol+2, startCol+4, etc.
  const offset = charPos - startCol;
  if (offset < 0 || offset % 2 !== 0) return -1;
  const idx = offset / 2;
  if (idx >= numStrings) return -1;
  // String 6 is at idx 0, string 1 is at idx (numStrings - 1)
  return numStrings - idx;
}

/**
 * Find grid boundaries for ASCII format
 * In the new format, the grid looks like: ------
 * And fret rows look like: ||||||  or  |||o||
 * The first dash/equals line or pipe sequence determines the grid extent.
 * @param {string[]} lines
 * @param {number} firstGridRowIdx
 * @returns {{ startCol: number, endCol: number, numStrings: number }}
 */
function findAsciiGridBoundaries(lines, firstGridRowIdx) {
  const firstLine = lines[firstGridRowIdx];
  let minPos = Infinity;
  let maxPos = -1;

  // Analyze only the first grid line to find boundaries
  let inSequence = false;
  let seqStart = -1;
  
  for (let j = 0; j < firstLine.length; j++) {
    const char = firstLine[j];
    const isGridChar = char === ASCII_VERTICAL || char === ASCII_DASH || char === ASCII_EQUALS;
    
    if (isGridChar && !inSequence) {
      // Start of sequence
      inSequence = true;
      seqStart = j;
    } else if (!isGridChar && inSequence) {
      // End of sequence
      inSequence = false;
      const seqEnd = j - 1;
      if (seqStart < minPos) minPos = seqStart;
      if (seqEnd > maxPos) maxPos = seqEnd;
    }
  }
  
  // Handle sequence that extends to end of line
  if (inSequence) {
    const seqEnd = firstLine.length - 1;
    if (seqStart < minPos) minPos = seqStart;
    if (seqEnd > maxPos) maxPos = seqEnd;
  }

  if (minPos === Infinity || maxPos === -1) {
    return { startCol: 0, endCol: 0, numStrings: 0 };
  }

  // Number of strings is the span from minPos to maxPos inclusive
  const numStrings = maxPos - minPos + 1;
  return { startCol: minPos, endCol: maxPos, numStrings };
}

/**
 * Map a character position to a string number for ASCII format (1-6, right to left)
 * @param {number} charPos - Character position in the line
 * @param {number} startCol - Start column of the grid
 * @param {number} numStrings - Number of strings (typically 6)
 * @returns {number} String number (1-6) or -1 if out of bounds
 */
function asciiCharPosToStringNumber(charPos, startCol, numStrings) {
  const offset = charPos - startCol;
  if (offset < 0 || offset >= numStrings) return -1;
  // String 6 is at offset 0, string 1 is at offset (numStrings - 1)
  return numStrings - offset;
}

/**
 * Check if a line is a grid row (contains structural characters like pipes, dashes, box drawing)
 * In new ASCII format: ------ or ====== for separator, |||||| for content
 * @param {string} line
 * @param {boolean} isUnicode
 * @returns {boolean}
 */
function isGridRow(line, isUnicode) {
  if (isUnicode) {
    // For Unicode, look for box drawing characters or vertical bars
    let count = 0;
    for (const char of line) {
      if (char === UNICODE_VERTICAL || "╒╤╕├┼┤└┴┘┌┬┐".includes(char)) count++;
    }
    return count >= 2;
  } else {
    // For ASCII, check for:
    // 1. Separator lines: 4+ consecutive dashes or equals
    // 2. Content lines: multiple pipes (even if interrupted by notes/digits)
    const hasDashes = /-{4,}/.test(line);
    const hasEquals = /={4,}/.test(line);
    if (hasDashes || hasEquals) return true;
    
    // Count pipes for content rows (allow notes/digits between pipes)
    const pipeCount = (line.match(/\|/g) || []).length;
    return pipeCount >= 4;
  }
}



/**
 * Parse a string representation of a guitar fingering into internal format
 * @param {string} fingeringStr - The string representation of the fingering
 * @param {{ redColor?: string, blackColor?: string, greyColor?: string, blueColor?: string }} [options]
 * @returns {import("svguitar").Chord | null} The parsed fingering object
 */
export default function stringToFingering(fingeringStr, options = {}) {
  const {
    redColor = "#e74c3c",
    blackColor = "#000000",
    greyColor = "#9B9B9B",
    blueColor = "#4A90E2",
  } = options;

  if (!fingeringStr || fingeringStr.trim() === "") {
    return null;
  }

  const lines = fingeringStr.split("\n");
  const isUnicode = isUnicodeFormat(fingeringStr);

  const openChar = isUnicode ? UNICODE_OPEN : ASCII_OPEN;
  const mutedChar = isUnicode ? UNICODE_MUTED : ASCII_MUTED;
  const rootChar = isUnicode ? UNICODE_ROOT : ASCII_ROOT;
  const greyChar = isUnicode ? UNICODE_GREY : ASCII_GREY;
  const blueChar = isUnicode ? UNICODE_BLUE : ASCII_BLUE;

  /** @type {import("svguitar").Finger[]} */
  const fingers = [];
  /** @type {string | undefined} */
  let title;
  /** @type {number | undefined} */
  let position;

  // Find the first grid row
  let firstGridRowIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (isGridRow(lines[i], isUnicode)) {
      firstGridRowIdx = i;
      break;
    }
  }

  if (firstGridRowIdx === -1) {
    // No valid grid found
    return null;
  }

  // Get column mapping based on format
  let startCol = 0;
  let numStrings = 6;

  if (isUnicode) {
    const bounds = findUnicodeGridBoundaries(lines, firstGridRowIdx);
    startCol = bounds.startCol;
    numStrings = bounds.numStrings;
    if (numStrings === 0) {
      return { fingers: [], barres: [] };
    }
    // Check if first grid row uses ╒═╤ pattern (indicates position = 1)
    const firstGridLine = lines[firstGridRowIdx];
    if (firstGridLine.includes("╒") && firstGridLine.includes("═")) {
      position = 1;
    }
  } else {
    const bounds = findAsciiGridBoundaries(lines, firstGridRowIdx);
    startCol = bounds.startCol;
    numStrings = bounds.numStrings;
    if (numStrings === 0) {
      return { fingers: [], barres: [] };
    }
    // Check if first grid row uses ====== pattern (indicates position = 1)
    const firstGridLine = lines[firstGridRowIdx];
    if (/={4,}/.test(firstGridLine)) {
      position = 1;
    }
  }

  /**
   * Get string number for a character position
   * @param {number} charPos
   * @returns {number}
   */
  const getStringNumber = (charPos) => {
    if (isUnicode) {
      return unicodeCharPosToStringNum(charPos, startCol, numStrings);
    } else {
      return asciiCharPosToStringNumber(charPos, startCol, numStrings);
    }
  };

  // Parse title from lines before the grid
  // Title must be followed by a separator line (all # or all ‾)
  for (let i = 0; i < firstGridRowIdx - 1; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1];
    const trimmed = line.trim();
    
    if (trimmed === "") continue;
    
    // Check if next line is a separator line
    const asciiSeparatorPattern = /^[\s#]+$/;
    const unicodeSeparatorPattern = /^[\s‾]+$/;
    const nextTrimmed = nextLine.trim();
    
    if (asciiSeparatorPattern.test(nextTrimmed) || unicodeSeparatorPattern.test(nextTrimmed)) {
      // This line is the title
      title = trimmed;
      break;
    }
  }

  // If no title found, set to empty string
  if (title === undefined) {
    title = "";
  }

  // Parse open/muted string indicators (line just before first grid row)
  const indicatorLineIdx = firstGridRowIdx - 1;
  if (indicatorLineIdx >= 0) {
    const indicatorLine = lines[indicatorLineIdx];
    for (let i = 0; i < indicatorLine.length; i++) {
      const char = indicatorLine[i];
      const stringNum = getStringNumber(i);
      if (stringNum <= 0) continue;

      if (char === openChar || (!isUnicode && char === ASCII_OPEN)) {
        fingers.push([stringNum, 0, { text: "", color: blackColor }]);
      } else if (char === mutedChar || (!isUnicode && char === ASCII_MUTED)) {
        fingers.push([stringNum, "x", { text: "", color: blackColor }]);
      } else if (/\S/.test(char)) {
        // Skip structural characters (delimiters and box-drawing)
        const isStructural = char === ASCII_VERTICAL || char === ASCII_DASH || char === ASCII_EQUALS ||
          char === UNICODE_VERTICAL || char === "─" || char === "═" ||
          [...UNICODE_BOX_CHARS].includes(char);
        
        if (!isStructural) {
          // Any other non-whitespace character is an open string with text label
          fingers.push([stringNum, 0, { text: char, color: blackColor }]);
        }
      }
    }
  }

  // Parse fret rows
  let fretNumber = 1;
  let isFirstFretRow = true;

  for (let lineIdx = firstGridRowIdx; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    
    // Determine if this line is a fret row based on format and position
    let isFretRow = false;
    if (isUnicode) {
      // Unicode: fret rows are at odd positions (1, 3, 5...) after firstGridRowIdx
      const relativePos = lineIdx - firstGridRowIdx;
      isFretRow = relativePos % 2 === 1;
    } else {
      // ASCII: all lines after the separator are fret rows
      isFretRow = lineIdx > firstGridRowIdx;
    }
    
    // Skip if not a fret row
    if (!isFretRow) continue;

    // Check for position number at start of first fret row (1-2 digits before grid)
    if (isFirstFretRow) {
      // Position number must appear before the grid starts (before startCol)
      const beforeGrid = line.substring(0, startCol).trim();
      const posMatch = beforeGrid.match(/^(\d{1,2})$/);
      if (posMatch) {
        position = parseInt(posMatch[1], 10);
      }
      isFirstFretRow = false;
    }

    // Scan for fretted notes and finger numbers in this row
    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      const stringNum = getStringNumber(i);
      if (stringNum <= 0) continue;

      // Skip empty positions and structural characters
      if (isUnicode) {
        if (char === UNICODE_VERTICAL || "╒═╤╕├─┼┤└┴┘┌┬┐".includes(char) || char === " ") continue;
      } else {
        // In ASCII format, skip pipes and spaces, but process notes/digits
        if (char === ASCII_VERTICAL || char === " ") continue;
      }

      // Check for root marker
      if (char === rootChar) {
        fingers.push([stringNum, fretNumber, { text: "", color: redColor }]);
      }
      // Check for grey marker
      else if (char === greyChar) {
        fingers.push([stringNum, fretNumber, { text: "", color: greyColor }]);
      }
      // Check for blue marker
      else if (char === blueChar) {
        fingers.push([stringNum, fretNumber, { text: "", color: blueColor }]);
      }
      // Check for regular note (○ in Unicode, o in ASCII within grid)
      else if (char === UNICODE_OPEN || char === ASCII_OPEN) {
        fingers.push([stringNum, fretNumber, { text: "", color: blackColor }]);
      }
      // Check for finger label (digit or any other character)
      else if (/\S/.test(char)) {
        fingers.push([stringNum, fretNumber, { text: char, color: blackColor }]);
      }
    }

    fretNumber++;
  }

  /** @type {import("svguitar").Chord} */
  const result = {
    fingers,
    barres: [],
    title,
  };

  if (position !== undefined) {
    result.position = position;
  }

  return result;
}