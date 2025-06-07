import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { githubClient } from '@/lib/github-client';
import { type Product, type InsertProduct } from '@shared/schema';

export function useGitHubProducts() {
  const queryClient = useQueryClient();

  // Products
  const {
    data: products = [],
    isLoading: isLoadingProducts,
    error: productsError,
    refetch: refetchProducts
  } = useQuery({
    queryKey: ['github-products'],
    queryFn: () => githubClient.getProducts(),
    enabled: githubClient.isConfigured(),
    staleTime: 30000, // 30 seconds
  });

  const createProductMutation = useMutation({
    mutationFn: (product: InsertProduct) => githubClient.createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['github-products'] });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<InsertProduct> }) =>
      githubClient.updateProduct(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['github-products'] });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => githubClient.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['github-products'] });
    },
  });

  return {
    products,
    isLoadingProducts,
    productsError,
    refetchProducts,
    createProduct: createProductMutation.mutateAsync,
    updateProduct: updateProductMutation.mutateAsync,
    deleteProduct: deleteProductMutation.mutateAsync,
    isCreating: createProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
  };
}