export interface Filter {
  department?: number|string;
  value?:      number|string|number[]|string[];
};

export interface Page {
  count?: number;
};

export interface Sort {
  type?:  string;
  order?: string;
};

export interface Options {
  search?: string;
  filter?: Filter;
  page?:   Page;
  sort?:   Sort;
};
