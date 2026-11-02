/** @typedef {{ primaryColor?: string, defaultColor?: string, tertiaryColor?: string, secondaryColor?: string }} ColorsType */
/**
 * @type {ColorsType}
 * @readonly
 */
export const defaultColors: ColorsType;
export const ASCII_VERTICAL: "|";
export const ASCII_DASH: "-";
export const ASCII_EQUALS: "=";
export const ASCII_OPEN: "o";
export const ASCII_MUTED: "x";
export const ASCII_ROOT: "*";
export const ASCII_GREY: "O";
export const ASCII_BLUE: "+";
export const UNICODE_VERTICAL: "\u2502";
export const UNICODE_OPEN: "\u25CB";
export const UNICODE_MUTED: "\u00D7";
export const UNICODE_ROOT: "\u25CF";
export const UNICODE_GREY: "\u25A1";
export const UNICODE_BLUE: "\u25A0";
export const UNICODE_BOX_CHARS: "\u2552\u2550\u2564\u2555\u251C\u2500\u253C\u2524\u2514\u2534\u2518\u250C\u252C\u2510";
export const unicodeSymbols: string[];
export const asciiSymbols: string[];
export type ColorsType = {
    primaryColor?: string;
    defaultColor?: string;
    tertiaryColor?: string;
    secondaryColor?: string;
};
