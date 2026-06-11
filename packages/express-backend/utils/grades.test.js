import { calculateGpa } from "./grades.js";

describe("calculateGpa", () => {
  test("returns 0 when there are no grades", () => {
    expect(calculateGpa([])).toBe(0);
  });

  test("converts average grade ratios to a 4.0 GPA", () => {
    const grades = [
      { score: 90, pointsPossible: 100 },
      { score: 45, pointsPossible: 50 },
      { score: 18, pointsPossible: 20 }
    ];

    expect(calculateGpa(grades)).toBeCloseTo(3.6, 5);
  });
});
