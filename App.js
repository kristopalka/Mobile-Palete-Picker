import {BackHandler, StyleSheet, View} from 'react-native';
import {useState} from "react";
import CameraPage from "./components/CameraPage";
import PalettePage from "./components/PalettePage";

const pages = {
    camera: "camera",
    photo: "photo",
}

export default function App() {
    BackHandler.addEventListener("hardwareBackPress", backAction);


    const [page, goPage] = useState(pages.camera);
    const [photo, setPhoto] = useState(null);
    const [paletteLength, setPaletteLength] = useState(6);

    async function renderPaletteScreen(photoBase64, paletteLength) {
        console.log("Setting image")
        setPhoto(photoBase64);
        setPaletteLength(paletteLength)
        goPage(pages.photo);
    }

    function currentView() {
        switch(page) {
            case pages.camera:
                return <CameraPage renderPaletteScreen={renderPaletteScreen} paletteLength={paletteLength}/>;
            case pages.photo:
                return <PalettePage photo={photo} paletteLength={paletteLength}/>;

        }
    }

    function backAction() {
        switch(page) {
            case pages.camera:
                return false;
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
