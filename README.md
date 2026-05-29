# VitalityAI Frontend

Production frontend for the VitalityAI wellness platform.

## Backend

- Base URL: `https://vetalityai.onrender.com/api`
- Swagger: `https://vetalityai.onrender.com/swagger`
- Environment variable: `VITE_API_BASE_URL`

## Supported Features

- JWT login, registration, session restore, refresh-token retry, logout/revoke
- Profile setup using activity-level and goal lookups
- User dashboard with live dashboard, meal, stat, water, and Google Fit summaries
- AI meal-plan generation and weekly/monthly planner views
- Daily metrics, hydration, and meal completion tracking
- Nearby restaurant discovery using browser geolocation
- Admin dashboard, users, meals, restaurants, and workout management

Unsupported backend features such as notifications, chatbot APIs, and workout completion are not exposed in the UI.

## Commands

```bash
npm install
npm run dev
npm run build
```
