# HabiTracker

**HabiTracker** is a sophisticated, AI-powered habit and productivity management system designed to help users build positive habits, track their time, and achieve their personal goals with precision and motivation.

## ✨ Key Features

### 🧠 AI-Powered Insights & Efficiency
- **AI Habit Coach**: Get intelligent suggestions and insights to optimize your habit formation strategy.
- **Efficiency Weighting**: Automatically adjusts your habit scores based on the time invested, ensuring you're rewarded for effort.
- **AI-Generated Summaries**: Receive daily and weekly reports that highlight your progress and areas for improvement.

### 🎯 Advanced Habit Tracking
- **Streak System**: Maintain unbroken chains of consistency to build momentum.
- **Smart Reminders**: Never miss a session with intelligent, context-aware notifications.
- **Customizable Metrics**: Track habits by frequency, duration, or completion status.

### 💰 Financial Wellness
- **Expense Tracking**: Log and categorize your daily expenses to monitor your spending habits.
- **Savings Goals**: Set financial targets and track your progress towards achieving them.
- **Income Management**: Keep a clear overview of your earnings and cash flow.

### 🎮 Gamification & Motivation
- **Virtual Pet**: A Tamagotchi-style companion that grows and thrives based on your consistency. Neglect your habits, and your pet suffers; stay consistent, and watch it flourish.
- **Points & Levels**: Earn points for every completed habit and level up to unlock new badges and achievements.
- **Monthly Wrapped**: A visually stunning, shareable summary of your monthly achievements, similar to Spotify Wrapped.

### 🎨 Premium User Experience
- **Cinematic Dark Mode**: An immersive, high-contrast dark theme designed for focus and visual appeal.
- **Elegant UI**: A modern, glassmorphism-inspired interface with smooth animations and micro-interactions.
- **Customization**: Personalize your dashboard, themes, and notification preferences.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A MongoDB database (local or cloud-based like MongoDB Atlas)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd HabiTracker
    ```

2.  **Install dependencies:**
    ```bash
    cd frontend
    npm install
    cd ..
    cd backend
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the `backend` directory with the following variables:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key
    ```

4.  **Run the Application:**
    ```bash
    # Start the backend
    cd backend
    npm run dev

    # Start the frontend
    cd ../frontend
    npm run dev
    ```

## 🛠️ Tech Stack

### Frontend
- **React 18**: Component-based UI library.
- **Vite**: Fast build tool and development server.
- **Tailwind CSS**: Utility-first CSS framework for rapid styling.
- **Lucide React**: Icon library.
- **React Router**: Navigation.
- **React Hot Toast**: Notification system.

### Backend
- **Node.js & Express**: Server framework.
- **MongoDB**: NoSQL database.
- **Mongoose**: ODM for MongoDB.
- **JWT (JSON Web Tokens)**: Authentication.
- **Bcrypt**: Password hashing.
- **Axios**: HTTP client for AI API calls.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
