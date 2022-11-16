import {Clipboard, ToastAndroid} from 'react-native'
import {rgbToHex} from "./colors";


// todo EXAMPLES: https://github.com/kristopalka/mobile-palete-picker/issues/6

export function copyToClipboard(text) {
    Clipboard.setString(text);
    ToastAndroid.show('Copied to clipboard!', ToastAndroid.SHORT)
}


export function generateSimpleExport(palette) {
    let string = "";
    for(let i=0; i<palette.length;i++) {
        string += palette[i] + "\n";
    }
    return string;
}
