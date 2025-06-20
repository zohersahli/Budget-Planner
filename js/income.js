import { updateIncomeFiltersAtStart, showIncomeAnalysis } from "./utils.js";

let incomeData = {};

function loadIncomeData() {
  try {
    const data = localStorage.getItem("incomeData");
    incomeData = data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Error loading income data:", error);
    incomeData = {};
  }
}

function saveIncomeData() {
  try {
    localStorage.setItem("incomeData", JSON.stringify(incomeData));
  } catch (error) {
    console.error("Error saving income data:", error);
    alert("Error saving income data. Please try again.");
  }
}

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthFromDate(dateString) {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function setDefaultDate() {
  const today = new Date();
  const dateString = today.toISOString().split('T')[0]; 
  const incomeDateInput = document.getElementById("income-date");
  if (incomeDateInput) {
    incomeDateInput.value = dateString;
  }
}

function updateIncomeDisplay() {
  const currentMonth = getCurrentMonth();
  let monthlyIncomes = incomeData[currentMonth] || [];

  if (!Array.isArray(monthlyIncomes) && monthlyIncomes !== undefined) {
    monthlyIncomes = [monthlyIncomes];
    incomeData[currentMonth] = monthlyIncomes;
    saveIncomeData();
  }

  const monthlyTotal = monthlyIncomes.reduce((sum, val) => sum + val, 0);
  let yearlyTotal = 0;

  const currentYear = new Date().getFullYear();
  for (let key in incomeData) {
    if (key.startsWith(currentYear.toString())) {
      const values = Array.isArray(incomeData[key]) ? incomeData[key] : [incomeData[key]];
      yearlyTotal += values.reduce((sum, val) => sum + val, 0);
    }
  }

  const incomeDisplay = document.getElementById("income-display");
  if (incomeDisplay) {
    incomeDisplay.textContent = `Income for ${currentMonth}: ${monthlyTotal} SEK | Yearly Total: ${yearlyTotal} SEK`;
  }
}

function setIncome() {
  const incomeInput = document.getElementById("income-input");
  const incomeDateInput = document.getElementById("income-date");
  
  const value = parseFloat(incomeInput.value);
  const selectedDate = incomeDateInput.value;
  
  if (!isNaN(value) && value > 0 && selectedDate) {
    const month = getMonthFromDate(selectedDate);
    
    if (!incomeData[month]) {
      incomeData[month] = [];
    }
    incomeData[month].push(value);

    saveIncomeData();
    updateIncomeDisplay();
    updateIncomeFiltersAtStart(); 
    showIncomeAnalysis(); 
    incomeInput.value = "";
    setDefaultDate(); 
  } else {
    
    alert("Please enter a valid positive number for income and select a date");
  }
}


loadIncomeData();

export function loadIncome() {
  const incomeInput = document.getElementById("income-input");
  const incomeDateInput = document.getElementById("income-date");
  const setIncomeBtn = document.getElementById("set-income-btn");
  const incomeDisplay = document.getElementById("income-display");

  if (!incomeInput || !incomeDateInput || !setIncomeBtn || !incomeDisplay) {
    console.error("Required income elements not found in HTML");
    return;
  }

  setDefaultDate(); 
  updateIncomeDisplay();
  updateIncomeFiltersAtStart(); 
  showIncomeAnalysis(); 
  setIncomeBtn.addEventListener("click", setIncome);
}

export function getIncome() {
  const month = getCurrentMonth();
  const monthlyIncomes = incomeData[month] || [];

  if (!Array.isArray(monthlyIncomes)) {
    return monthlyIncomes;
  }

  return monthlyIncomes.reduce((sum, val) => sum + val, 0);
}
