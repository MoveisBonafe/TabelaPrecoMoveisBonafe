// DEPRECATED: Use useGitHubPagesData instead
import { useGitHubPagesData } from './use-github-pages-data';

export function useGitHubProducts() {
  // Redirect to GitHub Pages data source
  const githubPagesData = useGitHubPagesData();
  
  return {
    ...githubPagesData,
    // Maintain compatibility with old API
    createProduct: () => Promise.reject('Use GitHub Pages - read-only'),
    updateProduct: () => Promise.reject('Use GitHub Pages - read-only'),
    deleteProduct: () => Promise.reject('Use GitHub Pages - read-only'),
    createCategory: () => Promise.reject('Use GitHub Pages - read-only'),
    updateCategory: () => Promise.reject('Use GitHub Pages - read-only'),
    deleteCategory: () => Promise.reject('Use GitHub Pages - read-only'),
  };
}