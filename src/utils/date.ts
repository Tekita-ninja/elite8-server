export const generatePastMonths = (year: string, month: number): string[] => {
  const months: string[] = [];

  for (let i = month; i >= 1; i--) {
    const formattedMonth = `${year}-${String(i).padStart(2, '0')}`;
    months.push(formattedMonth);
  }

  return months.reverse();
};
