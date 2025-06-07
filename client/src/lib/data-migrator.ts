import { githubClient } from './github-client';
import { type Product, type Category, type InsertProduct, type InsertCategory } from '@shared/schema';

// Dados dos CSVs fornecidos pelo usuário
const INITIAL_CATEGORIES: InsertCategory[] = [
  {
    name: "Mesas",
    description: "Mesas de centro e jantar",
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABGcAAAZlCAYAAACDgLtKAAAAAXNSR0IArs4c6QAAIABJREFUeJzsvWuwLUlWHvatlVl773PP7dvv6el5v4cZxNOAJoxQIGE9HP5jS5oJI8lEELYYh/BgGwVC2MhxrBCSQVgoBpDdAxIGI2QzNhGybDkUBA4kgXmEeQ7DMDAzTM+je2b6ebvvvefsXZlr+UdVVmVlZe2qvc8+557uW19Ex+19qiorMysrK9eX31qLMGPGjBkzZsyYcZfi/3jsO19ni6O3LNSfKot64VMAMCxHAnleyvIdxtBN4uVG1StUlyT20w7uy4lwzIaeMGTcv/mk/X/+2Bvx9WW5eQgiaxh",
    color: "#f59e0b",
    active: true
  },
  {
    name: "Cadeiras", 
    description: "Cadeiras e assentos",
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnUAAAVVCAYAAAB9/D3sAAAAAXNSR0IArs4c6QAAIABJREFUeJzsvVmwHFea3/f/zjmZWVnb3QFcECQWkiAJcJq9cDTd6rHIjh5LFhWjmZEEWvJE2Ao/eB4UofCDFQ6/VfjJYU3ERLStcHBCo5YUsjUCPGrPdJvTrWk32dv0RrLJZgMgARLEcnG3ulutWbmc8/nhZFZl1b0XAEmAYE/nLyJvVeVWWXmrTv7zWwkFBQUFBQUfkhdeeMGprHzHd0sRRYMuu6WYooHD+XXCfpsBwCvXKT+vVna404+pVrure36dwqCdbrsAABh0WwwApWpEg67LawAO7nEcBw8iXbLXGmv5NcfmRz2P3Uo4PK6o59n3XwTcdkjD1yluZfe8SYJ6iY8AWAJwoX0ubDRgbr",
    color: "#10b981",
    active: true
  },
  {
    name: "Banquetas",
    description: "Banquetas e assentos altos", 
    icon: "data:image/x-icon;base64,AAABAAEApQAAAAEAIAAorAIAFgAAACgAAAClAAAAAAIAAAEAIAAAAAAAAJQCAAAAAAAAAAAAAAAAAAAAAAB0mLsEZprMBVGXtwVTpMIGVqq2Bl6p0gZOjr4HJW6TBytxlQc+ep8IQnylCEGAnwhCg6UIQoWlCEOGqwg+fKgJTX+bB0FjYQFCZ2cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgI+/AJOJvgBunb0FbKfFCHSnxQh6uNkIcbbZB2622gdwuNwHZqXKB0qGogdIe5MHSJGUB0mClAdJiqYHSYKgB0lukgdHbZIHNWuNB",
    color: "#f97316",
    active: true
  },
  {
    name: "Camas",
    description: "Camas e móveis para dormir",
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABkAAAATuCAIAAAAa53hHAAAAAXNSR0IArs4c6QAAIABJREFUeJzsvVmwJUd6Hvb9f2ad5W59e8UyGzgghrNwZjjUDJdhUKSDtC2FxDBliaIcIh8coVDY8oPDevKDwy+iKVuMcEh2OGxSJkWKIil6KFJkxAw5G2fDYIDBYCEwAAaYRmNrAN3o9fZdzlKV/++HzKzKqnPOXbrRmO6L/GKmcW6dqqzMrKw8lV99//eTqiIjIyMjIyPjxiDJZ160U/qTSze3Pjcf3Ranf/uGUmeP7tfpEdLdSxb0IjdHSbL/wj6fU9v9HZGRkZGRkZGRkXErIT+9ZWRkZGRkZNwmIEDzo0tGRkZGRkZGxtsR9ntdgYyMjIyMjIzbHY2+KRWZKcKrMoLUezAAWkRCJXt1FGoKUNB0CXieoiojIyMjIyMjI+Mw",
    color: "#8b5cf6",
    active: true
  },
  {
    name: "Beliches",
    description: "Beliches e camas duplas",
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABOIAAAXWCAYAAAAuGgJJAAAAAXNSR0IArs4c6QAAIABJREFUeJzsvXmYJFd55vt+58SSS1V1q9VqCe209gUtSC20IcQiyWCQAE9jY8YeYY+FPc+Dx8a+Y/vewdNjz9zh8cWDr5exR7av8QJeZCObzaySACG0oQ2phYQQWmhtvVR3V1dmRsQ557t/nIjIyMiIzKzqqu7q6vPTo6crM2M5cWI9b7zf9xEcDofD4XA4HI4F8jM/c/10uz1N33vkB2c0p6a6vV7X9HrJmSpSAhLJzFR7b6RVsmd2z7FhGHTuvPeBz/7SjTeuve+xR6476uijftCZmz96796507rd7iYQSGkNozUAsCd9DgJ/eyMMHpDC765fs+a54846a2u4O9Qf/euPzh/sbXc4HA6Hw+FYLHSwG+BwOBwOh8PhWPn8p",
    color: "#06b6d4",
    active: true
  }
];

const INITIAL_PRODUCTS: InsertProduct[] = [
  {
    name: "Banqueta 50 cm",
    description: "",
    category: "Banquetas",
    basePrice: 44.00,
    discount: 0.00,
    priceAVista: 44.00,
    image: "",
    images: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAhcAAAM9CAYAAAAvmVGsAAAAAXNSR0IArs4c6QAAIABJREFUeJzsvWusZNl1Hvattfc+51TdR9/ueZIU3zRJkeJDEhVLjG1lIEEymNCCBGcAQ4YMBAj4I0gQ/w+Q/pk/AfwjDzDIfwdt2UIcmJbi2O3IDG1Jw2lySA1JicN5cWbU0zPdfe+tqvPYe6+VH/ucU1Wnqu6jH/PoqQ9o3K57q86rztn722t961uELbbY4p7hypUr5sknn4xvx76//vWvu4sXL9LHbt3Sb5/h/d17v/S1r/m73DW1P/Uut7PFFls8ILBv9wFsscWDgsuXL/MjjzxC7WR7TyfaK1eumEceecSVZanXr1+nL3z8"],
    active: true,
    fixedPrice: false,
    specifications: []
  },
  {
    name: "Cadeira Comum",
    description: "",
    category: "Cadeiras", 
    basePrice: 77.00,
    discount: 0.00,
    priceAVista: 77.00,
    image: "",
    images: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyYAAAV6CAYAAAAYq2iEAAAAAXNSR0IArs4c6QAAIABJREFUeJzsvXmMJUl+3/eJiMx8Vx1d1V3dUz3Xbu/ukKzioeVwvbs80G2ChA2BEHyw16ZMWYZtrAjaoA1bPmgbmEfZgC/RJinI9PIPSSRsUNgmDBhcExZEgT1ewRIltA5TVdztXc4eszM109Vd13v1jjwi/EdmvpcvK69XVV1dPZPfxut6LzMiMvKKiO/v+/tFCC4WAjA532OYgnR5ZZKRPr29St3Sxy8qI6teWenL6n+ZkD5vALrd2d8bW3fF9uY9E3/nLqxt74o3gY2ttcm5rm3uiuusyW+tviD6e++ZhdW+6O8tmIXV/kx5"],
    active: true,
    fixedPrice: false,
    specifications: []
  },
  {
    name: "Mesa Bonacor 0,70 X 0,45",
    description: "",
    category: "Mesas",
    basePrice: 136.00,
    discount: 0.00, 
    priceAVista: 136.00,
    image: "",
    images: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA5kAAAZCCAYAAAC+lydtAAAAAXNSR0IArs4c6QAAIABJREFUeJzsvXvQbclVH/Zbq/c53/fdO3fuPCUNSGL0AIyMwQqFTaWMHR4GzMMpHEIlqTghQi8ejiFUUrYTnHElRYzlB4ECJOvFG1sEO7JMEJEQJoSYimPiOGBjYRlUxiAECpJmRvd+39m9Vv7o3b27V3fvfb5777w0e1XN3O+csx/dvXt3r9/6rQdhk0022WSTTTbZZJNNnmD5O6//1s/kvTsQ8Wco6f2O+AECyzDQQ07oqoi/NvpxUOiBmR8C4RqpnoMwEPQMij0BHwZhVNCHCPioQh9lEBG5m370vzP"],
    active: true,
    fixedPrice: false,
    specifications: []
  },
  {
    name: "Cama Paris Solteiro",
    description: "",
    category: "Camas",
    basePrice: 258.00,
    discount: 0.00,
    priceAVista: 258.00,
    image: "",
    images: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABaoAAAThCAYAAADd8aZ8AAAAAXNSR0IArs4c6QAAIABJREFUeJzsvXmQdclZ3vm8b+Y5d6mqb+mvV3W3xCKEEGCMBVYDwYywCZCQJVkgCdsaHBgRtIERRmDWGWZqYnBYGrAZt8bCakAGoyEYNOMxBgzEAAbG4fEAtoPVICBQg6TW0su3VNW995zM950/cjl5zr31bepFSPmLqKiqe8+aJ8+5cZ588nkJlUqlUqlUnlIODw8tAPnd3/1deuXnf+rewR722V3pXOsdz91ySeuzgDsLdHeQSiPwnZWGZm2zgrfvu3J0+X2zDboP/TJWr33oIf9Mn0+lUqlUKpVKpVKpVCpPNv"],
    active: true,
    fixedPrice: false,
    specifications: []
  },
  {
    name: "Beliche Paris",
    description: "",
    category: "Beliches",
    basePrice: 468.00,
    discount: 0.00,
    priceAVista: 468.00,
    image: "",
    images: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABkAAAAd1CAIAAABcroRaAAAAAXNSR0IArs4c6QAAIABJREFUeJzsvWewZdd5Hbi+b59w0wudu9EIBECQCARzphhEipYo0UEzZXvGUk2QxuOZGrs8P6QqTagyla0qzViyPEoztmrkUnmGkiXZiswkBIgiQIAgcmigkYHO8fVL995z9v6++bH3Offc8F6/bqDR3dRehWrcd+8J+5yzT9jrrLU+UlVERERERERERERcLVAINf+2gAACgMEKslYApEkKkIgDwEwAAQIQAIjYojDMlKWAgZawFsRIEojAWiQMIgBQhX9WNAAEUkIFJE5EhZIsBwxgUQqIYAyE4BQAkgyc+NlGEMABB"],
    active: true,
    fixedPrice: false,
    specifications: []
  }
];

const INITIAL_USERS = [
  {
    username: "lojas",
    passwordHash: "lojas@moveisbonafe",
    name: "Lojas Móveis Bonafe",
    role: "customer",
    active: true,
    priceMultiplier: 1.00
  },
  {
    username: "moveisbonafe", 
    passwordHash: "bonafe1108",
    name: "Administrador",
    role: "admin",
    active: true,
    priceMultiplier: 1.00
  },
  {
    username: "restaurantes",
    passwordHash: "restaurantes@moveisbonafe", 
    name: "Restaurantes Móveis Bonafe",
    role: "customer_restaurant",
    active: true,
    priceMultiplier: 1.06
  }
];

const INITIAL_PROMOTIONS = [
  {
    text: "Oferta Especial Mês de Maio -5%",
    description: "Desconto válido em todos os móveis até o final do mês",
    color: "#f59e0b",
    active: true
  }
];

const INITIAL_PRICE_SETTINGS = [
  { tableName: "A Vista", percentage: 0.00, active: true },
  { tableName: "30", percentage: 2.00, active: true },
  { tableName: "30/60", percentage: 4.00, active: true },
  { tableName: "30/60/90", percentage: 6.00, active: true },
  { tableName: "30/60/90/120", percentage: 8.00, active: true }
];

export class DataMigrator {
  async migrateInitialData() {
    if (!githubClient.isConfigured()) {
      throw new Error('GitHub não configurado. Configure primeiro no painel admin.');
    }

    try {
      // Migrar categorias
      console.log('Migrando categorias...');
      for (const category of INITIAL_CATEGORIES) {
        await githubClient.createCategory(category);
      }

      // Migrar produtos  
      console.log('Migrando produtos...');
      for (const product of INITIAL_PRODUCTS) {
        await githubClient.createProduct(product);
      }

      // Migrar dados auxiliares
      await this.migrateAuxiliaryData();

      console.log('Migração concluída com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro na migração:', error);
      throw error;
    }
  }

  private async migrateAuxiliaryData() {
    // Salvar usuários
    await githubClient.saveJsonFile('data/users.json', INITIAL_USERS);
    
    // Salvar promoções
    await githubClient.saveJsonFile('data/promotions.json', INITIAL_PROMOTIONS);
    
    // Salvar configurações de preço
    await githubClient.saveJsonFile('data/price_settings.json', INITIAL_PRICE_SETTINGS);
    
    // Criar estrutura de pastas
    await githubClient.saveJsonFile('data/README.md', `# Dados do Catálogo Móveis Bonafe

Este repositório contém todos os dados do sistema de catálogo:

## Estrutura:
- \`data/products.json\` - Produtos do catálogo
- \`data/categories.json\` - Categorias de produtos  
- \`data/users.json\` - Usuários e autenticação
- \`data/promotions.json\` - Promoções ativas
- \`data/price_settings.json\` - Configurações de tabela de preços
- \`images/\` - Imagens dos produtos

## Atualização:
Os dados são atualizados automaticamente através da interface admin.
Cada modificação gera um commit automático para rastreamento.
`);
  }

  async checkDataExists(): Promise<boolean> {
    try {
      const products = await githubClient.getProducts();
      return products.length > 0;
    } catch {
      return false;
    }
  }
}

export const dataMigrator = new DataMigrator();