// Simple and reliable image upload system based on working project
async function uploadImageToGitHub(file, pathPrefix = 'product') {
    const token = localStorage.getItem('github_token');
    if (!token) {
        throw new Error('Token GitHub não configurado');
    }

    try {
        // Clean filename for GitHub compatibility
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${pathPrefix}_${Date.now()}_${cleanName}`;
        
        // Convert to base64 using FileReader (safe method)
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
            throw new Error(`Erro no upload: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const imageUrl = `https://moveisbonafe.github.io/TabelaPrecoMoveisBonafe/data/images/${filename}`;
        
        console.log(`Upload successful: ${imageUrl}`);
        return imageUrl;
        
    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
}

// Replace global upload function
window.uploadImageToGitHub = uploadImageToGitHub;