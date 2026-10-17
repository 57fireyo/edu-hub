/**
 * Academic Year & Semester Configuration and Utilities
 */

export const ACADEMIC_YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'] as const;
export type AcademicYearName = typeof ACADEMIC_YEARS[number];

export const YEAR_SEMESTERS: Record<string, string[]> = {
  '1st Year': ['Semester 1', 'Semester 2'],
  '2nd Year': ['Semester 3', 'Semester 4'],
  '3rd Year': ['Semester 5', 'Semester 6'],
  '4th Year': ['Semester 7', 'Semester 8'],
};

/**
 * Normalizes year strings to standard '1st Year' | '2nd Year' | '3rd Year' | '4th Year'
 */
export function normalizeYearString(val?: string | number): AcademicYearName {
  if (!val) return '2nd Year';
  const str = String(val).toLowerCase().trim();
  if (str.includes('1') || str.includes('first')) return '1st Year';
  if (str.includes('2') || str.includes('second')) return '2nd Year';
  if (str.includes('3') || str.includes('third')) return '3rd Year';
  if (str.includes('4') || str.includes('fourth')) return '4th Year';
  return '2nd Year';
}

/**
 * Returns true if an item matches the target year strictly.
 * Prevents 2nd Year uploads from appearing in 1st/3rd/4th Year sections and vice versa.
 */
export function isYearMatch(itemYear?: string, itemAcadYear?: string, targetYear?: string): boolean {
  if (!targetYear) return false;
  const raw = `${itemYear || ''} ${itemAcadYear || ''}`.toLowerCase();
  const target = targetYear.toLowerCase();

  if (target.includes('1') || target.includes('first')) {
    return raw.includes('1st') || raw.includes('first') || raw.includes('year 1') || raw.includes('year-1');
  }
  if (target.includes('2') || target.includes('second')) {
    return raw.includes('2nd') || raw.includes('second') || raw.includes('year 2') || raw.includes('year-2');
  }
  if (target.includes('3') || target.includes('third')) {
    return raw.includes('3rd') || raw.includes('third') || raw.includes('year 3') || raw.includes('year-3');
  }
  if (target.includes('4') || target.includes('fourth')) {
    return raw.includes('4th') || raw.includes('fourth') || raw.includes('year 4') || raw.includes('year-4');
  }
  return raw.includes(target);
}

/**
 * Returns the default initial semester for a given year.
 */
export function getDefaultSemesterForYear(year: string): string {
  const sems = YEAR_SEMESTERS[year];
  return sems && sems.length > 0 ? sems[0] : 'Semester 1';
}

/**
 * Resolves the semester of a resource, inferring from subject if omitted.
 */
export function getResourceSemester(
  item: { semester?: string; subjectCode?: string; year?: string; academicYear?: string },
  subjects?: { code: string; semester?: string }[]
): string {
  if (item.semester && item.semester !== 'All') return item.semester;

  if (item.subjectCode && subjects) {
    const match = subjects.find(
      (s) => s.code.toLowerCase() === item.subjectCode?.toLowerCase()
    );
    if (match?.semester) return match.semester;
  }

  // Fallback by year
  if (isYearMatch(item.year, item.academicYear, '1st Year')) return 'Semester 1';
  if (isYearMatch(item.year, item.academicYear, '2nd Year')) return 'Semester 3';
  if (isYearMatch(item.year, item.academicYear, '3rd Year')) return 'Semester 5';
  if (isYearMatch(item.year, item.academicYear, '4th Year')) return 'Semester 7';

  return 'Semester 1';
}
