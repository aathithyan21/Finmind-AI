import 'package:flutter/material.dart';
import 'package:uuid/uuid.dart';
import '../models/finance_model.dart';

class FinanceProvider extends ChangeNotifier {
  final _uuid = const Uuid();
  List<Transaction> _transactions = [];
  List<SavingsGoal> _goals = [];
  List<CashFlowPrediction> _predictions = [];
  bool _isLoading = false;

  List<Transaction> get transactions => _transactions;
  List<SavingsGoal> get goals => _goals;
  List<CashFlowPrediction> get predictions => _predictions;
  bool get isLoading => _isLoading;

  double get totalBalance {
    double income = _transactions
        .where((t) => t.type == TransactionType.income)
        .fold(0, (sum, t) => sum + t.amount);
    double expense = _transactions
        .where((t) => t.type == TransactionType.expense)
        .fold(0, (sum, t) => sum + t.amount);
    return income - expense;
  }

  double get monthlyIncome {
    final now = DateTime.now();
    return _transactions
        .where((t) =>
            t.type == TransactionType.income &&
            t.date.month == now.month &&
            t.date.year == now.year)
        .fold(0, (sum, t) => sum + t.amount);
  }

  double get monthlyExpense {
    final now = DateTime.now();
    return _transactions
        .where((t) =>
            t.type == TransactionType.expense &&
            t.date.month == now.month &&
            t.date.year == now.year)
        .fold(0, (sum, t) => sum + t.amount);
  }

  List<Transaction> get anomalousTransactions =>
      _transactions.where((t) => t.isAnomalous).toList();

  Map<TransactionCategory, double> get categoryBreakdown {
    final map = <TransactionCategory, double>{};
    for (final t in _transactions.where((t) => t.type == TransactionType.expense)) {
      map[t.category] = (map[t.category] ?? 0) + t.amount;
    }
    return map;
  }

  List<Transaction> get recentTransactions {
    final sorted = List<Transaction>.from(_transactions)
      ..sort((a, b) => b.date.compareTo(a.date));
    return sorted.take(10).toList();
  }

  FinanceProvider() {
    _loadMockData();
  }

  void _loadMockData() {
    final now = DateTime.now();

    _transactions = [
      Transaction(
        id: _uuid.v4(),
        title: 'Monthly Salary',
        amount: 8500,
        type: TransactionType.income,
        category: TransactionCategory.salary,
        date: DateTime(now.year, now.month, 1),
      ),
      Transaction(
        id: _uuid.v4(),
        title: 'Freelance Project',
        amount: 2200,
        type: TransactionType.income,
        category: TransactionCategory.investment,
        date: DateTime(now.year, now.month, 5),
      ),
      Transaction(
        id: _uuid.v4(),
        title: 'Restaurant — Nobu',
        amount: 380,
        type: TransactionType.expense,
        category: TransactionCategory.food,
        date: DateTime(now.year, now.month, now.day - 1),
        isAnomalous: true,
        note: 'Unusually high for dining',
      ),
      Transaction(
        id: _uuid.v4(),
        title: 'Uber Eats',
        amount: 45,
        type: TransactionType.expense,
        category: TransactionCategory.food,
        date: DateTime(now.year, now.month, now.day - 2),
      ),
      Transaction(
        id: _uuid.v4(),
        title: 'Netflix + Spotify',
        amount: 28,
        type: TransactionType.expense,
        category: TransactionCategory.entertainment,
        date: DateTime(now.year, now.month, 10),
      ),
      Transaction(
        id: _uuid.v4(),
        title: 'Gym Membership',
        amount: 85,
        type: TransactionType.expense,
        category: TransactionCategory.health,
        date: DateTime(now.year, now.month, 3),
      ),
      Transaction(
        id: _uuid.v4(),
        title: 'Electricity Bill',
        amount: 120,
        type: TransactionType.expense,
        category: TransactionCategory.utilities,
        date: DateTime(now.year, now.month, 8),
      ),
      Transaction(
        id: _uuid.v4(),
        title: 'Amazon Shopping',
        amount: 340,
        type: TransactionType.expense,
        category: TransactionCategory.shopping,
        date: DateTime(now.year, now.month, 12),
        isAnomalous: true,
        note: 'Higher than usual shopping spend',
      ),
      Transaction(
        id: _uuid.v4(),
        title: 'Metro Card',
        amount: 65,
        type: TransactionType.expense,
        category: TransactionCategory.transport,
        date: DateTime(now.year, now.month, 2),
      ),
      Transaction(
        id: _uuid.v4(),
        title: 'Stock Dividend',
        amount: 450,
        type: TransactionType.income,
        category: TransactionCategory.investment,
        date: DateTime(now.year, now.month, 15),
      ),
    ];

    _goals = [
      SavingsGoal(
        id: _uuid.v4(),
        title: 'Emergency Fund',
        targetAmount: 25000,
        currentAmount: 18500,
        deadline: DateTime(now.year + 1, 3, 1),
        icon: '🛡️',
      ),
      SavingsGoal(
        id: _uuid.v4(),
        title: 'Dream Vacation — Japan',
        targetAmount: 8000,
        currentAmount: 3200,
        deadline: DateTime(now.year, 12, 15),
        icon: '✈️',
      ),
      SavingsGoal(
        id: _uuid.v4(),
        title: 'MacBook Pro',
        targetAmount: 3500,
        currentAmount: 2800,
        deadline: DateTime(now.year, now.month + 2, 1),
        icon: '💻',
      ),
    ];

    _predictions = List.generate(6, (i) {
      final month = DateTime(now.year, now.month + i + 1, 1);
      final baseIncome = 10700 + (i * 200) + (i % 2 == 0 ? 500 : 0);
      final baseExpense = 4800 + (i * 120) + (i % 3 == 0 ? 300 : 0);
      return CashFlowPrediction(
        month: month,
        predictedIncome: baseIncome.toDouble(),
        predictedExpense: baseExpense.toDouble(),
        confidence: 0.85 - (i * 0.05),
      );
    });

    notifyListeners();
  }

  void addTransaction(Transaction transaction) {
    _transactions.insert(0, transaction);
    notifyListeners();
  }

  void updateGoalAmount(String goalId, double amount) {
    final goal = _goals.firstWhere((g) => g.id == goalId);
    goal.currentAmount = (goal.currentAmount + amount).clamp(0, goal.targetAmount);
    notifyListeners();
  }
}
