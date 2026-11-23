import 'package:flutter/material.dart';

enum MessageSender { user, ai }

class ChatMessage {
  final String id;
  final String content;
  final MessageSender sender;
  final DateTime timestamp;
  final bool isTyping;

  ChatMessage({
    required this.id,
    required this.content,
    required this.sender,
    required this.timestamp,
    this.isTyping = false,
  });
}

class ChatProvider extends ChangeNotifier {
  final List<ChatMessage> _messages = [];
  bool _isThinking = false;

  List<ChatMessage> get messages => List.unmodifiable(_messages);
  bool get isThinking => _isThinking;

  ChatProvider() {
    _addWelcome();
  }

  void _addWelcome() {
    _messages.add(ChatMessage(
      id: 'welcome',
      content:
          "Hi! I'm your FinMind AI co-pilot 👋\n\nI can help you analyze your spending, predict cash flow, check if you can afford something, or review your savings goals.\n\nTry asking me something like:\n• \"Can I afford a vacation next month?\"\n• \"Where am I overspending?\"\n• \"How long to reach my Japan goal?\"",
      sender: MessageSender.ai,
      timestamp: DateTime.now(),
    ));
  }

  Future<void> sendMessage(String userText, {
    double balance = 0,
    double monthlyIncome = 0,
    double monthlyExpense = 0,
    List<String> anomalies = const [],
    List<String> goals = const [],
  }) async {
    final userMsg = ChatMessage(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      content: userText,
      sender: MessageSender.user,
      timestamp: DateTime.now(),
    );
    _messages.add(userMsg);
    _isThinking = true;
    notifyListeners();

    await Future.delayed(const Duration(milliseconds: 1500));

    final response = _generateAIResponse(
      userText,
      balance: balance,
      monthlyIncome: monthlyIncome,
      monthlyExpense: monthlyExpense,
      anomalies: anomalies,
      goals: goals,
    );

    _messages.add(ChatMessage(
      id: '${DateTime.now().millisecondsSinceEpoch}_ai',
      content: response,
      sender: MessageSender.ai,
      timestamp: DateTime.now(),
    ));
    _isThinking = false;
    notifyListeners();
  }

  String _generateAIResponse(
    String query, {
    double balance = 0,
    double monthlyIncome = 0,
    double monthlyExpense = 0,
    List<String> anomalies = const [],
    List<String> goals = const [],
  }) {
    final q = query.toLowerCase();
    final savings = monthlyIncome - monthlyExpense;
    final savingsRate = monthlyIncome > 0 ? (savings / monthlyIncome * 100) : 0;

    if (q.contains('vacation') || q.contains('afford') || q.contains('travel')) {
      if (savings > 500) {
        return "✅ Based on your current finances, yes — you can afford a vacation!\n\nHere's the math:\n• Monthly savings: \$${savings.toStringAsFixed(0)}\n• Current balance: \$${balance.toStringAsFixed(0)}\n\nIf you spend \$2,000–\$3,000 on a vacation next month, you'd still have \$${(balance - 2500).toStringAsFixed(0)} remaining.\n\n💡 Pro tip: Set up a dedicated vacation savings goal to track it separately!";
      } else {
        return "⚠️ It might be tight right now.\n\nYour current monthly savings are only \$${savings.toStringAsFixed(0)}. A vacation could strain your budget.\n\n📋 My recommendations:\n1. Cut discretionary spending by 15% this month\n2. Set a vacation budget cap of \$${(savings * 2).toStringAsFixed(0)}\n3. Wait 2 months to accumulate \$${(savings * 2).toStringAsFixed(0)} in savings\n\nWant me to create a vacation savings plan?";
      }
    }

    if (q.contains('overspend') || q.contains('spending') || q.contains('waste')) {
      String anomalyText = anomalies.isNotEmpty
          ? '\n\n🚨 Flagged anomalies:\n${anomalies.map((a) => '• $a').join('\n')}'
          : '';
      return "📊 Spending Analysis for This Month:\n\n• Total income: \$${monthlyIncome.toStringAsFixed(0)}\n• Total expenses: \$${monthlyExpense.toStringAsFixed(0)}\n• Savings rate: ${savingsRate.toStringAsFixed(1)}%\n${savingsRate < 20 ? '\n⚠️ Your savings rate is below the recommended 20%.' : '\n✅ Great savings rate!'}\n\nTop areas to watch:\n• Food & Dining is trending high\n• Shopping spikes detected this week$anomalyText\n\n💡 Reducing dining out by 30% could save you \$${(monthlyExpense * 0.08).toStringAsFixed(0)}/month.";
    }

    if (q.contains('goal') || q.contains('japan') || q.contains('save') || q.contains('savings')) {
      return "🎯 Savings Goal Analysis:\n\nYour Japan vacation goal needs \$4,800 more.\n\n📅 At your current savings rate of \$${savings.toStringAsFixed(0)}/month:\n• Time to reach goal: ${savings > 0 ? (4800 / savings).toStringAsFixed(1) : '∞'} months\n\n🚀 To hit it by December:\n• Save \$685/month extra\n• Or reduce expenses by 15%\n\n💡 Quick wins:\n1. Pause unused subscriptions (~\$45/mo)\n2. Meal prep 3x/week (~\$120/mo saved)\n3. Skip 1 dining out/week (~\$80/mo)";
    }

    if (q.contains('cash flow') || q.contains('predict') || q.contains('next month') || q.contains('forecast')) {
      return "📈 Cash Flow Forecast:\n\nBased on your spending patterns:\n\n• Next month income: ~\$${(monthlyIncome * 1.02).toStringAsFixed(0)}\n• Next month expenses: ~\$${(monthlyExpense * 1.05).toStringAsFixed(0)}\n• Predicted savings: ~\$${((monthlyIncome * 1.02) - (monthlyExpense * 1.05)).toStringAsFixed(0)}\n\n🔮 3-month outlook:\nYour spending is trending up 3–5% monthly. If unchecked, your savings rate could drop from ${savingsRate.toStringAsFixed(0)}% to ${(savingsRate * 0.85).toStringAsFixed(0)}% by Q3.\n\n✅ Action: Set a monthly expense cap of \$${(monthlyExpense * 0.95).toStringAsFixed(0)} to stay on track.";
    }

    if (q.contains('balance') || q.contains('how much')) {
      return "💰 Your Financial Snapshot:\n\n• Current balance: \$${balance.toStringAsFixed(2)}\n• This month's income: \$${monthlyIncome.toStringAsFixed(0)}\n• This month's expenses: \$${monthlyExpense.toStringAsFixed(0)}\n• Net savings: \$${savings.toStringAsFixed(0)}\n\nYou're ${savings > 0 ? '✅ in the green' : '🔴 in the red'} this month.\n\nWant a full breakdown by category?";
    }

    if (q.contains('invest') || q.contains('stock') || q.contains('portfolio')) {
      return "📊 Investment Insight:\n\nWith a monthly surplus of \$${savings.toStringAsFixed(0)}, here's what I'd suggest:\n\n1. 🛡️ Emergency fund first (you're at 74% — top it up)\n2. 📈 Index funds: Put \$${(savings * 0.4).toStringAsFixed(0)}/month in low-cost ETFs\n3. 💹 Growth portfolio: \$${(savings * 0.2).toStringAsFixed(0)} in sector picks\n4. 💰 High-yield savings: \$${(savings * 0.4).toStringAsFixed(0)} liquid\n\n⚠️ Disclaimer: This is AI-generated guidance. Always consult a licensed financial advisor for investment decisions.";
    }

    return "I understand you're asking about \"$query\".\n\nHere's what I can tell you based on your financial data:\n\n• Balance: \$${balance.toStringAsFixed(0)}\n• Monthly savings: \$${savings.toStringAsFixed(0)}\n• Savings rate: ${savingsRate.toStringAsFixed(1)}%\n\nCould you be more specific? I can help with:\n• Affordability checks\n• Spending analysis\n• Cash flow predictions\n• Savings goal planning\n• Investment suggestions";
  }

  void clearChat() {
    _messages.clear();
    _addWelcome();
    notifyListeners();
  }
}
