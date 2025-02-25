import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

export const RecordWaveButton = ({ isRecording }) => {
  const animationDetails = useRef(
    [...Array(100)].map(() => new Animated.Value(1)),
  ).current;

  const animationRef = useRef(null);

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.stop();
    }

    if (isRecording) {
      const createRandomAnimation = (value) => {
        const randomScale = Math.random() * (2.5 - 1.2) + 1.2;
        const randomDuration = Math.random() * (800 - 400) + 400;

        return Animated.sequence([
          Animated.timing(value, {
            toValue: randomScale,
            duration: randomDuration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 1,
            duration: randomDuration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]);
      };

      const startAnimation = () => {
        animationDetails.forEach((value) => {
          animationRef.current = Animated.loop(createRandomAnimation(value));
          animationRef.current.start();
        });
      };

      startAnimation();
    } else {
      animationDetails.forEach((value) => {
        Animated.timing(value, {
          toValue: 1,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start();
      });
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [isRecording]);

  return (
    <View style={styles.container}>
      {animationDetails.map((value, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bar,
            {
              transform: [
                { rotate: `${index * (360 / 100)}deg` },
                { translateY: -70 },
                { scaleY: value },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bar: {
    position: 'absolute',
    width: 2,
    height: 20,
    backgroundColor: '#000000',
    borderRadius: 1,
  },
});
