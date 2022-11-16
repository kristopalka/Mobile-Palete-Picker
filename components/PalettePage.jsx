import {StyleSheet, View} from 'react-native';
import React, {useState} from "react";
import ColorPalette from "./other/color_palette/ColorPalette";
import {rgbToHex} from "../javascript/colors";
import ImagePointers from "./other/ImagePointers";
import Button from "./other/Button";
import {generateCodeExport, generateCssExport, generateSimpleExport} from "../javascript/exporting";


export default function PalettePage(props) {
    const [palette, setPalette] = useState(props.palette);
    const [points, setPoints] = useState(props.points);


    async function movePointer(index, newPoint) {
        const newColor = rgbToHex(await props.getColor(newPoint));
        console.log("New color:", newColor)

        let newPoints = points.map((c, i) => {
            if (i === index) return newPoint;
            else return c;
        });
        setPoints(newPoints);

        let newPalette = palette.map((c, i) => {
            if (i === index) return newColor;
            else return c;
        });
        setPalette(newPalette)
    }

    return (
        <View style={styles.container}>

            <ImagePointers
                width={props.imageWidth} height={props.imageHeight}
                imageUrl={props.image}
                points={props.points}
                colors={palette}
                movePointer={movePointer}
            />

            <View style={{margin: 15}}/>
            <ColorPalette colors={palette} value={palette[0]}/>

            <View style={{margin: 15}}/>
            <View>
                <View style={styles.buttonRow}>
                    <Button title={"Code"}
                            style={styles.button}
                            onPress={() => {
                                props.exportText(palette, points, generateCodeExport)
                            }}
                    />
                    <Button title={"CSS"}
                            style={styles.button}
                            onPress={() => {
                                props.exportText(palette, points, generateCssExport)
                            }}
                    />
                </View>
                <View style={styles.buttonRow}>
                    <Button title={"Image"}
                            style={styles.button}
                            onPress={() => {
                                props.exportImage(palette, points)
                            }}
                    />
                    <Button title={"Simple"}
                            style={styles.button}
                            onPress={() => {
                                props.exportText(palette, points, generateSimpleExport)
                            }}
                    />
                </View>
            </View>
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
