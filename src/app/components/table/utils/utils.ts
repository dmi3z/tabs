export function originalOrder(): number {
  return 0;
}

export function stopProp(event: MouseEvent): void {
  event.stopPropagation();
}

export function sortAsc(data: any[], column: string): any[] {
  const sortedDataAsc = [...data].sort((a, b) => {
    if (typeof a[column] === 'number' && typeof b[column] === 'number') {
      return a[column] - b[column];
    } else {
      const strA = a[column];
      const strB = b[column];
      return strA.localeCompare(strB);
    }
  });

  return sortedDataAsc;
}

export function sortDesc(data: any[], column: string): any[] {
  const sortedDataDesc = [...data].sort((a, b) => {
    if (typeof a[column] === 'number' && typeof b[column] === 'number') {
      return b[column] - a[column];
    } else {
      const strA = a[column];
      const strB = b[column];
      return strB.localeCompare(strA);
    }
  });
  return sortedDataDesc;
}
