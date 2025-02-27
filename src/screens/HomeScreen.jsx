import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Image } from 'expo-image';

export default function HomeScreen({ navigation }) {
  const titleOpacity = useSharedValue(0);
  const titleScale = useSharedValue(0.5);
  const startButtonOpacity = useSharedValue(0);
  const imageOpacity = useSharedValue(0);

  const titleAnimationStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ scale: titleScale.value }],
  }));

  const startButtonAnimationStyle = useAnimatedStyle(() => ({
    opacity: startButtonOpacity.value,
  }));

  const imageAnimationStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
  }));

  useEffect(() => {
    imageOpacity.value = withTiming(1, { duration: 2000 });

    setTimeout(() => {
      startButtonOpacity.value = withTiming(1, { duration: 2000 });
      titleOpacity.value = withTiming(1, { duration: 1000 });
      titleScale.value = withTiming(1, { duration: 1000 });
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
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('Start')}
        >
          <Text style={styles.startButtonText}>시작하기</Text>
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={[styles.imageContainer, imageAnimationStyle]}>
        <Image
          source={require('../../assets/suit.png')}
          style={styles.image}
          contentFit="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    color: '#3D3A3C',
    fontSize: 80,
    fontWeight: 'bold',
  },
  startButtonContainer: {
    marginTop: 20,
    zIndex: 2,
  },
  startButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  startButtonText: {
    color: '#3D3A3C',
    fontSize: 25,
    fontWeight: 'bold',
  },
  lightButtonContainer: {
    position: 'absolute',
    left: 35,
    bottom: 50,
  },
  imageContainer: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
    width: '100%',
    left: 170,
  },
  image: {
    width: 470,
    height: 470,
  },
});
