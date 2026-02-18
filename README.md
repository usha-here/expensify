# Expensify Expense Tracker 💸

Welcome to the **Expensify Expense Tracker** project! This application helps users manage their expenses effectively by allowing them to track, categorize, and visualize their spending.

##  📌 Features 
- **User-Friendly Interface**: Navigate easily with our intuitive interface.
- **Expense Tracking**: Add, edit, and delete your expenses seamlessly.
- **Categorization**: Organize your expenses into categories for better management.
- **Visualization**: Get insights into your spending habits with informative charts.

## 🔗 Deployed Link 
Explore the live application here: [Expensify Expense Tracker](https://expensify-tau.vercel.app/)

## 📌 Repository Structure 
```bash
expense-tracker/
│
├── backend/        # Express API
├── frontend/       # React client
└── README.md
```


## 🛠 Getting Started 
To get started with the project, clone the repository and run the following commands:

1. Backend
```bash
cd backend
npm install
# Ensure MongoDB is running
npm start
```
Server runs on http://localhost:3001.

2. Frontend
```bash
cd frontend
npm install
npm run dev
```

## ⭐ Features 
- Add Expenses – Create new expense entries with amount, category, description, and date.
- View Expenses – Display a list of all recorded expenses in a clear table format.
- Filter by Category – Quickly filter expenses to view specific spending categories.
- Sort by Date – Sort expenses by newest first for better tracking of recent transactions.
- Total Calculation – Automatically calculates and displays the total of the currently visible expenses (e.g., Total: ₹X).
- Persistent Storage – Expenses are saved in the backend database and remain available after page refresh.
- Duplicate Submission Handling – Designed to prevent duplicate expense creation due to multiple clicks or network retries.
- Generate reports.

## 🧠 Trade Offs  
Due to limited scope:
- No authentication
- No advanced analytics
- No advanced UI styling
- No complex state management (Redux/Context) as local state was sufficient.

## 💡 Contributing 
Contributions are welcome! Please follow the standard fork-and-pull request workflow.

## 👤 Made By 
Usha Nitwal
