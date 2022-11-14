import React from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, Dimensions, StyleSheet } from 'react-native'
import {getContrastColor} from "../../../javascript/colors";


const { width } = Dimensions.get('window');

const ColorOption = (props) => {
    const { icon, color, isSelected, scaleToWindow, onColorChange } = props;
    let scaledWidth = width * .025;
    return (
        <TouchableOpacity
            onPress={() => onColorChange(color)}
            style={[
                styles.colorOption(50),
                { backgroundColor: color },
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
    );
}

const styles = StyleSheet.create({
    colorOption: (size) => ({
        borderWidth: 1.5,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        marginHorizontal: 10,
        marginVertical: 10,
        borderRadius: size/2,
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
