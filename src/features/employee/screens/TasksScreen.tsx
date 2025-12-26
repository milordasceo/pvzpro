import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CheckCircle2,
  Camera,
  ChevronDown,
  ChevronUp,
  Clock,
  Lock,
  ListChecks,
  Hash,
  Circle,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { theme } from '../../../shared/theme';
import { marketplaceThemes } from '../../../shared/theme/colors';
import { useTasksStore, Task } from '../model/tasks.store';
import { useShiftStore } from '../model/shift.store';
import Animated, { FadeInDown, FadeIn, Layout } from 'react-native-reanimated';

type FilterType = 'all' | 'pending' | 'completed';

export const TasksScreen = () => {
  const { tasks, setTaskPhoto, completeTask } = useTasksStore();
  const { isShiftOpen, pvz } = useShiftStore();
  const currentTheme = marketplaceThemes[pvz.marketplace] || marketplaceThemes.wb;

  const [filter, setFilter] = useState<FilterType>('all');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // Locked state when shift is closed
  if (!isShiftOpen) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          <View style={styles.lockedContainer}>
            <View style={[styles.lockedIcon, { backgroundColor: `${currentTheme.primary}10` }]}>
              <Lock size={32} color={currentTheme.primary} />
            </View>
            <Text style={styles.lockedTitle}>Смена закрыта</Text>
            <Text style={styles.lockedText}>
              Откройте смену, чтобы увидеть задачи на сегодня
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return task.status === 'pending';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  });

  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  const toggleExpand = (taskId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const handleTakePhoto = async (taskId: string, itemId?: string) => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Доступ', 'Разрешите доступ к камере');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.7,
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (!result.canceled && result.assets?.[0]) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setTaskPhoto(taskId, result.assets[0].uri, itemId);
      }
    } catch (error) {
      console.error('Camera error:', error);
    }
  };

  const handleCompleteTask = (taskId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    completeTask(taskId);
    setExpandedTaskId(null);
  };

  const getTaskProgress = (task: Task) => {
    if (!task.items) return null;
    const completed = task.items.filter(i => i.completed).length;
    return { completed, total: task.items.length };
  };

  const renderTaskIcon = (task: Task) => {
    const iconColor = task.status === 'completed' ? theme.colors.success : currentTheme.primary;
    const bgColor = task.status === 'completed' ? `${theme.colors.success}15` : `${currentTheme.primary}10`;

    return (
      <View style={[styles.taskIcon, { backgroundColor: bgColor }]}>
        {task.type === 'checklist' ? (
          <ListChecks size={20} color={iconColor} />
        ) : (
          <Hash size={20} color={iconColor} />
        )}
      </View>
    );
  };

  const renderProgressBar = (task: Task) => {
    const progress = getTaskProgress(task);
    if (!progress) return null;

    const percentage = (progress.completed / progress.total) * 100;

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View
            layout={Layout.springify()}
            style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: currentTheme.primary }]}
          />
        </View>
        <Text style={styles.progressText}>{progress.completed}/{progress.total}</Text>
      </View>
    );
  };

  const renderChecklistContent = (task: Task) => (
    <View style={styles.expandedContent}>
      {task.items?.map((item, index) => (
        <TouchableOpacity
          key={item.id}
          activeOpacity={0.7}
          onPress={() => !item.completed && handleTakePhoto(task.id, item.id)}
          style={[
            styles.checklistItem,
            item.completed && styles.checklistItemCompleted
          ]}
        >
          <View style={[
            styles.checkbox,
            item.completed && { backgroundColor: theme.colors.success, borderColor: theme.colors.success }
          ]}>
            {item.completed ? (
              <CheckCircle2 size={14} color={theme.colors.white} />
            ) : (
              <Circle size={14} color={theme.colors.text.muted} />
            )}
          </View>

          <Text style={[
            styles.checklistTitle,
            item.completed && { color: theme.colors.text.muted, textDecorationLine: 'line-through' }
          ]}>
            {item.title}
          </Text>

          {!item.completed && (
            <View style={[styles.photoIndicator, { borderColor: currentTheme.primary }]}>
              <Camera size={16} color={currentTheme.primary} />
            </View>
          )}

          {item.photoUrl && (
            <Image source={{ uri: item.photoUrl }} style={styles.photoThumb} />
          )}
        </TouchableOpacity>
      ))}

      {task.items?.every(i => i.completed) && (
        <TouchableOpacity
          style={[styles.completeButton, { backgroundColor: theme.colors.success }]}
          onPress={() => handleCompleteTask(task.id)}
        >
          <CheckCircle2 size={18} color={theme.colors.white} />
          <Text style={styles.completeButtonText}>Отправить отчёт</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderCountContent = (task: Task) => (
    <View style={styles.expandedContent}>
      <Text style={styles.taskDescription}>{task.description}</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Результат</Text>
        <TextInput
          style={styles.resultInput}
          placeholder="Введите число"
          keyboardType="numeric"
          placeholderTextColor={theme.colors.text.muted}
        />
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.photoButton, task.photoUrl && styles.photoButtonDone]}
          onPress={() => handleTakePhoto(task.id)}
        >
          {task.photoUrl ? (
            <>
              <Image source={{ uri: task.photoUrl }} style={styles.photoButtonThumb} />
              <Text style={[styles.photoButtonText, { color: theme.colors.success }]}>Фото готово</Text>
            </>
          ) : (
            <>
              <Camera size={18} color={currentTheme.primary} />
              <Text style={[styles.photoButtonText, { color: currentTheme.primary }]}>Сделать фото</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: task.photoUrl ? theme.colors.success : theme.colors.background }
          ]}
          disabled={!task.photoUrl}
          onPress={() => handleCompleteTask(task.id)}
        >
          <CheckCircle2 size={22} color={task.photoUrl ? theme.colors.white : theme.colors.text.muted} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTaskCard = (task: Task) => {
    const isExpanded = expandedTaskId === task.id;
    const isCompleted = task.status === 'completed';

    return (
      <Animated.View
        key={task.id}
        entering={FadeInDown.duration(300).delay(50)}
        layout={Layout.springify()}
        style={[
          styles.taskCard,
          isCompleted && styles.taskCardCompleted
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => !isCompleted && toggleExpand(task.id)}
          style={styles.taskHeader}
        >
          {renderTaskIcon(task)}

          <View style={styles.taskInfo}>
            <Text style={[styles.taskTitle, isCompleted && { color: theme.colors.text.muted }]}>
              {task.title}
            </Text>
            {task.deadline && !isCompleted && (
              <View style={styles.deadlineRow}>
                <Clock size={12} color={theme.colors.text.muted} />
                <Text style={styles.deadlineText}>до {task.deadline}</Text>
              </View>
            )}
            {isCompleted && task.completedAt && (
              <Text style={styles.completedText}>
                Выполнено в {new Date(task.completedAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            )}
          </View>

          {!isCompleted && (
            <>
              {renderProgressBar(task)}
              <View style={styles.expandIcon}>
                {isExpanded ? (
                  <ChevronUp size={20} color={theme.colors.text.muted} />
                ) : (
                  <ChevronDown size={20} color={theme.colors.text.muted} />
                )}
              </View>
            </>
          )}

          {isCompleted && (
            <View style={styles.completedBadge}>
              <CheckCircle2 size={20} color={theme.colors.success} />
            </View>
          )}
        </TouchableOpacity>

        {isExpanded && !isCompleted && (
          <Animated.View entering={FadeIn.duration(200)}>
            {task.type === 'checklist' ? renderChecklistContent(task) : renderCountContent(task)}
          </Animated.View>
        )}
      </Animated.View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Задачи</Text>
          <View style={styles.statsRow}>
            <View style={[styles.statBadge, { backgroundColor: `${currentTheme.primary}15` }]}>
              <Text style={[styles.statText, { color: currentTheme.primary }]}>{pendingCount} в работе</Text>
            </View>
            <View style={[styles.statBadge, { backgroundColor: `${theme.colors.success}15` }]}>
              <Text style={[styles.statText, { color: theme.colors.success }]}>{completedCount} готово</Text>
            </View>
          </View>
        </View>

        {/* Filter */}
        <View style={styles.filterContainer}>
          {(['all', 'pending', 'completed'] as FilterType[]).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterButton, filter === f && styles.filterButtonActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[
                styles.filterText,
                filter === f && { color: currentTheme.primary, fontWeight: '700' }
              ]}>
                {f === 'all' ? 'Все' : f === 'pending' ? 'В работе' : 'Готово'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tasks List */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {filteredTasks.length > 0 ? (
            filteredTasks.map(renderTaskCard)
          ) : (
            <View style={styles.emptyState}>
              <CheckCircle2 size={48} color={theme.colors.success} />
              <Text style={styles.emptyTitle}>
                {filter === 'pending' ? 'Нет активных задач' : filter === 'completed' ? 'Пока ничего не выполнено' : 'Задач нет'}
              </Text>
              <Text style={styles.emptyText}>
                {filter === 'pending' ? 'Отличная работа!' : 'Задачи появятся здесь'}
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  // Locked State
  lockedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  lockedIcon: {
    width: 80, height: 80,
    borderRadius: 40,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 24,
  },
  lockedTitle: {
    ...theme.typography.presets.h2,
    marginBottom: 8,
  },
  lockedText: {
    ...theme.typography.presets.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },

  // Header
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  headerTitle: {
    ...theme.typography.presets.h1,
    marginBottom: theme.spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statText: {
    ...theme.typography.presets.caption,
    fontWeight: '500',
  },

  // Filter
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.white,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  filterText: {
    ...theme.typography.presets.caption,
    color: theme.colors.text.muted,
  },

  // Scroll
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 40,
  },

  // Task Card
  taskCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  taskCardCompleted: {
    opacity: 0.7,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    gap: 12,
  },
  taskIcon: {
    width: 44, height: 44,
    borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    ...theme.typography.presets.body,
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  deadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  deadlineText: {
    ...theme.typography.presets.caption,
    color: theme.colors.text.muted,
  },
  completedText: {
    ...theme.typography.presets.caption,
    color: theme.colors.success,
    marginTop: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    width: 40, height: 4,
    backgroundColor: theme.colors.background,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    ...theme.typography.presets.caption,
    color: theme.colors.text.muted,
    fontSize: 11,
  },
  expandIcon: {
    width: 32, height: 32,
    alignItems: 'center', justifyContent: 'center',
  },
  completedBadge: {
    width: 32, height: 32,
    alignItems: 'center', justifyContent: 'center',
  },

  // Expanded Content
  expandedContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  taskDescription: {
    ...theme.typography.presets.bodySmall,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },

  // Checklist
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  checklistItemCompleted: {
    backgroundColor: `${theme.colors.success}08`,
  },
  checkbox: {
    width: 24, height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border.DEFAULT,
    alignItems: 'center', justifyContent: 'center',
  },
  checklistTitle: {
    ...theme.typography.presets.body,
    flex: 1,
  },
  photoIndicator: {
    width: 36, height: 36,
    borderRadius: 10,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center',
  },
  photoThumb: {
    width: 36, height: 36,
    borderRadius: 10,
  },

  // Count Task
  inputContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    ...theme.typography.presets.caption,
    color: theme.colors.text.muted,
    marginBottom: 4,
  },
  resultInput: {
    ...theme.typography.presets.h3,
    color: theme.colors.text.primary,
    padding: 0,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  photoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 14,
    backgroundColor: theme.colors.background,
  },
  photoButtonDone: {
    backgroundColor: `${theme.colors.success}10`,
  },
  photoButtonText: {
    ...theme.typography.presets.label,
  },
  photoButtonThumb: {
    width: 28, height: 28,
    borderRadius: 8,
  },
  submitButton: {
    width: 48, height: 48,
    borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 14,
    marginTop: 8,
  },
  completeButtonText: {
    ...theme.typography.presets.label,
    color: theme.colors.white,
    fontWeight: '700',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    ...theme.typography.presets.h4,
    marginTop: theme.spacing.lg,
    marginBottom: 4,
  },
  emptyText: {
    ...theme.typography.presets.body,
    color: theme.colors.text.muted,
  },
});
