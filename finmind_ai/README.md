# FinMind AI — Personal Finance Co-Pilot

> An AI-powered financial assistant that analyzes spending patterns, predicts cash flow, detects anomalies, and gives personalized financial advice.

---

## 📁 Project Structure

```
finmind_ai/
├── flutter_app/        → Flutter mobile app (iOS & Android)
└── react_native_app/   → React Native cross-platform app (iOS & Android)
```

---

## 🚀 Flutter App Setup

### Prerequisites
- Flutter SDK ≥ 3.0.0 → https://flutter.dev/docs/get-started/install
- Android Studio or Xcode
- A connected device or emulator

### Steps

```bash
cd flutter_app
flutter pub get
flutter run
```

> For specific platform:
> ```bash
> flutter run -d android   # Android
> flutter run -d ios       # iOS (Mac only)
> ```

---

## 🚀 React Native App Setup

### Prerequisites
- Node.js ≥ 18 → https://nodejs.org
- React Native CLI: `npm install -g react-native-cli`
- Android Studio or Xcode
- Java 17 (for Android)

### Steps

```bash
cd react_native_app
npm install

# Android
npx react-native run-android

# iOS (Mac only)
cd ios && pod install && cd ..
npx react-native run-ios
```

---

## ✨ Features

| Feature | Flutter | React Native |
|--------|---------|--------------|
| Dashboard with balance card | ✅ | ✅ |
| Spending breakdown chart | ✅ | ✅ |
| AI cash flow forecast | ✅ | ✅ |
| Anomaly detection alerts | ✅ | ✅ |
| Transaction history + filters | ✅ | ✅ |
| Savings goals with AI insights | ✅ | ✅ |
| AI Chat co-pilot | ✅ | ✅ |
| Quick question suggestions | ✅ | ✅ |
| Dark theme UI | ✅ | ✅ |

---

## 🤖 AI Chat — Sample Questions

- "Can I afford a vacation next month?"
- "Where am I overspending?"
- "How's my savings rate?"
- "Cash flow forecast"
- "How long to reach my Japan goal?"
- "Should I invest this month?"

---

## 🎨 Design System

- **Primary:** `#00E5C3` (Teal)
- **Secondary:** `#6C63FF` (Purple)
- **Danger:** `#FF6B6B` (Red)
- **Background:** `#080E15` (Deep Navy)
- **Card:** `#0F1923`

---

## 📦 Key Dependencies

### Flutter
- `fl_chart` — Charts & graphs
- `provider` — State management
- `flutter_animate` — Animations
- `google_fonts` — Typography

### React Native
- `@react-navigation` — Navigation
- `react-native-linear-gradient` — Gradients
- `react-native-reanimated` — Animations

---

## ⚠️ Notes

- All data is **mock/demo data** — no real financial data is used
- AI responses are **rule-based** and pattern-matched locally
- To connect a real AI backend, replace `generateResponse()` / `_generateAIResponse()` with an API call
- No API keys are required to run the app

---

## 🛠️ VS Code Tips

1. Install **Flutter** extension (Dart Code)
2. Install **React Native Tools** extension
3. Use `Ctrl+Shift+P` → "Flutter: Select Device" to pick emulator
4. For RN, open integrated terminal and run Metro bundler separately

---

Built with ❤️ using Flutter & React Native
