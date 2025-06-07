import { Octokit } from '@octokit/rest';
import { type Product, type Category, type InsertProduct, type InsertCategory } from "@shared/schema";

class GitHubClient {
  private octokit: Octokit | null = null;
  private owner: string = '';
  private repo: string = '';
  private branch: string = 'main';

  setCredentials(token: string, owner: string, repo: string, branch: string = 'main') {
    this.octokit = new Octokit({ auth: token });
    this.owner = owner;
    this.repo = repo;
    this.branch = branch;
    
    // Salvar no localStorage para persistir
    localStorage.setItem('github_token', token);
    localStorage.setItem('github_owner', owner);
    localStorage.setItem('github_repo', repo);
    localStorage.setItem('github_branch', branch);
  }

  loadCredentials() {
    const token = localStorage.getItem('github_token');
    const owner = localStorage.getItem('github_owner');
    const repo = localStorage.getItem('github_repo');
    const branch = localStorage.getItem('github_branch') || 'main';

    if (token && owner && repo) {
      this.octokit = new Octokit({ auth: token });
      this.owner = owner;
      this.repo = repo;
      this.branch = branch;
      return true;
    }
    return false;
  }

  isConfigured(): boolean {
    return this.octokit !== null && this.owner !== '' && this.repo !== '';
  }

  clearCredentials() {
    this.octokit = null;
    this.owner = '';
    this.repo = '';
    this.branch = 'main';
    localStorage.removeItem('github_token');
    localStorage.removeItem('github_owner');
    localStorage.removeItem('github_repo');
    localStorage.removeItem('github_branch');
  }

  // Products
  async getProducts(): Promise<Product[]> {
    if (!this.isConfigured()) {
      throw new Error('GitHub não configurado');
    }

    try {
      const { data } = await this.octokit!.repos.getContent({
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
        // File doesn't exist, return empty array
        return [];
      }
      throw error;
    }
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    if (!this.isConfigured()) {
      throw new Error('GitHub não configurado');
    }

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
    if (!this.isConfigured()) {
      throw new Error('GitHub não configurado');
    }

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
    if (!this.isConfigured()) {
      throw new Error('GitHub não configurado');
    }

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
    if (!this.isConfigured()) {
      throw new Error('GitHub não configurado');
    }

    try {
      const { data } = await this.octokit!.repos.getContent({
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
        return [];
      }
      throw error;
    }
  }

  async createCategory(categoryData: InsertCategory): Promise<Category> {
    if (!this.isConfigured()) {
      throw new Error('GitHub não configurado');
    }

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
    if (!this.isConfigured()) {
      throw new Error('GitHub não configurado');
    }

    const categories = await this.getCategories();
    const index = categories.findIndex(c => c.id === id);
    
    if (index === -1) return undefined;

    const updatedCategory = { ...categories[index], ...categoryData };
    categories[index] = updatedCategory;
    await this.saveCategories(categories);
    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<boolean> {
    if (!this.isConfigured()) {
      throw new Error('GitHub não configurado');
    }

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
  async uploadImage(fileName: string, file: File): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('GitHub não configurado');
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result as string;
          const base64Content = base64Data.split(',')[1]; // Remove data:image/...;base64,
          
          const path = `images/${fileName}`;
          
          await this.octokit!.repos.createOrUpdateFileContents({
            owner: this.owner,
            repo: this.repo,
            path,
            message: `Upload image: ${fileName}`,
            content: base64Content,
            branch: this.branch,
          });

          const imageUrl = `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}/${path}`;
          resolve(imageUrl);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private async saveJsonFile(path: string, data: any): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error('GitHub não configurado');
    }

    const content = JSON.stringify(data, null, 2);
    const encodedContent = Buffer.from(content).toString('base64');

    try {
      // Try to get the current file to get its SHA
      const { data: currentFile } = await this.octokit!.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path,
        ref: this.branch,
      });

      let sha: string | undefined;
      if ('sha' in currentFile) {
        sha = currentFile.sha;
      }

      await this.octokit!.repos.createOrUpdateFileContents({
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
        await this.octokit!.repos.createOrUpdateFileContents({
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

export const githubClient = new GitHubClient();