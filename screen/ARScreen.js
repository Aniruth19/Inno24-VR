import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Viro3DObject,
  ViroARScene,
  ViroARSceneNavigator,
  ViroAmbientLight,
  ViroAnimations,
} from "@viro-community/react-viro";

const InitialScene = ({ modelSource }) => {
  const [rotation, setRotation] = useState([-45, 50, 40]);
  const [position, setPosition] = useState([0, 0, -5]);
  const [skullScale, setSkullScale] = useState([0.09, 0.09, 0.09]); // Adjusted scale

  ViroAnimations.registerAnimations({
    rotate: {
      duration: 2500,
      properties: {
        rotateY: "+=90",
      },
    },
  });

  const moveObject = (newPosition) => {
    setPosition(newPosition);
  }

  const rotateObject = (rotateState, rotationFactor, source) => {
    if (rotateState === 3) {
      let newRotation = [rotation[0] - rotationFactor,rotation[1] - rotationFactor,rotation[2] - rotationFactor]
      setRotation(newRotation);
      console.log(rotationFactor);
    } 
  };
  
  const scaleSkullObject = (pinchState, scaleFactor, source) => {
    if (pinchState === 3) {
      let currentScale = skullScale[0] ;
      let newScale = currentScale*scaleFactor;
      let newScaleArray = [newScale, newScale, newScale];
      setSkullScale(newScaleArray);
    }
  };
  

  return (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" />
      <Viro3DObject
        source={modelSource} // Dynamically set source based on props
        position={position}
        scale={skullScale}
        rotation={rotation}
        type="OBJ"
        onDrag={moveObject}
        onRotate={rotateObject}
        onPinch={scaleSkullObject}
      />
    </ViroARScene>
  );
};

export default ({ route }) => {
  const { modelSource } = route.params; 
  return (
    <View style={styles.mainView}>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{ scene: () => <InitialScene modelSource={modelSource} /> }} // Pass modelSource as prop
        style={styles.arScene}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  arScene: {
    flex: 1,
  },
});
