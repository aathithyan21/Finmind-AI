import React from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useFinance } from '../context/FinanceContext';
import { COLORS } from '../data/mockData';

const { width } = Dimensions.get('window');

const fmt = (n) =>
  '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtShort = (n) =>
  '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 });

export default function DashboardScreen({ navigation }) {
  const finance = useFinance();
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting}, Alex 👋</Text>
          <Text style={styles.date}>
            {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
        </View>
        <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={styles.avatar}>
          <Text style={styles.avatarText}>AK</Text>
        </LinearGradient>
      </View>

      {/* Balance Card */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.balanceCard}
      >
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>▲ 12.4%</Text>
          </View>
        </View>
        <Text style={styles.balanceAmount}>{fmt(finance.totalBalance)}</Text>
        <View style={styles.balanceStats}>
          <View>
            <Text style={styles.balanceStatLabel}>↑ Income</Text>
            <Text style={styles.balanceStatValue}>{fmtShort(finance.totalIncome)}</Text>
          </View>
          <View style={styles.divider} />
          <View>
            <Text style={styles.balanceStatLabel}>↓ Expenses</Text>
            <Text style={styles.balanceStatValue}>{fmtShort(finance.totalExpense)}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <StatCard
          icon="📈" label="Savings Rate"
          value={`${finance.savingsRate.toFixed(1)}%`}
          sub={finance.savingsRate >= 20 ? 'On track ✓' : 'Below target'}
          color={COLORS.primary}
        />
        <StatCard
          icon="💰" label="Monthly Net"
          value={fmtShort(finance.totalIncome - finance.totalExpense)}
          sub="This month"
          color={COLORS.secondary}
        />
        <StatCard
          icon="⚠️" label="Alerts"
          value={`${finance.anomalies.length}`}
          sub="Anomalies"
          color={COLORS.danger}
        />
      </View>

      {/* Anomaly Alert */}
      {finance.anomalies.length > 0 && (
        <TouchableOpacity
          style={styles.anomalyAlert}
          onPress={() => navigation.navigate('Transactions')}
        >
          <View style={styles.anomalyIcon}>
            <Text style={{ fontSize: 18 }}>⚠️</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.anomalyTitle}>Spending Anomalies Detected</Text>
            <Text style={styles.anomalySub}>
              {finance.anomalies.length} unusual transactions flagged by AI
            </Text>
          </View>
          <Text style={{ color: COLORS.danger, fontSize: 18 }}>›</Text>
        </TouchableOpacity>
      )}

      {/* Category Breakdown */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Spending Breakdown</Text>
        <Text style={styles.cardSub}>This month</Text>
        <View style={{ marginTop: 16 }}>
          {finance.categoryBreakdown.map((cat, i) => {
            const total = finance.categoryBreakdown.reduce((s, c) => s + c.value, 0);
            const pct = Math.round((cat.value / total) * 100);
            return (
              <View key={i} style={{ marginBottom: 12 }}>
                <View style={styles.catRow}>
                  <Text style={styles.catName}>{cat.name}</Text>
                  <Text style={[styles.catPct, { color: cat.color }]}>{pct}%</Text>
                </View>
                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: cat.color }]} />
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Cash Flow Forecast */}
      <View style={[styles.card, { marginBottom: 100 }]}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Cash Flow Forecast</Text>
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>AI Predicted</Text>
          </View>
        </View>
        <Text style={styles.cardSub}>Next 6 months</Text>
        <View style={{ marginTop: 20 }}>
          {finance.cashFlow.map((item, i) => {
            const net = item.income - item.expense;
            const maxVal = 12000;
            return (
              <View key={i} style={styles.cashFlowRow}>
                <Text style={styles.cashFlowMonth}>{item.month}</Text>
                <View style={styles.cashFlowBar}>
                  <View
                    style={[
                      styles.cashFlowIncome,
                      { width: `${(item.income / maxVal) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={[
                  styles.cashFlowNet,
                  { color: net > 0 ? COLORS.primary : COLORS.danger },
                ]}>
                  +{fmtShort(net)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

function StatCard({ icon, label, value, sub, color }) {
  return (
    <View style={[styles.statCard, { flex: 1 }]}>
      <Text style={{ fontSize: 18 }}>{icon}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statSub}>{sub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingBottom: 20 },
  greeting: { color: COLORS.text, fontSize: 22, fontWeight: '700' },
  date: { color: COLORS.textMuted, fontSize: 13, marginTop: 2 },
  avatar: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#000', fontWeight: '700', fontSize: 15 },
  balanceCard: { borderRadius: 24, padding: 24, marginBottom: 20 },
  balanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceLabel: { color: 'rgba(0,0,0,0.6)', fontSize: 14, fontWeight: '500' },
  badge: { backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { color: '#000', fontSize: 12, fontWeight: '600' },
  balanceAmount: { color: '#000', fontSize: 38, fontWeight: '800', marginTop: 10, marginBottom: 20, letterSpacing: -1 },
  balanceStats: { flexDirection: 'row', alignItems: 'center' },
  balanceStatLabel: { color: 'rgba(0,0,0,0.5)', fontSize: 12 },
  balanceStatValue: { color: '#000', fontSize: 18, fontWeight: '700', marginTop: 2 },
  divider: { width: 1, height: 36, backgroundColor: 'rgba(0,0,0,0.2)', marginHorizontal: 24 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: COLORS.border },
  statValue: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginTop: 8 },
  statSub: { color: COLORS.textMuted, fontSize: 10, marginTop: 2 },
  anomalyAlert: {
    backgroundColor: 'rgba(255,107,107,0.1)', borderRadius: 16, padding: 14,
    flexDirection: 'row', alignItems: 'center', marginBottom: 20,
    borderWidth: 1, borderColor: 'rgba(255,107,107,0.3)',
  },
  anomalyIcon: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,107,107,0.2)',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  anomalyTitle: { color: COLORS.text, fontWeight: '600', fontSize: 14 },
  anomalySub: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  card: {
    backgroundColor: COLORS.card, borderRadius: 20, padding: 20,
    marginBottom: 20, borderWidth: 1, borderColor: COLORS.border,
  },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  cardSub: { color: COLORS.textMuted, fontSize: 12, marginTop: 4 },
  aiBadge: { backgroundColor: 'rgba(108,99,255,0.2)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  aiBadgeText: { color: COLORS.secondary, fontSize: 10, fontWeight: '600' },
  catRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  catName: { color: COLORS.textMuted, fontSize: 13 },
  catPct: { fontSize: 13, fontWeight: '600' },
  progressBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 3 },
  progressFill: { height: 6, borderRadius: 3 },
  cashFlowRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  cashFlowMonth: { color: COLORS.textMuted, fontSize: 12, width: 32 },
  cashFlowBar: { flex: 1, height: 8, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 4, marginHorizontal: 12 },
  cashFlowIncome: { height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
  cashFlowNet: { fontSize: 12, fontWeight: '600', width: 72, textAlign: 'right' },
});
