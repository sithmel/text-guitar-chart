/**
 * Parse a string representation of a guitar fingering into internal format
 * @param {string} fingeringStr - The string representation of the fingering
 * @param {{ primaryColor?: string, defaultColor?: string, tertiaryColor?: string, secondaryColor?: string }} [options]
 * @returns {import("svguitar").Chord | null} The parsed fingering object
 */
export default function stringToFingering(fingeringStr: string, options?: {
    primaryColor?: string;
    defaultColor?: string;
    tertiaryColor?: string;
    secondaryColor?: string;
}): import("svguitar").Chord | null;
