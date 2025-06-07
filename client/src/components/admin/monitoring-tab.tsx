import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { 
  Package, 
  Tags, 
  Users, 
  Activity,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Clock,
  Cloud
} from 'lucide-react';
import { useGitHubPagesData } from '@/hooks/use-github-pages-data';

interface MonitoringStats {
  totalProducts: number;
  totalCategories: number;
  totalUsers: number;
  activeProducts: number;
  inactiveProducts: number;
  lastUpdate: string;
  systemStatus: 'online' | 'offline' | 'loading';
}

export function MonitoringTab() {
  const { products, categories, users, isLoadingProducts, isLoadingCategories, productsError, categoriesError } = useGitHubPagesData();
  const isLoading = isLoadingProducts || isLoadingCategories;
  const error = productsError || categoriesError;
  const [uptimeStart] = useState(Date.now());
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: stats, isLoading: isLoadingStats, refetch } = useQuery<MonitoringStats>({
    queryKey: ['monitoring-stats'],
    queryFn: async () => {
      const activeProducts = products.filter((p: any) => p.active).length;
      
      return {
        totalProducts: products.length,
        totalCategories: categories.length,
        totalUsers: users.length,
        activeProducts,
        inactiveProducts: products.length - activeProducts,
        lastUpdate: new Date().toISOString(),
        systemStatus: 'online' as const,
      };
    },
    enabled: !isLoading && products.length > 0,
    refetchInterval: 30000, // Atualiza a cada 30 segundos
  });

  const formatUptime = (uptimeInMs: number) => {
    const seconds = Math.floor(uptimeInMs / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Header com status da sincronização */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Monitoramento do Sistema</h3>
          <p className="text-sm text-muted-foreground">
            Sistema GitHub Pages - Dados carregados localmente
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={error ? "destructive" : "default"} className="flex items-center space-x-1">
            {error ? (
              <AlertCircle className="h-3 w-3" />
            ) : (
              <CheckCircle className="h-3 w-3" />
            )}
            <span>{error ? "Erro" : "Online"}</span>
          </Badge>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-red-800 font-medium">Erro no Sistema</p>
                <p className="text-red-600 text-sm">{error.message}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.activeProducts || 0} ativos, {stats?.inactiveProducts || 0} inativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            <Tags className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCategories || 0}</div>
            <p className="text-xs text-muted-foreground">Categorias disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">Usuários cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {isLoading ? "Carregando" : "Online"}
            </div>
            <p className="text-xs text-muted-foreground">GitHub Pages ativo</p>
          </CardContent>
        </Card>
      </div>

      {/* Informações do Sistema */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Informações do Sistema</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Tempo Online:</span>
              <span className="text-sm font-medium">
                {formatUptime(currentTime - uptimeStart)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Última Atualização:</span>
              <span className="text-sm font-medium">
                {stats?.lastUpdate ? formatTime(stats.lastUpdate) : '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Backend:</span>
              <span className="text-sm font-medium">GitHub Pages</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Modo:</span>
              <span className="text-sm font-medium">Produção</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Cloud className="h-5 w-5" />
              <span>Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">CDN:</span>
              <span className="text-sm font-medium text-green-600">GitHub CDN</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Cache:</span>
              <span className="text-sm font-medium text-green-600">Ativo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Compressão:</span>
              <span className="text-sm font-medium text-green-600">Gzip</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">SSL:</span>
              <span className="text-sm font-medium text-green-600">Ativo</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}