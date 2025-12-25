import React from 'react';
import { View, Text } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    runOnJS,
    interpolate,
    Extrapolate,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { ChevronRight, Power } from 'lucide-react-native';
import { theme } from '../theme';
import * as Haptics from 'expo-haptics';

interface SlideToActionProps {
    onAction: () => void;
    label: string;
    variant?: 'primary' | 'danger';
    primaryColor?: string;
    disabled?: boolean;
}

// Using theme tokens for all dimensions
const { slider } = theme.layout;

export const SlideToAction = ({
    onAction,
    label,
    variant = 'primary',
    primaryColor = theme.colors.primary,
    disabled = false,
}: SlideToActionProps) => {
    const [containerWidth, setContainerWidth] = React.useState(0);
    const translateX = useSharedValue(0);
    const startX = useSharedValue(0);

    const travelDistance = containerWidth > 0
        ? containerWidth - slider.knobSize - slider.padding * 2
        : 0;

    const handleAction = React.useCallback(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onAction();
        translateX.value = withSpring(0);
    }, [onAction]);

    const panGesture = Gesture.Pan()
        .enabled(!disabled && containerWidth > 0)
        .onStart(() => {
            startX.value = translateX.value;
        })
        .onUpdate((event) => {
            if (containerWidth === 0) return;
            let newVal = startX.value + event.translationX;
            if (newVal < 0) newVal = 0;
            if (newVal > travelDistance) newVal = travelDistance;
            translateX.value = newVal;
        })
        .onEnd(() => {
            if (containerWidth === 0) return;
            if (translateX.value > travelDistance * 0.8) {
                translateX.value = withSpring(travelDistance);
                runOnJS(handleAction)();
            } else {
                translateX.value = withSpring(0);
            }
        });

    const knobStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const textStyle = useAnimatedStyle(() => ({
        opacity: interpolate(translateX.value, [0, travelDistance * 0.4], [1, 0], Extrapolate.CLAMP),
        transform: [{ translateX: interpolate(translateX.value, [0, travelDistance], [0, theme.spacing['2xl']], Extrapolate.CLAMP) }],
    }));

    const isDanger = variant === 'danger';
    const sliderColors = isDanger ? theme.colors.slider.danger : theme.colors.slider.primary;
    const knobColor = isDanger ? theme.colors.danger : primaryColor;
    const textColor = isDanger ? theme.colors.danger : primaryColor;

    return (
        <View
            onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
            style={{
                height: slider.height,
                backgroundColor: sliderColors.bg,
                borderRadius: slider.borderRadius,
                padding: slider.padding,
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: sliderColors.border,
                opacity: disabled ? 0.5 : 1,
            }}
        >
            <View style={{ position: 'absolute', width: '100%', paddingLeft: slider.knobSize + theme.spacing.xl, zIndex: 0 }}>
                <Animated.View style={textStyle}>
                    <Text style={{ ...theme.typography.presets.label, color: textColor, fontWeight: '700' }}>
                        {label}
                    </Text>
                </Animated.View>
            </View>

            <GestureDetector gesture={panGesture}>
                <Animated.View
                    style={[
                        knobStyle,
                        {
                            width: slider.knobSize,
                            height: slider.knobSize,
                            borderRadius: slider.knobRadius,
                            backgroundColor: knobColor,
                            alignItems: 'center',
                            justifyContent: 'center',
                            shadowColor: knobColor,
                            shadowOffset: { width: 0, height: theme.spacing.xs },
                            shadowOpacity: 0.2,
                            shadowRadius: theme.spacing.sm,
                            elevation: 4,
                            zIndex: 1,
                        },
                    ]}
                >
                    {isDanger ? (
                        <Power size={theme.layout.icon.xl} color={theme.colors.white} strokeWidth={2.5} />
                    ) : (
                        <ChevronRight size={theme.layout.icon['3xl']} color={theme.colors.white} strokeWidth={3} />
                    )}
                </Animated.View>
            </GestureDetector>
        </View>
    );
};
