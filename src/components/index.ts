/**
 * ⚠️ DEPRECATED - Файл обратной совместимости
 * 
 * Этот файл предоставляет обратную совместимость со старыми импортами.
 * 
 * СТАРЫЙ импорт (deprecated):
 * import { StyledCard } from '../components';
 * 
 * НОВЫЙ импорт (рекомендуется):
 * import { Card } from '../ui';
 * 
 * Этот файл будет удален в будущих версиях.
 * Пожалуйста, обновите ваши импорты на новые.
 */

// Реэкспорт из новой UI системы со старыми именами
export { 
  Card as StyledCard,
  type CardProps as StyledCardProps,
} from '../ui/components/layout/Card';

export { 
  Button as StyledButton,
  type ButtonProps as StyledButtonProps,
} from '../ui/components/buttons/Button';

export { 
  ScrollView as StyledScrollView,
  type ScrollViewProps as StyledScrollViewProps,
} from '../ui/components/layout/ScrollView';

export { 
  Dialog as StyledDialog,
  type DialogProps as StyledDialogProps,
} from '../ui/components/overlays/Dialog';

export { 
  IconButton as SquareIconButton,
  type IconButtonProps as SquareIconButtonProps,
} from '../ui/components/buttons/IconButton';

export { 
  MetaRow,
  type MetaRowProps,
  safeDate,
} from '../ui/components/display/MetaRow';

export { 
  SelectModal,
  type SelectModalProps,
  type SelectOption,
} from '../ui/components/inputs/SelectModal';

export { 
  AnimatedTabBar,
  AnimatedTab,
} from '../ui/components/navigation';

export { 
  DevUICatalogFAB,
  type UICatalogFABProps as DevUICatalogFABProps,
} from '../ui/components/dev';
