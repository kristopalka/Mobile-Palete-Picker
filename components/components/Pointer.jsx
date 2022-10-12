import {StyleSheet, View} from 'react-native';


export default function Pointer(props) {
    let size = props.size ? props.size : 50;
    let width = props.width ? props.width : 1.5;

    return (
        <View style={styles.container(size, width)}></View>
    );
}

const styles = StyleSheet.create({
    container: (size, width) => ({
        height: size,
        width: size,
        flexDirection: "column",
        borderStyle: "solid",
        borderWidth: width,
        borderColor: "black",
        borderRadius: size/2,
        borderTopLeftRadius: 0,
    }),
});
