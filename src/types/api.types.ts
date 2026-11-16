export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

export interface SortResponse {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface PageableResponse {
  sort: SortResponse;
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
}

/** JSON representation returned by Spring Data's Page<T>. */
export interface PageResponse<T> {
  content: T[];
  pageable: PageableResponse;
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: SortResponse;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}
