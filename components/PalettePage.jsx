import {Dimensions, StyleSheet, View} from 'react-native';
import Canvas, {Image as CanvasImage} from "react-native-canvas";
import React, {useEffect, useRef, useState} from "react";
import ColorPalette from "./other/color_palette/ColorPalette";
import {getKMeans} from "../javascript/palette_generators/kMens";
import {rgbToHex} from "../javascript/colors";
import ImagePointers from "./other/ImagePointers";
import Loading from "./other/Loading";
import Button from "./other/Button";


export default function PalettePage(props) {
    const imageUrl = `data:image/jpg;base64,${props.photo}`
    const imageWidth = Dimensions.get('window').width * 0.9;
    const imageHeight = imageWidth * 4 / 3;

    const ratio = 1 / 3;
    const canvasWidth = Math.round(imageWidth * ratio);
    const canvasHeight = Math.round(imageHeight * ratio);

    const weirdMultiplier = 2.75; // https://github.com/iddan/react-native-canvas/issues/301

    const [palette, setPalette] = useState([]);
    const [points, setPoints] = useState([]);
    const [loading, setLoading] = useState(true)

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
            context.drawImage(image, 0, 0, canvas.width / weirdMultiplier, canvas.height / weirdMultiplier);
            context.getImageData(0, 0, canvas.width, canvas.height)
                .then((object) => {
                    initialPaletteCalculation(object.data);
                })
                .catch((err) => {
                    console.log("Error while getting image data:", err);
                })
        });
    }, []);


    function initialPaletteCalculation(imageData) {
        const data = []
        for (let i = 0; i < canvasWidth * canvasHeight * 4; i += 4) {
            data.push([imageData[i], imageData[i + 1], imageData[i + 2]])
        }
        const kMeans = getKMeans(data, props.paletteLength)

        const newPoints = []
        const newPalette = []
        for (let i = 0; i < kMeans.length; i++) {
            let index = closestElementIndex(kMeans[i], data);
            newPoints.push(indexToImagePoints(index))
            newPalette.push(rgbToHex(kMeans[i]))
        }

        console.log("Calculated palette_generators:", newPalette)
        console.log("Palette points:", newPoints)

        setPoints(newPoints)
        setPalette(newPalette)
        setLoading(false)
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

    function indexToImagePoints(index) {
        return {
            x: (index % canvasWidth) / ratio,
            y: ((index - (index % canvasWidth)) / canvasWidth) / ratio
        }
    }


    async function getColor(point) {
        const x = Math.round(point.x * ratio);
        const y = Math.round(point.y * ratio);

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        return await context.getImageData(Math.round(x), Math.round(y), 1, 1)
            .then((imageData) => {
                return [imageData.data[0], imageData.data[1], imageData.data[2]];
            })
            .catch((err) => {
                console.log("Error while getting image data:", err);
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

            {loading ? <Loading/> :
                <View>
                    <ImagePointers
                        width={imageWidth} height={imageHeight} imageUrl={imageUrl}
                        points={points} colors={palette} movePointer={movePointer}
                    />

                    <View style={{margin: 15}}/>
                    <ColorPalette colors={palette} value={palette[0]}/>

                    <View style={{margin: 15}}/>
                    <View>
                        <View style={styles.buttonRow}>
                            <Button title={"Code"} onPress={() => {
                            }} style={styles.button}/>
                            <Button title={"CSS"} onPress={() => {
                            }} style={styles.button}/>
                        </View>
                        <View style={styles.buttonRow}>
                            <Button title={"Image"} onPress={() => {
                            }} style={styles.button}/>
                            <Button title={"Simple"} style={styles.button}
                                    onPress={() => {
                                        props.exportSimple(palette)
                                    }}/>
                        </View>
                    </View>
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-evenly",
        backgroundColor: "white",
    },
    canvas: {
        opacity: 0,
        position: "absolute",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "center"
    },
    button: {
        height: 50,
        width: 140,
        margin: 5,
    },
});
