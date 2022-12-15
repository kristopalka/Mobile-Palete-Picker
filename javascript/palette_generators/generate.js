import {Image as CanvasImage} from "react-native-canvas";
import {getKMeans} from "./kMens";
import {rgbToHex} from "../colors";

const weirdMultiplier = 2.75; // https://github.com/iddan/react-native-canvas/issues/301

export const canvasWidth = 150;
export const canvasHeight = canvasWidth * 4 / 3;

export function initCanvas(canvasRef) {
    const canvas = canvasRef.current;
    if (canvas === null) return;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
}


export async function generatePalette(canvasRef, imageBase64, length, ratio, onEndFunction) {
    const canvas = canvasRef.current;
    let context = canvas.getContext('2d');

    const image = new CanvasImage(canvas);
    image.src = imageBase64;

    image.addEventListener("load", async () => {
        context.drawImage(image, 0, 0, canvas.width / weirdMultiplier, canvas.height / weirdMultiplier);
        context.getImageData(0, 0, canvas.width, canvas.height)
            .then((imageData) => {
                const pixels = extractPixelsFromData(imageData);
                const kMeans = getKMeans(pixels, length)

                const points = []
                const palette = []
                for (let i = 0; i < kMeans.length; i++) {
                    let index = closestElementIndex(kMeans[i], pixels);
                    points.push(indexToImagePoints(index, ratio))
                    palette.push(rgbToHex(kMeans[i]))
                }

                console.log("Calculated palette_generators:", palette)
                console.log("Palette points:", points)

                onEndFunction(palette, points)
            })
            .catch((err) => {
                console.log("Error while processing:", err)
            });

    });
    return null;
}

function extractPixelsFromData(imageData) {
    const data = imageData.data;
    const pixels = []
    for (let i = 0; i < canvasWidth * canvasHeight * 4; i += 4) {
        pixels.push([data[i], data[i + 1], data[i + 2]])
    }
    return pixels;
}

function closestElementIndex(color, data) {
    const diff = (color1, color2) => {
        return Math.pow(color1[0] - color2[0], 2) +
            Math.pow(color1[1] - color2[1], 2) +
            Math.pow(color1[2] - color2[2], 2);
    }

    let bestIndex = 0;
    let bestDiff = Number.MAX_VALUE;
    for (let i = 2 * canvasWidth + 2; i < data.length - 2 * canvasWidth - 2; i++) {
        let currentDiff =
            diff(color, data[i - 2]) +
            2 * diff(color, data[i - 1]) +
            diff(color, data[-2 * canvasWidth + i]) + 2 * diff(color, data[-canvasWidth + i]) + 4 * diff(color, data[i]) + 2 * diff(color, data[canvasWidth + i]) + diff(color, data[2 * canvasWidth + i]) +
            2 * diff(color, data[i + 1]) +
            diff(color, data[i + 2]);
        if (currentDiff < bestDiff) {
            bestDiff = currentDiff;
            bestIndex = i;
        }
    }
    return bestIndex;
}

function indexToImagePoints(index, ratio) {
    return {
        x: (index % canvasWidth) / ratio,
        y: ((index - (index % canvasWidth)) / canvasWidth) / ratio
    }
}


export async function getColor(point, ratio, canvasRef) {
    const x = Math.round(point.x * ratio);
    const y = Math.round(point.y * ratio)

    const context = canvasRef.current.getContext('2d');
    return await context.getImageData(x,y, 1, 1)
        .then((imageData) => {
            return [imageData.data[0], imageData.data[1], imageData.data[2]];
        })
        .catch((err) => {
            console.log("Error while getting image data:", err);
        })
}
