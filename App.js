import {BackHandler, StyleSheet, View} from 'react-native';
import {useState} from "react";
import CameraPage from "./components/CameraPage";
import PhotoPage from "./components/PhotoPage";
import {logger} from "./javascript/logger";

const pages = {
    camera: "camera",
    photo: "photo",
}

export default function App() {
    BackHandler.addEventListener("hardwareBackPress", backAction);


    const [page, goPage] = useState(pages.camera);
    const [photo, setPhoto] = useState(null);

    async function takePhoto(photoBase64) {
        logger("Setting image")
        setPhoto(photoBase64);
        goPage(pages.photo);
    }

    function currentView() {
        switch(page) {
            case pages.camera:
                return <CameraPage takePhoto={takePhoto}/>;
            case pages.photo:
                return <PhotoPage photo={photo}/>;

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
