import React from "react";
import {StyleSheet, Text, TouchableOpacity} from "react-native";
import {borderRadius, borderWidth, mainTextColor, mainTextSize} from "../../javascript/css";

export default function Button(props) {

    return (
        <TouchableOpacity style={[styles.button, props.style]} onPress={props.onPress}>
            <Text style={styles.text}>
                {props.title}
            </Text>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    button: {
        borderRadius: borderRadius,
        borderWidth: borderWidth,
        borderColor: "black",
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 13,
    },
    text: {
        padding: 7,
        textAlign: "center",
        color: mainTextColor,
        fontSize: mainTextSize,
    },
});
