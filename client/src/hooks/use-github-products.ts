import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { githubClient } from '@/lib/github-client';
import { type Product, type InsertProduct, type Category, type InsertCategory } from '@shared/schema';

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

  // Categories
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    error: categoriesError,
    refetch: refetchCategories
  } = useQuery({
    queryKey: ['github-categories'],
    queryFn: () => githubClient.getCategories(),
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

  const createCategoryMutation = useMutation({
    mutationFn: (category: InsertCategory) => githubClient.createCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['github-categories'] });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<InsertCategory> }) =>
      githubClient.updateCategory(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['github-categories'] });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => githubClient.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['github-categories'] });
    },
  });

  return {
    products,
    categories,
    isLoadingProducts,
    isLoadingCategories,
    productsError,
    categoriesError,
    refetchProducts,
    refetchCategories,
    createProduct: createProductMutation.mutateAsync,
    updateProduct: updateProductMutation.mutateAsync,
    deleteProduct: deleteProductMutation.mutateAsync,
    createCategory: createCategoryMutation.mutateAsync,
    updateCategory: updateCategoryMutation.mutateAsync,
    deleteCategory: deleteCategoryMutation.mutateAsync,
    isCreating: createProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
    isCategoryCreating: createCategoryMutation.isPending,
    isCategoryUpdating: updateCategoryMutation.isPending,
    isCategoryDeleting: deleteCategoryMutation.isPending,
  };
}