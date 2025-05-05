
// Helper function to safely parse any JSON strings within an object recursively
export const deepParseJsonStrings = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'string') {
    try {
      // Try to parse it as JSON
      return JSON.parse(obj);
    } catch (e) {
      // If it's not valid JSON, return the original string
      return obj;
    }
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepParseJsonStrings(item));
  }
  
  if (typeof obj === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = deepParseJsonStrings(value);
    }
    return result;
  }
  
  // For numbers, booleans, etc., return as is
  return obj;
};

// Helper function to safely stringify objects that might be directly rendered
export const safelyRenderValue = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
};

// Recursively transforms any object values into renderable strings
export const transformToRenderableValues = (data: any): any => {
  if (data === null || data === undefined) {
    return '';
  }
  
  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(item => transformToRenderableValues(item));
  }
  
  // Handle objects
  if (typeof data === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = transformToRenderableValues(value);
    }
    return result;
  }
  
  // Return primitives as is
  return data;
};

// Function to check if an object might be a stringified JSON
export const mightBeJson = (str: string): boolean => {
  if (typeof str !== 'string') return false;
  str = str.trim();
  return (str.startsWith('{') && str.endsWith('}')) || 
         (str.startsWith('[') && str.endsWith(']'));
};

// Format medication objects for display
export const formatMedication = (med: any): string => {
  if (!med) return '';
  
  if (typeof med === 'string') {
    try {
      const parsedMed = JSON.parse(med);
      if (parsedMed.name) {
        let formatted = parsedMed.name;
        if (parsedMed.dose) formatted += ` (${parsedMed.dose})`;
        if (parsedMed.condition) formatted += ` - ${parsedMed.condition}`;
        return formatted;
      }
      return med;
    } catch (e) {
      return med;
    }
  }
  
  if (typeof med === 'object') {
    if (med.name) {
      let formatted = med.name;
      if (med.dose) formatted += ` (${med.dose})`;
      if (med.condition) formatted += ` - ${med.condition}`;
      return formatted;
    }
  }
  
  return String(med);
};
