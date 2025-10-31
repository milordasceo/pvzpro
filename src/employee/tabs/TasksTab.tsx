import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Pressable } from 'react-native';
import { Text, Divider, useTheme, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useTasksCounter } from '../tasks/TasksCounterContext';
import { Card, Button, ScrollView, IconButton, tokens, Title, Body, Label, Caption } from '../../ui';

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
    const result = await ImagePicker.launchCameraAsync({ quality: 0.3 });
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

  // Мемоизированные вычисления общего прогресса
  const totalTasks = useMemo(
    () => CHECKLISTS.length + assignments.length,
    [assignments.length]
  );
  const completedTasks = useMemo(
    () => Object.values(completedChecklists).filter(Boolean).length + completed.filter(c => !c.id.includes('checklist')).length,
    [completedChecklists, completed]
  );
  const totalProgress = useMemo(
    () => (totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0),
    [totalTasks, completedTasks]
  );

  return (
    <ScrollView>
      {/* 1) Hero Card - Общий прогресс */}
      <Card>
        <View style={{ gap: 12 }}>
          {/* Заголовок */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Title size="large">
                Задачи смены
              </Title>
              <Label size="medium" color="secondary" style={{ marginTop: 2 }}>
                {completedTasks} из {totalTasks} выполнено
              </Label>
            </View>
            {/* Статус-бейдж */}
            <View
              style={{
                backgroundColor: totalProgress === 100 ? tokens.colors.success.lighter : totalProgress > 0 ? tokens.colors.primary.light : tokens.colors.gray[100],
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 999,
              }}
            >
              <Label size="small" style={{
                  color: totalProgress === 100 ? tokens.colors.success.darker : totalProgress > 0 ? tokens.colors.primary.dark : tokens.colors.text.secondary,
                }}>
                {totalProgress === 100 ? 'Готово' : totalProgress > 0 ? 'В работе' : 'Ожидают'}
              </Label>
            </View>
          </View>

          {/* Прогресс-бар */}
          <View style={{ gap: 8 }}>
            <View
              style={{
                height: 8,
                backgroundColor: tokens.colors.gray[100],
                borderRadius: 999,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  height: '100%',
                  width: `${totalProgress}%`,
                  backgroundColor: totalProgress === 100 ? tokens.colors.success.main : tokens.colors.primary.main,
                  borderRadius: 999,
                }}
              />
            </View>
            <Caption color="secondary" style={{ textAlign: 'right' }}>
              {Math.round(totalProgress)}% выполнено
            </Caption>
          </View>

          {/* Мотивационный блок */}
          {totalProgress === 100 ? (
            <View
              style={{
                backgroundColor: tokens.colors.success.light,
                padding: 12,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                borderLeftWidth: 4,
                borderLeftColor: tokens.colors.success.main,
              }}
            >
              <MaterialCommunityIcons name="check-circle" size={20} color={tokens.colors.success.dark} />
              <Label size="medium" style={{ color: tokens.colors.success.darker, flex: 1 }}>
                🎉 Отличная работа! Все задачи выполнены!
              </Label>
            </View>
          ) : totalProgress > 50 ? (
            <View
              style={{
                backgroundColor: tokens.colors.primary.light,
                padding: 12,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                borderLeftWidth: 4,
                borderLeftColor: tokens.colors.info.main,
              }}
            >
              <MaterialCommunityIcons name="rocket-launch" size={18} color={tokens.colors.primary.dark} />
              <Label size="medium" style={{ color: tokens.colors.primary.darker, flex: 1 }}>
                Отлично! Вы уже прошли больше половины!
              </Label>
            </View>
          ) : null}
        </View>
      </Card>

      {/* 2) Чек-листы */}
      {CHECKLISTS.map((cl) => {
        const isCompleted = completedChecklists[cl.id];
        const progress = getChecklistProgress(cl.id);
        const isExpanded = checklistsExpanded[cl.id];
        
        if (isCompleted) return null; // Скрываем завершённые

        return (
          <Card key={cl.id}>
            <View style={{ gap: 12 }}>
              {/* Заголовок чек-листа */}
              <Pressable
                onPress={() => setChecklistsExpanded((prev) => ({ ...prev, [cl.id]: !isExpanded }))}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <MaterialCommunityIcons name="clipboard-check-outline" size={20} color={tokens.colors.text.secondary} />
                    <Title size="small">
                      {cl.title}
                    </Title>
                  </View>
                  <Caption color="secondary" style={{ marginTop: 2 }}>
                    {progress.completed} из {progress.total} фото
                  </Caption>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  {/* Мини-прогресс */}
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: tokens.colors.gray[100],
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 3,
                      borderColor: progress.percent === 100 ? tokens.colors.success.main : tokens.colors.border,
                    }}
                  >
                    <Label size="small" style={{ color: progress.percent === 100 ? tokens.colors.success.main : tokens.colors.text.secondary }}>
                      {progress.completed}/{progress.total}
                    </Label>
                  </View>
                  <MaterialCommunityIcons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color={tokens.colors.text.secondary}
                  />
                </View>
              </Pressable>

              {/* Прогресс-бар чек-листа */}
              <View
                style={{
                  height: 6,
                  backgroundColor: tokens.colors.gray[100],
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    height: '100%',
                    width: `${progress.percent}%`,
                    backgroundColor: progress.percent === 100 ? tokens.colors.success.main : tokens.colors.primary.main,
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
                              backgroundColor: photoUri ? tokens.colors.success.main : tokens.colors.gray[100],
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderWidth: 2,
                              borderColor: photoUri ? tokens.colors.success.dark : tokens.colors.border,
                            }}
                          >
                            {photoUri ? (
                              <MaterialCommunityIcons name="check" size={14} color={tokens.colors.surface} />
                            ) : (
                              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: tokens.colors.gray[300] }} />
                            )}
                          </View>

                          {/* Текст */}
                          <View style={{ flex: 1 }}>
                            <Body style={{ fontWeight: '500' }}>
                              {it.title}
                            </Body>
                            <Caption color="secondary" style={{ marginTop: 2 }}>
                              {it.desc}
                            </Caption>
                          </View>

                          {/* Фото или кнопка камеры */}
                          {photoUri ? (
                            <Image
                              source={{ uri: photoUri }}
                              style={{ width: 52, height: 52, borderRadius: 8 }}
                              contentFit="cover"
                              transition={200}
                              placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
                            />
                          ) : (
                            <IconButton
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
              <Button
                mode="contained"
                disabled={!isChecklistReady(cl.id)}
                onPress={() => submitChecklist(cl.id, cl.title)}
                icon={isChecklistReady(cl.id) ? 'send' : 'camera-outline'}
              >
                {isChecklistReady(cl.id) ? 'Отправить чек-лист' : `Осталось ${progress.total - progress.completed} фото`}
              </Button>
            </View>
          </Card>
        );
      })}

      {/* Плейсхолдер для пустых чек-листов */}
      {allChecklistsSubmitted && assignments.length === 0 ? (
        <Card>
          <View style={{ alignItems: 'center', paddingVertical: 20, gap: 12 }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: tokens.colors.success.light,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MaterialCommunityIcons name="checkbox-multiple-marked" size={32} color={tokens.colors.success.main} />
            </View>
            <Title size="medium">
              Все задачи выполнены!
            </Title>
            <Label size="medium" color="secondary" style={{ textAlign: 'center' }}>
              Отличная работа! Новые задачи появятся позже.
            </Label>
          </View>
        </Card>
      ) : null}

      {/* 3) Поручения */}
      {assignments.length > 0 ? (
        <Card>
          <View style={{ gap: 12 }}>
            {/* Заголовок */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MaterialCommunityIcons name="text-box-check-outline" size={20} color={tokens.colors.text.secondary} />
              <Title size="small">
                Поручения
              </Title>
              <View
                style={{
                  backgroundColor: tokens.colors.warning.light,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 999,
                }}
              >
                <Label size="small" style={{ color: tokens.colors.warning.dark }}>
                  {assignments.length}
                </Label>
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
                      <Body style={{ fontWeight: '500' }}>
                        {it.title}
                      </Body>
                      {it.desc ? (
                        <Caption color="secondary" style={{ marginTop: 4 }}>
                          {it.desc}
                        </Caption>
                      ) : null}
                    </View>

                    {/* Ввод количества */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <MaterialCommunityIcons name="counter" size={20} color={tokens.colors.text.secondary} />
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
                            contentFit="cover"
                            transition={200}
                            placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
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
                            <MaterialCommunityIcons name="check" size={14} color={tokens.colors.surface} />
                            <Label size="small" style={{ color: tokens.colors.surface }}>
                              Фото готово
                            </Label>
                          </View>
                        </View>
                      ) : (
                        <Button
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
                        </Button>
                      )}
                    </View>

                    {/* Кнопка завершения */}
                    <Button
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
                      buttonColor={isReady ? tokens.colors.success.main : undefined}
                    >
                      {isReady ? 'Завершить поручение' : 'Добавьте фото и количество'}
                    </Button>
                  </View>
                  {idx < assignments.length - 1 ? <Divider style={{ marginVertical: 12 }} /> : null}
                </View>
              );
            })}
          </View>
        </Card>
      ) : null}

      {/* 4) Выполненное (сворачиваемое) */}
      {completed.length > 0 ? (
        <Card>
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
                <MaterialCommunityIcons name="check-all" size={20} color={tokens.colors.success.main} />
                <Title size="small">
                  Выполненное
                </Title>
                <View
                  style={{
                    backgroundColor: tokens.colors.success.light,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 999,
                  }}
                >
                  <Label size="small" style={{ color: tokens.colors.success.darker }}>
                    {completed.length}
                  </Label>
                </View>
              </View>
              <MaterialCommunityIcons
                name={completedExpanded ? 'chevron-up' : 'chevron-down'}
                size={24}
                color={tokens.colors.text.secondary}
              />
            </Pressable>
            {completedExpanded ? (
              <View style={{ gap: 0, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: tokens.colors.gray[100] }}>
                {completed.map((it, idx) => (
                  <View key={it.id}>
                    <View style={{ paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <MaterialCommunityIcons name="check-circle" size={18} color={tokens.colors.success.main} />
                      <View style={{ flex: 1 }}>
                        <Body>{it.title}</Body>
                        <Caption color="secondary" style={{ marginTop: 2 }}>
                          {new Date(it.completedAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Caption>
                      </View>
                    </View>
                    {idx < completed.length - 1 ? <Divider style={{ marginLeft: 28 }} /> : null}
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        </Card>
      ) : null}
    </ScrollView>
  );
};
