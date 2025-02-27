import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';

export default function HomeScreen({ navigation }) {
  const bgAnimation = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(-50);
  const titleScale = useSharedValue(0.9);
  const startButtonOpacity = useSharedValue(0);
  const startButtonScale = useSharedValue(0.8);

  const animatedBackground = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      bgAnimation.value,
      [0, 1],
      ['#3D3A3C', '#2C2A2D'],
    ),
  }));

  const titleAnimationStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [
      { translateY: titleTranslateY.value },
      { scale: titleScale.value },
    ],
  }));

  const startButtonAnimationStyle = useAnimatedStyle(() => ({
    opacity: startButtonOpacity.value,
    transform: [{ scale: startButtonScale.value }],
  }));

  useEffect(() => {
    bgAnimation.value = withTiming(1, { duration: 2000 });
    titleOpacity.value = withTiming(1, { duration: 1200 });
    titleTranslateY.value = withSpring(0, { damping: 10 });
    titleScale.value = withTiming(1, { duration: 1500 });

    setTimeout(() => {
      startButtonOpacity.value = withTiming(1, { duration: 1500 });
      startButtonScale.value = withSpring(1, { damping: 7 });
    }, 800);
  }, []);

  return (
    <Animated.View style={[styles.container, animatedBackground]}>
      <Animated.Text style={[styles.titleText, titleAnimationStyle]}>
        Steach
      </Animated.Text>
      <Animated.View
        style={[styles.startButtonContainer, startButtonAnimationStyle]}
      >
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('Start')}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>시작하기</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    color: '#F8F8F8',
    fontSize: 60,
    fontWeight: 'bold',
    marginBottom: 40,
    textShadowColor: '#FFFFFF4D',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  startButtonContainer: {
    marginTop: 20,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#242124',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  startButtonText: {
    color: '#F8F8F8',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
