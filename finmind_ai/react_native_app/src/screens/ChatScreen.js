import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useFinance } from '../context/FinanceContext';
import { COLORS } from '../data/mockData';

const QUICK_QUESTIONS = [
  "Can I afford a vacation? ✈️",
  "Where am I overspending? 📊",
  "How's my savings rate? 💰",
  "Cash flow forecast 🔮",
];

const generateResponse = (query, finance) => {
  const q = query.toLowerCase();
  const savings = finance.totalIncome - finance.totalExpense;
  const savingsRate = finance.savingsRate;

  if (q.includes('vacation') || q.includes('afford') || q.includes('travel')) {
    return savings > 500
      ? `✅ Yes — you can afford a vacation!\n\nHere's the math:\n• Monthly savings: $${savings.toFixed(0)}\n• Current balance: $${finance.totalBalance.toFixed(0)}\n\nA $2,000–$3,000 trip would still leave you $${(finance.totalBalance - 2500).toFixed(0)} remaining.\n\n💡 Tip: Create a vacation savings goal to track it!`
      : `⚠️ It might be tight right now.\n\nYour monthly savings are only $${savings.toFixed(0)}. I'd suggest:\n1. Cut discretionary spending 15%\n2. Cap vacation budget at $${(savings * 2).toFixed(0)}\n3. Save for 2 more months first`;
  }

  if (q.includes('overspend') || q.includes('spending') || q.includes('waste')) {
    return `📊 Spending Analysis:\n\n• Income: $${finance.totalIncome.toFixed(0)}\n• Expenses: $${finance.totalExpense.toFixed(0)}\n• Savings rate: ${savingsRate.toFixed(1)}%\n\n${savingsRate < 20 ? '⚠️ Below recommended 20% savings rate' : '✅ Great savings rate!'}\n\nTop concerns:\n• Food & Dining trending high\n• Shopping spikes this week\n\n💡 Reducing dining out 30% saves ~$${(finance.totalExpense * 0.08).toFixed(0)}/month.`;
  }

  if (q.includes('savings rate') || q.includes('rate')) {
    return `💰 Your Savings Rate: ${savingsRate.toFixed(1)}%\n\n${savingsRate >= 20 ? '✅ You\'re above the recommended 20% threshold!' : '⚠️ The recommended rate is 20%+. You\'re a bit below.'}\n\nBreakdown:\n• Monthly income: $${finance.totalIncome.toFixed(0)}\n• Monthly expenses: $${finance.totalExpense.toFixed(0)}\n• Net savings: $${savings.toFixed(0)}\n\nTo reach 20%: reduce expenses by $${Math.max(0, finance.totalExpense - finance.totalIncome * 0.8).toFixed(0)}/month`;
  }

  if (q.includes('forecast') || q.includes('cash flow') || q.includes('predict')) {
    return `📈 Cash Flow Forecast:\n\nBased on your patterns:\n• Next month income: ~$${(finance.totalIncome * 1.02).toFixed(0)}\n• Next month expenses: ~$${(finance.totalExpense * 1.05).toFixed(0)}\n• Predicted savings: ~$${((finance.totalIncome * 1.02) - (finance.totalExpense * 1.05)).toFixed(0)}\n\n🔮 3-month outlook:\nSpending is trending +3–5% monthly. Set an expense cap of $${(finance.totalExpense * 0.95).toFixed(0)} to stay on track.`;
  }

  return `I understand you're asking about "${query}".\n\nHere's your snapshot:\n• Balance: $${finance.totalBalance.toFixed(0)}\n• Monthly savings: $${savings.toFixed(0)}\n• Savings rate: ${savingsRate.toFixed(1)}%\n\nI can help with:\n• Affordability checks\n• Spending analysis\n• Cash flow predictions\n• Savings goal planning`;
};

export default function ChatScreen() {
  const finance = useFinance();
  const flatListRef = useRef(null);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'ai',
      text: "Hi! I'm your FinMind AI co-pilot 👋\n\nI analyze your spending, predict cash flow, and help you make smarter financial decisions.\n\nTry asking me:\n• \"Can I afford a vacation?\"\n• \"Where am I overspending?\"\n• \"Cash flow forecast\"",
    },
  ]);

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => scrollToBottom(), [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    setInput('');
    Keyboard.dismiss();

    const userMsg = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    await new Promise(r => setTimeout(r, 1400));

    const aiText = generateResponse(text, finance);
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      text: aiText,
    }]);
    setIsThinking(false);
  };

  const renderMessage = ({ item }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.msgRow, isUser && styles.msgRowUser]}>
        {isUser ? (
          <LinearGradient
            colors={[COLORS.secondary, COLORS.primary]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={[styles.bubble, styles.bubbleUser]}
          >
            <Text style={[styles.bubbleText, { color: '#000' }]}>{item.text}</Text>
          </LinearGradient>
        ) : (
          <View style={[styles.bubble, styles.bubbleAi]}>
            <Text style={styles.bubbleText}>{item.text}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={styles.headerIcon}>
          <Text style={{ fontSize: 20 }}>🧠</Text>
        </LinearGradient>
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.headerTitle}>FinMind AI</Text>
          <Text style={styles.headerSub}>Your Finance Co-Pilot</Text>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
        showsVerticalScrollIndicator={false}
        renderItem={renderMessage}
        ListFooterComponent={isThinking ? (
          <View style={[styles.bubble, styles.bubbleAi, { alignSelf: 'flex-start', marginBottom: 12 }]}>
            <Text style={{ color: COLORS.primary }}>Thinking...</Text>
          </View>
        ) : null}
      />

      {/* Quick Questions */}
      <FlatList
        data={QUICK_QUESTIONS}
        horizontal
        keyExtractor={item => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.quickBtn}
            onPress={() => sendMessage(item)}
          >
            <Text style={styles.quickBtnText}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Input */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask FinMind AI anything..."
          placeholderTextColor={COLORS.textMuted}
          onSubmitEditing={() => sendMessage(input)}
          returnKeyType="send"
          multiline={false}
        />
        <TouchableOpacity onPress={() => sendMessage(input)}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary]}
            style={styles.sendBtn}
          >
            <Text style={{ color: '#000', fontWeight: '700', fontSize: 18 }}>↑</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.card,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  headerIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: COLORS.text, fontWeight: '700', fontSize: 16 },
  headerSub: { color: COLORS.primary, fontSize: 12 },
  msgRow: { marginBottom: 12, alignItems: 'flex-start' },
  msgRowUser: { alignItems: 'flex-end' },
  bubble: { maxWidth: '82%', padding: 14, borderRadius: 18 },
  bubbleAi: {
    backgroundColor: COLORS.card, borderTopLeftRadius: 4,
    borderWidth: 1, borderColor: COLORS.border,
  },
  bubbleUser: { borderBottomRightRadius: 4 },
  bubbleText: { color: COLORS.text, fontSize: 14, lineHeight: 21 },
  quickBtn: {
    backgroundColor: COLORS.card, borderRadius: 22,
    paddingHorizontal: 14, paddingVertical: 8, marginRight: 8,
    borderWidth: 1, borderColor: COLORS.border,
  },
  quickBtnText: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  inputBar: {
    flexDirection: 'row', alignItems: 'center', padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 30 : 12,
    backgroundColor: COLORS.card,
    borderTopWidth: 1, borderTopColor: COLORS.border,
    gap: 10,
  },
  input: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16,
    paddingHorizontal: 16, paddingVertical: 12, color: COLORS.text, fontSize: 14,
  },
  sendBtn: { width: 46, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
});
