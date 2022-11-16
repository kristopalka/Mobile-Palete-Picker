import React from 'react'
import PropTypes from 'prop-types'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {ntc} from "../../../javascript/color_naming";
import {copyToClipboard} from "../../../javascript/exporting";


const ColorOption = (props) => {
    const {icon, color, isSelected, scaleToWindow, onColorChange} = props;
    const colorName = ntc.name(color)[1];
    const width = props.width;
    const height = props.height;
    let scaledWidth = width * .025;
    return (
        <View>
            <TouchableOpacity
                onPress={() => {copyToClipboard(color)}}
                style={[
                    styles.colorOption(width, height),
                    {backgroundColor: color},
                    scaleToWindow && {
                        width: width * .07,
                        height: width * .07,
                        marginHorizontal: scaledWidth,
                        marginVertical: scaledWidth,
                        borderRadius: scaledWidth * 2
                    }
                ]}
            >
            </TouchableOpacity>
            <Text style={styles.text(color, width)}>{color}</Text>
            <Text style={styles.text(colorName, width)}>{colorName}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    colorOption: (width, height) => ({
        borderWidth: 1.5,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        height: height,
        borderRadius: 10,
    }),
    text: (text, width) => ({
        marginTop: 5,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: "center",
        textAlignVertical: 'center',
        fontSize: Math.min(1.7 * width / text.length, 14),
    })
});

ColorOption.propTypes = {
    icon: PropTypes.node,
    color: PropTypes.string.isRequired,
    isSelected: PropTypes.bool.isRequired,
    scaleToWindow: PropTypes.bool.isRequired,
    onColorChange: PropTypes.func.isRequired,
}

export default ColorOption;
