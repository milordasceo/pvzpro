import React, { useMemo, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, useTheme, TouchableRipple, Snackbar } from 'react-native-paper';
import { UI_TOKENS } from '../ui/themeTokens';
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

  const today = new Date();

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={{ paddingHorizontal: 12, marginTop: 8 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <View style={{ width: 72, alignItems: 'flex-start' }}>
            <StyledButton mode="text" onPress={() => setWeekOffset((v) => v - 1)}>
              ‹
            </StyledButton>
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <StyledButton
              mode="text"
              icon="calendar-today"
              disabled={isSameDay(selectedDate, today) && weekOffset === 0}
              onPress={() => {
                const t = new Date();
                setSelectedDate(t);
                setWeekOffset(0);
              }}
            >
              Сегодня
            </StyledButton>
          </View>
          <View style={{ width: 72, alignItems: 'flex-end' }}>
            <StyledButton mode="text" onPress={() => setWeekOffset((v) => v + 1)}>
              ›
            </StyledButton>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 4 }}>
          {WEEKDAY_SHORT.map((wd) => (
            <Text key={wd} style={{ width: `${100 / 7}%`, textAlign: 'center', color: '#6B7280' }}>
              {wd}
            </Text>
          ))}
        </View>

        <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
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
                    style={{ width: '100%', paddingVertical: 6 }}
                  >
                    <Text style={{ color: '#6B7280', fontWeight: '600' }}>
                      {d.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
                    </Text>
                  </View>,
                );
                // паддинг до корректного столбца дня недели
                const offset = weekdayMonIndex(d);
                for (let i = 0; i < offset; i++) {
                  cells.push(
                    <View
                      key={`pad_${d.getFullYear()}_${d.getMonth()}_${i}`}
                      style={{ width: `${100 / 7}%`, height: 40 }}
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
                <View key={d.toISOString()} style={{ width: `${100 / 7}%` }}>
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
                          height: 40,
                          borderRadius: 0,
                          width: '100%',
                          margin: 1,
                          opacity: disabled ? 0.4 : 1,
                        },
                        (() => {
                          const key = dateKey(d);
                          const added = editMode && !isWork && adds.has(key);
                          const removed = editMode && isWork && removes.has(key);
                          const effectiveSelected = isSelected && !editMode;
                          const green = 'rgba(22,163,74,0.18)';
                          if (effectiveSelected) return { backgroundColor: theme.colors.primary };
                          if (removed) return null;
                          if (added) return { backgroundColor: green };
                          return isWork ? { backgroundColor: green } : null;
                        })(),
                      ]}
                    >
                      <Text
                        style={{
                          color:
                            isSelected && !editMode
                              ? theme.colors.onPrimary
                              : isToday
                                ? '#16A34A'
                                : baseColor,
                          textAlign: 'center',
                          fontWeight: isToday ? '700' : '400',
                        }}
                      >
                        {d.getDate()}
                      </Text>
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
        return (
          <StyledCard title="" style={{ marginHorizontal: 16, marginTop: 12 }}>
            <View style={{ gap: 8 }}>
              {editMode ? (
                <>
                  <Text variant="titleMedium" style={{ color: '#111827' }}>
                    Редактирование графика
                  </Text>
                  <View style={{ gap: 6 }}>
                    <MetaRow icon="plus" label="Нажмите на выходной — смена будет добавлена" />
                    <MetaRow icon="minus" label="Нажмите на зелёный день — смена будет снята" />
                    <MetaRow icon="block-helper" label="Прошедшие и сегодняшняя даты недоступны" />
                  </View>
                </>
              ) : (
                <>
                  <Text variant="titleMedium" style={{ color: '#111827' }}>
                    {isWorkSelected ? 'Информация о смене' : 'Нет смены'}
                  </Text>
                  <View style={{ gap: 6 }}>
                    <MetaRow icon="calendar" label={selectedDate.toLocaleDateString('ru-RU')} />
                    {isWorkSelected ? (
                      <>
                        <MetaRow icon="store-outline" label={'Герцена 12'} />
                        <MetaRow icon="clock-outline" label={'с 10:00 до 22:00'} />
                        <MetaRow icon="cash" label={'2 200 ₽'} />
                      </>
                    ) : null}
                  </View>
                </>
              )}

              {!editMode ? (
                <StyledButton
                  mode="contained"
                  onPress={() => setEditMode(true)}
                  style={{ marginTop: 8 }}
                >
                  Запросить изменение графика
                </StyledButton>
              ) : (
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                  <StyledButton
                    mode="outlined"
                    onPress={() => {
                      setEditMode(false);
                      setAdds(new Set());
                      setRemoves(new Set());
                    }}
                  >
                    Отмена
                  </StyledButton>
                  <StyledButton
                    mode="contained"
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
                  >
                    Отправить запрос
                  </StyledButton>
                </View>
              )}
            </View>
          </StyledCard>
        );
      })()}

      <Snackbar visible={!!snack} onDismiss={() => setSnack(null)} duration={2500}>
        {snack}
      </Snackbar>
    </ScrollView>
  );
};
