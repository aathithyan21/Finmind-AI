import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useFinance } from '../context/FinanceContext';
import { COLORS } from '../data/mockData';

const fmt = (n) =>
  '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function TransactionsScreen() {
  const { transactions } = useFinance();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? transactions
    : transactions.filter(t => t.type === filter);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
        <View style={styles.filters}>
          {['all', 'income', 'expense'].map(f => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterChip,
                filter === f && {
                  backgroundColor:
                    f === 'income' ? 'rgba(0,229,195,0.2)' :
                    f === 'expense' ? 'rgba(255,107,107,0.2)' :
                    'rgba(108,99,255,0.2)',
                  borderColor:
                    f === 'income' ? 'rgba(0,229,195,0.5)' :
                    f === 'expense' ? 'rgba(255,107,107,0.5)' :
                    'rgba(108,99,255,0.5)',
                }
              ]}
              onPress={() => setFilter(f)}
            >
              <Text style={[
                styles.filterText,
                filter === f && {
                  color:
                    f === 'income' ? COLORS.primary :
                    f === 'expense' ? COLORS.danger :
                    COLORS.secondary,
                  fontWeight: '600',
                }
              ]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isIncome = item.type === 'income';
          const amountColor = isIncome ? COLORS.primary : COLORS.danger;
          return (
            <View style={[
              styles.txItem,
              item.isAnomalous && { borderColor: 'rgba(255,107,107,0.3)' }
            ]}>
              <View style={[styles.txIcon, { backgroundColor: `${amountColor}18` }]}>
                <Text style={{ fontSize: 22 }}>{item.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.txTitleRow}>
                  <Text style={styles.txTitle} numberOfLines={1}>{item.title}</Text>
                  {item.isAnomalous && (
                    <View style={styles.aiBadge}>
                      <Text style={styles.aiBadgeText}>⚠ AI</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.txMeta}>
                  {item.category} · {item.date}
                </Text>
                {item.note && (
                  <Text style={styles.txNote}>{item.note}</Text>
                )}
              </View>
              <Text style={[styles.txAmount, { color: amountColor }]}>
                {isIncome ? '+' : '-'}{fmt(item.amount)}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16, backgroundColor: COLORS.bg },
  title: { color: COLORS.text, fontSize: 26, fontWeight: '800', marginBottom: 16 },
  filters: { flexDirection: 'row', gap: 8 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'transparent',
  },
  filterText: { color: COLORS.textMuted, fontSize: 13 },
  txItem: {
    backgroundColor: COLORS.card, borderRadius: 16, padding: 16,
    flexDirection: 'row', alignItems: 'center', marginBottom: 10,
    borderWidth: 1, borderColor: COLORS.border,
  },
  txIcon: { width: 46, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  txTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  txTitle: { color: COLORS.text, fontWeight: '600', fontSize: 15, flex: 1 },
  aiBadge: {
    backgroundColor: 'rgba(255,107,107,0.2)', borderRadius: 6,
    paddingHorizontal: 6, paddingVertical: 2, marginLeft: 6,
  },
  aiBadgeText: { color: COLORS.danger, fontSize: 10, fontWeight: '700' },
  txMeta: { color: COLORS.textMuted, fontSize: 12 },
  txNote: { color: COLORS.danger, fontSize: 11, marginTop: 2 },
  txAmount: { fontWeight: '700', fontSize: 15 },
});
