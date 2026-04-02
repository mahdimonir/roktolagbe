export const jsonToCsv = (data: any[]) => {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const rows = data.map(obj => 
    headers.map(header => {
      const val = obj[header];
      // Basic escaping for CSV
      if (typeof val === 'string' && (val.includes(',') || val.includes('\n'))) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    }).join(',')
  );
  
  return [headers.join(','), ...rows].join('\n');
};
