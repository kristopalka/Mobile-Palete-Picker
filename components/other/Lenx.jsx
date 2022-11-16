import {StyleSheet, View} from 'react-native';

export default function Lens(props) {
    let size = props.size;
    let elementSize = size/5;

    return (
        <View style={styles.container(props.size)}>
            <View style={styles.row}>
                <View style={[styles.left_top, styles.default(elementSize)]}/>
                <View style={[styles.right_top, styles.default(elementSize)]}/>
            </View>
            <View style={styles.row}>
                <View style={[styles.left_bottom, styles.default(elementSize)]}/>
                <View style={[styles.right_bottom, styles.default(elementSize)]}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create( {
    container: (size) => ({
        height: size,
        width: size,
        flexDirection: "column",
        justifyContent: "space-between",
    }),
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    default: (size) => ({
        height: size,
        width: size,
        borderStyle: "solid",
        borderWidth: 3,
        borderRadius: 20,
        borderColor: "white",
        opacity: 0.7,
        backgroundColor: "transparent",
    }),
    left_top: {
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderBottomWidth: 0,
        borderRightWidth: 0,
    },
    right_top: {
        borderBottomRightRadius: 0,
        borderTopLeftRadius: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
    },
    right_bottom: {
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderTopWidth: 0,
        borderLeftWidth: 0,
    },
    left_bottom: {
        borderBottomRightRadius: 0,
        borderTopLeftRadius: 0,
        borderTopWidth: 0,
        borderRightWidth: 0,
    },
});
