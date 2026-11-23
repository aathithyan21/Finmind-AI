import 'package:intl/intl.dart';

enum TransactionType { income, expense }

enum TransactionCategory {
  food,
  transport,
  shopping,
  entertainment,
  health,
  utilities,
  salary,
  investment,
  other,
}

class Transaction {
  final String id;
  final String title;
  final double amount;
  final TransactionType type;
  final TransactionCategory category;
  final DateTime date;
  final String? note;
  final bool isAnomalous;

  Transaction({
    required this.id,
    required this.title,
    required this.amount,
    required this.type,
    required this.category,
    required this.date,
    this.note,
    this.isAnomalous = false,
  });

  String get formattedAmount {
    final formatter = NumberFormat.currency(symbol: '\$', decimalDigits: 2);
    return formatter.format(amount);
  }

  String get formattedDate {
    return DateFormat('MMM d, yyyy').format(date);
  }

  String get categoryIcon {
    switch (category) {
      case TransactionCategory.food:
        return '🍽️';
      case TransactionCategory.transport:
        return '🚗';
      case TransactionCategory.shopping:
        return '🛍️';
      case TransactionCategory.entertainment:
        return '🎬';
      case TransactionCategory.health:
        return '💊';
      case TransactionCategory.utilities:
        return '⚡';
      case TransactionCategory.salary:
        return '💼';
      case TransactionCategory.investment:
        return '📈';
      case TransactionCategory.other:
        return '📌';
    }
  }

  String get categoryName {
    switch (category) {
      case TransactionCategory.food:
        return 'Food';
      case TransactionCategory.transport:
        return 'Transport';
      case TransactionCategory.shopping:
        return 'Shopping';
      case TransactionCategory.entertainment:
        return 'Entertainment';
      case TransactionCategory.health:
        return 'Health';
      case TransactionCategory.utilities:
        return 'Utilities';
      case TransactionCategory.salary:
        return 'Salary';
      case TransactionCategory.investment:
        return 'Investment';
      case TransactionCategory.other:
        return 'Other';
    }
  }
}

class SavingsGoal {
  final String id;
  final String title;
  final double targetAmount;
  double currentAmount;
  final DateTime deadline;
  final String icon;

  SavingsGoal({
    required this.id,
    required this.title,
    required this.targetAmount,
    required this.currentAmount,
    required this.deadline,
    required this.icon,
  });

  double get progress => (currentAmount / targetAmount).clamp(0.0, 1.0);

  String get progressPercent => '${(progress * 100).toStringAsFixed(0)}%';

  int get daysRemaining => deadline.difference(DateTime.now()).inDays;

  double get monthlyRequired {
    final months = daysRemaining / 30;
    if (months <= 0) return targetAmount - currentAmount;
    return (targetAmount - currentAmount) / months;
  }
}

class CashFlowPrediction {
  final DateTime month;
  final double predictedIncome;
  final double predictedExpense;
  final double confidence;

  CashFlowPrediction({
    required this.month,
    required this.predictedIncome,
    required this.predictedExpense,
    required this.confidence,
  });

  double get netFlow => predictedIncome - predictedExpense;
}
