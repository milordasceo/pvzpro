/**
 * ✏️ Типографика приложения
 * 
 * Используется совместно с Paper Typography variants
 * Paper Text variants: displayLarge, displayMedium, displaySmall,
 * headlineLarge, headlineMedium, headlineSmall,
 * titleLarge, titleMedium, titleSmall,
 * bodyLarge, bodyMedium, bodySmall,
 * labelLarge, labelMedium, labelSmall
 */

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
} as const;

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
} as const;

export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

/**
 * Маппинг на Paper Typography variants
 * Используй эти варианты для Text компонента из react-native-paper
 */
export const paperVariants = {
  // Display (Hero text)
  hero: 'displayLarge' as const,        // ~57px
  displayLarge: 'displayLarge' as const,
  displayMedium: 'displayMedium' as const,
  displaySmall: 'displaySmall' as const,

  // Headings
  h1: 'headlineLarge' as const,         // ~32px
  h2: 'headlineMedium' as const,        // ~28px
  h3: 'headlineSmall' as const,         // ~24px

  // Titles
  titleLarge: 'titleLarge' as const,    // ~22px
  title: 'titleMedium' as const,        // ~16px
  titleSmall: 'titleSmall' as const,    // ~14px

  // Body (основной текст)
  bodyLarge: 'bodyLarge' as const,      // ~16px
  body: 'bodyMedium' as const,          // ~14px (основной)
  bodySmall: 'bodySmall' as const,      // ~12px

  // Labels
  labelLarge: 'labelLarge' as const,    // ~14px
  label: 'labelMedium' as const,        // ~12px
  labelSmall: 'labelSmall' as const,    // ~11px
} as const;

/**
 * Типографические пресеты для частых паттернов
 * Используются в новых компонентах Heading, Title, Body, Label, Caption
 */
export const textPresets = {
  // Headings
  heading1: {
    variant: 'headlineLarge' as const,
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
  },
  heading2: {
    variant: 'headlineMedium' as const,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.semibold,
  },
  heading3: {
    variant: 'headlineSmall' as const,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
  },

  // Titles (заголовки карточек/секций)
  sectionTitle: {
    variant: 'titleLarge' as const,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  cardTitle: {
    variant: 'titleMedium' as const,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  subtitle: {
    variant: 'titleSmall' as const,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },

  // Body (основной текст)
  bodyPrimary: {
    variant: 'bodyMedium' as const,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
  },
  bodySecondary: {
    variant: 'bodyMedium' as const,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
  },
  bodySmallText: {
    variant: 'bodySmall' as const,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
  },

  // Labels
  label: {
    variant: 'labelMedium' as const,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  caption: {
    variant: 'bodySmall' as const,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
  },

  // Meta (время, даты, вспомогательная информация)
  meta: {
    variant: 'labelSmall' as const,
    fontSize: 11,
    fontWeight: fontWeight.regular,
  },
} as const;

export type FontSize = typeof fontSize;
export type FontWeight = typeof fontWeight;
export type PaperVariant = typeof paperVariants[keyof typeof paperVariants];

