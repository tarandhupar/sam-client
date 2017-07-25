export interface SortConfig {
  options: Array<SortOption>;
  disabled: boolean;
  label: string;
  name: string;
}

export interface SortOption {
  value: string;
  label: string;
  name: string;
}

export interface SearchOption {
  value: string;
  label: string;
  width: number|string;
}

export interface NotificationItem{
  link: string,
  datetime: string,
  username: string,
  text: string
}