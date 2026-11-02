//@ts-check
import {defaultColors, unicodeSymbols, asciiSymbols} from "./options.js";


/**
 * Get the marker character for a non-black color
 * @param {string} color - The color hex value
 * @param {boolean} isUnicode - Whether to use Unicode characters
 * @returns {string} The marker character
 */

/**
 * Get the marker character for a non-black color
 * @param {string} color - The color hex value
 * @param {{ primaryColor?: string, defaultColor?: string, tertiaryColor?: string, secondaryColor?: string }} colors - The color mapping object
 * @param {Array<string>} symbols - Whether to use Unicode characters
 * @returns {string} The marker character
 */
function getMarkerChar(color, colors, symbols) {
  if (color === colors.tertiaryColor) {
    return symbols[3];
  }
  if (color === colors.secondaryColor) {
    return symbols[2];
  }
  // Red or any unrecognized color falls back to root marker
  return symbols[1];
}


/**
 * Parse a string representation of a guitar fingering into internal format
 * @param {import("svguitar").Chord} chord
 * @param {{ primaryColor?: string, defaultColor?: string, tertiaryColor?: string, secondaryColor?: string, useUnicode?: boolean }} [options]
 * @returns {string}
 */
export default function fingeringToString(chord, options = {}) {
  const { useUnicode = false } = options;
  const colors = {...defaultColors, ...options};
  const { fingers = [], title = "", position } = chord;

  // Parse fingers to build data structure
  const stringData = new Map(); // Map<string, Map<fret, fingerInfo>>
  let maxFret = 0;
  const openStrings = new Map(); // Map<string, text>
  const mutedStrings = new Set();

  for (const finger of fingers) {
    const [string, fret, opts = {}] = finger;
    const optsObject = typeof opts === "object" ? opts : {};
    const { text = "", color = "#000000" } = optsObject;

    if (fret === 0) {
      openStrings.set(string, text);
    } else if (fret === "x") {
      mutedStrings.add(string);
    } else {
      if (!stringData.has(string)) {
        stringData.set(string, new Map());
      }
      stringData.get(string).set(fret, { text, color });
      
      if (fret > maxFret) maxFret = fret;
    }
  }

  // Determine number of frets to show
  const numFrets = fingers.some(f => typeof f[1] === "number" && f[1] > 0)
    ? Math.max(3, maxFret)
    : 3;

  if (useUnicode) {
    return buildUnicodeOutput(
      title,
      stringData,
      openStrings,
      mutedStrings,
      numFrets,
      position,
      colors
    );
  } else {
    return buildAsciiOutput(
      title,
      stringData,
      openStrings,
      mutedStrings,
      numFrets,
      position,
      colors
    );
  }
}

/**
 * Build ASCII format output
 * @param {string} title
 * @param {Map<number, Map<number, {text: string, color: string}>>} stringData
 * @param {Map<number, string>} openStrings
 * @param {Set<number>} mutedStrings
 * @param {number} numFrets
 * @param {number|undefined} position
 * @param {{ primaryColor?: string, defaultColor?: string, tertiaryColor?: string, secondaryColor?: string }} colors
 * @returns {string}
 */
function buildAsciiOutput(
  title,
  stringData,
  openStrings,
  mutedStrings,
  numFrets,
  position,
  colors,
) {
  const lines = [];
  
  // Title section
  if (title && title.length > 0) {
    const clampedTitle = title.length > 15 ? title.slice(0, 15) : title;
    lines.push(`  ${clampedTitle}`);
    // Add separator line of # characters (exactly 6 chars minimum)
    lines.push(`  ${'#'.repeat(Math.max(6, clampedTitle.length))}`);
  }

  // Open/muted strings line - only if there are any
  if (openStrings.size > 0 || mutedStrings.size > 0) {
    let openLine = "  ";
    let lowestMarked = 6; // lowest numbered string (rightmost in display) that has a marker
    
    // Find lowest numbered string with a marker
    for (let str = 6; str >= 1; str--) {
      if (openStrings.has(str) || mutedStrings.has(str)) {
        lowestMarked = str;
      }
    }
    
    // Show from string 6 down to lowestMarked, extending to 3 only if lowestMarked > 4
    const showTo = lowestMarked > 4 ? 3 : lowestMarked;
    
    // Build line from string 6 down to showTo
    for (let str = 6; str >= showTo; str--) {
      if (openStrings.has(str)) {
        const text = openStrings.get(str);
        openLine += text ? text[0] : "o";
      } else if (mutedStrings.has(str)) {
        openLine += "x";
      } else {
        openLine += " ";
      }
    }
    
    lines.push(openLine.trimEnd());
  }

  // Separator line before fretboard (always included)
  lines.push(position === 1 ? "  ======" : "  ------");

  // Fret lines
  for (let fret = 1; fret <= numFrets; fret++) {
    let line = "";
    
    // Add position number on first fret line if specified
    if (fret === 1 && position !== undefined && position !== 1) {
      line = position < 10 ? ` ${position}` : `${position}`;
    } else {
      line = "  ";
    }

    // Build fret line (strings 6 to 1, left to right)
    for (let str = 6; str >= 1; str--) {
      const fingerInfo = stringData.get(str)?.get(fret);
      
      if (fingerInfo) {
        if (fingerInfo.color !== "#000000") {
          line += getMarkerChar(fingerInfo.color, colors, asciiSymbols);
        } else if (fingerInfo.text) {
          line += fingerInfo.text[0];
        } else {
          line += asciiSymbols[0]; // default open string marker
        }
      } else {
        line += "|";
      }
    }
    
    lines.push(line);
  }

  return lines.join("\n");
}

/**
 * Build Unicode format output
 * @param {string} title
 * @param {Map<number, Map<number, {text: string, color: string}>>} stringData
 * @param {Map<number, string>} openStrings
 * @param {Set<number>} mutedStrings
 * @param {number} numFrets
 * @param {number|undefined} position
 * @param {{ primaryColor?: string, defaultColor?: string, tertiaryColor?: string, secondaryColor?: string }} colors
 * @returns {string}
 */
function buildUnicodeOutput(
  title,
  stringData,
  openStrings,
  mutedStrings,
  numFrets,
  position,
  colors
) {
  const lines = [];
  
  // Title section
  if (title && title.length > 0) {
    const clampedTitle = title.length > 15 ? title.slice(0, 15) : title;
    lines.push(`  ${clampedTitle}`);
    // Add separator line of # characters (exactly 6 chars minimum)
    lines.push(`  ${'‾'.repeat(Math.max(11, clampedTitle.length))}`);
  }

  // Open/muted strings line - only if there are any
  if (openStrings.size > 0 || mutedStrings.size > 0) {
    let openLine = "  ";
    let lowestMarked = 6;
    
    // Find lowest numbered string with a marker
    for (let str = 6; str >= 1; str--) {
      if (openStrings.has(str) || mutedStrings.has(str)) {
        lowestMarked = str;
      }
    }
    
    // Show from string 6 down to lowestMarked, extending to 3 only if lowestMarked > 4
    const showTo = lowestMarked > 4 ? 3 : lowestMarked;
    
    // Build line from string 6 down to showTo with spaces between characters
    const chars = [];
    for (let str = 6; str >= showTo; str--) {
      if (openStrings.has(str)) {
        const text = openStrings.get(str);
        chars.push(text ? text[0] : "○");
      } else if (mutedStrings.has(str)) {
        chars.push("×");
      } else {
        chars.push(" ");
      }
    }
    openLine += chars.join(" ");
    
    lines.push(openLine.trimEnd());
  }

  // Top border
  lines.push(position === 1 ? "  ╒═╤═╤═╤═╤═╕" : "  ┌─┬─┬─┬─┬─┐");

  // Fret lines
  for (let fret = 1; fret <= numFrets; fret++) {
    let line = "";
    
    // Add position number on first fret line if specified
    if (fret === 1 && position !== undefined && position > 1) {
      line = position < 10 ? ` ${position}` : `${position}`;
    } else {
      line = "  ";
    }

    // Build fret line (strings 6 to 1, left to right)
    for (let str = 6; str >= 1; str--) {
      const fingerInfo = stringData.get(str)?.get(fret);
      
      if (fingerInfo) {
        if (fingerInfo.color !== "#000000") {
          line += getMarkerChar(fingerInfo.color, colors, unicodeSymbols);
        } else if (fingerInfo.text) {
          line += fingerInfo.text[0];
        } else {
          line += unicodeSymbols[0]; // default open string marker
        }
      } else {
        line += "│";
      }
      if (str > 1) line += " ";
    }
    
    lines.push(line);

    // Add separator or bottom border
    if (fret < numFrets) {
      lines.push("  ├─┼─┼─┼─┼─┤");
    } else {
      lines.push("  └─┴─┴─┴─┴─┘");
    }
  }

  return lines.join("\n");
}