import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Searchbar, Text, List, useTheme } from 'react-native-paper';
import { Dialog } from '../overlays/Dialog';
import { Button } from '../buttons/Button';
import { tokens } from '../../theme';

export interface SelectOption {
  id: string;
  label: string;
  hint?: string;
}

export interface SelectModalProps {
  visible: boolean;
  title: string;
  options: SelectOption[];
  onClose: () => void;
  onSelect: (opt: SelectOption) => void;
}

/**
 * 🔍 SelectModal - Модал выбора с поиском
 * 
 * Компонент для выбора элемента из списка с возможностью поиска.
 * Использует Dialog и Searchbar для удобного UX.
 * 
 * @example
 * ```tsx
 * <SelectModal
 *   visible={isVisible}
 *   title="Выберите сотрудника"
 *   options={employees.map(emp => ({
 *     id: emp.id,
 *     label: emp.name,
 *     hint: emp.position
 *   }))}
 *   onSelect={handleSelect}
 *   onClose={handleClose}
 * />
 * ```
 */
export const SelectModal: React.FC<SelectModalProps> = ({
  visible,
  title,
  options,
  onClose,
  onSelect,
}) => {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) => o.label.toLowerCase().includes(q) || (o.hint ?? '').toLowerCase().includes(q),
    );
  }, [query, options]);

  return (
    <Dialog
      visible={visible}
      onDismiss={onClose}
      title={title}
      actions={<Button onPress={onClose}>Закрыть</Button>}
    >
      <Searchbar
        placeholder="Поиск"
        value={query}
        onChangeText={setQuery}
        style={{ 
          marginBottom: 8, 
          borderRadius: tokens.radius.md, 
          height: 48 
        }}
        inputStyle={{
          color: theme.colors.onSurface,
          paddingVertical: 0,
          textAlignVertical: 'center' as any,
        }}
        placeholderTextColor={tokens.colors.text.muted}
      />
      <View style={{ maxHeight: 320 }}>
        {filtered.map((opt) => (
          <List.Item
            key={opt.id}
            title={opt.label}
            description={opt.hint}
            onPress={() => {
              onSelect(opt);
              onClose();
            }}
          />
        ))}
        {filtered.length === 0 ? (
          <Text style={{ 
            textAlign: 'center', 
            padding: 16,
            color: tokens.colors.text.secondary 
          }}>
            Ничего не найдено
          </Text>
        ) : null}
      </View>
    </Dialog>
  );
};

SelectModal.displayName = 'SelectModal';

