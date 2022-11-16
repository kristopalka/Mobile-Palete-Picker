import PropTypes from 'prop-types';
import React, { useState, useEffect, Fragment, useCallback } from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';

import ColorOption from './ColorOption';

const windowWidth = Dimensions.get('window').width;



const ColorPalette = (props) => {
    const {colors, defaultColor, icon, onChange, paletteStyles, scaleToWindow, title, titleStyles, value} = props;
    const [color, setColor] = useState(value || defaultColor);

    const width = (windowWidth * 0.8) / colors.length;
    const height = 60;

    useEffect(() => {
        value && setColor(value);
    }, [value]);

    const onColorChange = useCallback((color) => {
        setColor(color);
        onChange(color);
    }, [onChange]);

    return (
        <Fragment>
            <View style={[styles.colorContainer, { ...paletteStyles }]}>
                {colors.map((c, i) => (
                    <ColorOption
                        key={i}
                        color={c}
                        icon={icon}
                        onColorChange={onColorChange}
                        scaleToWindow={scaleToWindow}
                        isSelected={value ? value ===c : color ===c}
                        width={width}
                        height={height}
                    />
                ))}
            </View>
        </Fragment>
    );
}

const styles = StyleSheet.create({
    titleStyles: {
        color: 'black',
    },
    colorContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    }
});

ColorPalette.defaultProps = {
    defaultColor: null,
    onChange: () => { },
    paletteStyles: {},
    scaleToWindow: false,
    title: "Color Palette:",
    titleStyles: {},
    value: null,
};

ColorPalette.propTypes = {
    colors: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string,
    onChange: PropTypes.func,
    defaultColor: PropTypes.string,
    value: PropTypes.string,
    paletteStyles: PropTypes.shape({})
};

export default ColorPalette;
