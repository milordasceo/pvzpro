import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Appbar, Text, Card, useTheme, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyledCard, StyledButton, MetaRow } from '../components';
import { FinancialSummary } from '../types/finance';
import { financeService, FinanceService } from '../services';
import { useAuthStore } from '../store/auth.store';

export const FinanceScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();

  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFinancialData();
  }, [user?.id]);

  const loadFinancialData = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // Используем синглтон, а при ошибке пробуем создать инстанс
      let data: FinancialSummary;
      try {
        data = await financeService.getFinancialSummary(user.id);
      } catch (e) {
        const svc = new FinanceService();
        data = await svc.getFinancialSummary(user.id);
      }
      setSummary(data);
    } catch (err) {
      setError('Не удалось загрузить финансовые данные');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getNextPaymentText = () => {
    if (!summary?.nextPaymentDate) return 'Дата неизвестна';
    return summary.nextPaymentDate.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={{ flex: 1 }}>
        <Appbar.Header mode="center-aligned">
          <Appbar.Content title="Финансы" />
        </Appbar.Header>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 16 }}>Загрузка финансовых данных...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1 }}>
        <Appbar.Header mode="center-aligned">
          <Appbar.Content title="Финансы" />
        </Appbar.Header>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <MaterialCommunityIcons name="alert-circle" size={48} color={theme.colors.error} />
          <Text style={{ marginTop: 16, textAlign: 'center' }}>{error}</Text>
          <StyledButton mode="contained" onPress={loadFinancialData} style={{ marginTop: 16 }}>
            Повторить
          </StyledButton>
        </View>
      </View>
    );
  }

  // Если нет пользователя
  if (!user) {
    return (
      <View style={{ flex: 1 }}>
        <Appbar.Header mode="center-aligned">
          <Appbar.Content title="Финансы" />
        </Appbar.Header>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <MaterialCommunityIcons
            name="account-alert"
            size={64}
            color={theme.colors.onSurfaceVariant}
          />
          <Text variant="titleMedium" style={{ marginTop: 16, textAlign: 'center' }}>
            Необходимо войти в систему
          </Text>
          <Text style={{ color: '#6B7280', textAlign: 'center', marginTop: 8 }}>
            Для просмотра финансовых данных требуется авторизация
          </Text>
          <StyledButton
            mode="contained"
            onPress={() => {
              const { login } = useAuthStore.getState();
              login({
                id: 'demo-employee',
                name: 'Демо Сотрудник',
                role: 'employee',
                email: 'demo@wb-pvz.ru',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
              });
            }}
            style={{ marginTop: 16 }}
          >
            Войти как демо-пользователь
          </StyledButton>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header mode="center-aligned">
        <Appbar.Content title="Финансы" />
        <Appbar.Action icon="history" onPress={() => navigation.navigate('FinanceHistory')} />
      </Appbar.Header>

      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 16, gap: 16 }}>
          {/* Текущий расчетный период */}
          <StyledCard title="Текущий период (с последней выплаты)">
            <View style={{ gap: 8 }}>
              <MetaRow
                icon="calendar-range"
                label={`${summary?.currentPayoutPeriod.startDate.toLocaleDateString('ru-RU')} — ${summary?.currentPayoutPeriod.endDate.toLocaleDateString('ru-RU')}`}
              />
              <MetaRow
                icon="cash"
                label={`К выплате: ${formatCurrency(summary?.currentPayoutPeriod.toPay || 0)}`}
              />
              <MetaRow
                icon="gift-outline"
                label={`Премии: ${formatCurrency(summary?.currentPayoutPeriod.bonuses || 0)}`}
              />
              <MetaRow
                icon="alert-outline"
                label={`Штрафы: ${formatCurrency(summary?.currentPayoutPeriod.penalties || 0)}`}
              />
              <MetaRow
                icon="account-check-outline"
                label={`Смен за период: ${summary?.currentPayoutPeriod.shiftsCount ?? 0}`}
              />
            </View>
          </StyledCard>

          {/* Текущий месяц */}
          <StyledCard title="Текущий месяц">
            <View style={{ gap: 12 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text variant="titleMedium" style={{ color: '#111827' }}>
                  Заработано
                </Text>
                <Text
                  variant="titleMedium"
                  style={{ color: theme.colors.primary, fontWeight: '600' }}
                >
                  {formatCurrency(summary?.currentMonth.totalEarned || 0)}
                </Text>
              </View>

              <View style={{ gap: 8 }}>
                <MetaRow
                  icon="cash"
                  label={`Выплачено: ${formatCurrency(summary?.currentMonth.totalPaid || 0)}`}
                />
                <MetaRow
                  icon="clock-outline"
                  label={`Ожидает выплаты: ${formatCurrency(summary?.currentMonth.pendingPayments || 0)}`}
                />
                <MetaRow
                  icon="gift"
                  label={`Премии: ${formatCurrency(summary?.currentMonth.bonuses || 0)}`}
                />
                <MetaRow
                  icon="alert-circle"
                  label={`Штрафы: ${formatCurrency(summary?.currentMonth.penalties || 0)}`}
                />
                <MetaRow
                  icon="account-check-outline"
                  label={`Смен за период: ${summary?.currentMonth.shiftsCount ?? 0}`}
                />
                {summary?.currentMonth?.overtimeHours && summary.currentMonth.overtimeHours > 0 ? (
                  <MetaRow
                    icon="timer"
                    label={`Переработка: ${summary.currentMonth?.overtimeHours ?? 0} ч.`}
                  />
                ) : null}
              </View>
            </View>
          </StyledCard>

          {/* За год */}
          <StyledCard title="За текущий год">
            <View style={{ gap: 12 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text variant="titleMedium" style={{ color: '#111827' }}>
                  Всего заработано
                </Text>
                <Text
                  variant="titleMedium"
                  style={{ color: theme.colors.primary, fontWeight: '600' }}
                >
                  {formatCurrency(summary?.yearToDate.totalEarned || 0)}
                </Text>
              </View>

              <View style={{ gap: 8 }}>
                <MetaRow
                  icon="cash-check"
                  label={`Выплачено: ${formatCurrency(summary?.yearToDate.totalPaid || 0)}`}
                />
                <MetaRow
                  icon="gift"
                  label={`Премии: ${formatCurrency(summary?.yearToDate.totalBonuses || 0)}`}
                />
                <MetaRow
                  icon="alert-circle"
                  label={`Штрафы: ${formatCurrency(summary?.yearToDate.totalPenalties || 0)}`}
                />
                <MetaRow
                  icon="calendar-month"
                  label={`Среднемесячный доход: ${formatCurrency(summary?.averageMonthly || 0)}`}
                />
              </View>
            </View>
          </StyledCard>

          {/* Следующая выплата */}
          <StyledCard title="Следующая выплата">
            <View style={{ alignItems: 'center', paddingVertical: 8 }}>
              <MaterialCommunityIcons
                name="calendar-clock"
                size={32}
                color={theme.colors.primary}
                style={{ marginBottom: 8 }}
              />
              <Text variant="titleMedium" style={{ color: '#111827', textAlign: 'center' }}>
                {getNextPaymentText()}
              </Text>
              <Text style={{ color: '#6B7280', textAlign: 'center', marginTop: 4 }}>
                Выплаты раз в 2 недели: 1 и 15 числа месяца
              </Text>
            </View>
          </StyledCard>

          {/* Быстрые действия */}
          <View style={{ gap: 12 }}>
            <StyledButton
              mode="contained"
              onPress={() => navigation.navigate('FinanceHistory')}
              style={{ marginBottom: 8 }}
            >
              История платежей
            </StyledButton>

            <StyledButton mode="outlined" onPress={() => navigation.navigate('FinanceBreakdown')}>
              Детализация по сменам
            </StyledButton>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
