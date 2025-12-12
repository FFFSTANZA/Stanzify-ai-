const UNSPLASH_ACCESS_KEY = 'your_unsplash_access_key_here';
const UNSPLASH_API_URL = 'https://api.unsplash.com';

export interface UnsplashImage {
  id: string;
  url: string;
  downloadUrl: string;
  author: string;
  authorUrl: string;
  description: string | null;
}

export async function searchImages(query: string, count = 1): Promise<UnsplashImage[]> {
  try {
    const response = await fetch(
      `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      console.warn('Unsplash API error, using fallback images');
      return getFallbackImages(query, count);
    }

    const data = await response.json();
    
    return data.results.map((photo: any) => ({
      id: photo.id,
      url: photo.urls.regular,
      downloadUrl: photo.links.download_location,
      author: photo.user.name,
      authorUrl: photo.user.links.html,
      description: photo.description || photo.alt_description,
    }));
  } catch (error) {
    console.error('Error fetching images from Unsplash:', error);
    return getFallbackImages(query, count);
  }
}

function getFallbackImages(query: string, count: number): UnsplashImage[] {
  const fallbackImages: UnsplashImage[] = [];
  
  for (let i = 0; i < count; i++) {
    fallbackImages.push({
      id: `fallback-${i}`,
      url: `https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=675&fit=crop`,
      downloadUrl: '',
      author: 'Unsplash',
      authorUrl: 'https://unsplash.com',
      description: query,
    });
  }
  
  return fallbackImages;
}

export function extractKeywordsFromMarkdown(markdown: string): string[] {
  const placeholderRegex = /!\[.*?\]\(IMAGE_PLACEHOLDER_(.+?)\)/g;
  const keywords: string[] = [];
  let match;

  while ((match = placeholderRegex.exec(markdown)) !== null) {
    keywords.push(match[1]);
  }

  return keywords;
}

export async function replaceImagePlaceholders(markdown: string): Promise<string> {
  const keywords = extractKeywordsFromMarkdown(markdown);
  
  if (keywords.length === 0) {
    return markdown;
  }

  const imagePromises = keywords.map((keyword) => searchImages(keyword, 1));
  const imageResults = await Promise.all(imagePromises);

  let updatedMarkdown = markdown;
  keywords.forEach((keyword, index) => {
    const images = imageResults[index];
    if (images && images.length > 0) {
      const placeholder = `IMAGE_PLACEHOLDER_${keyword}`;
      updatedMarkdown = updatedMarkdown.replace(
        new RegExp(placeholder, 'g'),
        images[0].url
      );
    }
  });

  return updatedMarkdown;
}
