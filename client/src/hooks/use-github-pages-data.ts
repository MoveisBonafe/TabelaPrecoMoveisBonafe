import { useQuery } from '@tanstack/react-query';
import { githubPagesClient } from '@/lib/github-pages-client';
import { type Product, type Category } from '@shared/schema';

export function useGitHubPagesData() {
  // Products
  const {
    data: products = [],
    isLoading: isLoadingProducts,
    error: productsError,
    refetch: refetchProducts
  } = useQuery({
    queryKey: ['github-pages-products'],
    queryFn: () => githubPagesClient.getProducts(),
    staleTime: 300000, // 5 minutes
    gcTime: 600000, // 10 minutes
  });

  // Categories
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    error: categoriesError,
    refetch: refetchCategories
  } = useQuery({
    queryKey: ['github-pages-categories'],
    queryFn: () => githubPagesClient.getCategories(),
    staleTime: 300000, // 5 minutes
    gcTime: 600000, // 10 minutes
  });

  // Users
  const {
    data: users = [],
    isLoading: isLoadingUsers,
    error: usersError,
  } = useQuery({
    queryKey: ['github-pages-users'],
    queryFn: () => githubPagesClient.getUsers(),
    staleTime: 300000,
    gcTime: 600000,
  });

  // Promotions
  const {
    data: promotions = [],
    isLoading: isLoadingPromotions,
    error: promotionsError,
  } = useQuery({
    queryKey: ['github-pages-promotions'],
    queryFn: () => githubPagesClient.getPromotions(),
    staleTime: 300000,
    gcTime: 600000,
  });

  // Price Settings
  const {
    data: priceSettings = [],
    isLoading: isLoadingPriceSettings,
    error: priceSettingsError,
  } = useQuery({
    queryKey: ['github-pages-price-settings'],
    queryFn: () => githubPagesClient.getPriceSettings(),
    staleTime: 300000,
    gcTime: 600000,
  });

  return {
    products,
    categories,
    users,
    promotions,
    priceSettings,
    isLoadingProducts,
    isLoadingCategories,
    isLoadingUsers,
    isLoadingPromotions,
    isLoadingPriceSettings,
    productsError,
    categoriesError,
    usersError,
    promotionsError,
    priceSettingsError,
    refetchProducts,
    refetchCategories,
    // Authentication helper
    authenticate: githubPagesClient.authenticate.bind(githubPagesClient),
  };
}