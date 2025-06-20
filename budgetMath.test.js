import { describe, it, expect } from 'vitest';
import { calculateRemaining, calculateSavingPercentage } from './js/budgetMath.js';

describe('Budget Math Functions', () => {
  
  describe('calculateRemaining', () => {
    it('should calculate remaining balance correctly', () => {
      expect(calculateRemaining(1000, 600)).toBe(400);
      expect(calculateRemaining(500, 300)).toBe(200);
      expect(calculateRemaining(1000, 1000)).toBe(0);
    });

    it('should handle negative remaining (overspending)', () => {
      expect(calculateRemaining(500, 800)).toBe(-300);
      expect(calculateRemaining(0, 100)).toBe(-100);
    });

    it('should handle zero values', () => {
      expect(calculateRemaining(0, 0)).toBe(0);
      expect(calculateRemaining(1000, 0)).toBe(1000);
      expect(calculateRemaining(0, 500)).toBe(-500);
    });
  });

  describe('calculateSavingPercentage', () => {
    it('should calculate saving percentage correctly', () => {
      expect(calculateSavingPercentage(1000, 600)).toBe(40); // 40% saved
      expect(calculateSavingPercentage(500, 300)).toBe(40); // 40% saved
      expect(calculateSavingPercentage(1000, 1000)).toBe(0); // 0% saved
    });

    it('should handle negative percentage (overspending)', () => {
      expect(calculateSavingPercentage(500, 800)).toBe(-60); // -60% (overspent)
      expect(calculateSavingPercentage(1000, 1500)).toBe(-50); // -50% (overspent)
    });

    it('should handle zero income', () => {
      expect(calculateSavingPercentage(0, 0)).toBe(0);
      expect(calculateSavingPercentage(0, 100)).toBe(0);
    });

    it('should round to nearest integer', () => {
      expect(calculateSavingPercentage(1000, 333)).toBe(67); // 66.7% rounded to 67
      expect(calculateSavingPercentage(1000, 666)).toBe(33); // 33.4% rounded to 33
    });
  });
}); 