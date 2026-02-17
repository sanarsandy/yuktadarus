# Yuktadarus (ODOJ Application)

A modern, full-stack application for **One Day One Juz** (ODOJ) tracking, built with **Nuxt 3** (Frontend) and **Go/Gin** (Backend).

## 🚀 Features

- **📖 Quran Reader**: Read Al-Quran per Juz with beautiful Arabic typography (Amiri font).
- **📝 Juz Tracking**: Track your daily reading progress. Mark Juz as complete.
- **📍 Last Read Position**: Automatically saves your last read Ayah (syncs across devices).
- **📅 Daily Target**: "Today's Goal" feature to keep you on track during Ramadan or daily routines.
- **🏆 Gamification**: Badges, streaks, and progress stats.
- **🌙 Premium UI**: Glassmorphism design, smooth animations, and responsive layout.

## 🛠️ Tech Stack

- **Frontend**: Nuxt 3, Vue 3, TypeScript, Tailwind CSS, Pinia.
- **Backend**: Go (Golang), Gin Framework, GORM.
- **Database**: PostgreSQL.
- **Infrastructure**: Docker & Docker Compose.

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/sanarsandy/yuktadarus.git
    cd yuktadarus
    ```

2.  **Run with Docker (Recommended)**
    Ensure you have Docker installed.
    ```bash
    docker compose up -d --build
    ```
    This will start:
    - Frontend: http://localhost:3000
    - Backend: http://localhost:8080
    - Database: PostgreSQL (Port 5432)

3.  **Manual Setup (Dev)**

    *Frontend:*
    ```bash
    cd app
    npm install
    npm run dev
    ```

    *Backend:*
    ```bash
    cd backend
    go mod download
    go run main.go
    ```

## 🤝 Contribution

Feel free to fork and submit Pull Requests!

## 📄 License

MIT License.
