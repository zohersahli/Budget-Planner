export function calculateRemaining(income, totalExpenses) {
  return income - totalExpenses;
}

export function calculateSavingPercentage(income, totalExpenses) {
  if (income === 0) return 0;
  const saved = income - totalExpenses;
  return Math.round((saved / income) * 100);
}