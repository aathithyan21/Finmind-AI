import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useFinance } from '../context/FinanceContext';
import { COLORS } from '../data/mockData';

const fmt = (n) =>
  '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 });

export default function GoalsScreen() {
  const { goals } = useFinance();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Savings Goals</Text>
        <Text style={styles.sub}>AI-powered progress tracking</Text>
      </View>

      {goals.map((goal, i) => {
        const progress = goal.currentAmount / goal.targetAmount;
        const remaining = goal.targetAmount - goal.currentAmount;
        const deadline = new Date(goal.deadline);
        const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
        const monthsLeft = daysLeft / 30;
        const monthlyNeeded = monthsLeft > 0 ? remaining / monthsLeft : remaining;

        return (
          <View key={goal.id} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <View style={styles.goalLeft}>
                <Text style={{ fontSize: 28 }}>{goal.icon}</Text>
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Text style={[
                    styles.goalDays,
                    { color: daysLeft < 60 ? COLORS.danger : COLORS.textMuted }
                  ]}>
                    {daysLeft} days remaining
                  </Text>
                </View>
              </View>
              <View style={styles.goalPct}>
                <Text style={styles.goalPctValue}>
                  {Math.round(progress * 100)}%
                </Text>
                <Text style={styles.goalPctLabel}>complete</Text>
              </View>
            </View>

            {/* Progress bar */}
            <View style={styles.progressBg}>
              <View style={[
                styles.progressFill,
                {
                  width: `${Math.min(progress * 100, 100)}%`,
                  backgroundColor: progress > 0.8 ? COLORS.primary : COLORS.secondary,
                }
              ]} />
            </View>

            {/* Stats */}
            <View style={styles.goalStats}>
              <GoalStat label="Saved" value={fmt(goal.currentAmount)} color={COLORS.primary} />
              <GoalStat label="Remaining" value={fmt(remaining)} color={COLORS.text} />
              <GoalStat label="Target" value={fmt(goal.targetAmount)} color={COLORS.textMuted} />
            </View>

            {/* AI Insight */}
            <View style={styles.aiInsight}>
              <Text style={{ fontSize: 14 }}>🤖</Text>
              <Text style={styles.aiInsightText}>
                AI suggests saving {fmt(monthlyNeeded)}/month to hit your target on time
              </Text>
            </View>
          </View>
        );
      })}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

function GoalStat({ label, value, color }) {
  return (
    <View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: 20 },
  header: { paddingTop: 60, paddingBottom: 20 },
  title: { color: COLORS.text, fontSize: 26, fontWeight: '800' },
  sub: { color: COLORS.textMuted, fontSize: 13, marginTop: 4 },
  goalCard: {
    backgroundColor: COLORS.card, borderRadius: 20, padding: 20,
    marginBottom: 16, borderWidth: 1, borderColor: COLORS.border,
  },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  goalLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  goalTitle: { color: COLORS.text, fontWeight: '700', fontSize: 16 },
  goalDays: { fontSize: 12, marginTop: 2 },
  goalPct: { alignItems: 'flex-end' },
  goalPctValue: { color: COLORS.primary, fontWeight: '800', fontSize: 22 },
  goalPctLabel: { color: COLORS.textMuted, fontSize: 11 },
  progressBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 4, marginBottom: 16 },
  progressFill: { height: 8, borderRadius: 4 },
  goalStats: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  statLabel: { color: COLORS.textMuted, fontSize: 11 },
  statValue: { fontWeight: '700', fontSize: 15, marginTop: 2 },
  aiInsight: {
    backgroundColor: 'rgba(108,99,255,0.1)', borderRadius: 12, padding: 12,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1, borderColor: 'rgba(108,99,255,0.2)',
  },
  aiInsightText: { color: COLORS.secondary, fontSize: 12, fontWeight: '500', flex: 1 },
});
