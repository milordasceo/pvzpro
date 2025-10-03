import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Image } from 'react-native';
import { Text, Divider, useTheme, TextInput } from 'react-native-paper';
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
  const { setPendingCount } = useTasksCounter();
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

  // Обновление счётчика задач (пока считаем суммой: оставшиеся пункты чек-листов + открытые поручения)
  useEffect(() => {
    const remainingChecklists = CHECKLISTS.filter((cl) => !completedChecklists[cl.id]).length;
    const pending = remainingChecklists + assignments.length;
    setPendingCount(pending);
  }, [completedChecklists, assignments]);

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
    },
    [isChecklistReady],
  );

  return (
    <StyledScrollView>
      {/* Карточка: Чек-листы */}
      <StyledCard title="Чек‑листы">
        {allChecklistsSubmitted ? (
          <Text style={{ color: '#6B7280' }}>Все чек‑листы выполнены · нет новых задач</Text>
        ) : (
          CHECKLISTS.filter((cl) => !completedChecklists[cl.id]).map((cl, clIdx) => (
            <View key={cl.id} style={{ marginBottom: clIdx < CHECKLISTS.length - 1 ? 12 : 0 }}>
              <Text variant="titleMedium" style={{ marginBottom: 6 }}>
                {cl.title}
              </Text>
              {cl.items.map((it, idx) => {
                const photoUri = checklistPhotos[cl.id]?.[it.id] ?? null;
                return (
                  <View
                    key={it.id}
                    style={{ paddingVertical: 6, flexDirection: 'row', alignItems: 'center' }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text>{it.title}</Text>
                      <Text style={{ color: '#6B7280' }}>{it.desc}</Text>
                    </View>
                    {photoUri ? (
                      <Image
                        source={{ uri: photoUri }}
                        style={{ width: 44, height: 44, borderRadius: 8 }}
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
                    {idx < cl.items.length - 1 ? (
                      <Divider style={{ position: 'absolute', bottom: -4, left: 0, right: 0 }} />
                    ) : null}
                  </View>
                );
              })}
              <StyledButton
                mode="contained"
                disabled={!isChecklistReady(cl.id)}
                onPress={() => submitChecklist(cl.id, cl.title)}
                style={{ marginTop: 8 }}
              >
                Отправить
              </StyledButton>
              {clIdx < CHECKLISTS.length - 1 ? <Divider style={{ marginTop: 12 }} /> : null}
            </View>
          ))
        )}
      </StyledCard>

      {/* Карточка: Поручения */}
      <StyledCard title="Поручения">
        {assignments.length === 0 ? (
          <Text style={{ color: '#6B7280' }}>Нет новых поручений</Text>
        ) : (
          assignments.map((it, idx) => {
            const photoUri = assignmentPhotos[it.id];
            const qty = assignmentQty[it.id] ?? '';
            return (
              <View key={it.id} style={{ paddingVertical: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <Text>{it.title}</Text>
                    {it.desc ? <Text style={{ color: '#6B7280' }}>{it.desc}</Text> : null}
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <TextInput
                      mode="outlined"
                      value={qty}
                      onChangeText={(v) =>
                        setAssignmentQty((prev) => ({ ...prev, [it.id]: v.replace(/[^0-9]/g, '') }))
                      }
                      placeholder="шт"
                      keyboardType="numeric"
                      style={{ width: 96, marginBottom: 6, textAlign: 'center' as any }}
                      maxLength={5}
                    />
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      {photoUri ? (
                        <Image
                          source={{ uri: photoUri }}
                          style={{ width: 44, height: 44, borderRadius: 8 }}
                        />
                      ) : (
                        <SquareIconButton
                          icon="camera"
                          onPress={() =>
                            takePhoto((uri) =>
                              setAssignmentPhotos((prev) => ({ ...prev, [it.id]: uri })),
                            )
                          }
                        />
                      )}
                      <SquareIconButton
                        icon="check"
                        onPress={() => {
                          setAssignments((prev) => prev.filter((a) => a.id !== it.id));
                          setCompleted((prev) => [
                            { id: `done-${it.id}`, title: it.title, completedAt: Date.now() },
                            ...prev,
                          ]);
                        }}
                        disabled={!photoUri || !(qty && Number(qty) > 0)}
                      />
                    </View>
                  </View>
                </View>
                {idx < assignments.length - 1 ? <Divider style={{ marginTop: 8 }} /> : null}
              </View>
            );
          })
        )}
      </StyledCard>

      {/* Карточка: Выполненное */}
      <StyledCard title="Выполненное">
        {completed.length === 0 ? (
          <Text style={{ color: '#6B7280' }}>Пока пусто</Text>
        ) : (
          completed.map((it, idx) => (
            <View key={it.id} style={{ paddingVertical: 6 }}>
              <Text>{it.title}</Text>
              <Text style={{ color: '#6B7280' }}>
                {new Date(it.completedAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
              {it.desc ? <Text style={{ color: '#6B7280' }}>{it.desc}</Text> : null}
              {idx < completed.length - 1 ? <Divider style={{ marginTop: 8 }} /> : null}
            </View>
          ))
        )}
      </StyledCard>
    </StyledScrollView>
  );
};
