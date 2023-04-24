export interface TableSettings {
  page?: number;
  size?: number;
  selectable?: boolean;
  asyncData?: boolean;
  visibleColumns?: { [key: string]: string } | null;
  pagination?: boolean;
  filterable?: boolean;
}
