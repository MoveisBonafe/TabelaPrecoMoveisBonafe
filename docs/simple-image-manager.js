// Enhanced Memory-Only Image Manager with immediate display for new uploads
class SimpleImageManager {
    constructor() {
        this.cache = new Map();
        this.uploadTimestamps = new Map();
        this.maxCacheSize = 100;
        this.githubDelayTime = 60000; // 60 seconds
    }

    store(filename, base64Data) {
        this.cache.set(filename, base64Data);
        this.uploadTimestamps.set(filename, Date.now());

        // Prevent memory overflow
        if (this.cache.size > this.maxCacheSize) {
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
            this.uploadTimestamps.delete(oldestKey);
        }
        
        console.log(`Image cached: ${filename}`);
    }

    get(filename) {
        return this.cache.get(filename) || null;
    }

    isRecentUpload(filename) {
        const uploadTime = this.uploadTimestamps.get(filename);
        if (!uploadTime) return false;
        return (Date.now() - uploadTime) < this.githubDelayTime;
    }

    handleError(img) {
        const filename = this.extractFilename(img.src);
        
        // Priority 1: Check our memory cache
        const cached = this.get(filename);
        if (cached) {
            img.src = cached;
            img.style.border = '2px solid #10b981';
            img.title = 'Imagem do cache local';
            return true;
        }

        // Priority 2: Check global memory cache
        if (window.imageMemoryCache && window.imageMemoryCache[filename]) {
            img.src = window.imageMemoryCache[filename];
            img.style.border = '2px solid #f59e0b';
            img.title = 'Imagem do cache global';
            return true;
        }

        // Priority 3: For recent uploads, show loading placeholder and retry
        if (this.isRecentUpload(filename)) {
            this.showLoadingPlaceholder(img, filename);
            this.scheduleRetry(img, filename);
            return false;
        }

        // Final: Show unavailable placeholder
        this.showUnavailablePlaceholder(img, filename);
        return false;
    }

    showLoadingPlaceholder(img, filename) {
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmVmM2M3IiBzdHJva2U9IiNmNTk1MDIiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNDAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNkOTI1MjEiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNhcnJlZ2FuZG8uLi48L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI2MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iI2Q5MjUyMSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QWd1YXJkZSBzaW5jcm9uaXphw6fDo288L3RleHQ+PC9zdmc+';
        img.style.border = '2px solid #f59e0b';
        img.title = `Processando upload: ${filename}`;
    }

    showUnavailablePlaceholder(img, filename) {
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2IiBzdHJva2U9IiNkMWQ1ZGIiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNmI3NDgxIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbWFnZW0gaW5kaXNwb27DrXZlbDwvdGV4dD48L3N2Zz4=';
        img.style.border = '2px solid #ef4444';
        img.title = `Imagem não encontrada: ${filename}`;
    }

    scheduleRetry(img, filename) {
        setTimeout(() => {
            const originalSrc = img.src.split('?')[0];
            if (originalSrc.includes('data:image/svg+xml')) {
                // Still showing placeholder, try GitHub URL again
                img.src = `https://moveisbonafe.github.io/TabelaPrecoMoveisBonafe/data/images/${filename}?retry=${Date.now()}`;
            }
        }, 10000); // Retry after 10 seconds
    }

    extractFilename(url) {
        if (!url) return '';
        return url.split('/').pop().split('?')[0];
    }

    // Clean old entries periodically
    cleanup() {
        const now = Date.now();
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        for (const [filename, timestamp] of this.uploadTimestamps.entries()) {
            if (now - timestamp > maxAge) {
                this.cache.delete(filename);
                this.uploadTimestamps.delete(filename);
            }
        }
    }
}

// Initialize global instance
window.simpleImageManager = new SimpleImageManager();
window.handleImageError = (img) => window.simpleImageManager.handleError(img);

// Cleanup old entries every 30 minutes
setInterval(() => {
    if (window.simpleImageManager) {
        window.simpleImageManager.cleanup();
    }
}, 30 * 60 * 1000);