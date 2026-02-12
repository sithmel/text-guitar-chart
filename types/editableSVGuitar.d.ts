export namespace DOT_COLORS {
    let RED: string;
    let BLACK: string;
    let GREY: string;
    let BLUE: string;
}
/**
 * EditableSVGuitarChord - Wrapper around SVGuitarChord that adds interactive editing capabilities
 *
 * Features:
 * - Click on fretboard to add dots
 * - Click existing dots to edit/remove them
 * - Dialog for editing dot text and color
 * - Fret count selector
 * - Maintains same interface as SVGuitarChord
 */
export class EditableSVGuitarChord {
    /**
     * @param {HTMLElement} container
     * @param {any} SVGuitarChordClass
     */
    constructor(container: HTMLElement, SVGuitarChordClass?: any);
    container: HTMLElement;
    SVGuitarChordClass: any;
    /** @type {import("svguitar").Chord} */
    chordConfig: import("svguitar").Chord;
    /** @type {any} */
    config: any;
    svgChord: any;
    isDialogOpen: boolean;
    controlsCreated: boolean;
    currentEditElement: Element;
    /** @type {Function|null} */
    changeCallback: Function | null;
    /**
     * Create controls and containers
     */
    createControls(): void;
    wrapper: HTMLDivElement;
    settingsButton: HTMLButtonElement;
    svgContainer: HTMLDivElement;
    /**
     * Create the settings dialog for title and position
     */
    createSettingsDialog(): void;
    settingsDialog: HTMLDivElement;
    titleInput: HTMLInputElement;
    positionInput: HTMLInputElement;
    settingsBackdrop: HTMLDivElement;
    /**
     * Create the edit dialog
     */
    createDialog(): void;
    dialog: HTMLDivElement;
    redRadio: HTMLInputElement;
    blackRadio: HTMLInputElement;
    greyRadio: HTMLInputElement;
    blueRadio: HTMLInputElement;
    textSection: HTMLDivElement;
    textInput: HTMLInputElement;
    backdrop: HTMLDivElement;
    /**
     * Create the open string edit dialog
     */
    createOpenStringDialog(): void;
    openStringDialog: HTMLDivElement;
    openRadio: HTMLInputElement;
    mutedRadio: HTMLInputElement;
    openStringTextSection: HTMLDivElement;
    openStringTextInput: HTMLInputElement;
    openStringBackdrop: HTMLDivElement;
    /**
     * Set chord configuration
     * @param {import("svguitar").Chord} config
     * @returns {EditableSVGuitarChord}
     */
    chord(config: import("svguitar").Chord): EditableSVGuitarChord;
    /**
     * Configure SVGuitar options
     * @param {any} config
     * @returns {EditableSVGuitarChord}
     */
    configure(config: any): EditableSVGuitarChord;
    /**
     * Calculate dynamic fret count based on chord content
     * @returns {number} - Number of frets needed (minimum 3, max dot position + 1)
     */
    calculateDynamicFrets(): number;
    /**
     * Draw the chord with interactive capabilities
     * @param {number | undefined} [frets] - Force redraw even if already drawn
     * @returns {EditableSVGuitarChord}
     */
    draw(frets?: number | undefined): EditableSVGuitarChord;
    /**
     * Redraw the chord
     * @param {number | undefined} [frets] - Force redraw even if already drawn
     */
    redraw(frets?: number | undefined): void;
    /**
     * Add transparent placeholder dots for empty positions
     * @param {import("svguitar").Chord} config
     * @returns {import("svguitar").Chord}
     */
    addPlaceholderDots(config: import("svguitar").Chord): import("svguitar").Chord;
    /**
     * Add event listeners to SVG elements
     */
    addEventListeners(): void;
    /**
     * Handle click on a dot (finger circle)
     * @param {Element} circleElement
     */
    handleDotClick(circleElement: Element): void;
    /**
     * Handle click on an open string element
     * @param {Element} openStringElement
     */
    handleOpenStringClick(openStringElement: Element): void;
    /**
     * Add a new dot at the specified position
     * @param {number} string
     * @param {number} fret
     */
    addDot(string: number, fret: number): void;
    /**
     * Edit an existing dot
     * @param {number} string
     * @param {number} fret
     */
    editDot(string: number, fret: number): void;
    currentEditFinger: import("svguitar").Finger;
    currentEditString: number;
    currentEditFret: number;
    /**
     * Edit an existing open string
     * @param {number} string
     * @param {Element} openStringElement
     */
    editOpenString(string: number, openStringElement: Element): void;
    /**
     * Open the edit dialog
     */
    openDialog(): void;
    /**
     * Open the open string edit dialog
     */
    openOpenStringDialog(): void;
    /**
     * Calculate absolute position for a dialog relative to a reference element
     * @param {HTMLElement} dialog - The dialog element to position
     * @param {Element} referenceElement - The element to position relative to
     * @param {object} options - Positioning options
     * @param {'beside'|'below'} [options.placement] - Whether to place beside or below the reference
     * @param {number} [options.offset] - Distance from reference element
     * @returns {{x: number, y: number, arrowSide: string, elementCenterY: number}}
     */
    calculateDialogPosition(dialog: HTMLElement, referenceElement: Element, options?: {
        placement?: "beside" | "below";
        offset?: number;
    }): {
        x: number;
        y: number;
        arrowSide: string;
        elementCenterY: number;
    };
    /**
     * Position dialog relative to the clicked element
     */
    positionDialog(): void;
    /**
     * Position the open string dialog
     */
    positionOpenStringDialog(): void;
    /**
     * Add CSS arrow using ::after pseudo-element
     * @param {string} side - 'left' or 'right' indicating arrow direction
     * @param {number} dotY - Y position of the clicked dot
     * @param {number} dialogY - Y position of the dialog
     * @param {number} dialogHeight - Height of the dialog
     */
    addArrowCSS(side: string, dotY: number, dialogY: number, dialogHeight: number): void;
    /**
     * Add CSS arrow for open string dialog using ::after pseudo-element
     * @param {string} side - 'left' or 'right' indicating arrow direction
     * @param {number} openStringY - Y position of the clicked open string
     * @param {number} dialogY - Y position of the dialog
     * @param {number} dialogHeight - Height of the dialog
     */
    addOpenStringArrowCSS(side: string, openStringY: number, dialogY: number, dialogHeight: number): void;
    /**
     * Ensure arrow CSS rules are added to the document
     */
    addCustomCSS(): void;
    /**
     * Close the edit dialog
     */
    closeDialog(): void;
    /**
     * Close the open string edit dialog
     */
    closeOpenStringDialog(): void;
    /**
     * Update text section visibility based on color selection
     */
    updateTextSectionVisibility(): void;
    /**
     * Update text section visibility for open string dialog based on type selection
     */
    updateOpenStringTextSectionVisibility(): void;
    /**
     * Update dot text in real-time
     */
    updateDotText(): void;
    /**
     * Update open string text in real-time
     */
    updateOpenStringText(): void;
    /**
     * Update open string type (open vs muted) in real-time
     */
    updateOpenStringType(): void;
    /**
     * Update dot color in real-time
     */
    updateDotColor(): void;
    /**
     * Save changes to the current dot
     */
    saveDot(): void;
    /**
     * Remove the current dot
     */
    removeDot(): void;
    /**
     * Remove the current open string being edited
     */
    removeOpenString(): void;
    /**
     * Open the settings dialog
     */
    openSettingsDialog(): void;
    /**
     * Position settings dialog near the settings button
     */
    positionSettingsDialog(): void;
    /**
     * Close the settings dialog
     */
    closeSettingsDialog(): void;
    /**
     * Save settings from the dialog
     */
    saveSettings(): void;
    /**
     * Get current chord configuration
     * @returns {import("svguitar").Chord}
     */
    getChord(): import("svguitar").Chord;
    /**
     * Get string representation of the chord
     * @param {object} [options]
     * @param {boolean} [options.useUnicode=false] - Whether to use Unicode characters for string/fret markers
     * @returns {string}
     */
    toString(options?: {
        useUnicode?: boolean;
    }): string;
    /**
     * Register a callback for when the chord changes
     * @param {(this: EditableSVGuitarChord) => void} callback - Called with updated fingers array
     * @returns {EditableSVGuitarChord}
     */
    onChange(callback: (this: EditableSVGuitarChord) => void): EditableSVGuitarChord;
    /**
     * Trigger the change callback if registered
     */
    triggerChange(): void;
    /**
     * Clean up resources
     */
    destroy(): void;
}
