import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { githubClient } from '@/lib/github-client';
import { useToast } from '@/hooks/use-toast';

interface GitHubConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigured: () => void;
}

export function GitHubConfigModal({ isOpen, onClose, onConfigured }: GitHubConfigModalProps) {
  const [token, setToken] = useState('');
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [branch, setBranch] = useState('main');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      // Load existing credentials if any
      const savedOwner = localStorage.getItem('github_owner') || '';
      const savedRepo = localStorage.getItem('github_repo') || '';
      const savedBranch = localStorage.getItem('github_branch') || 'main';
      
      setOwner(savedOwner);
      setRepo(savedRepo);
      setBranch(savedBranch);
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!token || !owner || !repo) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      githubClient.setCredentials(token, owner, repo, branch);
      
      // Test connection by trying to fetch products
      await githubClient.getProducts();
      
      toast({
        title: "Sucesso",
        description: "GitHub configurado com sucesso!",
      });
      
      onConfigured();
      onClose();
    } catch (error: any) {
      console.error('Error configuring GitHub:', error);
      toast({
        title: "Erro",
        description: `Falha ao configurar GitHub: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearConfig = () => {
    githubClient.clearCredentials();
    setToken('');
    setOwner('');
    setRepo('');
    setBranch('main');
    toast({
      title: "Configuração limpa",
      description: "Credenciais do GitHub removidas",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configurar GitHub</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="token">Token do GitHub</Label>
            <Input
              id="token"
              type="password"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Crie um token em: Settings → Developer settings → Personal access tokens
            </p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="owner">Usuário/Organização</Label>
            <Input
              id="owner"
              placeholder="seu-usuario"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="repo">Repositório</Label>
            <Input
              id="repo"
              placeholder="catalog-data"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="branch">Branch</Label>
            <Input
              id="branch"
              placeholder="main"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleClearConfig}>
            Limpar Configuração
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Configurando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}