// Override all existing upload functions with clean, working implementation
window.uploadImageToGitHub = async function(file, pathPrefix = 'product') {
    const token = localStorage.getItem('github_token');
    if (!token) {
        throw new Error('Token GitHub não configurado');
    }

    try {
        // Clean filename for GitHub compatibility
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${pathPrefix}_${Date.now()}_${cleanName}`;
        
        // Convert to base64 using FileReader (safe method like working project)
        const base64Content = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

        const response = await fetch(`https://api.github.com/repos/moveisbonafe/TabelaPrecoMoveisBonafe/contents/docs/data/images/${filename}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `Upload image: ${filename}`,
                content: base64Content
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Upload failed: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const imageUrl = `https://moveisbonafe.github.io/TabelaPrecoMoveisBonafe/data/images/${filename}`;
        
        // Add to system log if function exists
        if (typeof addSystemLog === 'function') {
            addSystemLog(`✅ Upload successful: ${filename}`);
        }
        
        console.log(`Upload successful: ${imageUrl}`);
        return imageUrl;
        
    } catch (error) {
        if (typeof addSystemLog === 'function') {
            addSystemLog(`❌ Upload error: ${error.message}`);
        }
        console.error('Upload error:', error);
        throw error;
    }
};

// Simple image error handler without localStorage dependencies
window.handleImageError = function(img) {
    const filename = img.src.split('/').pop().split('?')[0];
    
    // Show loading state and schedule retry
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmVmM2M3IiBzdHJva2U9IiNmNTk1MDIiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNDAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNkOTI1MjEiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkFndWFyZGFuZG8uLi48L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI2MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iI2Q5MjUyMSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+R2l0SHViIFBhZ2VzIHNpbmNyb25pemFuZG88L3RleHQ+PC9zdmc+';
    img.title = `Aguardando sincronização: ${filename}`;
    img.style.border = '2px solid #f59e0b';
    
    // Retry after 10 seconds
    setTimeout(() => {
        if (img.src.includes('data:image/svg+xml')) {
            img.src = `https://moveisbonafe.github.io/TabelaPrecoMoveisBonafe/data/images/${filename}?retry=${Date.now()}`;
        }
    }, 10000);
};