import {Image, StyleSheet, View} from 'react-native';

import Pointer from "./Pointer";
import {useRef} from "react";
import Draggable from "react-native-draggable";

export default function ImagePointers(props) {
    const width = props.width;
    const height = props.height;
    const pointerSize = 50;
    const pointerWidth = 1.5;

    const imageBox = useRef(null);
    const pointers = useRef([]);


    return (
        <View style={styles.imageBox(width, height)} ref={imageBox} collapsable={false}>
            <Image style={styles.image} source={{uri: props.imageUrl}}/>

            {
                props.points.map((item, i) => {
                    return <Draggable
                        key={i} x={Math.round(item.x)} y={Math.round(item.y)} minX={0} minY={0}
                        maxX={width + pointerSize - pointerWidth} maxY={height + pointerSize - pointerWidth}
                        children={
                            <View ref={e => pointers.current[i] = e} collapsable={false}>
                                <Pointer size={pointerSize} width={pointerWidth} color={props.colors[i]}/>
                            </View>
                        }
                        onDragRelease={() => {
                            pointers.current[i].measureLayout(imageBox.current,
                                async (x, y) => {
                                    const newCoords = {x: x, y: y}
                                    console.log("Pointer", i, "moved to", newCoords)
                                    props.movePointer(i, newCoords);
                                })
                        }}

                    />
                })
            }
        </View>
    );
}

const styles = StyleSheet.create({
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
