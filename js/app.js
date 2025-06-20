import { loadIncome } from "./income.js";
import { loadExpenses } from "./expenses.js";

import { showAnalysis, updateFiltersAtStart, initializeFilterEvents, showIncomeAnalysis, updateIncomeFiltersAtStart, initializeNewButtons } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  loadIncome();               
  loadExpenses();             
  updateFiltersAtStart();     
  updateIncomeFiltersAtStart(); 
  initializeFilterEvents();   
  initializeNewButtons();     
  showAnalysis();             
  showIncomeAnalysis();       
});
