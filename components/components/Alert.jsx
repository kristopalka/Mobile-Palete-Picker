import React from "react";
import {StyleSheet} from "react-native";
import AwesomeAlert from 'react-native-awesome-alerts';
import {
    additionalTextColor,
    additionalTextSize,
    borderRadius,
    borderWidth,
    mainTextColor,
    mainTextSize
} from "../../javascript/css";


export default function Alert(props) {
    return (
        <AwesomeAlert
            show={props.visible}
            title={props.title}
            message={props.message}
            confirmText="Ok"
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={true}
            showConfirmButton={true}
            onConfirmPressed={() => props.setVisible(false)}
            onDismiss={() => props.setVisible(false)}

            overlayStyle={styles.overlayStyle}
            contentContainerStyle={styles.contentContainerStyle}
            confirmButtonStyle={styles.confirmButtonStyle}
            confirmButtonTextStyle={styles.confirmButtonTextStyle}
            titleStyle={styles.titleStyle}
            messageStyle={styles.messageStyle}
        />
    )
}

const styles = StyleSheet.create({
    overlayStyle: {
        height: "100%"
    },
    contentContainerStyle: {
        width: "80%",
        paddingTop: 10,
        paddingBottom: 15,
        borderRadius: borderRadius,
    },
    confirmButtonStyle: {
        borderRadius: borderRadius,
        borderWidth: borderWidth,
        borderColor: "black",
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 13,
        marginTop: 9,
    },
    confirmButtonTextStyle: {
        textAlign: "center",
        color: "black",
        fontSize: 17,
    },
    titleStyle: {
        fontSize: mainTextSize,
        color: mainTextColor,
        paddingBottom: 10,
    },
    messageStyle: {
        fontSize: additionalTextSize,
        color: additionalTextColor,
        textAlign: "center",
    },
});
