import PropTypes from 'prop-types';
import React, {useEffect} from 'react';
import {Animated, Dimensions, StyleSheet, Text, TouchableOpacity} from 'react-native';


export default function SegmentedControl(props) {
    const margin = 0;
    const [tabTranslate, setTabTranslate] = React.useState(new Animated.Value(0));

    // useCallBack with an empty array as input, which will call inner lambda only once and memoize the reference for future calls
    const memoizedTabPressCallback = React.useCallback(
        (index) => {
            props?.onChange(index);
        },
        []
    );

    useEffect(() => {
        // Animating the active index based current index
        Animated.spring(tabTranslate, {
            toValue: props?.currentIndex * ((props.width - 2*margin) / props?.tabs?.length),
            stiffness: 180,
            damping: 20,
            mass: 1,
            useNativeDriver: true
        }).start()
    }, [props?.currentIndex])

    return (
        <Animated.View style={[
            styles.segmentedControlWrapper(props.width),
            {backgroundColor: props?.segmentedControlBackgroundColor},
            {paddingVertical: props?.paddingVertical,}
        ]}>
            <Animated.View
                style={[{
                    ...StyleSheet.absoluteFill,
                    position: "absolute",
                    width: (props.width - 2*margin) / props?.tabs?.length,
                    top: 0,
                    marginVertical: margin,
                    marginHorizontal: margin,
                    backgroundColor: props?.activeSegmentBackgroundColor,
                    borderRadius: 10,
                },
                    {transform: [{translateX: tabTranslate}]}]}
            >
            </Animated.View>
            {
                props?.tabs.map((tab, index) => {
                    const isCurrentIndex = props?.currentIndex === index;
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[styles.textWrapper]}
                            onPress={() => memoizedTabPressCallback(index)}
                            activeOpacity={0.7}>
                            <Text numberOfLines={1}
                                  style={[styles.textStyles, {color: props?.textColor}, isCurrentIndex && {color: props?.activeTextColor}]}>{tab}</Text>
                        </TouchableOpacity>
                    )
                })
            }
        </Animated.View>
    )
}


const styles = StyleSheet.create({
    segmentedControlWrapper: (width) => ({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        width: width,
        marginVertical: 5
    }),
    textWrapper: {
        flex: 1,
        elevation: 9,
        paddingHorizontal: 2
    },
    textStyles: {
        fontSize: 18,
        textAlign: 'center',
        fontWeight: '600',
    }
})

SegmentedControl.propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
    currentIndex: PropTypes.number.isRequired,
    segmentedControlBackgroundColor: PropTypes.string,
    activeSegmentBackgroundColor: PropTypes.string,
    textColor: PropTypes.string,
    activeTextColor: PropTypes.string,
    paddingVertical: PropTypes.number
}


SegmentedControl.defaultProps = {
    tabs: [],
    onChange: () => {
    },
    currentIndex: 0,
    segmentedControlBackgroundColor: 'black',
    activeSegmentBackgroundColor: 'white',
    textColor: 'white',
    activeTextColor: 'black',
    paddingVertical: 4,
    width: Dimensions.get('screen').width - 32,
}

