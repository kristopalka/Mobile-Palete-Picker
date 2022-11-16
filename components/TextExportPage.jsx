import {StyleSheet, TextInput, View} from 'react-native';
import React, {useState} from "react";
import Button from "./other/Button";
import {borderRadius, borderWidth} from "../javascript/css";
import {copyToClipboard} from "../javascript/exporting";

export default function TextExportPage(props) {
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
            <View>
                <View style={styles.buttonRow}>
                    <Button title={"Back"}
                            style={styles.button}
                            onPress={props.back}
                    />
                    <Button title={"Copy"}
                            style={styles.button}
                            onPress={() => {
                                copyToClipboard(text);
                            }}
                    />
                </View>
                {/*<View style={styles.buttonRow}>*/}
                {/*    <Button title={"Share"}*/}
                {/*            style={styles.button}*/}
                {/*            onPress={() => {*/}
                {/*                /!* todo share button *!/*/}
                {/*            }}*/}
                {/*    />*/}
                {/*    <Button title={"Save"}*/}
                {/*            style={styles.button}*/}
                {/*            onPress={() => {*/}
                {/*                /!* todo save to file button *!/*/}
                {/*            }}*/}
                {/*    />*/}
                {/*</View>*/}
            </View>
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
        flexWrap: "nowrap",
        paddingLeft: 15,
        borderWidth: borderWidth,
        borderColor: "black",
        borderRadius: borderRadius,
        height: "50%",
        width: "90%",
        fontSize: 15,
        marginBottom: 30,
        marginTop: 10,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "center"
    },
    button: {
        height: 50,
        width: 140,
        margin: 5,
    },
});
