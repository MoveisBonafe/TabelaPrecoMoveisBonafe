# MoveisBonafe - Catálogo GitHub Pages

Sistema completo de catálogo de móveis rodando exclusivamente no GitHub Pages com dados estáticos em JSON.

## 📁 Estrutura do Projeto

```
docs/
├── index.html          # Página principal do catálogo
├── admin.html          # Painel administrativo (somente leitura)
├── data/               # Dados do sistema em JSON
│   ├── products.json   # 26 produtos autênticos
│   ├── categories.json # 5 categorias
│   ├── users.json      # 3 usuários
│   ├── promotions.json # Promoções ativas
│   └── price_settings.json # Configurações de preços
├── images/             # Imagens dos produtos
└── favicon.ico         # Ícone do site
```

## 🚀 Como Usar

### Acesso Público
- Visite `index.html` para ver o catálogo completo
- Busque produtos por nome ou categoria
- Visualize preços e informações detalhadas

### Acesso Administrativo
- Acesse `admin.html` para o painel administrativo
- Credenciais: `moveisbonafe` / `bonafe1108`
- Visualize estatísticas e dados do sistema

## 📊 Dados Incluídos

### Produtos (26 itens)
- Banquetas, cadeiras, mesas, camas e beliches
- Preços autênticos a partir de R$ 44,00
- Categorização completa
- Imagens e especificações

### Categorias (5 tipos)
- Mesas (12 produtos)
- Cadeiras (6 produtos) 
- Banquetas (2 produtos)
- Camas (2 produtos)
- Beliches (1 produto)

### Usuários (3 perfis)
- Administrador principal
- Perfil para lojas
- Perfil para restaurantes

## 🔧 Configuração GitHub Pages

1. Vá para Settings → Pages no repositório
2. Source: Deploy from a branch
3. Branch: main
4. Folder: `/docs`
5. Salve as configurações

O site ficará disponível em:
`https://[seu-usuario].github.io/[nome-do-repositorio]/`

## 💡 Características

### Performance
- Carregamento instantâneo via CDN
- Arquivos JSON estáticos
- Sem dependências de servidor
- Cache automático do GitHub

### Funcionalidades
- Busca em tempo real
- Filtros por categoria
- Ordenação de produtos
- Interface responsiva
- Painel administrativo

### Segurança
- Sistema somente leitura
- Dados servidos estaticamente
- Sem exposição de APIs
- Controle via GitHub

## 📱 Compatibilidade

- Todos os navegadores modernos
- Dispositivos móveis e desktop
- Funciona offline após primeiro carregamento
- Acessível via HTTPS

## 🛠️ Manutenção

### Atualizando Produtos
1. Edite `data/products.json`
2. Commit e push para o repositório
3. GitHub Pages atualiza automaticamente

### Adicionando Imagens
1. Coloque arquivos em `images/`
2. Referencie no JSON como `images/nome-arquivo.jpg`
3. Commit e push

### Modificando Layout
- Edite CSS inline em `index.html`
- Modifique JavaScript conforme necessário
- Teste localmente antes do deploy

## 📈 Monitoramento

O painel admin mostra:
- Total de produtos ativos
- Estatísticas por categoria
- Status dos usuários
- Última atualização

## 🔒 Autenticação

Sistema básico implementado via JavaScript:
- Username: `moveisbonafe`
- Password: `bonafe1108`
- Verificação contra `data/users.json`

## 📞 Suporte

Sistema desenvolvido para MoveisBonafe
- Dados autênticos migrados do Supabase
- Arquitetura otimizada para GitHub Pages
- Performance CDN global