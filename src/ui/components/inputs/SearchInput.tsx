/**
 * 🔍 SearchInput - Производительный компонент поиска
 * 
 * Замена медленного Searchbar из react-native-paper
 * Использует нативный TextInput для максимальной производительности
 * 
 * @example
 * <SearchInput
 *   value={query}
 *   onChangeText={setQuery}
 *   placeholder="Поиск сотрудников..."
 * />
 */

import React, { useCallback } from 'react';
import { View, TextInput, StyleSheet, Pressable, ViewStyle, TextStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { tokens } from '../../theme';

export interface SearchInputProps {
  /** Значение поиска */
  value: string;
  /** Callback при изменении текста */
  onChangeText: (text: string) => void;
  /** Placeholder текст */
  placeholder?: string;
  /** Автофокус при монтировании */
  autoFocus?: boolean;
  /** Дополнительные стили контейнера */
  style?: ViewStyle;
  /** Дополнительные стили input */
  inputStyle?: TextStyle;
  /** Callback при нажатии Enter */
  onSubmitEditing?: () => void;
  /** Показывать внутреннюю тень */
  insetShadow?: boolean;
}

export const SearchInput = React.memo<SearchInputProps>(({
  value,
  onChangeText,
  placeholder = 'Поиск...',
  autoFocus = false,
  style,
  inputStyle,
  onSubmitEditing,
  insetShadow = false,
}) => {
  const handleClear = useCallback(() => {
    onChangeText('');
  }, [onChangeText]);

  const showClearButton = value.length > 0;

  return (
    <View style={[styles.container, style]}>
      {/* Внутренняя тень - полупрозрачный overlay сверху */}
      {insetShadow && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            borderTopLeftRadius: tokens.radius.lg,
            borderTopRightRadius: tokens.radius.lg,
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            pointerEvents: 'none',
          }}
        />
      )}

      <MaterialCommunityIcons 
        name="magnify" 
        size={20} 
        color={tokens.colors.text.muted}
        style={styles.searchIcon}
      />
      
      <TextInput
        style={[styles.input, inputStyle]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={tokens.colors.text.muted}
        autoFocus={autoFocus}
        returnKeyType="search"
        onSubmitEditing={onSubmitEditing}
        clearButtonMode="never" // Используем кастомную кнопку
      />
      
      {showClearButton && (
        <Pressable 
          onPress={handleClear}
          hitSlop={8}
          style={styles.clearButton}
        >
          <MaterialCommunityIcons 
            name="close-circle" 
            size={20} 
            color={tokens.colors.text.muted}
          />
        </Pressable>
      )}
    </View>
  );
});

SearchInput.displayName = 'SearchInput';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    paddingHorizontal: tokens.spacing.md,
    height: tokens.spacing.controlHeight,
  },
  
  searchIcon: {
    marginRight: tokens.spacing.sm,
  },
  
  input: {
    flex: 1,
    fontSize: tokens.fontSize.md,
    color: tokens.colors.text.primary,
    // Убираем outline на веб
    outlineStyle: 'none' as any,
  },
  
  clearButton: {
    padding: tokens.spacing.xs,
    marginLeft: tokens.spacing.xs,
  },
});

