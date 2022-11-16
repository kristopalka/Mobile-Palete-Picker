import {Clipboard, ToastAndroid} from 'react-native'
import {hexToHsla, hexToRgb, rgbToHex, rgbToHsla} from "./colors";
import {ntc} from "./color_naming";


// todo EXAMPLES: https://github.com/kristopalka/mobile-palete-picker/issues/6

export function copyToClipboard(text) {
    Clipboard.setString(text);
    ToastAndroid.show('Copied to clipboard!', ToastAndroid.SHORT)
}


export function generateSimpleExport(palette) {
    let string = "";
    for(let i=0; i<palette.length;i++) {
        string += `${palette[i]}\n`;
    }
    return string;
}

export function generateCssExport(palette) {
    const names = palette.map(color => kebabCase(ntc.name(color)[1]))
    const rgb = palette.map(color => hexToRgb(color))
    const hsla = rgb.map(color => rgbToHsla(color))
    let string = "\n";

    string += "/* CSS HEX */\n"
    for(let i=0; i<palette.length;i++) {
        string += `--${names[i]}: ${palette[i]};\n`;
    }

    string += "\n"
    string += "/* CSS HSL */\n"
    for(let i=0; i<palette.length;i++) {
        string += `--${names[i]}: ${hsla[i]};\n`;
    }

    string += "\n"
    string += "/* SCSS HEX */\n"
    for(let i=0; i<palette.length;i++) {
        string += `$${names[i]}: ${palette[i]};\n`;
    }

    string += "\n"
    string += "/* SCSS HSL */\n"
    for(let i=0; i<palette.length;i++) {
        string += `$${names[i]}: ${hsla[i]};\n`;
    }

    string += "\n"
    string += "/* SCSS RGB */\n"
    for(let i=0; i<palette.length;i++) {
        string += `$${names[i]}: rgba(${rgb[i].r}, ${rgb[i].g}, ${rgb[i].b}, 1);\n`;
    }

    return string;
}

export function generateCodeExport(palette) {
    const names = palette.map(color => kebabCase(ntc.name(color)[1]))
    const withoutHash = palette.map(color => color.substring(1, 7))
    const rgb = palette.map(color => hexToRgb(color))
    let string = "\n";

    string += "/* CSV */\n"
    for(let i=0; i<palette.length;i++) {
        string += `${withoutHash[i]}`;
        if(i !== palette.length -1) string+=", "
    }
    string += "\n\n"
    string += "/* CSV with # */\n"
    for(let i=0; i<palette.length;i++) {
        string += `${palette[i]}`;
        if(i !== palette.length -1) string+=", "
    }

    string += "\n\n"
    string += "/* Array */\n["
    for(let i=0; i<palette.length;i++) {
        string += `"${withoutHash[i]}"`;
        if(i !== palette.length -1) string+=", "
    }
    string += "]\n\n"

    string += "/* Array with # */\n["
    for(let i=0; i<palette.length;i++) {
        string += `"${palette[i]}"`;
        if(i !== palette.length -1) string+=", "
    }
    string += "]\n\n"

    string += "/* Object */\n{"
    for(let i=0; i<palette.length;i++) {
        string += `"${names[i]}": "${withoutHash[i]}"`;
        if(i !== palette.length -1) string+=", "
    }
    string += "}\n\n"

    string += "/* Object with # */\n{"
    for(let i=0; i<palette.length;i++) {
        string += `"${names[i]}": "${palette[i]}"`;
        if(i !== palette.length -1) string+=", "
    }
    string += "}\n\n"

    string += "/* XML */\n<palette>\n"
    for(let i=0; i<palette.length;i++) {
        string += `    <color name="${names[i]}" hex="${palette[i]}" r="${rgb[i].r}" g="${rgb[i].g}" b="${rgb[i].b}"`;
        if(i !== palette.length -1) string+=", "
    }
    string += "\n<palette>\n"

    return string;
}




function kebabCase(string) {
    return string
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
}
