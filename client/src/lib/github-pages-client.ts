import { type Product, type Category } from "@shared/schema";

// Cliente para carregar dados diretamente do GitHub Pages
class GitHubPagesClient {
  private baseUrl: string;

  constructor() {
    // Detecta se está no GitHub Pages ou desenvolvimento local
    this.baseUrl = window.location.hostname.includes('github.io') 
      ? `${window.location.origin}` 
      : '/docs';
  }

  async getProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseUrl}/data/products.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      return [];
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      const response = await fetch(`${this.baseUrl}/data/categories.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      return [];
    }
  }

  async getUsers(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/data/users.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      return [];
    }
  }

  async getPromotions(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/data/promotions.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch promotions: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao carregar promoções:', error);
      return [];
    }
  }

  async getPriceSettings(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/data/price_settings.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch price settings: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao carregar configurações de preço:', error);
      return [];
    }
  }

  // Para autenticação simples baseada nos dados dos usuários
  async authenticate(username: string, password: string): Promise<any | null> {
    try {
      const users = await this.getUsers();
      const user = users.find(u => 
        u.username === username && u.passwordHash === password && u.active
      );
      return user || null;
    } catch (error) {
      console.error('Erro na autenticação:', error);
      return null;
    }
  }

  // Método para verificar se os dados estão disponíveis
  async checkDataAvailability(): Promise<boolean> {
    try {
      const products = await this.getProducts();
      return products.length > 0;
    } catch {
      return false;
    }
  }
}

export const githubPagesClient = new GitHubPagesClient();