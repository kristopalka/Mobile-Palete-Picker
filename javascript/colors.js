function componentToHex(c) {
    let hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

export function rgbToHex(color) {
    return "#" + componentToHex(color[0]) + componentToHex(color[1]) + componentToHex(color[2]);
}

export function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}


export function getContrastColor(hexColor) {
    let c = hexToRgb(hexColor)
    if(c === null) console.log("c can not be null")

    if (c.r*0.299 + c.g*0.587 + c.b*0.114 > 150) return "#000000";
    else return "#ffffff"
}
