export function calculateGpa(grades) {
  if (!grades.length) {
    return 0;
  }

  return (
    grades.reduce(
      (sum, grade) => sum + grade.score / grade.pointsPossible,
      0
    ) /
    grades.length
  ) * 4;
}
