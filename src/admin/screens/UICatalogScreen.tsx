/**
 * 🎨 UI Catalog Screen - Визуальный каталог UI системы
 * 
 * Демонстрирует все компоненты, цвета, отступы и другие элементы UI системы
 * Полезно для разработки и проверки консистентности дизайна
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Badge, Chip, Avatar, ActivityIndicator, Divider, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { tokens, SearchInput, StatusBadge, EmptyState, LoadingState, ErrorState } from '../../ui';
import { StyledCard } from '../../components/StyledCard';
import { StyledButton } from '../../components/StyledButton';
import { AnimatedTabBar } from '../../components/AnimatedTabBar';
import { SquareIconButton } from '../../components/SquareIconButton';

type CatalogTab = 'colors' | 'spacing' | 'typography' | 'components';

const TABS = [
  { key: 'colors' as const, label: '🎨 Цвета' },
  { key: 'spacing' as const, label: '📏 Отступы' },
  { key: 'typography' as const, label: '✏️ Типографика' },
  { key: 'components' as const, label: '🧩 Компоненты' },
];

export const UICatalogScreen = () => {
  const [activeTab, setActiveTab] = useState<CatalogTab>('colors');
  const [searchQuery, setSearchQuery] = useState('');

  const handleTabPress = (index: number) => {
    setActiveTab(TABS[index].key);
  };

  const activeTabIndex = TABS.findIndex(tab => tab.key === activeTab);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.headerTitle}>
          UI Catalog
        </Text>
        <Text variant="bodyMedium" style={styles.headerSubtitle}>
          Визуальный каталог системы дизайна
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <AnimatedTabBar
          tabs={TABS}
          activeIndex={activeTabIndex}
          onTabPress={handleTabPress}
        />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'colors' && <ColorsSection />}
        {activeTab === 'spacing' && <SpacingSection />}
        {activeTab === 'typography' && <TypographySection />}
        {activeTab === 'components' && <ComponentsSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
      </ScrollView>
    </View>
  );
};

// ==================== Секция: Цвета ====================

const ColorsSection = () => (
  <View style={styles.section}>
    {/* Primary */}
    <SectionHeader title="Primary Colors" />
    <View style={styles.colorGrid}>
      {Object.entries(tokens.colors.primary).map(([key, color]) => (
        <ColorSwatch key={key} label={key} color={color} />
      ))}
    </View>

    <Divider style={styles.divider} />

    {/* Gray */}
    <SectionHeader title="Gray Colors" />
    <View style={styles.colorGrid}>
      {Object.entries(tokens.colors.gray).map(([key, color]) => (
        <ColorSwatch key={key} label={key} color={color} />
      ))}
    </View>

    <Divider style={styles.divider} />

    {/* Status */}
    <SectionHeader title="Status Colors (Оптимизировано: по 2 оттенка)" />
    <Text variant="bodySmall" style={[styles.hint, { marginBottom: tokens.spacing.sm }]}>
      ✅ Success (Зелёный) - "На смене", успех, подтверждения
    </Text>
    <View style={styles.colorRow}>
      <ColorSwatch label="light" color={tokens.colors.success.light} />
      <ColorSwatch label="main ⭐" color={tokens.colors.success.main} />
    </View>

    <Text variant="bodySmall" style={[styles.hint, { marginTop: tokens.spacing.md, marginBottom: tokens.spacing.sm }]}>
      ⚠️ Warning (Жёлтый) - "Опоздание", требует внимания
    </Text>
    <View style={styles.colorRow}>
      <ColorSwatch label="light" color={tokens.colors.warning.light} />
      <ColorSwatch label="main ⭐" color={tokens.colors.warning.main} />
    </View>

    <Text variant="bodySmall" style={[styles.hint, { marginTop: tokens.spacing.md, marginBottom: tokens.spacing.sm }]}>
      ❌ Error (Красный) - ошибки, удаление, критично
    </Text>
    <View style={styles.colorRow}>
      <ColorSwatch label="light" color={tokens.colors.error.light} />
      <ColorSwatch label="main ⭐" color={tokens.colors.error.main} />
    </View>

    <Divider style={styles.divider} />

    {/* Semantic */}
    <SectionHeader title="Semantic Colors" />
    <View style={styles.colorRow}>
      <ColorSwatch label="Background" color={tokens.colors.background} />
      <ColorSwatch label="Surface" color={tokens.colors.surface} />
      <ColorSwatch label="Border" color={tokens.colors.border} />
      <ColorSwatch label="Divider" color={tokens.colors.divider} />
    </View>

    <Divider style={styles.divider} />

    {/* Text */}
    <SectionHeader title="Text Colors" />
    <View style={styles.colorRow}>
      <ColorSwatch label="Primary" color={tokens.colors.text.primary} />
      <ColorSwatch label="Secondary" color={tokens.colors.text.secondary} />
      <ColorSwatch label="Muted" color={tokens.colors.text.muted} />
      <ColorSwatch label="Disabled" color={tokens.colors.text.disabled} />
    </View>
  </View>
);

// ==================== Секция: Отступы ====================

const SpacingSection = () => (
  <View style={styles.section}>
    {/* Spacing */}
    <SectionHeader title="Spacing Scale" />
    <View style={styles.spacingList}>
      {Object.entries(tokens.spacing).slice(0, 7).map(([key, value]) => (
        <SpacingSwatch key={key} label={key} value={value} />
      ))}
    </View>

    <Divider style={styles.divider} />

    {/* Radius */}
    <SectionHeader title="Border Radius" />
    <View style={styles.radiusList}>
      {Object.entries(tokens.radius).slice(0, 8).map(([key, value]) => (
        <RadiusSwatch key={key} label={key} value={value} />
      ))}
    </View>

    <Divider style={styles.divider} />

    {/* Heights */}
    <SectionHeader title="Component Heights" />
    <View style={styles.heightsList}>
      <HeightSwatch label="Control" value={tokens.spacing.controlHeight} />
      <HeightSwatch label="Button" value={tokens.spacing.buttonHeight} />
      <HeightSwatch label="Input" value={tokens.spacing.inputHeight} />
      <HeightSwatch label="TabBar" value={tokens.spacing.tabBarHeight} />
      <HeightSwatch label="Header" value={tokens.spacing.headerHeight} />
    </View>
  </View>
);

// ==================== Секция: Типографика ====================

const TypographySection = () => (
  <View style={styles.section}>
    <SectionHeader title="Paper Text Variants" />
    
    <StyledCard style={styles.typographyCard}>
      <Text variant="displayLarge">Display Large</Text>
      <Text variant="displayMedium">Display Medium</Text>
      <Text variant="displaySmall">Display Small</Text>
    </StyledCard>

    <StyledCard style={styles.typographyCard}>
      <Text variant="headlineLarge">Headline Large (H1)</Text>
      <Text variant="headlineMedium">Headline Medium (H2)</Text>
      <Text variant="headlineSmall">Headline Small (H3)</Text>
    </StyledCard>

    <StyledCard style={styles.typographyCard}>
      <Text variant="titleLarge">Title Large</Text>
      <Text variant="titleMedium">Title Medium</Text>
      <Text variant="titleSmall">Title Small</Text>
    </StyledCard>

    <StyledCard style={styles.typographyCard}>
      <Text variant="bodyLarge">Body Large - Lorem ipsum dolor sit amet</Text>
      <Text variant="bodyMedium">Body Medium - Lorem ipsum dolor sit amet</Text>
      <Text variant="bodySmall">Body Small - Lorem ipsum dolor sit amet</Text>
    </StyledCard>

    <StyledCard style={styles.typographyCard}>
      <Text variant="labelLarge">Label Large</Text>
      <Text variant="labelMedium">Label Medium</Text>
      <Text variant="labelSmall">Label Small</Text>
    </StyledCard>

    <Divider style={styles.divider} />

    <SectionHeader title="Font Sizes & Weights" />
    <StyledCard style={styles.typographyCard}>
      <View style={styles.fontSizeRow}>
        <Text style={{ fontSize: tokens.fontSize.xs }}>XS (12px)</Text>
        <Text style={{ fontSize: tokens.fontSize.sm }}>SM (14px)</Text>
        <Text style={{ fontSize: tokens.fontSize.md }}>MD (16px)</Text>
        <Text style={{ fontSize: tokens.fontSize.lg }}>LG (18px)</Text>
      </View>
      <View style={styles.fontWeightRow}>
        <Text style={{ fontWeight: tokens.fontWeight.regular }}>Regular</Text>
        <Text style={{ fontWeight: tokens.fontWeight.medium }}>Medium</Text>
        <Text style={{ fontWeight: tokens.fontWeight.semibold }}>Semibold</Text>
        <Text style={{ fontWeight: tokens.fontWeight.bold }}>Bold</Text>
      </View>
    </StyledCard>
  </View>
);

// ==================== Секция: Компоненты ====================

const ComponentsSection = ({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (q: string) => void }) => (
  <View style={styles.section}>
    {/* SearchInput */}
    <SectionHeader title="SearchInput" />
    <SearchInput
      value={searchQuery}
      onChangeText={setSearchQuery}
      placeholder="Поиск компонентов..."
    />

    <Divider style={styles.divider} />

    {/* StatusBadge */}
    <SectionHeader title="StatusBadge" />
    <View style={styles.badgeRow}>
      <StatusBadge status="success">На смене</StatusBadge>
      <StatusBadge status="warning">Опоздание</StatusBadge>
      <StatusBadge status="error">Неактивен</StatusBadge>
      <StatusBadge status="info">В пути</StatusBadge>
      <StatusBadge status="neutral">Нейтральный</StatusBadge>
    </View>
    <Text variant="bodySmall" style={styles.hint}>Размеры:</Text>
    <View style={styles.badgeRow}>
      <StatusBadge status="success" size="small">Small</StatusBadge>
      <StatusBadge status="success" size="medium">Medium</StatusBadge>
      <StatusBadge status="success" size="large">Large</StatusBadge>
    </View>

    <Divider style={styles.divider} />

    {/* Paper Badges */}
    <SectionHeader title="Paper Badge" />
    <View style={styles.badgeRow}>
      <Badge size={20}>5</Badge>
      <Badge size={24}>12</Badge>
      <Badge size={28}>99+</Badge>
    </View>

    <Divider style={styles.divider} />

    {/* Paper Chips */}
    <SectionHeader title="Paper Chip" />
    <View style={styles.badgeRow}>
      <Chip icon="information">Info Chip</Chip>
      <Chip mode="outlined" onPress={() => {}}>Outlined</Chip>
      <Chip onClose={() => {}}>Closable</Chip>
    </View>

    <Divider style={styles.divider} />

    {/* Avatars */}
    <SectionHeader title="Paper Avatar" />
    <View style={styles.badgeRow}>
      <Avatar.Text size={32} label="АБ" />
      <Avatar.Text size={40} label="ИВ" />
      <Avatar.Text size={48} label="МП" />
      <Avatar.Icon size={40} icon="account" />
    </View>

    <Divider style={styles.divider} />

    {/* Buttons */}
    <SectionHeader title="StyledButton" />
    <View style={styles.buttonColumn}>
      <StyledButton mode="contained" onPress={() => {}}>Contained Button</StyledButton>
      <StyledButton mode="outlined" onPress={() => {}}>Outlined Button</StyledButton>
      <StyledButton mode="text" onPress={() => {}}>Text Button</StyledButton>
      <StyledButton mode="contained" icon="plus" onPress={() => {}}>With Icon</StyledButton>
    </View>

    <Divider style={styles.divider} />

    {/* SquareIconButton */}
    <SectionHeader title="SquareIconButton" />
    <View style={styles.badgeRow}>
      <SquareIconButton icon="plus" onPress={() => {}} />
      <SquareIconButton icon="pencil" onPress={() => {}} bg={tokens.colors.primary.dark} />
      <SquareIconButton icon="delete" onPress={() => {}} bg={tokens.colors.error.main} />
      <SquareIconButton icon="eye" onPress={() => {}} bg={tokens.colors.success.main} />
    </View>

    <Divider style={styles.divider} />

    {/* ActivityIndicator */}
    <SectionHeader title="ActivityIndicator" />
    <View style={styles.badgeRow}>
      <ActivityIndicator size="small" color={tokens.colors.primary.main} />
      <ActivityIndicator size="large" color={tokens.colors.primary.main} />
    </View>

    <Divider style={styles.divider} />

    {/* State Components */}
    <SectionHeader title="EmptyState" />
    <StyledCard style={{ minHeight: 200 }}>
      <EmptyState
        icon="magnify"
        title="Ничего не найдено"
        description="Попробуйте изменить параметры поиска"
        action={{
          label: 'Очистить поиск',
          onPress: () => {},
          icon: 'close',
        }}
      />
    </StyledCard>

    <Divider style={styles.divider} />

    <SectionHeader title="LoadingState" />
    <StyledCard style={{ minHeight: 150 }}>
      <LoadingState text="Загрузка данных..." />
    </StyledCard>

    <Divider style={styles.divider} />

    <SectionHeader title="ErrorState" />
    <StyledCard style={{ minHeight: 200 }}>
      <ErrorState
        title="Ошибка загрузки"
        message="Не удалось загрузить данные. Проверьте подключение к интернету."
        onRetry={() => {}}
      />
    </StyledCard>

    <Divider style={styles.divider} />

    {/* Cards */}
    <SectionHeader title="StyledCard" />
    <StyledCard>
      <Text variant="titleMedium">Card Title</Text>
      <Text variant="bodyMedium">This is a styled card component with default styling.</Text>
    </StyledCard>

    <Divider style={styles.divider} />

    {/* Surface */}
    <SectionHeader title="Paper Surface (Elevation)" />
    <View style={styles.surfaceRow}>
      <Surface style={styles.surface} elevation={0}>
        <Text variant="labelSmall">elevation 0</Text>
      </Surface>
      <Surface style={styles.surface} elevation={1}>
        <Text variant="labelSmall">elevation 1</Text>
      </Surface>
      <Surface style={styles.surface} elevation={2}>
        <Text variant="labelSmall">elevation 2</Text>
      </Surface>
      <Surface style={styles.surface} elevation={4}>
        <Text variant="labelSmall">elevation 4</Text>
      </Surface>
    </View>
  </View>
);

// ==================== Вспомогательные компоненты ====================

const SectionHeader = ({ title }: { title: string }) => (
  <Text variant="titleMedium" style={styles.sectionTitle}>
    {title}
  </Text>
);

const ColorSwatch = ({ label, color }: { label: string; color: string }) => (
  <View style={styles.colorSwatch}>
    <View style={[styles.colorBox, { backgroundColor: color }]} />
    <Text variant="labelSmall" style={styles.colorLabel}>{label}</Text>
    <Text variant="labelSmall" style={styles.colorValue}>{color}</Text>
  </View>
);

const SpacingSwatch = ({ label, value }: { label: string; value: number }) => (
  <View style={styles.spacingSwatch}>
    <View style={styles.spacingInfo}>
      <Text variant="labelMedium">{label}</Text>
      <Text variant="labelSmall" style={styles.spacingValue}>{value}px</Text>
    </View>
    <View style={[styles.spacingBox, { width: value, height: value }]} />
  </View>
);

const RadiusSwatch = ({ label, value }: { label: string; value: number }) => (
  <View style={styles.radiusSwatch}>
    <View style={styles.spacingInfo}>
      <Text variant="labelMedium">{label}</Text>
      <Text variant="labelSmall" style={styles.spacingValue}>{value}px</Text>
    </View>
    <View style={[styles.radiusBox, { borderRadius: value }]} />
  </View>
);

const HeightSwatch = ({ label, value }: { label: string; value: number }) => (
  <View style={styles.heightSwatch}>
    <Text variant="labelMedium">{label}</Text>
    <View style={[styles.heightBox, { height: value }]}>
      <Text variant="labelSmall" style={styles.heightValue}>{value}px</Text>
    </View>
  </View>
);

// ==================== Стили ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },

  header: {
    padding: tokens.spacing.lg,
    backgroundColor: tokens.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },

  headerTitle: {
    color: tokens.colors.text.primary,
    fontWeight: tokens.fontWeight.bold,
  },

  headerSubtitle: {
    color: tokens.colors.text.secondary,
    marginTop: tokens.spacing.xs,
  },

  tabsContainer: {
    backgroundColor: tokens.colors.surface,
    paddingHorizontal: tokens.spacing.lg,
    paddingBottom: tokens.spacing.sm,
  },

  content: {
    flex: 1,
  },

  section: {
    padding: tokens.spacing.lg,
  },

  sectionTitle: {
    marginBottom: tokens.spacing.md,
    color: tokens.colors.text.primary,
    fontWeight: tokens.fontWeight.semibold,
  },

  divider: {
    marginVertical: tokens.spacing.xl,
  },

  // Colors
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.md,
  },

  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.md,
  },

  colorSwatch: {
    width: 80,
    alignItems: 'center',
    gap: tokens.spacing.xs,
  },

  colorBox: {
    width: 60,
    height: 60,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },

  colorLabel: {
    color: tokens.colors.text.primary,
    fontWeight: tokens.fontWeight.medium,
  },

  colorValue: {
    color: tokens.colors.text.muted,
  },

  // Spacing
  spacingList: {
    gap: tokens.spacing.md,
  },

  spacingSwatch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: tokens.colors.surface,
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },

  spacingInfo: {
    flex: 1,
  },

  spacingValue: {
    color: tokens.colors.text.muted,
    marginTop: tokens.spacing.xs,
  },

  spacingBox: {
    backgroundColor: tokens.colors.primary.main,
    borderRadius: tokens.radius.xs,
  },

  // Radius
  radiusList: {
    gap: tokens.spacing.md,
  },

  radiusSwatch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: tokens.colors.surface,
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },

  radiusBox: {
    width: 48,
    height: 48,
    backgroundColor: tokens.colors.primary.main,
  },

  // Heights
  heightsList: {
    gap: tokens.spacing.md,
  },

  heightSwatch: {
    gap: tokens.spacing.sm,
  },

  heightBox: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.md,
    borderWidth: 2,
    borderColor: tokens.colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },

  heightValue: {
    color: tokens.colors.primary.main,
    fontWeight: tokens.fontWeight.semibold,
  },

  // Typography
  typographyCard: {
    marginBottom: tokens.spacing.md,
    gap: tokens.spacing.sm,
  },

  fontSizeRow: {
    flexDirection: 'row',
    gap: tokens.spacing.lg,
    flexWrap: 'wrap',
  },

  fontWeightRow: {
    flexDirection: 'row',
    gap: tokens.spacing.lg,
    flexWrap: 'wrap',
    marginTop: tokens.spacing.md,
  },

  // Components
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.md,
    alignItems: 'center',
  },

  hint: {
    color: tokens.colors.text.muted,
    marginTop: tokens.spacing.md,
    marginBottom: tokens.spacing.xs,
  },

  buttonColumn: {
    gap: tokens.spacing.md,
  },

  surfaceRow: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
    flexWrap: 'wrap',
  },

  surface: {
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    minHeight: 60,
  },
});

