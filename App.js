import {BackHandler, StyleSheet, View} from 'react-native';
import {useState} from "react";
import CameraPage from "./components/CameraPage";
import PalettePage from "./components/PalettePage";
import {generateSimpleExport} from "./javascript/exporting";
import ExportPage from "./components/ExportPage";

const pages = {
    camera: "camera",
    palette: "photo",
    exportSimple: "export-simple",
}

export default function App() {
    BackHandler.addEventListener("hardwareBackPress", backAction);


    const [page, goPage] = useState(pages.camera);
    const [photo, setPhoto] = useState(null);
    const [paletteLength, setPaletteLength] = useState(6);

    const [exportText, setExportText] = useState("");

    async function renderPaletteScreen(photoBase64, paletteLength) {
        console.log("Setting image")
        setPhoto(photoBase64);
        setPaletteLength(paletteLength)
        goPage(pages.palette);
    }

    async function exportSimple(palette) {
        setExportText(generateSimpleExport(palette))
        goPage(pages.exportSimple)
    }

    function currentView() {
        switch(page) {
            case pages.camera:
                return <CameraPage renderPaletteScreen={renderPaletteScreen} paletteLength={paletteLength}/>;
            case pages.palette:
                return <PalettePage photo={photo} paletteLength={paletteLength}
                exportSimple={exportSimple}/>;
            case pages.exportSimple:
                return <ExportPage text={exportText} />;

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
});
