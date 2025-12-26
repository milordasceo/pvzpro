import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Image, StyleSheet, TextInput, Alert, Linking, ActionSheetIOS, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  LogOut,
  Phone,
  Mail,
  Star,
  Pencil,
  Check,
  X,
  MessageCircle,
  HelpCircle,
  Info,
  Camera,
} from 'lucide-react-native';
import { theme } from '../../../shared/theme';
import { marketplaceThemes } from '../../../shared/theme/colors';
import { useShiftStore } from '../model/shift.store';
import { useAuthStore } from '../../auth/model/auth.store';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

type EditableField = 'name' | 'phone' | 'email' | null;

export const ProfileScreen = () => {
  const navigation = useNavigation();
  const { employee, pvz } = useShiftStore();
  const { logout } = useAuthStore();
  const currentTheme = marketplaceThemes[pvz.marketplace] || marketplaceThemes.wb;

  const [editingField, setEditingField] = useState<EditableField>(null);
  const [formData, setFormData] = useState({
    name: employee.name,
    phone: '+7 (999) 123-45-67',
    email: 'alex@pvz.pro',
  });
  const [tempValue, setTempValue] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(employee.avatarUrl || null);

  const pickAvatar = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const showOptions = () => {
      if (Platform.OS === 'ios') {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ['Отмена', 'Сделать фото', 'Выбрать из галереи'],
            cancelButtonIndex: 0,
          },
          async (buttonIndex) => {
            if (buttonIndex === 1) launchCamera();
            if (buttonIndex === 2) launchGallery();
          }
        );
      } else {
        Alert.alert('Изменить фото', 'Выберите источник', [
          { text: 'Отмена', style: 'cancel' },
          { text: 'Камера', onPress: launchCamera },
          { text: 'Галерея', onPress: launchGallery },
        ]);
      }
    };

    const launchCamera = async () => {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Ошибка', 'Нужен доступ к камере');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled) {
        setAvatarUri(result.assets[0].uri);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    };

    const launchGallery = async () => {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Ошибка', 'Нужен доступ к галерее');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled) {
        setAvatarUri(result.assets[0].uri);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    };

    showOptions();
  };

  const handleLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      'Выход',
      'Вы уверены, что хотите выйти из аккаунта?',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Выйти', style: 'destructive', onPress: logout },
      ]
    );
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  const startEditing = (field: EditableField) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (field) {
      setTempValue(formData[field]);
      setEditingField(field);
    }
  };

  const cancelEditing = () => {
    setEditingField(null);
    setTempValue('');
  };

  const saveEditing = () => {
    if (editingField && tempValue.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setFormData({ ...formData, [editingField]: tempValue });
    }
    setEditingField(null);
    setTempValue('');
  };

  const handleSupport = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL('https://t.me/pvzpro_support');
  };

  const renderEditableField = (
    field: 'phone' | 'email',
    icon: React.ReactNode,
    keyboardType: 'phone-pad' | 'email-address' = 'phone-pad'
  ) => {
    const isEditing = editingField === field;

    return (
      <View style={styles.cardRow}>
        {icon}
        {isEditing ? (
          <View style={styles.editingRow}>
            <TextInput
              style={styles.cardInput}
              value={tempValue}
              onChangeText={setTempValue}
              keyboardType={keyboardType}
              autoCapitalize="none"
              autoFocus
            />
            <TouchableOpacity onPress={saveEditing} style={styles.editAction}>
              <Check size={20} color={theme.colors.success} />
            </TouchableOpacity>
            <TouchableOpacity onPress={cancelEditing} style={styles.editAction}>
              <X size={20} color={theme.colors.text.muted} />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.cardText}>{formData[field]}</Text>
            <TouchableOpacity onPress={() => startEditing(field)} style={styles.editButton}>
              <Pencil size={16} color={theme.colors.text.muted} />
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <View style={styles.headerNav}>
          <TouchableOpacity onPress={handleBack} style={styles.navButton}>
            <ChevronLeft size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Профиль</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeInDown.duration(400)}>

            {/* HERO: Avatar + Name + Rating */}
            <View style={styles.heroSection}>
              <TouchableOpacity
                onPress={pickAvatar}
                activeOpacity={0.8}
                style={[styles.avatar, { borderColor: `${currentTheme.primary}30` }]}
              >
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
                ) : (
                  <Text style={[styles.avatarText, { color: currentTheme.primary }]}>
                    {formData.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                )}
                <View style={[styles.cameraBadge, { backgroundColor: currentTheme.primary }]}>
                  <Camera size={14} color={theme.colors.white} />
                </View>
              </TouchableOpacity>

              {/* Editable Name */}
              {editingField === 'name' ? (
                <View style={styles.nameEditContainer}>
                  <TextInput
                    style={styles.nameInput}
                    value={tempValue}
                    onChangeText={setTempValue}
                    autoFocus
                  />
                  <View style={styles.nameEditActions}>
                    <TouchableOpacity onPress={saveEditing} style={styles.nameEditButton}>
                      <Check size={20} color={theme.colors.success} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={cancelEditing} style={styles.nameEditButton}>
                      <X size={20} color={theme.colors.text.muted} />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => startEditing('name')}
                  style={styles.nameRow}
                >
                  <Text style={styles.userName}>{formData.name}</Text>
                  <Pencil size={16} color={theme.colors.text.muted} style={{ marginLeft: 8 }} />
                </TouchableOpacity>
              )}

              <Text style={styles.userRole}>{employee.role}</Text>

              {/* Rating Badge */}
              <View style={styles.ratingContainer}>
                <Star size={16} color={theme.colors.warning} fill={theme.colors.warning} />
                <Text style={styles.ratingText}>5.0</Text>
                <Text style={styles.ratingLabel}>• Отличный рейтинг</Text>
              </View>
            </View>

            {/* CONTACT INFO */}
            <Text style={styles.sectionTitle}>Контактные данные</Text>
            <View style={styles.card}>
              {renderEditableField('phone', <Phone size={18} color={theme.colors.text.muted} />, 'phone-pad')}
              <View style={styles.divider} />
              {renderEditableField('email', <Mail size={18} color={theme.colors.text.muted} />, 'email-address')}
            </View>

            {/* SUPPORT */}
            <Text style={styles.sectionTitle}>Помощь</Text>
            <View style={styles.card}>
              <TouchableOpacity style={styles.cardRow} onPress={handleSupport}>
                <MessageCircle size={18} color={theme.colors.text.muted} />
                <Text style={styles.cardText}>Написать в поддержку</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.cardRow} onPress={() => { }}>
                <HelpCircle size={18} color={theme.colors.text.muted} />
                <Text style={styles.cardText}>Частые вопросы</Text>
              </TouchableOpacity>
            </View>

            {/* ABOUT */}
            <View style={styles.aboutRow}>
              <Info size={18} color={theme.colors.text.muted} />
              <View>
                <Text style={styles.aboutAppName}>PVZ Pro</Text>
                <Text style={styles.aboutVersion}>Версия 2.4.12</Text>
              </View>
            </View>

            {/* LOGOUT */}
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <LogOut size={18} color={theme.colors.danger} />
              <Text style={styles.logoutText}>Выйти из аккаунта</Text>
            </TouchableOpacity>

          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  navButton: {
    width: 44, height: 44,
    alignItems: 'center', justifyContent: 'center',
    borderRadius: 22,
  },
  headerTitle: {
    ...theme.typography.presets.h4,
    color: theme.colors.text.primary,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: 60,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing['2xl'],
  },
  avatar: {
    width: 100, height: 100,
    borderRadius: 50,
    borderWidth: 3,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: theme.colors.white,
    marginBottom: theme.spacing.lg,
  },
  avatarImage: {
    width: '100%', height: '100%', borderRadius: 50,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '600',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0, right: 0,
    width: 32, height: 32,
    borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3,
    borderColor: theme.colors.background,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    ...theme.typography.presets.h2,
  },
  nameEditContainer: {
    alignItems: 'center',
    marginBottom: 4,
  },
  nameInput: {
    ...theme.typography.presets.h3,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    minWidth: 200,
  },
  nameEditActions: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
    gap: 12,
  },
  nameEditButton: {
    width: 36, height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.white,
    alignItems: 'center', justifyContent: 'center',
  },
  userRole: {
    ...theme.typography.presets.body,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: `${theme.colors.warning}10`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  ratingText: {
    ...theme.typography.presets.label,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  ratingLabel: {
    ...theme.typography.presets.caption,
    color: theme.colors.text.muted,
  },
  sectionTitle: {
    ...theme.typography.presets.caption,
    color: theme.colors.text.muted,
    marginBottom: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    marginBottom: theme.spacing.xl,
    overflow: 'hidden',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    gap: 12,
  },
  cardText: {
    ...theme.typography.presets.body,
    color: theme.colors.text.primary,
    flex: 1,
  },
  editingRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardInput: {
    ...theme.typography.presets.body,
    color: theme.colors.text.primary,
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  editButton: {
    padding: 8,
  },
  editAction: {
    padding: 6,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.light,
    marginLeft: 46,
  },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  aboutAppName: {
    ...theme.typography.presets.label,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  aboutVersion: {
    ...theme.typography.presets.caption,
    color: theme.colors.text.muted,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  logoutText: {
    ...theme.typography.presets.body,
    color: theme.colors.danger,
  },
});
