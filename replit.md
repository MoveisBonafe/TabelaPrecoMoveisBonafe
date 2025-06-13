# MoveisBonafe Catalog System

## Overview

This is a furniture catalog system for MoveisBonafe that runs entirely on GitHub Pages with a static data architecture. The system provides both a public catalog interface and an administrative panel for managing products, categories, and pricing configurations. It uses JSON files for data storage and GitHub API for content management.

## System Architecture

### Frontend-Only Architecture
- **No Backend Server**: The system runs entirely in the browser using static files served by GitHub Pages
- **GitHub API Integration**: Uses GitHub's API for data persistence and file management
- **Static Data Storage**: All data is stored in JSON files within the repository
- **Client-Side Rendering**: Dynamic content is generated using vanilla JavaScript

### Data Storage Strategy
- JSON files stored in `/docs/data/` directory
- Images stored in `/docs/data/images/` directory
- GitHub Pages serves static content via CDN
- Local storage used for caching and offline functionality

## Key Components

### 1. Public Catalog (`catalogo.html`)
- **Product Display**: Grid-based product catalog with filtering and search
- **Category Navigation**: Browse products by furniture categories
- **Price Tables**: Different pricing for different customer types (stores vs restaurants)
- **Responsive Design**: Mobile-friendly interface

### 2. Administrative Panel (`admin.html`)
- **Product Management**: Create, edit, and manage furniture products
- **Category Management**: Organize products into categories
- **Image Upload**: Direct upload to GitHub repository via API
- **Price Configuration**: Manage different pricing tables
- **User Management**: Handle different user roles and permissions

### 3. Authentication System (`login.html`)
- **Role-Based Access**: Different access levels (admin, store, restaurant)
- **Simple Authentication**: Username/password stored in JSON
- **Session Management**: Browser-based session handling

### 4. Express Server (`server.js`)
- **Development Server**: Local development environment
- **Static File Serving**: Serves the docs directory
- **CORS Support**: Enables cross-origin requests
- **Port Configuration**: Configurable ports for development

## Data Flow

### 1. Data Loading
- System loads JSON data from GitHub Pages CDN
- Fallback to localStorage for offline functionality
- Real-time synchronization between admin panel and catalog

### 2. Content Management
- Admin uploads images directly to GitHub via API
- JSON data files updated through GitHub API
- Automatic commit creation for audit trail

### 3. User Interaction
- Public users browse catalog without authentication
- Authenticated users access role-specific features
- Price calculations based on user role and payment conditions

## External Dependencies

### GitHub Integration
- **GitHub Pages**: Static hosting and CDN
- **GitHub API**: File management and content updates
- **Personal Access Token**: Required for write operations

### JavaScript Libraries
- **No External Frameworks**: Pure vanilla JavaScript implementation
- **Built-in Browser APIs**: FileReader, Fetch, localStorage
- **CSS Grid/Flexbox**: Modern layout techniques

### Development Tools
- **Node.js**: Development server environment
- **Express**: Local development server
- **CORS**: Cross-origin resource sharing

## Deployment Strategy

### GitHub Pages Deployment
- **Automatic Deployment**: Changes to main branch trigger deployment
- **CDN Distribution**: Global content delivery network
- **Custom Domain Support**: Can be configured with custom domain

### Environment Configuration
- **Development**: Local Express server on port 5000
- **Production**: GitHub Pages hosting
- **Asset Management**: Images and data served from GitHub CDN

### Data Synchronization
- **Real-time Updates**: Changes propagate via GitHub API
- **Cache Management**: Smart caching with fallback strategies
- **Conflict Resolution**: Last-write-wins approach for simplicity

## Changelog

```
Changelog:
- June 13, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```