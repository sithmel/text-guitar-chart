/**
 * Parse a string representation of a guitar fingering into internal format
 * @param {import("svguitar").Chord} chord
 * @param {{ primaryColor?: string, defaultColor?: string, tertiaryColor?: string, secondaryColor?: string, useUnicode?: boolean }} [options]
 * @returns {string}
 */
export default function fingeringToString(chord: import("svguitar").Chord, options?: {
    primaryColor?: string;
    defaultColor?: string;
    tertiaryColor?: string;
    secondaryColor?: string;
    useUnicode?: boolean;
}): string;
