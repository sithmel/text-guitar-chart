/** @typedef {{ primaryColor?: string, defaultColor?: string, tertiaryColor?: string, secondaryColor?: string }} ColorsType */

/**
 * @type {ColorsType}
 * @readonly
 */
export const defaultColors = {
  defaultColor: "#000000",
  primaryColor: "#e74c3c",
  secondaryColor: "#4A90E2",
  tertiaryColor: "#9B9B9B",
};

// ASCII format characters
export const ASCII_VERTICAL = "|";
export const ASCII_DASH = "-";
export const ASCII_EQUALS = "=";
export const ASCII_OPEN = "o";
export const ASCII_MUTED = "x";
export const ASCII_ROOT = "*";
export const ASCII_GREY = "O";
export const ASCII_BLUE = "+";

// Unicode format characters
export const UNICODE_VERTICAL = "│";
export const UNICODE_OPEN = "○";
export const UNICODE_MUTED = "×";
export const UNICODE_ROOT = "●";
export const UNICODE_GREY = "□";
export const UNICODE_BLUE = "■";

// Unicode box drawing characters for grid detection
// Includes both double-line (╒═╤╕) and light (┌─┬┐) box-drawing sets
export const UNICODE_BOX_CHARS = "╒═╤╕├─┼┤└┴┘┌┬┐";

export const unicodeSymbols = [UNICODE_OPEN, UNICODE_ROOT, UNICODE_BLUE, UNICODE_GREY];
export const asciiSymbols = [ASCII_OPEN, ASCII_ROOT, ASCII_BLUE, ASCII_GREY];
