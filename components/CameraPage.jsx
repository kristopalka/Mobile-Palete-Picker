import {Camera, CameraType} from 'expo-camera';
import {useState} from 'react';
import {StyleSheet, TouchableOpacity, useWindowDimensions, View} from 'react-native';
import Lens from "./other/Lenx";
import SegmentedControl from "./other/SegmentedControll";
import {AntDesign, Entypo, Feather} from "@expo/vector-icons";
import Alert from "./other/Alert";

export default function CameraPage(props) {
    const {width, height} = useWindowDimensions();
    const [camera, setCamera] = useState(null);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [alert, setAlert] = useState(false);


    const paletteLengths = [2, 3, 4, 5, 6, 7, 8, 9, 10]
    const [paletteLengthIndex, setPaletteLengthIndex] = useState(props.paletteLength - 2);

    if (!permission) return <View/>;
    if (!permission.granted) requestPermission().catch();

    async function takePicture() {
        console.log("Taking picture")
        const data = await camera.takePictureAsync({base64: true, quality: 0.5});
        props.renderPaletteScreen(data.base64, paletteLengths[paletteLengthIndex]);
    }


    return (
        <View style={styles.container}>
            <Camera style={styles.camera(width)}
                    ratio="4:3"
                    type={CameraType.back}
                    ref={r => setCamera(r)}>
                <View style={styles.captureBox}>
                    <Lens size={3 * width / 4}/>
                </View>
            </Camera>

            <SegmentedControl
                tabs={paletteLengths.map(element => element.toString())}
                currentIndex={paletteLengthIndex}
                onChange={setPaletteLengthIndex}
                width={300}
                paddingVertical={10}
            />

            <View style={styles.navigation}>
                <TouchableOpacity onPress={() => {setAlert(true)}}>
                    <Entypo name="help" size={40} color={"white"}/>
                </TouchableOpacity>

                <TouchableOpacity onPress={takePicture}>
                    <AntDesign name="camera" size={80} color={"white"}/>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {}}>
                    <Feather name="square" size={40} color={"white"} />
                    {/* todo opis algorytmów? */}
                </TouchableOpacity>

                <Alert
                    visible={alert}
                    setVisible={setAlert}
                    title={"Palette Picker"}
                    message={"After taking a palette app will generate colors palette. Chose how many colors in palette do you need." +
                        "\n\nMobile Palette Picker v1.0\nKrzysztof Pałka\nAndrzej Krzywda"}
                />

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        width: "100%",
        justifyContent: 'space-evenly',
        alignItems: "center",
    },
    camera: (width) => ({
        width: width,
        height: Math.round((width * 4) / 3),
    }),
    captureBox: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: "center",
        borderWidth: 40,
        borderColor: "black",
        borderRadius: 70,
        margin: -37,
    },
    navigation: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        marginVertical: 20,
    },
});
