import { getIncome } from "./income.js";
import { getTotalExpenses } from "./expenses.js";
import { calculateRemaining, calculateSavingPercentage } from "./budgetMath.js";

export function updateSummary() {
  const income = getIncome();
  const totalExpenses = getTotalExpenses();
  const remaining = calculateRemaining(income, totalExpenses);
  const savedPercent = calculateSavingPercentage(income, totalExpenses);

  const totalExpensesElement = document.getElementById("total-expenses");
  const remainingBalanceElement = document.getElementById("remaining-balance");
  const savedPercentageElement = document.getElementById("saved-percentage");

  if (totalExpensesElement) totalExpensesElement.textContent = totalExpenses;
  if (remainingBalanceElement) remainingBalanceElement.textContent = remaining;
  if (savedPercentageElement) savedPercentageElement.textContent = savedPercent + "%";

  const remainingCard = document.getElementById("remaining-card");
  const savedCard = document.getElementById("saved-card");
  const savedPercentage = document.getElementById("saved-percentage");

  if (remainingCard) {
    if (remaining > 0) {
      remainingCard.className = "summary-card positive";
    } else if (remaining < 0) {
      remainingCard.className = "summary-card negative";
    } else {
      remainingCard.className = "summary-card neutral";
    }
  }

  if (savedCard && savedPercentage) {
    if (savedPercent > 0) {
      savedCard.className = "summary-card positive";
      savedPercentage.className = "percentage";
    } else if (savedPercent < 0) {
      savedCard.className = "summary-card negative";
      savedPercentage.className = "percentage negative";
    } else {
      savedCard.className = "summary-card neutral";
      savedPercentage.className = "percentage";
    }
  }
}

function safeGetFromStorage(key, defaultValue) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} data:`, error);
    return defaultValue;
  }
}

export function showAnalysis() {
  const filterYear = document.getElementById("filter-year");
  const filterMonth = document.getElementById("filter-month");
  const filterCategory = document.getElementById("filter-category");
  const monthlyDiv = document.getElementById("monthly-totals");
  const yearlyDisplay = document.getElementById("yearly-total-expenses");

  const expenses = safeGetFromStorage("expenses", []);

  const selectedYear = filterYear.value;
  const selectedMonth = filterMonth.value;
  const selectedCategory = filterCategory.value;

  const filtered = expenses.filter((exp) => {
    const expYear = exp.date.slice(0, 4); 
    const expMonth = exp.date.slice(0, 7); 
    
    const matchYear = selectedYear === "all" || expYear === selectedYear;
    const matchMonth = selectedMonth === "all" || expMonth === selectedMonth;
    const matchCategory = selectedCategory === "all" || exp.category === selectedCategory;
    
    return matchYear && matchMonth && matchCategory;
  });

  monthlyDiv.innerHTML = "";
  if (filtered.length === 0) {
    monthlyDiv.innerHTML = '<div class="analysis-results"><h4>📋 No Results Found</h4><p>No expenses found for the selected filters.</p></div>';
  } else {
    monthlyDiv.innerHTML = '<div class="analysis-results"><h4>📋 Filtered Expenses</h4>';
    filtered.forEach((exp) => {
      const p = document.createElement("p");
      const formattedDate = new Date(exp.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
      p.textContent = `${formattedDate} - ${exp.name} (${exp.category}): ${exp.amount} SEK`;
      monthlyDiv.appendChild(p);
    });
    monthlyDiv.innerHTML += '</div>';
  }

  const total = filtered.reduce((sum, exp) => sum + exp.amount, 0);
  yearlyDisplay.textContent = `Total Expenses: ${total} SEK`;
}

function updateFilters(expenses) {
  const filterYear = document.getElementById("filter-year");
  const filterMonth = document.getElementById("filter-month");
  const filterCategory = document.getElementById("filter-category");

  const years = [...new Set(expenses.map((exp) => exp.date.slice(0, 4)))];
  const months = [...new Set(expenses.map((exp) => exp.date.slice(0, 7)))];
  const categories = [...new Set(expenses.map((exp) => exp.category))];

  years.sort((a, b) => b - a); 
  months.sort((a, b) => b.localeCompare(a)); 

  filterYear.innerHTML = `<option value="all">All Years</option>` +
    years.map((y) => `<option value="${y}">${y}</option>`).join("");

  filterMonth.innerHTML = `<option value="all">All Months</option>` +
    months.map((m) => {
      const [year, month] = m.split("-");
      const monthName = new Date(year, month - 1).toLocaleDateString("en-GB", { month: "long" });
      return `<option value="${m}">${monthName}</option>`;
    }).join("");

  filterCategory.innerHTML = `<option value="all">All Categories</option>` +
    categories.sort().map((c) => `<option value="${c}">${c}</option>`).join("");
}

export function updateFiltersAtStart() {
  const expenses = safeGetFromStorage("expenses", []);
  updateFilters(expenses);
}

export function initializeFilterEvents() {
  const filterYear = document.getElementById("filter-year");
  const filterMonth = document.getElementById("filter-month");
  const filterCategory = document.getElementById("filter-category");
  const incomeFilterYear = document.getElementById("income-filter-year");
  const incomeFilterMonth = document.getElementById("income-filter-month");

  if (filterYear && filterMonth && filterCategory) {
    filterYear.onchange = showAnalysis;
    filterMonth.onchange = showAnalysis;
    filterCategory.onchange = showAnalysis;
  }

  if (incomeFilterYear && incomeFilterMonth) {
    incomeFilterYear.onchange = showIncomeAnalysis;
    incomeFilterMonth.onchange = showIncomeAnalysis;
  }
}

export function showIncomeAnalysis() {
  const filterYear = document.getElementById("income-filter-year");
  const filterMonth = document.getElementById("income-filter-month");
  const incomeDiv = document.getElementById("income-totals");
  const yearlyDisplay = document.getElementById("yearly-total-income");

  const incomeData = safeGetFromStorage("incomeData", {});

  const selectedYear = filterYear.value;
  const selectedMonth = filterMonth.value;

  const incomeEntries = [];
  for (let monthKey in incomeData) {
    const incomes = Array.isArray(incomeData[monthKey]) ? incomeData[monthKey] : [incomeData[monthKey]];
    incomes.forEach((amount, index) => {
      incomeEntries.push({
        month: monthKey,
        year: monthKey.slice(0, 4),
        amount: amount,
        date: `${monthKey}-01` 
      });
    });
  }

  const filtered = incomeEntries.filter((entry) => {
    const matchYear = selectedYear === "all" || entry.year === selectedYear;
    const matchMonth = selectedMonth === "all" || entry.month === selectedMonth;
    return matchYear && matchMonth;
  });

  incomeDiv.innerHTML = "";
  if (filtered.length === 0) {
    incomeDiv.innerHTML = '<div class="analysis-results"><h4>No Income Found</h4><p>No income found for the selected filters.</p></div>';
  } else {
    incomeDiv.innerHTML = '<div class="analysis-results"><h4>Filtered Income</h4>';
    filtered.forEach((entry) => {
      const p = document.createElement("p");
      const monthName = new Date(entry.date).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric"
      });
      p.textContent = `${monthName}: ${entry.amount} SEK`;
      incomeDiv.appendChild(p);
    });
    incomeDiv.innerHTML += '</div>';
  }

  const total = filtered.reduce((sum, entry) => sum + entry.amount, 0);
  yearlyDisplay.textContent = `Total Income: ${total} SEK`;
}

function updateIncomeFilters(incomeData) {
  const filterYear = document.getElementById("income-filter-year");
  const filterMonth = document.getElementById("income-filter-month");

  const years = [...new Set(Object.keys(incomeData).map(month => month.slice(0, 4)))];
  const months = [...new Set(Object.keys(incomeData))];

  years.sort((a, b) => b - a);
  months.sort((a, b) => b.localeCompare(a));

  filterYear.innerHTML = `<option value="all">All Years</option>` +
    years.map((y) => `<option value="${y}">${y}</option>`).join("");

  filterMonth.innerHTML = `<option value="all">All Months</option>` +
    months.map((m) => {
      const [year, month] = m.split("-");
      const monthName = new Date(year, month - 1).toLocaleDateString("en-GB", { month: "long" });
      return `<option value="${m}">${monthName}</option>`;
    }).join("");
}

export function updateIncomeFiltersAtStart() {
  const incomeData = safeGetFromStorage("incomeData", {});
  updateIncomeFilters(incomeData);
}

export function showMessage(message, type = 'info', duration = 3000) {
  const messageContainer = document.getElementById('message-container');
  if (!messageContainer) return;

  const messageElement = document.createElement('div');
  messageElement.className = `message ${type}`;
  messageElement.textContent = message;

  messageContainer.appendChild(messageElement);

  setTimeout(() => {
    messageElement.classList.add('hide');
    setTimeout(() => {
      if (messageElement.parentNode) {
        messageElement.parentNode.removeChild(messageElement);
      }
    }, 500);
  }, duration);
}

export function clearAllData() {
  if (!confirm('WARNING: This will permanently delete ALL your data!\n\nAre you sure you want to continue?')) {
    return;
  }
  
  if (!confirm('FINAL WARNING: This action cannot be undone!\n\nType "delete" to confirm:')) {
    return;
  }
  
  const userInput = prompt('Please type "delete" to confirm this action:');
  if (userInput !== 'delete') {
    showMessage('Action cancelled. Data was not deleted.', 'info');
    return;
  }
  
  try {
    localStorage.removeItem('income');
    localStorage.removeItem('expenses');
    localStorage.removeItem('incomeData');
    
    window.location.reload();
    
    showMessage('All data has been successfully cleared!', 'success');
  } catch (error) {
    console.error('Error clearing data:', error);
    showMessage('Error occurred while clearing data', 'error');
  }
}

export function goToToday() {
  const today = new Date().toISOString().split('T')[0];
  
  const incomeDate = document.getElementById('income-date');
  const expenseDate = document.getElementById('expense-date');
  
  if (incomeDate) {
    incomeDate.value = today;
  }
  
  if (expenseDate) {
    expenseDate.value = today;
  }
  
  showMessage('Navigated to today\'s date', 'info');
}

export function initializeNewButtons() {
  const clearAllBtn = document.getElementById('clear-all-btn');
  const goToTodayBtn = document.getElementById('go-to-today-btn');
  
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', clearAllData);
  }
  
  if (goToTodayBtn) {
    goToTodayBtn.addEventListener('click', goToToday);
  }
}
