import { Octokit } from '@octokit/rest';
import { type Product, type Category, type InsertProduct, type InsertCategory } from "@shared/schema";

export interface IGitHubStorage {
  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;
  
  // File operations
  uploadImage(fileName: string, imageData: string): Promise<string>;
}

export class GitHubStorage implements IGitHubStorage {
  private octokit: Octokit;
  private owner: string;
  private repo: string;
  private branch: string;

  constructor(token?: string) {
    if (token) {
      this.octokit = new Octokit({ auth: token });
    } else {
      // Create without auth for read-only operations
      this.octokit = new Octokit();
    }
    
    this.owner = process.env.GITHUB_OWNER || 'your-username';
    this.repo = process.env.GITHUB_REPO || 'catalog-data';
    this.branch = process.env.GITHUB_BRANCH || 'main';
  }

  setToken(token: string) {
    this.octokit = new Octokit({ auth: token });
  }

  // Products
  async getProducts(): Promise<Product[]> {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: 'data/products.json',
        ref: this.branch,
      });

      if ('content' in data) {
        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        return JSON.parse(content);
      }
      return [];
    } catch (error: any) {
      if (error.status === 404) {
        // File doesn't exist, create it
        await this.saveProducts([]);
        return [];
      }
      throw error;
    }
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const products = await this.getProducts();
    return products.find(p => p.id === id);
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const products = await this.getProducts();
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      finalPrice: productData.priceAVista * (1 - (productData.discount || 0) / 100),
      price30: productData.priceAVista * 1.02,
      price30_60: productData.priceAVista * 1.04,
      price30_60_90: productData.priceAVista * 1.06,
      price30_60_90_120: productData.priceAVista * 1.08,
      createdAt: new Date(),
    };

    products.unshift(newProduct);
    await this.saveProducts(products);
    return newProduct;
  }

  async updateProduct(id: string, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) return undefined;

    const updatedProduct = { ...products[index], ...productData };
    
    // Recalculate prices if priceAVista changed
    if (productData.priceAVista) {
      updatedProduct.finalPrice = productData.priceAVista * (1 - (updatedProduct.discount || 0) / 100);
      updatedProduct.price30 = productData.priceAVista * 1.02;
      updatedProduct.price30_60 = productData.priceAVista * 1.04;
      updatedProduct.price30_60_90 = productData.priceAVista * 1.06;
      updatedProduct.price30_60_90_120 = productData.priceAVista * 1.08;
    }

    products[index] = updatedProduct;
    await this.saveProducts(products);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const products = await this.getProducts();
    const filteredProducts = products.filter(p => p.id !== id);
    
    if (filteredProducts.length === products.length) {
      return false; // Product not found
    }

    await this.saveProducts(filteredProducts);
    return true;
  }

  private async saveProducts(products: Product[]): Promise<void> {
    await this.saveJsonFile('data/products.json', products);
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: 'data/categories.json',
        ref: this.branch,
      });

      if ('content' in data) {
        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        return JSON.parse(content);
      }
      return [];
    } catch (error: any) {
      if (error.status === 404) {
        await this.saveCategories([]);
        return [];
      }
      throw error;
    }
  }

  async createCategory(categoryData: InsertCategory): Promise<Category> {
    const categories = await this.getCategories();
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
      productCount: 0,
    };

    categories.push(newCategory);
    await this.saveCategories(categories);
    return newCategory;
  }

  async updateCategory(id: string, categoryData: Partial<InsertCategory>): Promise<Category | undefined> {
    const categories = await this.getCategories();
    const index = categories.findIndex(c => c.id === id);
    
    if (index === -1) return undefined;

    const updatedCategory = { ...categories[index], ...categoryData };
    categories[index] = updatedCategory;
    await this.saveCategories(categories);
    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const categories = await this.getCategories();
    const filteredCategories = categories.filter(c => c.id !== id);
    
    if (filteredCategories.length === categories.length) {
      return false;
    }

    await this.saveCategories(filteredCategories);
    return true;
  }

  private async saveCategories(categories: Category[]): Promise<void> {
    await this.saveJsonFile('data/categories.json', categories);
  }

  // File operations
  async uploadImage(fileName: string, imageData: string): Promise<string> {
    const path = `images/${fileName}`;
    
    try {
      await this.octokit.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repo,
        path,
        message: `Upload image: ${fileName}`,
        content: imageData, // Base64 encoded
        branch: this.branch,
      });

      return `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}/${path}`;
    } catch (error) {
      console.error('Error uploading image to GitHub:', error);
      throw error;
    }
  }

  private async saveJsonFile(path: string, data: any): Promise<void> {
    const content = JSON.stringify(data, null, 2);
    const encodedContent = Buffer.from(content).toString('base64');

    try {
      // Try to get the current file to get its SHA
      const { data: currentFile } = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path,
        ref: this.branch,
      });

      let sha: string | undefined;
      if ('sha' in currentFile) {
        sha = currentFile.sha;
      }

      await this.octokit.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repo,
        path,
        message: `Update ${path}`,
        content: encodedContent,
        branch: this.branch,
        sha,
      });
    } catch (error: any) {
      if (error.status === 404) {
        // File doesn't exist, create it
        await this.octokit.repos.createOrUpdateFileContents({
          owner: this.owner,
          repo: this.repo,
          path,
          message: `Create ${path}`,
          content: encodedContent,
          branch: this.branch,
        });
      } else {
        throw error;
      }
    }
  }
}

export const githubStorage = new GitHubStorage();