# Budget Planner - Personal Finance Management

A modern, responsive JavaScript web application for managing personal finances, tracking expenses, and achieving savings goals.

---

## Project Purpose

This application was developed as a **JavaScript Assignment** to demonstrate proficiency in JavaScript, HTML, CSS, and Test-Driven Development (TDD).

---

## Key Features

- **Income Management**: Set and track monthly income with date-based entries
- **Expense Tracking**: Add, edit, and delete expenses with categories
- **Financial Analytics**: Real-time balance and savings percentage
- **Modern UI**: Responsive design with pastel/blue color scheme
- **Data Persistence**: LocalStorage for data saving

---

## Technologies

- **HTML5**: Semantic markup
- **CSS3**: Responsive design with flexbox/grid
- **JavaScript (ES6+)**: Modular architecture
- **Google Fonts**: Poppins typography
- **Vitest**: Testing framework

---

## Quick Start

1. **Clone repository**
   ```bash
   git clone https://github.com/zohersahli/Budget-Planner.git

   cd budget-planner
   ```

2. **Install dependencies** (for testing)
   ```bash
   npm install
   ```

3. **Open application**
   - Double-click `index.html`
   

4. **Run tests**
   ```bash
   npm test
   ```

---

## 🧪 Testing

- **Framework**: Vitest with happy-dom
- **Test File**: `budgetMath.test.js`
- **Coverage**: Core calculations and edge cases
- **Approach**: Test-Driven Development (TDD)

### How Tests Work

The test suite validates two core mathematical functions:

#### 1. `calculateRemaining(income, expenses)`
Tests the remaining balance calculation:
- ✅ **Normal cases**: Positive income and expenses
- ✅ **Zero expenses**: When no expenses are recorded
- ✅ **Overspending**: When expenses exceed income
- ✅ **Edge cases**: Zero income, negative values

#### 2. `calculateSavingPercentage(income, expenses)`
Tests the savings percentage calculation:
- ✅ **Positive savings**: When income > expenses
- ✅ **Zero savings**: When income = expenses  
- ✅ **Negative savings**: When expenses > income
- ✅ **Rounding accuracy**: Proper decimal handling

### Running Tests

```bash
npm install    # Install dependencies
npm test       # Run all tests
```

## Future Enhancements

- Cloud synchronization
- Multiple currency support
- Data export/import
- Advanced analytics and charts
- Budget goals and alerts

## Author

Zoher Sahli 


