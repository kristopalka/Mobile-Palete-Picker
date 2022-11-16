import {StyleSheet, TextInput, View} from 'react-native';
import React, {useState} from "react";

export default function ExportPage(props) {
    const [text, onChangeText] = useState(props.text);


    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                value={text}
                multiline
                placeholder=""
                keyboardType="default"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        width: "100%",
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: "white",
    },
    input: {
        borderWidth: 1,
        borderColor: "gray",
        height: "50%",
        width: "80%",
        fontSize: 17,
        textDecorationColor: "black",
        textAlign: "center",
        marginBottom: 30,
        marginTop: 10,
    }
});
