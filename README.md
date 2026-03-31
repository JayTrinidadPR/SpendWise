# SpendWise

## 🚀 30-Second Elevator Pitch

SpendWise is a modern personal finance web application that helps users understand their full money picture in one place. Built with the PERN stack, it allows users to manage multiple income sources, track expenses by category, and immediately see whether their spending is outpacing their income. With a clean dashboard, category-based insights, and overspending alerts, SpendWise turns budgeting into something visual, organized, and easier to act on.

---

## 🎯 Core MVP Features

These are the essential features included in the first working version of SpendWise:

### 👤 User Authentication

- User registration and login
- Protected routes for authenticated users
- Logout flow with transition screen

### 💵 Income Management

- Add multiple income sources
- Store income source name, amount, frequency, and optional pay dates
- Edit and delete income sources

### 🧾 Expense Tracking

- Add expenses with title, amount, category, date, and recurring status
- Edit and delete expenses
- Filter expenses by category

### 📊 Dashboard Overview

- View total income
- View total expenses
- View remaining balance
- Display an overspending alert when expenses exceed income

### 📈 Category Insights

- Visual expense breakdown by category
- Highest-spending category highlight
- Charts that color expenses from highest to lowest intensity

## 🌟 Stretch Goal Features

These features are planned to expand SpendWise beyond the MVP:

- Debt payoff planner using the snowball strategy
- Monthly category budget targets
- Recurring expense automation
- Downloadable or exportable monthly summary
- More advanced financial analytics and trends

## 🛠️ Tech Stack

- Frontend: React, React Router, Vite, Recharts
- Backend: Node.js, Express
- Database: PostgreSQL
- Authentication: JSON Web Tokens (JWT) with hashed passwords
- Local testing mode: Demo datastore for browser testing without Postgres setup

## 🗄️ Database Design

The current database schema for the MVP includes four main tables:


```mermaid
erDiagram
    USERS {
        UUID id PK
        TEXT username
        TEXT email
        TEXT password_hash 
        TIMESTAMP created_at
    }

### `income_sources`

- `id` - primary key
- `user_id` - foreign key to users
- `source_name` - name of income source
- `amount` - income amount
- `frequency` - weekly, biweekly, twice monthly, or monthly
- `pay_date_1` - optional fixed pay date
- `pay_date_2` - optional second pay date
- `is_active` - whether source is active
- `created_at` - timestamp

### `categories`

- `id` - primary key
- `name` - category name

### `expenses`

- `id` - primary key
- `user_id` - foreign key to users
- `category_id` - foreign key to categories
- `title` - expense title
- `amount` - expense amount
- `expense_date` - date of expense
- `is_recurring` - recurring flag
- `recurring_frequency` - recurring cadence if applicable
- `created_at` - timestamp