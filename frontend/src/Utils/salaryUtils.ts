/**
 * Utility functions for parsing and handling salary strings
 * Handles formats like "12 - 20 triệu VNĐ", "50000 USD", etc.
 */

/**
 * Extract numeric value from salary string
 * Returns the first number found, or average if range is provided
 * @param salaryString - Salary string like "12 - 20 triệu VNĐ" or "50000 USD"
 * @returns Numeric value for comparison, or 0 if cannot parse
 */
export const parseSalaryToNumber = (salaryString: string | number | null | undefined): number => {
    if (!salaryString) return 0;
    
    // If already a number, return it
    if (typeof salaryString === 'number') {
        return salaryString;
    }
    
    // Remove common currency symbols and text
    const cleaned = salaryString.toString()
        .replace(/triệu|million|USD|VNĐ|VND|\$|₫/gi, '')
        .replace(/,/g, '')
        .trim();
    
    // Try to extract range (e.g., "12 - 20" or "12-20")
    const rangeMatch = cleaned.match(/(\d+(?:\.\d+)?)\s*[-–—]\s*(\d+(?:\.\d+)?)/);
    if (rangeMatch) {
        const min = parseFloat(rangeMatch[1]);
        const max = parseFloat(rangeMatch[2]);
        if (!isNaN(min) && !isNaN(max)) {
            return (min + max) / 2; // Return average for sorting
        }
    }
    
    // Try to extract single number
    const numberMatch = cleaned.match(/(\d+(?:\.\d+)?)/);
    if (numberMatch) {
        const value = parseFloat(numberMatch[1]);
        if (!isNaN(value)) {
            return value;
        }
    }
    
    return 0;
};

/**
 * Extract minimum salary from range string
 * @param salaryString - Salary string
 * @returns Minimum numeric value, or 0 if cannot parse
 */
export const parseMinSalary = (salaryString: string | number | null | undefined): number => {
    if (!salaryString) return 0;
    if (typeof salaryString === 'number') return salaryString;
    
    const cleaned = salaryString.toString()
        .replace(/triệu|million|USD|VNĐ|VND|\$|₫/gi, '')
        .replace(/,/g, '')
        .trim();
    
    const rangeMatch = cleaned.match(/(\d+(?:\.\d+)?)\s*[-–—]\s*(\d+(?:\.\d+)?)/);
    if (rangeMatch) {
        const min = parseFloat(rangeMatch[1]);
        if (!isNaN(min)) return min;
    }
    
    const numberMatch = cleaned.match(/(\d+(?:\.\d+)?)/);
    if (numberMatch) {
        const value = parseFloat(numberMatch[1]);
        if (!isNaN(value)) return value;
    }
    
    return 0;
};

/**
 * Extract maximum salary from range string
 * @param salaryString - Salary string
 * @returns Maximum numeric value, or Infinity if cannot parse
 */
export const parseMaxSalary = (salaryString: string | number | null | undefined): number => {
    if (!salaryString) return Infinity;
    if (typeof salaryString === 'number') return salaryString;
    
    const cleaned = salaryString.toString()
        .replace(/triệu|million|USD|VNĐ|VND|\$|₫/gi, '')
        .replace(/,/g, '')
        .trim();
    
    const rangeMatch = cleaned.match(/(\d+(?:\.\d+)?)\s*[-–—]\s*(\d+(?:\.\d+)?)/);
    if (rangeMatch) {
        const max = parseFloat(rangeMatch[2]);
        if (!isNaN(max)) return max;
    }
    
    const numberMatch = cleaned.match(/(\d+(?:\.\d+)?)/);
    if (numberMatch) {
        const value = parseFloat(numberMatch[1]);
        if (!isNaN(value)) return value;
    }
    
    return Infinity;
};
