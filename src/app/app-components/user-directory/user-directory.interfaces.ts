export interface Filter {
  department?: number|string;
  value?:      number|string|number[]|string[];
};

export interface Page {
  count?: number;
};

export interface Sort {
  type?:  string;
  order?: string; /* [Compatibility] */
  sort?:  string;
};

export interface Options {
  search?: string;
  filter?: Filter;
  page?:   Page;
  sort?:   Sort;
};

export interface PageState extends Page {
  current: number;
  total:   number;
  count:   number;
};
