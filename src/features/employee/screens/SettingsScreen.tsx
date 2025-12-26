import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ChevronLeft,
    ChevronRight,
    HelpCircle,
    Info,
    MessageCircle,
} from 'lucide-react-native';
import { theme } from '../../../shared/theme';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

export const SettingsScreen = () => {
    const navigation = useNavigation();

    const handleBack = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.goBack();
    };

    const handleSupport = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        // Opens Telegram or email
        Linking.openURL('https://t.me/pvzpro_support');
    };

    const menuItems = [
        {
            icon: <MessageCircle size={20} color={theme.colors.text.secondary} />,
            label: 'Написать в поддержку',
            onPress: handleSupport,
        },
        {
            icon: <HelpCircle size={20} color={theme.colors.text.secondary} />,
            label: 'Часто задаваемые вопросы',
            onPress: () => { },
        },
    ];

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <ChevronLeft size={24} color={theme.colors.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Настройки</Text>
                    <View style={{ width: 44 }} />
                </View>

                <View style={styles.content}>
                    {/* Menu Items */}
                    <View style={styles.menuCard}>
                        {menuItems.map((item, index) => (
                            <TouchableOpacity
                                key={item.label}
                                onPress={item.onPress}
                                activeOpacity={0.6}
                                style={[
                                    styles.menuItem,
                                    index < menuItems.length - 1 && styles.menuItemBorder
                                ]}
                            >
                                {item.icon}
                                <Text style={styles.menuLabel}>{item.label}</Text>
                                <ChevronRight size={18} color={theme.colors.text.muted} />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* About Section */}
                    <View style={styles.aboutSection}>
                        <Info size={20} color={theme.colors.text.muted} />
                        <View style={{ marginLeft: 12 }}>
                            <Text style={styles.aboutTitle}>PVZ Pro</Text>
                            <Text style={styles.aboutVersion}>Версия 2.4.12 • Build 1403</Text>
                        </View>
                    </View>

                    <Text style={styles.copyright}>
                        © 2025 PVZ Pro. Все права защищены.
                    </Text>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
    },
    backButton: {
        width: 44, height: 44,
        alignItems: 'center', justifyContent: 'center',
        borderRadius: 22,
    },
    headerTitle: {
        ...theme.typography.presets.h4,
        color: theme.colors.text.primary,
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.xl,
    },
    menuCard: {
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: theme.spacing['3xl'],
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.lg,
        gap: 12,
    },
    menuItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.light,
    },
    menuLabel: {
        flex: 1,
        ...theme.typography.presets.body,
        color: theme.colors.text.primary,
    },
    aboutSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.md,
    },
    aboutTitle: {
        ...theme.typography.presets.label,
        fontWeight: '600',
        color: theme.colors.text.primary,
        marginBottom: 2,
    },
    aboutVersion: {
        ...theme.typography.presets.caption,
        color: theme.colors.text.muted,
    },
    copyright: {
        ...theme.typography.presets.caption,
        color: theme.colors.text.muted,
        textAlign: 'center',
        marginTop: 'auto',
        paddingBottom: theme.spacing['3xl'],
        opacity: 0.5,
    },
});
