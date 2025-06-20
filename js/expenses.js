import { updateSummary, showAnalysis, updateFiltersAtStart, showMessage } from "./utils.js";

let expenses = [];

function loadExpensesData() {
  try {
    const data = localStorage.getItem("expenses");
    expenses = data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading expenses data:", error);
    expenses = [];
  }
}

function saveExpensesData() {
  try {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  } catch (error) {
    console.error("Error saving expenses data:", error);
    alert("Error saving expenses data. Please try again.");
  }
}

loadExpensesData();

let editIndex = null;

function saveExpenses() {
  saveExpensesData();
}

function renderExpenses() {
  const expenseTableBody = document.getElementById("expense-table-body");
  if (!expenseTableBody) return;

  expenseTableBody.innerHTML = "";

  expenses.forEach((exp, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${exp.name}</td>
      <td>${exp.amount} SEK</td>
      <td>${exp.category}</td>
      <td>${formatDate(exp.date)}</td>
      <td>
        <button class="edit-btn" data-index="${index}">Edit</button>
        <button class="delete-btn" data-index="${index}">Delete</button>
      </td>
    `;

    expenseTableBody.appendChild(row);
  });

  updateSummary();
  showAnalysis();
}

function addExpense() {
  const nameInput = document.getElementById("expense-name");
  const amountInput = document.getElementById("expense-amount");
  const categoryInput = document.getElementById("expense-category");
  const dateInput = document.getElementById("expense-date");
  const addBtn = document.getElementById("add-expense-btn");

  const name = nameInput.value;
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value;
  const date = dateInput.value;
  const month = date.slice(0, 7); 

  if (!name || isNaN(amount) || amount <= 0 || !category || !date) {
    showMessage("Please enter valid data: name, positive amount, category, and date", 'error');
    return;
  }

  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  
  if (selectedDate > today) {
    showMessage("Cannot add expenses for future dates", 'error');
    return;
  }

  const expense = { name, amount, category, date, month };

  if (editIndex !== null) {
    expenses[editIndex] = expense;
    editIndex = null;
    addBtn.textContent = "Add Expense";
    showMessage(`Expense "${name}" updated successfully`, 'success');
  } else {
    expenses.push(expense);
    showMessage(`Expense "${name}" added successfully with value ${amount} SEK`, 'success');
  }

  saveExpenses();
  renderExpenses();
  clearInputs();
  updateFiltersAtStart();
}

function clearInputs() {
  const nameInput = document.getElementById("expense-name");
  const amountInput = document.getElementById("expense-amount");
  const categoryInput = document.getElementById("expense-category");
  const dateInput = document.getElementById("expense-date");

  nameInput.value = "";
  amountInput.value = "";
  categoryInput.value = "";
  dateInput.value = "";
}

export function loadExpenses() {
  const nameInput = document.getElementById("expense-name");
  const amountInput = document.getElementById("expense-amount");
  const categoryInput = document.getElementById("expense-category");
  const dateInput = document.getElementById("expense-date");
  const addBtn = document.getElementById("add-expense-btn");
  const expenseTableBody = document.getElementById("expense-table-body");
  const newCategoryInput = document.getElementById("new-category-input");
  const addCategoryBtn = document.getElementById("add-category-btn");

  if (!nameInput || !amountInput || !categoryInput || !dateInput || !addBtn || !expenseTableBody || !newCategoryInput || !addCategoryBtn) {
    console.error("Required expense elements not found in HTML");
    return;
  }

  addBtn.addEventListener("click", addExpense);
  addCategoryBtn.addEventListener("click", addNewCategory);

  expenseTableBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const index = e.target.getAttribute("data-index");
      const expense = expenses[index];
      
      if (confirm(`Are you sure you want to delete "${expense.name}" (${expense.amount} SEK)?`)) {
        expenses.splice(index, 1);
        saveExpenses();
        renderExpenses();
        updateFiltersAtStart();
        showMessage(`Expense "${expense.name}" deleted successfully`, 'success');
      }

    }

    if (e.target.classList.contains("edit-btn")) {
      const index = e.target.getAttribute("data-index");
      const expense = expenses[index];

      nameInput.value = expense.name;
      amountInput.value = expense.amount;
      categoryInput.value = expense.category;
      dateInput.value = expense.date;

      editIndex = index;
      addBtn.textContent = "Update Expense";
    }
  });

  renderExpenses();
  updateFiltersAtStart();
}

export function getTotalExpenses() {
  return expenses.reduce((sum, exp) => sum + exp.amount, 0);
}

function addNewCategory() {
  const newCategoryInput = document.getElementById("new-category-input");
  const categoryInput = document.getElementById("expense-category");
  
  const newCat = newCategoryInput.value.trim();
  if (!newCat) {
    showMessage("Please enter a category name", 'error');
    return;
  }

  const exists = Array.from(categoryInput.options).some(
    (opt) => opt.value.toLowerCase() === newCat.toLowerCase()
  );

  if (!exists) {
    const option = document.createElement("option");
    option.value = newCat;
    option.textContent = newCat;
    categoryInput.appendChild(option);
    newCategoryInput.value = "";
    showMessage(`Category "${newCat}" added successfully!`, 'success');
  } else {
    showMessage(`Category "${newCat}" already exists`, 'error');
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const options = { day: "numeric", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-GB", options);
}


