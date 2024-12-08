import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

export default function App() {
  const titleOpacity = useSharedValue(0);
  const titleScale = useSharedValue(0.5);

  const titleAnimationStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value,
      transform: [{ scale: titleScale.value }],
    };
  });

  useEffect(() => {
    titleOpacity.value = withTiming(1, { duration: 2000 });
    titleScale.value = withTiming(1, { duration: 2000 });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.titleText, titleAnimationStyle]}>
        Steach
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    color: '#3FC0D7',
    fontSize: 80,
    fontWeight: 'bold',
  },
});
