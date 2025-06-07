import { type Product, type Category } from '@shared/schema';
import { githubPagesClient } from './github-pages-client';

// Data migrator now uses GitHub Pages static data
class DataMigrator {
  async migrateFromCSV(csvData: { 
    products: any[], 
    categories: any[], 
    users: any[],
    promotions: any[],
    priceSettings: any[]
  }): Promise<void> {
    try {
      console.log('Data migration: Using GitHub Pages static files');
      console.log('Migration complete - data served from /docs/data/ folder');
    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    }
  }

  async checkDataExists(): Promise<boolean> {
    try {
      const available = await githubPagesClient.checkDataAvailability();
      return available;
    } catch {
      return false;
    }
  }
}

export const dataMigrator = new DataMigrator();