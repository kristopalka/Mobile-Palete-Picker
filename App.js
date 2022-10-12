import {StyleSheet, View} from 'react-native';
import CameraPage from "./components/CameraPage";
import {logger} from "./javascript/logger";
import {useState} from "react";
import PhotoPage from "./components/PhotoPage";

const pages = {
    camera: "camera",
    photo: "photo",
}

export default function App() {
    const [page, goPage] = useState(pages.photo);
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
                return <PhotoPage/>;

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
