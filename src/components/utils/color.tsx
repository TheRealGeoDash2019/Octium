const parse = require("color-parse");

/**
 * Gets the Color for the CSS Variable from document.body
 * @param name                  CSS Property Name
 * @return                      String of Property Value
 */
export function getColorVariable(name: string) {
    const value = getComputedStyle(document.querySelector("body")).getPropertyValue(name);
    return value;
}

/**
 * Parse Color Values of the Input
 * @param input                 CSS Compatible Color excluding var()
 */
export function parseColor(input: string) {
    return parse(input);
}

/**
 * Picks the Correct Text Color based on the Background of the Element
 * @param bgColor               Hex Color of Background
 * @param lightColor            Hex Color of Light Text
 * @param darkColor             Hex Color of Dark Text
 * @returns                     Hex of lightColor | darkColor 
 */
export function getAppropriateColor(bgColor: string, lightColor: string, darkColor: string) {
    var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
    var r = parseInt(color.substring(0, 2), 16); // hexToR
    var g = parseInt(color.substring(2, 4), 16); // hexToG
    var b = parseInt(color.substring(4, 6), 16); // hexToB
    var uicolors = [r / 255, g / 255, b / 255];
    var c = uicolors.map((col) => {
      if (col <= 0.03928) {
        return col / 12.92;
      }
      return Math.pow((col + 0.055) / 1.055, 2.4);
    });
    var L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
    return (L > 0.179) ? darkColor : lightColor;
}