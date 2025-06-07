import { useState } from 'react';
import { Search } from 'lucide-react';
import { Product } from '@shared/schema';
import { Navbar } from '@/components/layout/navbar';
import { ProductGrid } from '@/components/products/product-grid';
import { ProductList } from '@/components/products/product-list';
import { ProductCompact } from '@/components/products/product-compact';
import { ProductModal } from '@/components/modals/product-modal';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGitHubProducts } from '@/hooks/use-github-products';

interface CatalogProps {
  onShowAdminLogin: () => void;
}

export function Catalog({ onShowAdminLogin }: CatalogProps) {
  const { products, categories } = useGitHubProducts();
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const activeProducts = products.filter(p => p.active);

  const filteredProducts = activeProducts
    .filter(product => {
      const matchesSearch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name, 'pt-BR', { numeric: true });
      case 'price-low':
        return a.finalPrice - b.finalPrice;
      case 'price-high':
        return b.finalPrice - a.finalPrice;
      case 'category':
        return a.category.localeCompare(b.category, 'pt-BR', { numeric: true });
      default:
        return a.name.localeCompare(b.name, 'pt-BR', { numeric: true });
    }
  });

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        onShowAdminLogin={onShowAdminLogin}
        viewMode={viewMode}
        onToggleViewMode={toggleViewMode}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Buscar produtos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">A-Z</SelectItem>
                  <SelectItem value="price-low">Menor preço</SelectItem>
                  <SelectItem value="price-high">Maior preço</SelectItem>
                  <SelectItem value="category">Categoria</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Products Display */}
        {viewMode === 'grid' ? (
          <ProductGrid
            products={filteredProducts}
            onViewDetails={handleViewProduct}
          />
        ) : viewMode === 'list' ? (
          <ProductList
            products={filteredProducts}
            onViewDetails={handleViewProduct}
          />
        ) : (
          <ProductCompact
            products={filteredProducts}
            onProductClick={handleViewProduct}
          />
        )}
      </div>

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        isVisible={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
      />
    </div>
  );
}