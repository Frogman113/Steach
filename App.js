import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const titleOpacity = useSharedValue(0);
  const titleScale = useSharedValue(0.5);
  const startButtonOpacity = useSharedValue(0);
  const lightIconButtonOpacity = useSharedValue(0);

  const titleAnimationStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value,
      transform: [{ scale: titleScale.value }],
    };
  });

  const startButtonAnimationStyle = useAnimatedStyle(() => {
    return {
      opacity: startButtonOpacity.value,
    };
  });

  const lightIconButtonAnimationStyle = useAnimatedStyle(() => {
    return {
      opacity: lightIconButtonOpacity.value,
    };
  });

  useEffect(() => {
    titleOpacity.value = withTiming(1, { duration: 2000 });
    titleScale.value = withTiming(1, { duration: 2000 });

    setTimeout(() => {
      startButtonOpacity.value = withTiming(1, { duration: 1000 });
      lightIconButtonOpacity.value = withTiming(1, { duration: 1000 });
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.titleText, titleAnimationStyle]}>
        Steach
      </Animated.Text>
      <Animated.View
        style={[styles.startButtonContainer, startButtonAnimationStyle]}
      >
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>시작하기</Text>
        </TouchableOpacity>
      </Animated.View>
      <Animated.View
        style={[styles.lightButtonContainer, lightIconButtonAnimationStyle]}
      >
        <TouchableOpacity>
          <Ionicons name="bulb" size={32} color="#FFCC02" />
        </TouchableOpacity>
      </Animated.View>
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
  startButtonContainer: {
    marginTop: 20,
  },
  startButton: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  startButtonText: {
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold',
  },
  lightButtonContainer: {
    position: 'absolute',
    left: 35,
    bottom: 50,
  },
});
