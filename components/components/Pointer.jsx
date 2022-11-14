import {StyleSheet, View} from 'react-native';
import {getContrastColor} from "../../javascript/colors";


export default function Pointer(props) {
    let size = props.size ? props.size : 50;
    let width = props.width ? props.width : 1.5;
    let color = props.color ? props.color : "#000000";

    return (
        <View style={styles.container(size, width, color)}></View>
    );
}

const styles = StyleSheet.create({
    container: (size, width, color) => ({
        backgroundColor: color,
        height: size,
        width: size,
        flexDirection: "column",
        borderStyle: "solid",
        borderWidth: width,
        borderColor: getContrastColor(color),
        borderRadius: size/2,
        borderTopLeftRadius: 0,
    }),
});
