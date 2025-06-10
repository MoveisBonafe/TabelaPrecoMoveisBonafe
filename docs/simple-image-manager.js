// Simple Memory-Only Image Manager
class SimpleImageManager {
    constructor() {
        this.cache = new Map();
        this.maxCacheSize = 100;
    }

    store(filename, base64Data) {
        this.cache.set(filename, {
            data: base64Data,
            timestamp: Date.now()
        });

        // Prevent memory overflow
        if (this.cache.size > this.maxCacheSize) {
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
        }
    }

    get(filename) {
        const cached = this.cache.get(filename);
        return cached ? cached.data : null;
    }

    handleError(img) {
        const filename = this.extractFilename(img.src);
        const cached = this.get(filename);
        
        if (cached) {
            img.src = cached;
            img.style.border = '2px solid #10b981';
            return true;
        }

        // Show simple loading state
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2IiBzdHJva2U9IiNkMWQ1ZGIiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNmI3NDgxIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Carregando...</dGV4dD48L3N2Zz4=';
        return false;
    }

    extractFilename(url) {
        return url.split('/').pop().split('?')[0];
    }
}

// Initialize global instance
window.simpleImageManager = new SimpleImageManager();
window.handleImageError = (img) => window.simpleImageManager.handleError(img);