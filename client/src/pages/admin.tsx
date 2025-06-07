import { useState } from 'react';
import { Product, Category, User, Promotion } from '@shared/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, Users, Tag, TrendingUp, Eye } from 'lucide-react';
import { ProductModal } from '@/components/modals/product-modal';
import { useGitHubPagesData } from '@/hooks/use-github-pages-data';
import { useToast } from '@/hooks/use-toast';

interface AdminProps {
  onLogout: () => void;
  onShowPublicView?: () => void;
  onConfigureGitHub?: () => void;
}

export function Admin({ onLogout, onShowPublicView, onConfigureGitHub }: AdminProps) {
  const { 
    products, 
    categories,
    users,
    promotions,
    priceSettings
  } = useGitHubPagesData();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.active).length,
    totalCategories: categories.length,
    totalUsers: users.length,
    totalPromotions: promotions.length
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Painel Administrativo
              </h1>
              <Badge variant="secondary">GitHub Pages</Badge>
            </div>
            <div className="flex items-center space-x-4">
              {onShowPublicView && (
                <Button variant="outline" onClick={onShowPublicView}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Ver Catálogo
                </Button>
              )}
              <Button variant="outline" onClick={onLogout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProducts}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.activeProducts} ativos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categorias</CardTitle>
                  <Tag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCategories}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Usuários</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Promoções</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalPromotions}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Status do Sistema</CardTitle>
                <CardDescription>
                  Sistema executando em modo GitHub Pages (somente leitura)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Backend:</span>
                    <Badge variant="outline">GitHub Pages</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Modo:</span>
                    <Badge variant="secondary">Somente Leitura</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Dados:</span>
                    <Badge variant="default">JSON Estático</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Produtos ({products.length})</CardTitle>
                <CardDescription>
                  Lista de todos os produtos cadastrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {product.category} • R$ {product.basePrice.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={product.active ? "default" : "secondary"}>
                          {product.active ? "Ativo" : "Inativo"}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewProduct(product)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Categorias ({categories.length})</CardTitle>
                <CardDescription>
                  Lista de todas as categorias disponíveis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                          style={{ backgroundColor: category.color }}
                        >
                          {category.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{category.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Usuários ({users.length})</CardTitle>
                <CardDescription>
                  Lista de usuários do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {user.username} • {user.role}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={user.active ? "default" : "secondary"}>
                          {user.active ? "Ativo" : "Inativo"}
                        </Badge>
                        <Badge variant="outline">
                          {user.role}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isProductModalOpen}
          onClose={() => {
            setIsProductModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}