# Catálogo Móveis Bonafe - Dados GitHub Pages

Este repositório contém a estrutura de dados para o sistema de catálogo, otimizada para GitHub Pages.

## Estrutura de Dados

### `/data/`
- `products.json` - Catálogo completo de produtos com preços e imagens
- `categories.json` - Categorias de produtos organizadas
- `users.json` - Usuários do sistema com senhas hash
- `promotions.json` - Promoções ativas no catálogo
- `price_settings.json` - Configurações das tabelas de preço

### `/images/`
- `product-images/` - Imagens dos produtos em alta resolução
- `category-images/` - Ícones e imagens das categorias

## Dados Importados

- **26 produtos** migrados dos dados originais
- **5 categorias** (Mesas, Cadeiras, Banquetas, Camas, Beliches)
- **3 usuários** com diferentes níveis de acesso
- **1 promoção** ativa
- **5 configurações** de tabela de preços

## Sincronização

O sistema é atualizado automaticamente via GitHub API quando modificações são feitas no painel administrativo. Cada alteração gera um commit para rastreamento completo.

## Acesso

- **Público**: Catálogo de produtos acessível via GitHub Pages
- **Admin**: Interface de gerenciamento com autenticação
- **Performance**: Dados servidos diretamente pelo CDN do GitHub