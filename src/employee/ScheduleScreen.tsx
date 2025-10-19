import React, { useMemo, useState, useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, useTheme, TouchableRipple, Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { tokens } from '../ui';
import { MetaRow } from '../components/MetaRow';
import { useRequestsStore, buildDateKey } from '../store/requests.store';
import { StyledCard, StyledButton } from '../components';
import { getDayState } from '../services/schedule.service';

const WEEKDAY_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function addDays(d: Date, days: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function startOfWeekMon(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const day = (x.getDay() + 6) % 7; // Mon=0
  x.setDate(x.getDate() - day);
  return x;
}

function endOfWeekSun(d: Date): Date {
  const x = startOfWeekMon(d);
  x.setDate(x.getDate() + 6);
  return x;
}

function weekdayMonIndex(d: Date): number {
  return (d.getDay() + 6) % 7; // Mon=0
}

function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export const ScheduleScreen: React.FC = () => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [snack, setSnack] = useState<string | null>(null);
  const submitRequest = useRequestsStore((s) => s.submit);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [adds, setAdds] = useState<Set<string>>(new Set());
  const [removes, setRemoves] = useState<Set<string>>(new Set());

  const monthMatrix = useMemo(() => {
    const todayLocal = new Date();
    todayLocal.setHours(0, 0, 0, 0);
    const base = startOfWeekMon(addDays(todayLocal, weekOffset * 7));
    const end = endOfWeekSun(addDays(base, 7 * 4)); // всего 5 недель: текущая + 4 вперёд
    const days: Date[] = [];
    for (let d = new Date(base); d.getTime() <= end.getTime(); d = addDays(d, 1)) {
      days.push(new Date(d));
    }
    return days;
  }, [weekOffset]);

  const today = useMemo(() => new Date(), []); // Мемоизируем, чтобы не создавать новый объект каждый рендер

  // Мемоизированные обработчики
  const handlePrevWeek = useCallback(() => setWeekOffset((v) => v - 1), []);
  const handleNextWeek = useCallback(() => setWeekOffset((v) => v + 1), []);
  const handleToday = useCallback(() => {
    const t = new Date();
    setSelectedDate(t);
    setWeekOffset(0);
  }, []);
  const handleEditMode = useCallback(() => setEditMode(true), []);
  const handleCancelEdit = useCallback(() => {
    setEditMode(false);
    setAdds(new Set());
    setRemoves(new Set());
  }, []);

  return (
    <View style={{ flex: 1 }}>
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={{ paddingHorizontal: 12, marginTop: 8 }}>
        {/* Навигация */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <StyledButton
            mode="text"
            onPress={handlePrevWeek}
            style={{ margin: 0 }}
            contentStyle={{ paddingHorizontal: 12 }}
            labelStyle={{ fontSize: 20 }}
            compact
          >
            ‹
          </StyledButton>
          
          <StyledButton
            mode={isSameDay(selectedDate, today) && weekOffset === 0 ? 'contained' : 'text'}
            disabled={isSameDay(selectedDate, today) && weekOffset === 0}
            icon="calendar-today"
            onPress={handleToday}
            labelStyle={{ fontSize: 12, fontWeight: '600' }}
            compact
          >
            Сегодня
          </StyledButton>
          
          <StyledButton
            mode="text"
            onPress={handleNextWeek}
            style={{ margin: 0 }}
            contentStyle={{ paddingHorizontal: 12 }}
            labelStyle={{ fontSize: 20 }}
            compact
          >
            ›
          </StyledButton>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            marginBottom: 8,
            paddingVertical: 8,
            backgroundColor: '#F9FAFB',
            borderRadius: 8,
          }}
        >
          {WEEKDAY_SHORT.map((wd) => (
            <Text
              key={wd}
              style={{
                width: `${100 / 7}%`,
                textAlign: 'center',
                color: '#6B7280',
                fontWeight: '600',
                fontSize: 13,
              }}
            >
              {wd}
            </Text>
          ))}
        </View>

        <View
          style={{
            flexWrap: 'wrap',
            flexDirection: 'row',
            backgroundColor: '#FFF',
            borderRadius: 8,
          }}
        >
          {(() => {
            const cells: React.ReactNode[] = [];
            let lastMonthHeader = -1;
            for (const d of monthMatrix) {
              // Вставляем заголовок месяца перед первым днём нового месяца в диапазоне
              if (d.getMonth() !== lastMonthHeader) {
                lastMonthHeader = d.getMonth();
                cells.push(
                  <View
                    key={`mh_${d.getFullYear()}_${d.getMonth()}`}
                    style={{
                      width: '100%',
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      backgroundColor: '#F3F4F6',
                      borderTopWidth: lastMonthHeader > 0 ? 1 : 0,
                      borderTopColor: '#E5E7EB',
                    }}
                  >
                    <Text style={{ color: '#374151', fontWeight: '600', fontSize: 13 }}>
                      {d.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })} г.
                    </Text>
                  </View>,
                );
                // паддинг до корректного столбца дня недели
                const offset = weekdayMonIndex(d);
                for (let i = 0; i < offset; i++) {
                  cells.push(
                    <View
                      key={`pad_${d.getFullYear()}_${d.getMonth()}_${i}`}
                      style={{ width: `${100 / 7}%`, height: 52 }}
                    />,
                  );
                }
              }

              const isSelected = isSameDay(d, selectedDate);
              const baseColor = isSelected ? theme.colors.onPrimary : '#111827';
              const isWork = getDayState(d) === 'work';
              const isToday = isSameDay(d, today);
              const isPast =
                new Date(d.getFullYear(), d.getMonth(), d.getDate()) <
                new Date(today.getFullYear(), today.getMonth(), today.getDate());
              const disabled = editMode ? isPast || isToday : false;
              cells.push(
                <View
                  key={d.toISOString()}
                  style={{
                    width: `${100 / 7}%`,
                    borderRightWidth: weekdayMonIndex(d) === 6 ? 0 : 1,
                    borderRightColor: '#F3F4F6',
                    borderBottomWidth: 1,
                    borderBottomColor: '#F3F4F6',
                  }}
                >
                  <TouchableRipple
                    borderless={false}
                    style={{ borderRadius: 0 }}
                    disabled={disabled}
                    onPress={() => {
                      if (editMode) {
                        if (isPast) return;
                        const key = dateKey(d);
                        if (getDayState(d) === 'work') {
                          setRemoves((prev) => {
                            const next = new Set(prev);
                            if (next.has(key)) {
                              next.delete(key);
                            } else {
                              next.add(key);
                            }
                            return next;
                          });
                        } else {
                          setAdds((prev) => {
                            const next = new Set(prev);
                            if (next.has(key)) {
                              next.delete(key);
                            } else {
                              next.add(key);
                            }
                            return next;
                          });
                        }
                      } else {
                        setSelectedDate(d);
                      }
                    }}
                  >
                    <View
                      style={[
                        {
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: 52,
                          borderRadius: 0,
                          width: '100%',
                          opacity: disabled ? 0.4 : 1,
                          position: 'relative',
                        },
                        (() => {
                          const key = dateKey(d);
                          const added = editMode && !isWork && adds.has(key);
                          const removed = editMode && isWork && removes.has(key);
                          const effectiveSelected = isSelected && !editMode;
                          const green = '#D1FAE5';
                          if (effectiveSelected) return { backgroundColor: theme.colors.primary };
                          if (removed) return { backgroundColor: '#FEE2E2' };
                          if (added) return { backgroundColor: green };
                          return isWork ? { backgroundColor: green } : null;
                        })(),
                      ]}
                    >
                      {/* Текущий день - специальное оформление */}
                      {isToday && !isSelected && (
                        <View
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            borderWidth: 2,
                            borderColor: '#16A34A',
                            borderRadius: 0,
                          }}
                        />
                      )}
                      
                      <Text
                        style={{
                          color:
                            isSelected && !editMode
                              ? theme.colors.onPrimary
                              : isToday
                                ? '#16A34A'
                                : baseColor,
                          textAlign: 'center',
                          fontWeight: isToday || (isSelected && !editMode) ? '700' : '500',
                          fontSize: 15,
                        }}
                      >
                        {d.getDate()}
                      </Text>
                      
                      {/* Индикатор изменений в режиме редактирования */}
                      {editMode && (() => {
                        const key = dateKey(d);
                        const added = !isWork && adds.has(key);
                        const removed = isWork && removes.has(key);
                        if (added) {
                          return (
                            <View
                              style={{
                                position: 'absolute',
                                bottom: 4,
                                width: 4,
                                height: 4,
                                borderRadius: 2,
                                backgroundColor: '#10B981',
                              }}
                            />
                          );
                        }
                        if (removed) {
                          return (
                            <View
                              style={{
                                position: 'absolute',
                                bottom: 4,
                                width: 4,
                                height: 4,
                                borderRadius: 2,
                                backgroundColor: '#EF4444',
                              }}
                            />
                          );
                        }
                        return null;
                      })()}
                    </View>
                  </TouchableRipple>
                </View>,
              );
            }
            return cells;
          })()}
        </View>
      </View>

      {(() => {
        const isWorkSelected = getDayState(selectedDate) === 'work';
        const isPast =
          new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()) <
          new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const isTodaySelected = isSameDay(selectedDate, today);
        const addCount = adds.size;
        const removeCount = removes.size;
        const totalChanges = addCount + removeCount;

        return (
          <StyledCard title="" style={{ marginHorizontal: 16, marginTop: 12 }}>
            <View style={{ gap: 12 }}>
              {editMode ? (
                <>
                  {/* Заголовок с счётчиком изменений */}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Text variant="titleMedium" style={{ color: '#111827', fontWeight: '600' }}>
                    Редактирование графика
                  </Text>
                    {totalChanges > 0 && (
                      <View
                        style={{
                          backgroundColor: '#EFF6FF',
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                          borderRadius: 12,
                          borderWidth: 1,
                          borderColor: '#BFDBFE',
                        }}
                      >
                        <Text style={{ fontSize: 13, fontWeight: '600', color: '#1E40AF' }}>
                          {totalChanges} {totalChanges === 1 ? 'изменение' : 'изменения'}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Статистика изменений */}
                  {totalChanges > 0 && (
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 8,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        backgroundColor: '#F9FAFB',
                        borderRadius: 8,
                      }}
                    >
                      {addCount > 0 && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <View
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: '#10B981',
                            }}
                          />
                          <Text style={{ fontSize: 13, color: '#111827' }}>
                            +{addCount} {addCount === 1 ? 'день' : 'дня'}
                          </Text>
                        </View>
                      )}
                      {removeCount > 0 && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <View
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: '#EF4444',
                            }}
                          />
                          <Text style={{ fontSize: 13, color: '#111827' }}>
                            -{removeCount} {removeCount === 1 ? 'день' : 'дня'}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Инструкции */}
                  <View style={{ gap: 6 }}>
                    <MetaRow icon="information-outline" label="Нажмите на дату для изменения" />
                    <MetaRow icon="plus-circle-outline" label="Зелёный фон — смена добавлена" />
                    <MetaRow icon="minus-circle-outline" label="Красный фон — смена снята" />
                  </View>
                </>
              ) : (
                <>
                  {/* Компактная информация о выбранной дате */}
                  {isWorkSelected ? (
                    <View style={{ gap: 10 }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                        }}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827' }}>
                            {selectedDate.toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'long',
                              weekday: 'short',
                            })}
                          </Text>
                          <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                            Рабочая смена
                          </Text>
                        </View>
                        <View
                          style={{
                            backgroundColor: '#D1FAE5',
                            paddingHorizontal: 8,
                            paddingVertical: 3,
                            borderRadius: 10,
                          }}
                        >
                          <Text style={{ fontSize: 11, fontWeight: '600', color: '#059669' }}>
                            Работа
                          </Text>
                        </View>
                      </View>

                      <View style={{ height: 1, backgroundColor: '#E5E7EB' }} />

                      <View style={{ gap: 8 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <MaterialCommunityIcons name="store-outline" size={16} color="#6B7280" />
                          <Text style={{ fontSize: 13, color: '#6B7280', flex: 1 }}>ПВЗ</Text>
                          <Text style={{ fontSize: 14, color: '#111827', fontWeight: '600' }}>
                            Герцена 12
                          </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <MaterialCommunityIcons name="clock-outline" size={16} color="#6B7280" />
                          <Text style={{ fontSize: 13, color: '#6B7280', flex: 1 }}>Время</Text>
                          <Text style={{ fontSize: 14, color: '#111827', fontWeight: '600' }}>
                            10:00 – 22:00
                          </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <MaterialCommunityIcons name="cash" size={16} color="#6B7280" />
                          <Text style={{ fontSize: 13, color: '#6B7280', flex: 1 }}>Оплата</Text>
                          <Text
                            style={{
                              fontSize: 16,
                              color: theme.colors.primary,
                              fontWeight: '700',
                            }}
                          >
                            2 200 ₽
                          </Text>
                        </View>
                      </View>
                    </View>
                  ) : (
                    <View style={{ gap: 8 }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <View>
                          <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827' }}>
                            {selectedDate.toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'long',
                              weekday: 'short',
                            })}
                          </Text>
                          <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                            Выходной день
                          </Text>
                        </View>
                        <View
                          style={{
                            backgroundColor: '#F3F4F6',
                            paddingHorizontal: 8,
                            paddingVertical: 3,
                            borderRadius: 10,
                          }}
                        >
                          <Text style={{ fontSize: 11, fontWeight: '600', color: '#6B7280' }}>
                            Выходной
                  </Text>
                        </View>
                      </View>
                  </View>
                  )}
                </>
              )}

              {!editMode ? (
                <StyledButton
                  mode="contained"
                  onPress={handleEditMode}
                  style={{ marginTop: 4 }}
                  icon="calendar-edit"
                >
                  Запросить изменение графика
                </StyledButton>
              ) : (
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                  <StyledButton
                    mode="outlined"
                    onPress={handleCancelEdit}
                    style={{ flex: 1 }}
                  >
                    Отмена
                  </StyledButton>
                  <StyledButton
                    mode="contained"
                    disabled={totalChanges === 0}
                    onPress={() => {
                      const addDates = Array.from(adds);
                      const removeDates = Array.from(removes);
                      if (addDates.length === 0 && removeDates.length === 0) {
                        setSnack('Не выбрано ни одной даты');
                        return;
                      }
                      submitRequest({
                        type: 'schedule_change',
                        employeeId: 'demo-employee',
                        date: buildDateKey(selectedDate),
                        addDates,
                        removeDates,
                      });
                      setSnack('Запрос на изменение графика отправлен');
                      setEditMode(false);
                      setAdds(new Set());
                      setRemoves(new Set());
                    }}
                    style={{ flex: 1 }}
                  >
                    Отправить
                  </StyledButton>
                </View>
              )}
            </View>
          </StyledCard>
        );
      })()}

      </ScrollView>
      
      <Snackbar visible={!!snack} onDismiss={() => setSnack(null)} duration={2500}>
        {snack}
      </Snackbar>
    </View>
  );
};
