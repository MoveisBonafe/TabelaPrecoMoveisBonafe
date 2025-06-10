// Enhanced Image Sync Manager - Primary memory cache with localStorage backup
class ImageSyncManager {
    constructor() {
        this.memoryCache = new Map(); // Primary cache
        this.uploadQueue = new Map(); // Recently uploaded items
        this.githubSyncDelay = 30000; // 30 seconds expected delay
        this.maxMemoryCacheSize = 50; // Limit memory usage
    }

    // Store image data after upload (prioritize memory cache)
    storeUpload(filename, base64Data) {
        const uploadData = {
            filename,
            base64Data,
            uploadTime: Date.now(),
            synced: false
        };
        
        // Store in memory cache first (most reliable)
        this.memoryCache.set(filename, base64Data);
        this.uploadQueue.set(filename, uploadData);
        
        // Try minimal localStorage only for critical info
        try {
            localStorage.setItem(`recent_${filename}`, Date.now().toString());
        } catch (e) {
            // Ignore localStorage errors - memory cache is primary
        }
        
        // Auto-cleanup memory cache
        this.cleanMemoryCache();
        
        console.log(`Image stored in memory cache: ${filename}`);
    }

    // Get image source with intelligent fallback logic
    getImageSrc(filename) {
        // Check if we have it in memory cache first
        if (this.memoryCache.has(filename)) {
            return this.memoryCache.get(filename);
        }
        
        // Check if it's a recent upload that might not be synced yet
        const uploadInfo = this.uploadQueue.get(filename);
        if (uploadInfo) {
            const timeSinceUpload = Date.now() - uploadInfo.uploadTime;
            
            // Use base64 for first 2 minutes after upload
            if (timeSinceUpload < 120000) {
                return uploadInfo.base64Data;
            }
        }
        
        // Default to GitHub URL for older images
        return `https://moveisbonafe.github.io/TabelaPrecoMoveisBonafe/data/images/${filename}`;
    }

    // Enhanced error handling with immediate fallback
    handleImageError(img) {
        const filename = this.extractFilename(img.src);
        
        // Priority 1: Memory cache
        if (this.memoryCache.has(filename)) {
            img.src = this.memoryCache.get(filename);
            img.style.border = '2px solid #10b981';
            img.title = 'Cache local';
            return true;
        }
        
        // Priority 2: Upload queue
        const uploadInfo = this.uploadQueue.get(filename);
        if (uploadInfo && uploadInfo.base64Data) {
            img.src = uploadInfo.base64Data;
            img.style.border = '2px solid #f59e0b';
            img.title = 'Upload recente';
            return true;
        }
        
        // Priority 3: Check for recent upload marker
        const recentMarker = localStorage.getItem(`recent_${filename}`);
        if (recentMarker) {
            const uploadTime = parseInt(recentMarker);
            const timeSince = Date.now() - uploadTime;
            
            // If very recent, retry GitHub URL with cache busting
            if (timeSince < 300000) { // 5 minutes
                setTimeout(() => {
                    img.src = `https://moveisbonafe.github.io/TabelaPrecoMoveisBonafe/data/images/${filename}?t=${Date.now()}`;
                }, 2000);
                return false;
            }
        }
        
        // Final fallback: placeholder
        this.showPlaceholder(img, filename);
        return false;
    }

    // Clean memory cache to prevent excessive memory usage
    cleanMemoryCache() {
        if (this.memoryCache.size > this.maxMemoryCacheSize) {
            // Remove oldest entries
            const entries = Array.from(this.memoryCache.entries());
            const toRemove = entries.slice(0, entries.length - this.maxMemoryCacheSize);
            toRemove.forEach(([key]) => this.memoryCache.delete(key));
        }
    }

    // Extract filename from URL
    extractFilename(url) {
        return url.split('/').pop().split('?')[0];
    }

    // Show placeholder image
    showPlaceholder(img, filename) {
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2IiBzdHJva2U9IiNkMWQ1ZGIiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNDAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2Yjc0ODEiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkFndWFyZGFuZG88L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI2MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzZiNzQ4MSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+c2luY3Jvbml6YcOnw6NvLi4uPC90ZXh0Pjwvc3ZnPg==';
        img.title = `Aguardando sincronização: ${filename}`;
        img.style.border = '2px solid #ef4444';
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