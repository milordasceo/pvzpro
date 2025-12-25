import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle2, Camera, LayoutList, ClipboardCheck, History, Info, Lock, RefreshCcw } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../../../shared/theme';
import { marketplaceThemes } from '../../../shared/theme/colors';
import { useTasksStore, Task } from '../model/tasks.store';
import { useShiftStore } from '../model/shift.store';
import Animated, { FadeInDown } from 'react-native-reanimated';

export const TasksScreen = () => {
  const { tasks, setTaskPhoto, completeTask, resetTasks } = useTasksStore();
  const { isShiftOpen, pvz } = useShiftStore();
  const [activeTab, setActiveTab] = React.useState<'checklists' | 'tasks'>('checklists');

  const currentTheme = marketplaceThemes[pvz.marketplace] || marketplaceThemes.wb;

  const handleReset = () => {
    Alert.alert(
      'Сброс сессии',
      'Вы уверены, что хотите сбросить все задачи и очистить историю за сегодня? Это полезно для тестирования.',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Да, сбросить', 
          style: 'destructive',
          onPress: () => resetTasks()
        }
      ]
    );
  };

  if (!isShiftOpen) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <StatusBar barStyle="light-content" backgroundColor={currentTheme.primary} translucent />
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 200, backgroundColor: currentTheme.bg }} />
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
            <View style={{ width: 80, height: 80, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 24, shadowColor: currentTheme.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 }}>
              <Lock size={32} color={currentTheme.primary} strokeWidth={2.5} />
            </View>
            <Text style={{ ...theme.typography.presets.h2, color: theme.colors.text.primary, marginBottom: 12 }}>Доступ закрыт</Text>
            <Text style={{ ...theme.typography.presets.body, textAlign: 'center', color: theme.colors.text.secondary, paddingHorizontal: 40, lineHeight: 22 }}>
              Чтобы увидеть список задач и приступить к работе, необходимо сначала открыть смену на главном экране.
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const activeChecklists = tasks.filter(t => t.type === 'checklist' && t.status === 'pending');
  const activeCustomTasks = tasks.filter(t => t.type === 'custom' && t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  const handleTakePhoto = async (taskId: string, itemId?: string) => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Доступ', 'Разрешите доступ к камере для фото-отчетов.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({ quality: 0.5 });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setTaskPhoto(taskId, result.assets[0].uri, itemId);
      }
    } catch (error) {
      console.error('Camera error:', error);
    }
  };

  const renderProgress = (task: Task) => {
    if (!task.items) return null;
    const completed = task.items.filter(i => i.completed).length;
    const total = task.items.length;
    const percentage = (completed / total) * 100;

    return (
      <View style={{ marginTop: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
          <Text style={{ ...theme.typography.presets.caption, color: theme.colors.text.secondary }}>ПРОГРЕСС</Text>
          <Text style={{ ...theme.typography.presets.label, color: currentTheme.primary }}>{completed}/{total}</Text>
        </View>
        <View style={{ height: 6, backgroundColor: theme.colors.background, borderRadius: 100, overflow: 'hidden' }}>
          <View style={{ height: '100%', backgroundColor: currentTheme.primary, width: `${percentage}%` }} />
        </View>
      </View>
    );
  };

  const renderChecklist = (task: Task) => {
    const isAllPhotosTaken = task.items?.every(i => i.photoUrl);

    return (
      <View key={task.id} style={{ backgroundColor: theme.colors.white, padding: 16, borderRadius: 24, marginBottom: 16, borderWidth: 1, borderColor: theme.colors.border.DEFAULT, shadowColor: theme.colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 40, height: 40, backgroundColor: `${currentTheme.primary}10`, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
            <LayoutList size={20} color={currentTheme.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ ...theme.typography.presets.h4, color: theme.colors.text.primary }}>{task.title}</Text>
            {task.description && <Text style={{ ...theme.typography.presets.bodySmall, color: theme.colors.text.secondary, marginTop: 2 }}>{task.description}</Text>}
          </View>
        </View>

        {renderProgress(task)}

        <View style={{ marginTop: 16, gap: 8 }}>
          {task.items?.map((item) => (
            <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: theme.colors.background, padding: 10, borderRadius: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 }}>
                <View style={{ width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: item.completed ? theme.colors.success : theme.colors.white, borderWidth: item.completed ? 0 : 2, borderColor: theme.colors.border.DEFAULT }}>
                  {item.completed && <CheckCircle2 size={14} color="white" strokeWidth={4} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ ...theme.typography.presets.body, color: item.completed ? theme.colors.text.muted : theme.colors.text.primary }}>{item.title}</Text>
                  {!item.completed && <Text style={{ ...theme.typography.presets.caption, color: currentTheme.primary, fontSize: 10 }}>НУЖНО ФОТО</Text>}
                </View>
              </View>
              
              <TouchableOpacity 
                onPress={() => handleTakePhoto(task.id, item.id)}
                activeOpacity={0.7}
                style={{ width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.white, borderWidth: 1, borderColor: item.photoUrl ? theme.colors.success : theme.colors.border.DEFAULT }}
              >
                {item.photoUrl ? <Image source={{ uri: item.photoUrl }} style={{ width: '100%', height: '100%', borderRadius: 11 }} /> : <Camera size={18} color={currentTheme.primary} />}
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity 
          disabled={!isAllPhotosTaken}
          onPress={() => completeTask(task.id)}
          style={{ marginTop: 16, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: isAllPhotosTaken ? currentTheme.primary : theme.colors.background, flexDirection: 'row', gap: 8 }}
        >
          {isAllPhotosTaken && <CheckCircle2 size={18} color="white" strokeWidth={3} />}
          <Text style={{ ...theme.typography.presets.label, color: isAllPhotosTaken ? theme.colors.white : theme.colors.text.muted }}>
            {isAllPhotosTaken ? 'ОТПРАВИТЬ ОТЧЕТ' : 'СНАЧАЛА ВСЕ ФОТО'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCustomTask = (task: Task) => (
    <View key={task.id} style={{ backgroundColor: theme.colors.white, padding: 16, borderRadius: 24, marginBottom: 16, borderWidth: 1, borderColor: theme.colors.border.DEFAULT, shadowColor: theme.colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <View style={{ width: 40, height: 40, backgroundColor: `${theme.colors.warning}10`, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
          <ClipboardCheck size={20} color={theme.colors.warning} />
        </View>
        <Text style={{ ...theme.typography.presets.h4, color: theme.colors.text.primary, flex: 1 }}>{task.title}</Text>
      </View>

      {task.description && <Text style={{ ...theme.typography.presets.bodySmall, color: theme.colors.text.secondary, marginBottom: 12 }}>{task.description}</Text>}

      <View style={{ backgroundColor: theme.colors.background, borderRadius: 16, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: theme.colors.border.light }}>
        <Text style={{ ...theme.typography.presets.caption, color: theme.colors.text.secondary, marginBottom: 4 }}>ВВЕДИТЕ РЕЗУЛЬТАТ</Text>
        <TextInput placeholder="Напр: 150" style={{ color: theme.colors.text.primary, fontWeight: '700', fontSize: 24, padding: 0 }} keyboardType="numeric" placeholderTextColor={theme.colors.text.muted} />
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TouchableOpacity onPress={() => handleTakePhoto(task.id)} style={{ flex: 1, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, borderWidth: 1, borderColor: theme.colors.border.DEFAULT, backgroundColor: theme.colors.background }}>
          {task.photoUrl ? (
            <><View style={{ width: 24, height: 24, borderRadius: 6, overflow: 'hidden' }}><Image source={{ uri: task.photoUrl }} style={{ width: '100%', height: '100%' }} /></View><Text style={{ ...theme.typography.presets.label, color: theme.colors.success }}>ФОТО ЕСТЬ</Text></>
          ) : (
            <><Camera size={16} color={currentTheme.primary} /><Text style={{ ...theme.typography.presets.label, color: currentTheme.primary }}>СДЕЛАТЬ ФОТО</Text></>
          )}
        </TouchableOpacity>
        <TouchableOpacity disabled={!task.photoUrl} onPress={() => completeTask(task.id)} style={{ width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: task.photoUrl ? theme.colors.success : theme.colors.background }}>
          <CheckCircle2 size={22} color={task.photoUrl ? theme.colors.white : theme.colors.text.muted} strokeWidth={3} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} translucent />
      
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.white }} edges={['top']}>
        {/* Header */}
        <View style={{ 
          paddingHorizontal: theme.spacing.md, 
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border.light
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <View>
              <Text style={{ ...theme.typography.presets.h4, color: theme.colors.text.primary }}>Задачи</Text>
              <Text style={{ ...theme.typography.presets.caption, color: theme.colors.text.muted, fontSize: 10 }}>ПЛАН НА ТЕКУЩУЮ СМЕНУ</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity onPress={handleReset} style={{ width: 36, height: 36, backgroundColor: theme.colors.background, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                <RefreshCcw size={16} color={currentTheme.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={{ width: 36, height: 36, backgroundColor: theme.colors.background, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                <Info size={18} color={currentTheme.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Tab Switcher */}
          <View style={{ flexDirection: 'row', backgroundColor: theme.colors.background, padding: 4, borderRadius: 16 }}>
            <TouchableOpacity onPress={() => setActiveTab('checklists')} style={{ flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 12, backgroundColor: activeTab === 'checklists' ? theme.colors.white : 'transparent', ... (activeTab === 'checklists' ? theme.shadows.sm : {}) }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <LayoutList size={14} color={activeTab === 'checklists' ? currentTheme.primary : theme.colors.text.muted} />
                <Text style={{ ...theme.typography.presets.caption, color: activeTab === 'checklists' ? currentTheme.primary : theme.colors.text.muted }}>ЧЕК-ЛИСТЫ</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('tasks')} style={{ flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 12, backgroundColor: activeTab === 'tasks' ? theme.colors.white : 'transparent', ... (activeTab === 'tasks' ? theme.shadows.sm : {}) }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <ClipboardCheck size={14} color={activeTab === 'tasks' ? theme.colors.warning : theme.colors.text.muted} />
                <Text style={{ ...theme.typography.presets.caption, color: activeTab === 'tasks' ? theme.colors.warning : theme.colors.text.muted }}>ЗАДАЧИ</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40, backgroundColor: theme.colors.background }} showsVerticalScrollIndicator={false}>
          {activeTab === 'checklists' ? (
            activeChecklists.length > 0 ? (
              <Animated.View entering={FadeInDown.duration(400)}>
                {activeChecklists.map(renderChecklist)}
              </Animated.View>
            ) : (
              <View style={{ backgroundColor: theme.colors.white, padding: 32, borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderStyle: 'dashed', borderColor: theme.colors.border.DEFAULT }}>
                <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: `${theme.colors.success}10`, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <CheckCircle2 size={32} color={theme.colors.success} />
                </View>
                <Text style={{ ...theme.typography.presets.h4, color: theme.colors.text.primary }}>Все чек-листы выполнены!</Text>
                <Text style={{ ...theme.typography.presets.bodySmall, color: theme.colors.text.secondary, marginTop: 4 }}>Отличная работа!</Text>
              </View>
            )
          ) : (
            activeCustomTasks.length > 0 ? (
              <Animated.View entering={FadeInDown.duration(400)}>
                {activeCustomTasks.map(renderCustomTask)}
              </Animated.View>
            ) : (
              <View style={{ backgroundColor: theme.colors.white, padding: 32, borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderStyle: 'dashed', borderColor: theme.colors.border.DEFAULT }}>
                <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: `${theme.colors.warning}10`, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <ClipboardCheck size={32} color={theme.colors.warning} />
                </View>
                <Text style={{ ...theme.typography.presets.h4, color: theme.colors.text.primary }}>Новых задач нет!</Text>
                <Text style={{ ...theme.typography.presets.bodySmall, color: theme.colors.text.secondary, marginTop: 4 }}>Пока всё спокойно</Text>
              </View>
            )
          )}

          {completedTasks.length > 0 && (
            <View style={{ marginTop: 24 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12, marginLeft: 4 }}>
                <History size={14} color={theme.colors.text.muted} />
                <Text style={{ ...theme.typography.presets.caption, color: theme.colors.text.muted }}>ИСТОРИЯ ВЫПОЛНЕНИЯ</Text>
              </View>
              <View style={{ backgroundColor: theme.colors.white, borderRadius: 20, borderWidth: 1, borderColor: theme.colors.border.DEFAULT, overflow: 'hidden' }}>
                {completedTasks.map((task, idx) => (
                  <View key={task.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderBottomWidth: idx !== completedTasks.length - 1 ? 1 : 0, borderBottomColor: theme.colors.background }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: task.type === 'checklist' ? currentTheme.primary : theme.colors.warning }} />
                      <Text style={{ ...theme.typography.presets.body, color: theme.colors.text.primary }}>{task.title}</Text>
                    </View>
                    <View style={{ backgroundColor: theme.colors.background, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                      <Text style={{ ...theme.typography.presets.label, color: theme.colors.text.secondary }}>{task.completedAt ? new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
