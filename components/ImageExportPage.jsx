import {Dimensions, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef} from "react";
import Button from "./other/Button";
import {borderRadius, borderWidth} from "../javascript/css";
import {copyToClipboard} from "../javascript/exporting";
import Canvas from "react-native-canvas";

export default function ImageExportPage(props) {
    const palette = props.palette;
    const canvasRef = useRef(null)

    const width = Dimensions.get('window').width * 0.9;
    const height = 300;
    const segmentLength = width / palette.length;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas === null) return;
        canvas.width = width;
        canvas.height = height;
        let context = canvas.getContext('2d');

        for (let i = 0; i < palette.length; i++) {
            context.fillStyle = palette[i];
            context.fillRect(i * segmentLength, 0, (i + 1) * segmentLength, height)
        }

    }, []);

    return (
        <View style={styles.container}>
            {React.useMemo(() => <Canvas ref={canvasRef} style={styles.canvas}/>, [])}
            <View style={{padding: 100}}/>
            <View style={styles.nav}>
                <View style={styles.buttonRow}>
                    <Button title={"Back"}
                            style={styles.button}
                            onPress={props.back}
                    />
                    <Button title={"Copy"}
                            style={styles.button}
                            onPress={() => {
                                copyToClipboard(text);
                            }}
                    />
                </View>
                <View style={styles.buttonRow}>
                    <Button title={"Share"}
                            style={styles.button}
                            onPress={() => console.log("sharing")}
                    />
                    <Button title={"Save"}
                            style={styles.button}
                            onPress={() => console.log("save")}
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
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: "white",
    },
    input: {
        flexWrap: "nowrap",
        paddingLeft: 15,
        borderWidth: borderWidth,
        borderColor: "black",
        borderRadius: borderRadius,
        height: "50%",
        width: "90%",
        fontSize: 15,
        marginBottom: 30,
        marginTop: 10,
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
    nav: {
        justifyContent: "flex-end"
    }
});
