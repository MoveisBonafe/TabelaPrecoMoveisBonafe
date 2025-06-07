import { useState, useEffect } from 'react';
import { Catalog } from '@/pages/catalog';
import { Admin } from '@/pages/admin';
import { Login } from '@/pages/login';
import { useToast } from '@/hooks/use-toast';
import { useGitHubPagesData } from '@/hooks/use-github-pages-data';
import { auth } from '@/lib/auth';

type View = 'login' | 'catalog' | 'admin';

function App() {
  const [currentView, setCurrentView] = useState<View>('catalog');
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
      setCurrentView('catalog');
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
    <>
      {currentView === 'catalog' && (
        <Catalog 
          onShowAdminLogin={() => setCurrentView('login')}
        />
      )}
      
      {currentView === 'login' && (
        <Login
          onLogin={handleAdminLogin}
          onBackToCatalog={() => setCurrentView('catalog')}
        />
      )}
      
      {currentView === 'admin' && (
        <Admin onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;
