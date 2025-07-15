
export interface Nomenclature {
  code: string;
  label: string;
  arabicLabel: string;
}

export const NOMENCLATURES: Nomenclature[] = [
  { code: '1501', label: 'Conflits du travail', arabicLabel: 'نزاعات الشغل' },
  { code: '1502', label: 'Affaires civiles', arabicLabel: 'القضايا المدنية' },
  { code: '1503', label: 'Affaires commerciales', arabicLabel: 'القضايا التجارية' },
  { code: '1504', label: 'Affaires familiales', arabicLabel: 'قضايا الأسرة' },
  { code: '1505', label: 'Affaires pénales', arabicLabel: 'القضايا الجنائية' },
  { code: '1506', label: 'Affaires administratives', arabicLabel: 'القضايا الإدارية' },
  { code: '1507', label: 'Affaires foncières', arabicLabel: 'القضايا العقارية' },
  { code: '1508', label: 'Successions', arabicLabel: 'المواريث' },
];

export const getCaseNumber = (nomenclatureCode: string, incrementalNumber: number): string => {
  const currentYear = new Date().getFullYear();
  return `${currentYear}/${nomenclatureCode}/${incrementalNumber}`;
};

export const getNextCaseNumber = (nomenclatureCode: string, existingCases: Array<{caseNumber: string}>): string => {
  const currentYear = new Date().getFullYear();
  const yearPrefix = `${currentYear}/${nomenclatureCode}/`;
  
  // Filter cases for current year and nomenclature
  const relevantCases = existingCases.filter(c => c.caseNumber.startsWith(yearPrefix));
  
  // Extract numbers and find the maximum
  const numbers = relevantCases.map(c => {
    const parts = c.caseNumber.split('/');
    return parseInt(parts[2] || '0', 10);
  });
  
  const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
  return getCaseNumber(nomenclatureCode, maxNumber + 1);
};
