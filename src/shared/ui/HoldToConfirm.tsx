import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet, Animated as RNAnimated } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  runOnJS,
  cancelAnimation,
  Easing
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme } from '../theme';

interface HoldToConfirmProps {
  onConfirm: () => void;
  label?: string;
  holdingLabel?: string;
  confirmedLabel?: string;
  duration?: number;
  color?: string;
  style?: any;
}

export const HoldToConfirm = ({
  onConfirm,
  label = 'Удерживайте для подтверждения',
  holdingLabel = 'Удерживайте...',
  confirmedLabel = 'Готово!',
  duration = 2000,
  color = theme.colors.primary,
  style,
}: HoldToConfirmProps) => {
  const [isHolding, setIsHolding] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const handlePressIn = () => {
    if (isConfirmed) return;
    
    setIsHolding(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    progress.value = withTiming(1, { 
      duration, 
      easing: Easing.linear 
    }, (finished) => {
      if (finished) {
        runOnJS(confirmAction)();
      }
    });
  };

  const handlePressOut = () => {
    if (isConfirmed) return;
    
    setIsHolding(false);
    cancelAnimation(progress);
    progress.value = withTiming(0, { duration: 300 });
  };

  const confirmAction = () => {
    setIsConfirmed(true);
    setIsHolding(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onConfirm();
    
    // Reset after some time
    setTimeout(() => {
      setIsConfirmed(false);
      progress.value = 0;
    }, 2000);
  };

  return (
    <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <View style={[styles.container, { borderColor: color }, style]}>
        <Animated.View style={[styles.progress, { backgroundColor: color }, animatedStyle]} />
        <View style={styles.content}>
          <Text style={[styles.text, { color: isHolding ? theme.colors.white : color }]}>
            {isConfirmed ? confirmedLabel : (isHolding ? holdingLabel : label)}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56, // Стандартная высота кнопки
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    overflow: 'hidden',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  progress: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...theme.typography.presets.bodyLarge,
    fontWeight: '800',
  },
});

