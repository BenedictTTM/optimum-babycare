export interface PaginationMeta {
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    totalCount: number;
    limit: number;
}
