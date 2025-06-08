# MoveisBonafe - Sistema de Catálogo

Sistema de gerenciamento de catálogo de produtos para móveis com suporte a múltiplos usuários e sincronização em tempo real.

## Acesso ao Sistema

- **Login**: [https://moveisbonafe.github.io/TabelaPrecoMoveisBonafe/docs/login.html](https://moveisbonafe.github.io/TabelaPrecoMoveisBonafe/docs/login.html)
- **Admin**: [https://moveisbonafe.github.io/TabelaPrecoMoveisBonafe/docs/admin.html](https://moveisbonafe.github.io/TabelaPrecoMoveisBonafe/docs/admin.html)
- **Catálogo**: [https://moveisbonafe.github.io/TabelaPrecoMoveisBonafe/docs/catalogo.html](https://moveisbonafe.github.io/TabelaPrecoMoveisBonafe/docs/catalogo.html)

## Funcionalidades

- ✅ Sistema de login com múltiplos perfis (admin, loja, restaurante)
- ✅ Gerenciamento de produtos com múltiplas imagens
- ✅ Categorias com imagens personalizadas
- ✅ Sistema de cores padronizadas
- ✅ Tabelas de preço dinâmicas
- ✅ Carrinho de compras por dispositivo
- ✅ Sincronização em tempo real entre dispositivos
- ✅ Armazenamento no GitHub com fallback localStorage

## Estrutura do Projeto

```
docs/
├── login.html          # Página de login
├── admin.html          # Painel administrativo
├── catalogo.html       # Catálogo de produtos
├── data/
│   ├── products.json   # Dados dos produtos
│   ├── categories.json # Categorias
│   ├── colors.json     # Cores padronizadas
│   ├── users.json      # Usuários do sistema
│   └── images/         # Imagens dos produtos
└── assets/             # Recursos estáticos
```

## Tecnologias

- HTML5, CSS3, JavaScript (Vanilla)
- GitHub Pages para hospedagem
- localStorage para cache local
- GitHub API para persistência de dados

## Notas Importantes

- Upload de imagens disponível apenas na versão de desenvolvimento
- GitHub Pages serve arquivos estáticos existentes
- Dados sincronizam automaticamente entre dispositivos
- Carrinho de compras específico por dispositivo