import {Button, Dimensions, StyleSheet, View} from 'react-native';
import Canvas, {Image as CanvasImage} from "react-native-canvas";
import React, {useEffect, useRef, useState} from "react";
import ColorPalette from "./components/color_palette/ColorPalette";
import {getKMeans} from "../javascript/palette/kMens";
import {rgbToHex} from "../javascript/colors";
import ImagePointers from "./components/ImagePointers";


export default function PhotoPage(props) {
    const imageUrl = `data:image/jpg;base64,${props.photo}`
    const imageWidth = Dimensions.get('window').width * 0.9;
    const imageHeight = imageWidth * 4 / 3;

    const ratio = 1 / 2;
    const canvasWidth = Math.round(imageWidth * ratio);
    const canvasHeight = Math.round(imageHeight * ratio);

    const weirdMultiplier = 2.75; // https://github.com/iddan/react-native-canvas/issues/301

    console.log("Image size:", imageWidth, imageHeight)
    console.log("Canvas size:", canvasWidth, canvasHeight)

    const [palette, setPalette] = useState([]);
    const [points, setPoints] = useState([]);


    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas === null) return;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        let context = canvas.getContext('2d');
        const image = new CanvasImage(canvas);
        image.src = imageUrl;


        image.addEventListener("load", async () => {
            context.drawImage(image, 0, 0, canvas.width/weirdMultiplier, canvas.height/weirdMultiplier);
            context.getImageData(0, 0, canvas.width, canvas.height)
                .then((imageData) => {
                    // context.putImageData(imageData, 10, 10);
                    initialPaletteCalculation(imageData.data);
                })
                .catch((err) => {
                    console.log("Error while calculation:", err);
                })
        });
    }, []);


    function initialPaletteCalculation(data) {
        const dataset = []
        for (let i = 0; i < canvasWidth  * canvasHeight * 4; i += 4) {
            dataset.push([data[i], data[i + 1], data[i + 2]])
        }
        const kMeans = getKMeans(dataset, 5)

        const newPoints = []
        const newPalette = []
        for (let i = 0; i < kMeans.length; i++) {
            let index = closestElementIndex(kMeans[i], dataset);
            newPoints.push(indexToImagePoints(index))
            newPalette.push(rgbToHex(kMeans[i]))
        }

        console.log("Calculated palette:", newPalette)
        console.log("Palette points:", newPoints)

        setPoints(newPoints)
        setPalette(newPalette)
    }


    function closestElementIndex(color, dataset) {
        const diff = (color1, color2) => {
            return Math.pow(color1[0] - color2[0], 2) +
                Math.pow(color1[1] - color2[1], 2) +
                Math.pow(color1[2] - color2[2], 2);
        }

        let bestIndex = 0;
        let bestDiff = Number.MAX_VALUE;
        for (let i = 0; i < dataset.length; i++) {
            let currentDiff = diff(color, dataset[i]);
            if (currentDiff < bestDiff) {
                bestDiff = currentDiff;
                bestIndex = i;
            }
        }
        return bestIndex;
    }

    function indexToImagePoints(index) {
        return {
            x: (index % canvasWidth) / ratio,
            y: ((index - (index % canvasWidth)) / canvasWidth) / ratio
        }
    }


    async function getColor(point) {
        const x = Math.round(point.x * ratio);
        const y = Math.round(point.y * ratio);

        console.log("Get color from point:", x, y)

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        return await context.getImageData(Math.round(x ), Math.round(y ), 1, 1)
            .then((imageData) => {
                return [imageData.data[0], imageData.data[1], imageData.data[2]];
            })
            .catch((err) => {
                console.log("Error while calculation:", err);
            })
    }

    async function movePointer(index, newPoint) {
        const newColor = rgbToHex(await getColor(newPoint));
        console.log("New color:", newColor)

        let newPalette = palette.map((c, i) => {
            if (i === index) return newColor;
            else return c;
        });
        setPalette(newPalette)
    }


    return (
        <View style={styles.container}>
            {React.useMemo(() => <Canvas ref={canvasRef} style={styles.canvas}/>, [])}

            <ImagePointers width={imageWidth} height={imageHeight} imageUrl={imageUrl}
                           points={points} colors={palette} movePointer={movePointer}/>

            <ColorPalette colors={palette} value={palette[0]}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
    },
    imageBox: (w, h) => ({
        width: w,
        height: h,
        backgroundColor: "black",
    }),
    image: {
        width: "100%",
        height: "100%",
    },
    canvas: {
        opacity: 0,
        position: "absolute",
    },
});
