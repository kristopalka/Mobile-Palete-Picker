import {BackHandler, Dimensions, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from "react";
import CameraPage from "./components/CameraPage";
import PalettePage from "./components/PalettePage";
import {generateSimpleExport} from "./javascript/exporting";
import ExportPage from "./components/ExportPage";
import Canvas from "react-native-canvas";
import {canvasWidth, generatePalette, getColor, initCanvas} from "./javascript/palette_generators/generate";
import Loading from "./components/other/Loading";

const pages = {
    camera: "camera",
    palette: "photo",
    loading: "loading",
    exportSimple: "export-simple",
}

export default function App() {
    BackHandler.addEventListener("hardwareBackPress", backAction);
    const canvasRef = useRef(null)

    const imageWidth = Dimensions.get('window').width * 0.9;
    const imageHeight = imageWidth * 4 / 3;
    const [image, setImage] = useState(null);

    const ratio = canvasWidth / imageWidth;

    const [page, goPage] = useState(pages.camera);
    const [palette, setPalette] = useState([]);
    const [points, setPoints] = useState([]);
    const [paletteLength, setPaletteLength] = useState(6);
    const [exportText, setExportText] = useState("");


    useEffect(() => {
        initCanvas(canvasRef);
    }, []);


    async function renderPaletteScreen(imageBase64, newPaletteLength) {
        console.log("Processing palette");
        goPage(pages.loading)
        await generatePalette(canvasRef, imageBase64, newPaletteLength, ratio,
            (palette, points) => {
                setPalette(palette);
                setPoints(points);

                setPaletteLength(newPaletteLength);
                setImage(imageBase64);
                goPage(pages.palette);
            });
    }


    async function exportSimple(newPalette, newPoints) {
        setExportText(generateSimpleExport(palette))
        setPalette(newPalette)
        setPoints(newPoints)
        goPage(pages.exportSimple)
    }

    function currentView() {
        switch(page) {
            case pages.camera:
                return <CameraPage
                    renderPaletteScreen={renderPaletteScreen}
                    paletteLength={paletteLength}
                />;
            case pages.palette:
                return <PalettePage
                    palette={palette}
                    points={points}
                    getColor={async (point) => {
                        return await getColor(point, ratio, canvasRef)
                    }}
                    imageWidth={imageWidth}
                    imageHeight={imageHeight}
                    image={image}
                    exportSimple={exportSimple}
                />;
            case pages.exportSimple:
                return <ExportPage
                    text={exportText}
                    back={() => {
                        goPage(pages.palette)
                    }}
                />;
            case pages.loading:
                return <Loading/>;
        }
    }

    function backAction() {
        switch(page) {
            case pages.camera:
                return false;
            case pages.exportSimple:
                goPage(pages.palette);
                return true;
            default:
                goPage(pages.camera);
                return true;
        }
    }

    return (
        <View style={styles.container}>
            {currentView()}
            {React.useMemo(() => <Canvas ref={canvasRef} style={styles.canvas}/>, [])}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        width: "100%",
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    canvas: {
        opacity: 0,
        position: "absolute",
        left: -500,
        top: -500,
    },
});
