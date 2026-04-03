import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { products } from '../api/clients';
import { Product, PaginatedResponse } from '../api/types';

export const useProducts = (page = 1, limit = 20) => {
    return useQuery({
        queryKey: ['products', page, limit],
        queryFn: () => products.getAll(page, limit),
        placeholderData: (previousData) => previousData,
    });
};

export const useProduct = (id: number) => {
    return useQuery({
        queryKey: ['product', id],
        queryFn: () => products.getById(id),
        enabled: !!id,
    });
};
export const useInfiniteProducts = (limit = 20) => {
    return useInfiniteQuery({
        queryKey: ['products', 'infinite', limit],
        queryFn: ({ pageParam = 1 }) => products.getAll(pageParam, limit),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            return lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined;
        },
    });
};
