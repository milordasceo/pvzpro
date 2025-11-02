import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { tokens } from '../../../../ui';
import { EmployeeInfoItem } from '../types/employee.types';

interface EmployeeInfoSectionProps {
  title: string;
  items: EmployeeInfoItem[];
}

export const EmployeeInfoSection: React.FC<EmployeeInfoSectionProps> = ({ title, items }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{title}</Text>
      
      <View style={styles.itemsContainer}>
        {items.map((item, index) => (
          <View 
            key={index} 
            style={[
              styles.infoItem,
              item.highlight && styles.infoItemHighlight,
            ]}
          >
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name={item.icon as any}
                size={20}
                color={item.highlight ? tokens.colors.primary.main : tokens.colors.text.muted}
              />
            </View>
            
            <View style={styles.textContainer}>
              <Text style={styles.label}>{item.label}</Text>
              <Text 
                style={[
                  styles.value,
                  item.highlight && styles.valueHighlight,
                ]}
              >
                {item.value}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.surface,
    padding: 16,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: tokens.colors.text.primary,
    marginBottom: 16,
  },
  itemsContainer: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: tokens.colors.screenBackground,
    borderRadius: 8,
    gap: 12,
  },
  infoItemHighlight: {
    backgroundColor: tokens.colors.primary.light,
    borderWidth: 1,
    borderColor: tokens.colors.primary.main,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: tokens.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 12,
    color: tokens.colors.text.secondary,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: tokens.colors.text.primary,
  },
  valueHighlight: {
    color: tokens.colors.primary.main,
    fontSize: 18,
    fontWeight: '700',
  },
});
