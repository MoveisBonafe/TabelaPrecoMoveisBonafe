import { useState, useEffect } from 'react';
import { Catalog } from '@/pages/catalog';
import { Admin } from '@/pages/admin';
import { LoginModal } from '@/components/modals/login-modal';
import { GitHubConfigModal } from '@/components/modals/github-config-modal';
import { useToast } from '@/hooks/use-toast';
import { useGitHubPagesData } from '@/hooks/use-github-pages-data';
import { auth } from '@/lib/auth';

type View = 'login' | 'catalog' | 'admin';

function App() {
  const [currentView, setCurrentView] = useState<View>('login');
  const [showGitHubConfig, setShowGitHubConfig] = useState(false);
  const { toast } = useToast();
  const { authenticate } = useGitHubPagesData();
  
  useEffect(() => {
    console.log('Sistema rodando com GitHub Pages como backend');
  }, []);

  useEffect(() => {
    // Verifica se já está logado ao carregar a página
    if (auth.isAuthenticated()) {
      setCurrentView('admin');
    } else {
      setCurrentView('login');
    }
  }, []);

  const handleAdminLogin = async (username: string, password: string) => {
    try {
      const user = await authenticate(username, password);
      if (user) {
        auth.setUser(user);
        setCurrentView('admin');
        toast({
          title: "Sucesso",
          description: "Login realizado com sucesso!",
        });
      } else {
        toast({
          title: "Erro",
          description: "Credenciais inválidas",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao fazer login",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    auth.logout();
    setCurrentView('catalog');
    toast({
      title: "Sucesso",
      description: "Logout realizado com sucesso!",
    });
  };

  const handleShowLogin = () => {
    setCurrentView('login');
  };

  const handleShowCatalog = () => {
    setCurrentView('catalog');
  };

  const handleShowAdmin = () => {
    if (auth.isAuthenticated()) {
      setCurrentView('admin');
    } else {
      setCurrentView('login');
    }
  };

  return (
    <div className="min-h-screen">
      {currentView === 'login' && (
        <LoginModal
          onAdminLogin={handleAdminLogin}
          onPublicView={handleShowCatalog}
          isVisible={true}
        />
      )}

      {currentView === 'catalog' && (
        <Catalog onShowAdminLogin={handleShowLogin} />
      )}

      {currentView === 'admin' && (
        <Admin 
          onLogout={handleLogout}
          onShowPublicView={handleShowCatalog}
          onConfigureGitHub={() => setShowGitHubConfig(true)}
        />
      )}

      <GitHubConfigModal
        isOpen={showGitHubConfig}
        onClose={() => setShowGitHubConfig(false)}
        onConfigured={() => {
          toast({
            title: "GitHub configurado",
            description: "Agora todos os dados são salvos no GitHub!",
          });
        }}
      />
    </div>
  );
}

export default App;
