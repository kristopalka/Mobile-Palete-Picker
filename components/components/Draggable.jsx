import {Button, Dimensions, Image, NativeModules, StyleSheet, View} from 'react-native';

import Pointer from "./components/Pointer";
import {useRef} from "react";
import Draggable from "react-native-draggable";

export default function PhotoPage(props) {
    const imageUrl = props.photo ? `data:image/jpg;base64,${props.photo}` : ''
    const width = props.width;
    const height = props.height;
    const pointerSize = props.pointerSize ? props.pointerSize : 50;
    const pointerWidth = props.pointerWidth ? props.pointerWidth : 1.5;

    const imageBox = useRef(null);
    const pointerA = useRef(null);
    const pointerB = useRef(null);
    const pointerC = useRef(null);
    const pointerD = useRef(null);

    const points = [{x: 100, y: 100}, {x: 200, y: 100}, {x: 100, y: 200}, {x: 200, y: 200}]

    function getDraggable(pointer, point) {
        return <Draggable
            x={point.x} y={point.y}
            minX={0} minY={0}
            maxX={width + pointerSize - pointerWidth} maxY={height + pointerSize - pointerWidth}
            children={<View ref={pointer} collapsable={false}><Pointer size={pointerSize}
                                                                       width={pointerWidth}></Pointer></View>}
        />
    }







    return (
        <View style={styles.container}>
            <View style={styles.imageBox(width, height)} ref={imageBox} collapsable={false}>
                <Image style={styles.image} source={{uri: imageUrl}}/>

                {getDraggable(pointerA, points[0])}
                {getDraggable(pointerB, points[1])}
                {getDraggable(pointerC, points[2])}
                {getDraggable(pointerD, points[3])}
            </View>

            <Button title={"show pos"} onPress={async () => {
                function measure(pointer) {
                    return new Promise((resolve, reject) => {
                        pointer.current.measureLayout(
                            imageBox.current,
                            (x, y) => {
                                resolve({x: x / width, y: y / height})
                            })
                    })
                }


                let points = await Promise.all([
                    measure(pointerA),
                    measure(pointerB),
                    measure(pointerC),
                    measure(pointerD),
                ])

                console.log(points)
            }}></Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
    },
    imageBox: (w, h) => ({
        width: w,
        height: h,
        backgroundColor: "black",
    }),
    image: {
        width: "100%",
        height: "100%",
    },

});
