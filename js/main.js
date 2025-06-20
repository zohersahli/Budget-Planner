import { loadIncome } from "./income.js";
import { loadExpenses } from "./expenses.js";
import { initializeFilterEvents } from "./utils.js";

function init() {
  const incomeSection = document.getElementById("income-section");
  const expensesSection = document.getElementById("expenses-section");
  const summarySection = document.getElementById("summary-section");
  const analysisSection = document.getElementById("analysis-section");

  if (!incomeSection || !expensesSection || !summarySection || !analysisSection) {
    console.error("Required sections not found in HTML");
    return;
  }

  loadIncome();
  loadExpenses();
  initializeFilterEvents();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
} 