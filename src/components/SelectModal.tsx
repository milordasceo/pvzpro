import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Searchbar, Text, List, useTheme } from 'react-native-paper';
import { placeholderColor } from '../theme';
import { StyledDialog } from './StyledDialog';
import { StyledButton } from './StyledButton';

export interface SelectOption {
  id: string;
  label: string;
  hint?: string;
}

interface SelectModalProps {
  visible: boolean;
  title: string;
  options: SelectOption[];
  onClose: () => void;
  onSelect: (opt: SelectOption) => void;
}

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
    <StyledDialog
      visible={visible}
      onDismiss={onClose}
      title={title}
      actions={<StyledButton onPress={onClose}>Закрыть</StyledButton>}
    >
      <Searchbar
        placeholder="Поиск"
        value={query}
        onChangeText={setQuery}
        style={{ marginBottom: 8, borderRadius: 8, height: 48 }}
        inputStyle={{
          color: theme.colors.onSurface,
          paddingVertical: 0,
          textAlignVertical: 'center' as any,
        }}
        placeholderTextColor={placeholderColor}
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
        {filtered.length === 0 ? <Text>Ничего не найдено</Text> : null}
      </View>
    </StyledDialog>
  );
};
