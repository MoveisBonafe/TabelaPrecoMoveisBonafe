// Image Sync Fix for GitHub Pages CDN delay
class ImageSyncManager {
    constructor() {
        this.recentUploads = new Map();
        this.fallbackCache = new Map();
        this.maxCacheTime = 24 * 60 * 60 * 1000; // 24 hours
    }

    // Store image data after upload
    storeUpload(filename, base64Data) {
        const uploadData = {
            filename,
            base64Data,
            uploadTime: Date.now(),
            githubPath: `data/images/${filename}`
        };
        
        this.recentUploads.set(filename, uploadData);
        this.fallbackCache.set(filename, base64Data);
        
        // Also store in localStorage with cleanup
        try {
            localStorage.setItem(`img_${filename}`, base64Data);
            localStorage.setItem(`img_time_${filename}`, Date.now().toString());
            this.cleanOldLocalStorage();
        } catch (e) {
            console.warn('localStorage full, using memory cache only');
        }
    }

    // Get image source with automatic fallback
    getImageSrc(filename) {
        const upload = this.recentUploads.get(filename);
        const now = Date.now();
        
        // If uploaded recently (< 5 minutes), use base64 immediately
        if (upload && (now - upload.uploadTime) < 5 * 60 * 1000) {
            return upload.base64Data;
        }
        
        // Otherwise try GitHub URL first
        return `https://moveisbonafe.github.io/TabelaPrecoMoveisBonafe/data/images/${filename}`;
    }

    // Handle image load errors with smart fallback
    handleImageError(img) {
        const filename = this.extractFilename(img.src);
        
        // Try base64 fallback first
        const fallback = this.fallbackCache.get(filename) || 
                         localStorage.getItem(`img_${filename}`);
        
        if (fallback) {
            img.src = fallback;
            img.style.border = '2px solid #059669';
            img.title = 'Imagem carregada do cache local';
            return true;
        }
        
        // If no fallback, show placeholder
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY5NzU4MiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbSBuw6NvIGRpc3BvbsOtdmVsPC90ZXh0Pjwvc3ZnPg==';
        img.title = 'Imagem não disponível';
        return false;
    }

    // Extract filename from URL
    extractFilename(url) {
        return url.split('/').pop().split('?')[0];
    }

    // Clean old localStorage entries
    cleanOldLocalStorage() {
        const now = Date.now();
        const keysToRemove = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('img_time_')) {
                const uploadTime = parseInt(localStorage.getItem(key));
                if (now - uploadTime > this.maxCacheTime) {
                    const filename = key.replace('img_time_', '');
                    keysToRemove.push(`img_${filename}`, key);
                }
            }
        }
        
        keysToRemove.forEach(key => {
            try {
                localStorage.removeItem(key);
            } catch (e) {}
        });
    }

    // Initialize global handlers
    init() {
        // Global image error handler
        window.handleImageError = (img) => this.handleImageError(img);
        
        // Clean cache on page load
        this.cleanOldLocalStorage();
        
        console.log('ImageSyncManager initialized');
    }
}

// Initialize globally
window.imageSyncManager = new ImageSyncManager();
window.imageSyncManager.init();