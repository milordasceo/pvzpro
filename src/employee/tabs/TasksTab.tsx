import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Image, Pressable } from 'react-native';
import { Text, Divider, useTheme, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTasksCounter } from '../tasks/TasksCounterContext';
import { StyledCard, StyledButton, StyledScrollView, SquareIconButton } from '../../components';

type TaskType = 'routine' | 'assigned';
type TaskStatus = 'todo' | 'in_progress' | 'done' | 'skipped';

interface TaskItem {
  id: string;
  type: TaskType;
  title: string;
  pvzId: string;
  dueAt?: number;
  status: TaskStatus;
  proof?: 'photo' | 'none';
}

const CHECKLISTS = [
  {
    id: 'cl1',
    title: 'Поддержание порядка',
    items: [
      { id: 'c1', title: 'Пол в клиентской зоне', desc: 'Чистый пол, без мусора и разводов.' },
      { id: 'c2', title: 'Примерочная №1', desc: 'Есть вешалки, штора целая, внутри чисто.' },
      { id: 'c3', title: 'Примерочная №2', desc: 'Есть вешалки, штора целая, внутри чисто.' },
      {
        id: 'c4',
        title: 'Стол для проверки товаров',
        desc: 'Стол протёрт, нет посторонних предметов.',
      },
      { id: 'c5', title: 'Рабочий стол', desc: 'Порядок на поверхности, кабели уложены.' },
    ],
  },
  {
    id: 'cl2',
    title: 'Санитария',
    items: [
      { id: 's1', title: 'Санузел', desc: 'Чисто, бумага/мыло есть.' },
      { id: 's2', title: 'Мусорные корзины', desc: 'Полные мешки вынесены, новые установлены.' },
    ],
  },
];

const ASSIGNMENTS_ITEMS = [
  {
    id: 'a1',
    title: 'Пакеты для переупаковки',
    desc: 'Посчитать остаток пакетов для переупаковки на складе и приложить фото пачек/коробок. Введите общее количество.',
  },
];

interface CompletedItem {
  id: string;
  title: string;
  desc?: string;
  completedAt: number;
}
const COMPLETED_ITEMS_INITIAL: CompletedItem[] = [];

export const TasksTab: React.FC = () => {
  const theme = useTheme();
  const { setPendingCount, setCompletedCount } = useTasksCounter();
  const [checklistPhotos, setChecklistPhotos] = useState<
    Record<string, Record<string, string | null>>
  >(
    Object.fromEntries(
      CHECKLISTS.map((cl) => [cl.id, Object.fromEntries(cl.items.map((i) => [i.id, null]))]),
    ),
  );
  const [completedChecklists, setCompletedChecklists] = useState<Record<string, boolean>>(
    Object.fromEntries(CHECKLISTS.map((cl) => [cl.id, false])),
  );
  const [assignments, setAssignments] = useState(ASSIGNMENTS_ITEMS);
  const [assignmentPhotos, setAssignmentPhotos] = useState<Record<string, string | null>>(
    Object.fromEntries(ASSIGNMENTS_ITEMS.map((i) => [i.id, null])),
  );
  const [assignmentQty, setAssignmentQty] = useState<Record<string, string>>(
    Object.fromEntries(ASSIGNMENTS_ITEMS.map((i) => [i.id, ''])),
  );
  const [completed, setCompleted] = useState<CompletedItem[]>(COMPLETED_ITEMS_INITIAL);
  const [checklistsExpanded, setChecklistsExpanded] = useState<Record<string, boolean>>(
    Object.fromEntries(CHECKLISTS.map((cl) => [cl.id, true])),
  );
  const [completedExpanded, setCompletedExpanded] = useState(false);

  const allChecklistsSubmitted = useMemo(
    () => Object.values(completedChecklists).every(Boolean),
    [completedChecklists],
  );

  const takePhoto = useCallback(async (update: (uri: string) => void) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchCameraAsync({ quality: 0.5 });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      update(result.assets[0].uri);
    }
  }, []);

  const isChecklistReady = useCallback(
    (clId: string): boolean => {
      const items = checklistPhotos[clId] || {};
      return Object.values(items).every(Boolean);
    },
    [checklistPhotos],
  );

  // Обновление счётчиков задач
  useEffect(() => {
    const remainingChecklists = CHECKLISTS.filter((cl) => !completedChecklists[cl.id]).length;
    const pending = remainingChecklists + assignments.length;
    const completedTotal = CHECKLISTS.filter((cl) => completedChecklists[cl.id]).length + completed.length;
    setPendingCount(pending);
    setCompletedCount(completedTotal);
  }, [completedChecklists, assignments, completed, setPendingCount, setCompletedCount]);

  const submitChecklist = useCallback(
    (clId: string, title: string) => {
      if (!isChecklistReady(clId)) return;
      setCompleted((prev) => [
        {
          id: 'done-checklist-' + clId + '-' + Date.now(),
          title: `Чек‑лист: ${title}`,
          completedAt: Date.now(),
        },
        ...prev,
      ]);
      setCompletedChecklists((prev) => ({ ...prev, [clId]: true }));
      setChecklistsExpanded((prev) => ({ ...prev, [clId]: false })); // Сворачиваем после отправки
    },
    [isChecklistReady],
  );

  // Подсчёт прогресса для каждого чек-листа
  const getChecklistProgress = useCallback(
    (clId: string) => {
      const items = checklistPhotos[clId] || {};
      const total = Object.keys(items).length;
      const completed = Object.values(items).filter(Boolean).length;
      return { completed, total, percent: total > 0 ? (completed / total) * 100 : 0 };
    },
    [checklistPhotos],
  );

  // Общий прогресс
  const totalTasks = CHECKLISTS.length + assignments.length;
  const completedTasks = Object.values(completedChecklists).filter(Boolean).length + completed.filter(c => !c.id.includes('checklist')).length;
  const totalProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <StyledScrollView>
      {/* 1) Hero Card - Общий прогресс */}
      <StyledCard>
        <View style={{ gap: 12 }}>
          {/* Заголовок */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827' }}>
                Задачи смены
              </Text>
              <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
                {completedTasks} из {totalTasks} выполнено
              </Text>
            </View>
            {/* Статус-бейдж */}
            <View
              style={{
                backgroundColor: totalProgress === 100 ? '#DCFCE7' : totalProgress > 0 ? '#DBEAFE' : '#F3F4F6',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 999,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: totalProgress === 100 ? '#166534' : totalProgress > 0 ? '#1E40AF' : '#6B7280',
                }}
              >
                {totalProgress === 100 ? '✓ Готово' : totalProgress > 0 ? 'В работе' : 'Ожидают'}
              </Text>
            </View>
          </View>

          {/* Прогресс-бар */}
          <View style={{ gap: 8 }}>
            <View
              style={{
                height: 8,
                backgroundColor: '#F3F4F6',
                borderRadius: 999,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  height: '100%',
                  width: `${totalProgress}%`,
                  backgroundColor: totalProgress === 100 ? '#10B981' : '#4F46E5',
                  borderRadius: 999,
                }}
              />
            </View>
            <Text style={{ fontSize: 12, color: '#6B7280', textAlign: 'right' }}>
              {Math.round(totalProgress)}% выполнено
            </Text>
          </View>

          {/* Мотивационный блок */}
          {totalProgress === 100 ? (
            <View
              style={{
                backgroundColor: '#DCFCE7',
                padding: 12,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                borderLeftWidth: 4,
                borderLeftColor: '#10B981',
              }}
            >
              <MaterialCommunityIcons name="check-circle" size={20} color="#059669" />
              <Text style={{ fontSize: 13, color: '#065F46', fontWeight: '600', flex: 1 }}>
                🎉 Отличная работа! Все задачи выполнены!
              </Text>
            </View>
          ) : totalProgress > 50 ? (
            <View
              style={{
                backgroundColor: '#DBEAFE',
                padding: 12,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                borderLeftWidth: 4,
                borderLeftColor: '#3B82F6',
              }}
            >
              <MaterialCommunityIcons name="rocket-launch" size={18} color="#1E40AF" />
              <Text style={{ fontSize: 13, color: '#1E3A8A', flex: 1 }}>
                Отлично! Вы уже прошли больше половины!
              </Text>
            </View>
          ) : null}
        </View>
      </StyledCard>

      {/* 2) Чек-листы */}
      {CHECKLISTS.map((cl) => {
        const isCompleted = completedChecklists[cl.id];
        const progress = getChecklistProgress(cl.id);
        const isExpanded = checklistsExpanded[cl.id];
        
        if (isCompleted) return null; // Скрываем завершённые

        return (
          <StyledCard key={cl.id}>
            <View style={{ gap: 12 }}>
              {/* Заголовок чек-листа */}
              <Pressable
                onPress={() => setChecklistsExpanded((prev) => ({ ...prev, [cl.id]: !isExpanded }))}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <MaterialCommunityIcons name="clipboard-check-outline" size={20} color="#6B7280" />
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827' }}>
                      {cl.title}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                    {progress.completed} из {progress.total} фото
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  {/* Мини-прогресс */}
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: '#F3F4F6',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 3,
                      borderColor: progress.percent === 100 ? '#10B981' : '#E5E7EB',
                    }}
                  >
                    <Text style={{ fontSize: 11, fontWeight: '700', color: progress.percent === 100 ? '#10B981' : '#6B7280' }}>
                      {progress.completed}/{progress.total}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color="#6B7280"
                  />
                </View>
              </Pressable>

              {/* Прогресс-бар чек-листа */}
              <View
                style={{
                  height: 6,
                  backgroundColor: '#F3F4F6',
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    height: '100%',
                    width: `${progress.percent}%`,
                    backgroundColor: progress.percent === 100 ? '#10B981' : '#4F46E5',
                    borderRadius: 3,
                  }}
                />
              </View>

              {/* Список пунктов (раскрываемый) */}
              {isExpanded ? (
                <View style={{ gap: 0, paddingTop: 4 }}>
                  {cl.items.map((it, idx) => {
                    const photoUri = checklistPhotos[cl.id]?.[it.id] ?? null;
                    return (
                      <View key={it.id}>
                        <View
                          style={{
                            paddingVertical: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 12,
                          }}
                        >
                          {/* Чекбокс-индикатор */}
                          <View
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 12,
                              backgroundColor: photoUri ? '#10B981' : '#F3F4F6',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderWidth: 2,
                              borderColor: photoUri ? '#059669' : '#E5E7EB',
                            }}
                          >
                            {photoUri ? (
                              <MaterialCommunityIcons name="check" size={14} color="#FFFFFF" />
                            ) : (
                              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#D1D5DB' }} />
                            )}
                          </View>

                          {/* Текст */}
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 14, fontWeight: '500', color: '#111827' }}>
                              {it.title}
                            </Text>
                            <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                              {it.desc}
                            </Text>
                          </View>

                          {/* Фото или кнопка камеры */}
                          {photoUri ? (
                            <Image
                              source={{ uri: photoUri }}
                              style={{ width: 52, height: 52, borderRadius: 8 }}
                            />
                          ) : (
                            <SquareIconButton
                              icon="camera"
                              onPress={() =>
                                takePhoto((uri) =>
                                  setChecklistPhotos((prev) => ({
                                    ...prev,
                                    [cl.id]: { ...(prev[cl.id] || {}), [it.id]: uri },
                                  })),
                                )
                              }
                            />
                          )}
                        </View>
                        {idx < cl.items.length - 1 ? (
                          <Divider style={{ marginLeft: 36 }} />
                        ) : null}
                      </View>
                    );
                  })}
                </View>
              ) : null}

              {/* Кнопка отправки */}
              <StyledButton
                mode="contained"
                disabled={!isChecklistReady(cl.id)}
                onPress={() => submitChecklist(cl.id, cl.title)}
                icon={isChecklistReady(cl.id) ? 'send' : 'camera-outline'}
              >
                {isChecklistReady(cl.id) ? 'Отправить чек-лист' : `Осталось ${progress.total - progress.completed} фото`}
              </StyledButton>
            </View>
          </StyledCard>
        );
      })}

      {/* Плейсхолдер для пустых чек-листов */}
      {allChecklistsSubmitted && assignments.length === 0 ? (
        <StyledCard>
          <View style={{ alignItems: 'center', paddingVertical: 20, gap: 12 }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: '#DCFCE7',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MaterialCommunityIcons name="checkbox-multiple-marked" size={32} color="#10B981" />
            </View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>
              Все задачи выполнены!
            </Text>
            <Text style={{ fontSize: 13, color: '#6B7280', textAlign: 'center' }}>
              Отличная работа! Новые задачи появятся позже.
            </Text>
          </View>
        </StyledCard>
      ) : null}

      {/* 3) Поручения */}
      {assignments.length > 0 ? (
        <StyledCard>
          <View style={{ gap: 12 }}>
            {/* Заголовок */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MaterialCommunityIcons name="text-box-check-outline" size={20} color="#6B7280" />
              <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827' }}>
                Поручения
              </Text>
              <View
                style={{
                  backgroundColor: '#FEF3C7',
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 999,
                }}
              >
                <Text style={{ fontSize: 11, color: '#92400E', fontWeight: '600' }}>
                  {assignments.length}
                </Text>
              </View>
            </View>

            {/* Список поручений */}
            {assignments.map((it, idx) => {
              const photoUri = assignmentPhotos[it.id];
              const qty = assignmentQty[it.id] ?? '';
              const isReady = photoUri && qty && Number(qty) > 0;
              return (
                <View key={it.id}>
                  <View style={{ gap: 12 }}>
                    {/* Текст задания */}
                    <View>
                      <Text style={{ fontSize: 14, fontWeight: '500', color: '#111827' }}>
                        {it.title}
                      </Text>
                      {it.desc ? (
                        <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>
                          {it.desc}
                        </Text>
                      ) : null}
                    </View>

                    {/* Ввод количества */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <MaterialCommunityIcons name="counter" size={20} color="#6B7280" />
                      <TextInput
                        mode="outlined"
                        value={qty}
                        onChangeText={(v) =>
                          setAssignmentQty((prev) => ({ ...prev, [it.id]: v.replace(/[^0-9]/g, '') }))
                        }
                        placeholder="Введите количество"
                        keyboardType="numeric"
                        style={{ flex: 1, fontSize: 14 }}
                        maxLength={5}
                        right={<TextInput.Affix text="шт" />}
                      />
                    </View>

                    {/* Фото и кнопка завершения */}
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      {photoUri ? (
                        <View style={{ flex: 1 }}>
                          <Image
                            source={{ uri: photoUri }}
                            style={{ width: '100%', height: 120, borderRadius: 8 }}
                            resizeMode="cover"
                          />
                          <View
                            style={{
                              position: 'absolute',
                              top: 6,
                              left: 6,
                              backgroundColor: 'rgba(16, 185, 129, 0.9)',
                              paddingHorizontal: 8,
                              paddingVertical: 4,
                              borderRadius: 6,
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            <MaterialCommunityIcons name="check" size={14} color="#FFFFFF" />
                            <Text style={{ fontSize: 11, color: '#FFFFFF', fontWeight: '600' }}>
                              Фото готово
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <StyledButton
                          mode="outlined"
                          icon="camera"
                          onPress={() =>
                            takePhoto((uri) =>
                              setAssignmentPhotos((prev) => ({ ...prev, [it.id]: uri })),
                            )
                          }
                          style={{ flex: 1 }}
                        >
                          Приложить фото
                        </StyledButton>
                      )}
                    </View>

                    {/* Кнопка завершения */}
                    <StyledButton
                      mode="contained"
                      icon={isReady ? 'check-bold' : 'alert-circle-outline'}
                      onPress={() => {
                        setAssignments((prev) => prev.filter((a) => a.id !== it.id));
                        setCompleted((prev) => [
                          { id: `done-${it.id}`, title: it.title, completedAt: Date.now() },
                          ...prev,
                        ]);
                      }}
                      disabled={!isReady}
                      buttonColor={isReady ? '#10B981' : undefined}
                    >
                      {isReady ? 'Завершить поручение' : 'Добавьте фото и количество'}
                    </StyledButton>
                  </View>
                  {idx < assignments.length - 1 ? <Divider style={{ marginVertical: 12 }} /> : null}
                </View>
              );
            })}
          </View>
        </StyledCard>
      ) : null}

      {/* 4) Выполненное (сворачиваемое) */}
      {completed.length > 0 ? (
        <StyledCard>
          <View>
            <Pressable
              onPress={() => setCompletedExpanded(!completedExpanded)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 4,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <MaterialCommunityIcons name="check-all" size={20} color="#10B981" />
                <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827' }}>
                  Выполненное
                </Text>
                <View
                  style={{
                    backgroundColor: '#DCFCE7',
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 999,
                  }}
                >
                  <Text style={{ fontSize: 11, color: '#065F46', fontWeight: '600' }}>
                    {completed.length}
                  </Text>
                </View>
              </View>
              <MaterialCommunityIcons
                name={completedExpanded ? 'chevron-up' : 'chevron-down'}
                size={24}
                color="#6B7280"
              />
            </Pressable>
            {completedExpanded ? (
              <View style={{ gap: 0, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6' }}>
                {completed.map((it, idx) => (
                  <View key={it.id}>
                    <View style={{ paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <MaterialCommunityIcons name="check-circle" size={18} color="#10B981" />
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 14, color: '#111827' }}>{it.title}</Text>
                        <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                          {new Date(it.completedAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                      </View>
                    </View>
                    {idx < completed.length - 1 ? <Divider style={{ marginLeft: 28 }} /> : null}
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        </StyledCard>
      ) : null}
    </StyledScrollView>
  );
};
