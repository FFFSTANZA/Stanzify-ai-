// High-quality fallback placeholder generation
const FALLBACK_PLACEHOLDERS = {
  business: 'data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%201200%20675%22%3E%3Crect%20fill=%22%234F46E5%22%20width=%221200%22%20height=%22675%22/%3E%3Ctext%20x=%22600%22%20y=%22337%22%20font-size=%2248%22%20fill=%22white%22%20text-anchor=%22middle%22%20dominant-baseline=%22middle%22%3E📊%20Business%20Content%3C/text%3E%3C/svg%3E',
  technology: 'data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%201200%20675%22%3E%3Crect%20fill=%223B82F6%22%20width=%221200%22%20height=%22675%22/%3E%3Ctext%20x=%22600%22%20y=%22337%22%20font-size=%2248%22%20fill=%22white%22%20text-anchor=%22middle%22%20dominant-baseline=%22middle%22%3E💻%20Tech%20Content%3C/text%3E%3C/svg%3E',
  education: 'data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%201200%20675%22%3E%3Crect%20fill=%2310B981%22%20width=%221200%22%20height=%22675%22/%3E%3Ctext%20x=%22600%22%20y=%22337%22%20font-size=%2248%22%20fill=%22white%22%20text-anchor=%22middle%22%20dominant-baseline=%22middle%22%3E📚%20Learning%20Content%3C/text%3E%3C/svg%3E',
  marketing: 'data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%201200%20675%22%3E%3Crect%20fill=%22%23F97316%22%20width=%221200%22%20height=%22675%22/%3E%3Ctext%20x=%22600%22%20y=%22337%22%20font-size=%2248%22%20fill=%22white%22%20text-anchor=%22middle%22%20dominant-baseline=%22middle%22%3E🎯%20Marketing%20Content%3C/text%3E%3C/svg%3E',
  pitch: 'data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%201200%20675%22%3E%3Crect%20fill=%228B5CF6%22%20width=%221200%22%20height=%22675%22/%3E%3Ctext%20x=%22600%22%20y=%22337%22%20font-size=%2248%22%20fill=%22white%22%20text-anchor=%22middle%22%20dominant-baseline=%22middle%22%3E🚀%20Pitch%20Content%3C/text%3E%3C/svg%3E',
  default: 'data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%201200%20675%22%3E%3Crect%20fill=%23667EEA%22%20width=%221200%22%20height=%22675%22/%3E%3Ctext%20x=%22600%22%20y=%22337%22%20font-size=%2248%22%20fill=%22white%22%20text-anchor=%22middle%22%20dominant-baseline=%22middle%22%3E✨%20Content%20Section%3C/text%3E%3C/svg%3E',
};

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY ?? '';
const UNSPLASH_API_URL = 'https://api.unsplash.com';

// Retry configuration
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 500;

export interface UnsplashImage {
  id: string;
  url: string;
  downloadUrl: string;
  author: string;
  authorUrl: string;
  description: string | null;
}

async function fetchWithRetry(url: string, options: RequestInit, retries = RETRY_ATTEMPTS): Promise<Response> {
  try {
    const response = await fetch(url, options);
    if (response.ok) return response;
    
    if (retries > 0 && response.status >= 500) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      return fetchWithRetry(url, options, retries - 1);
    }
    
    return response;
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

export async function searchImages(query: string, count = 1): Promise<UnsplashImage[]> {
  // If no API key, return placeholder images
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('No Unsplash API key configured, using placeholder images');
    return getPlaceholderImages(query, count);
  }

  try {
    const response = await fetchWithRetry(
      `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape&order_by=relevant`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          'Accept-Version': 'v1'
        },
        cache: 'force-cache'
      }
    );

    if (!response.ok) {
      console.warn(`Unsplash API error (${response.status}), using placeholder images`);
      return getPlaceholderImages(query, count);
    }

    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      console.warn(`No images found for query "${query}", using placeholder images`);
      return getPlaceholderImages(query, count);
    }
    
    return data.results.slice(0, count).map((photo: any) => ({
      id: photo.id,
      url: photo.urls.regular || photo.urls.full,
      downloadUrl: photo.links.download_location,
      author: photo.user?.name || 'Unsplash',
      authorUrl: photo.user?.links?.html || 'https://unsplash.com',
      description: photo.description || photo.alt_description || query,
    }));
  } catch (error) {
    console.error('Error fetching images from Unsplash:', error);
    return getPlaceholderImages(query, count);
  }
}

function getPlaceholderImages(query: string, count: number): UnsplashImage[] {
  const placeholderImages: UnsplashImage[] = [];
  
  // Determine category from query for better placeholders
  const categoryKey = getCategoryFromKeyword(query);
  const placeholderUrl = FALLBACK_PLACEHOLDERS[categoryKey as keyof typeof FALLBACK_PLACEHOLDERS] || FALLBACK_PLACEHOLDERS.default;
  
  for (let i = 0; i < count; i++) {
    placeholderImages.push({
      id: `placeholder-${query}-${i}`,
      url: placeholderUrl,
      downloadUrl: '',
      author: 'Stanzify Placeholder',
      authorUrl: 'https://stanzify.app',
      description: `Placeholder for: ${query}`,
    });
  }
  
  return placeholderImages;
}

function getCategoryFromKeyword(keyword: string): string {
  const lower = keyword.toLowerCase();
  if (lower.includes('tech') || lower.includes('code') || lower.includes('computer')) return 'technology';
  if (lower.includes('business') || lower.includes('finance') || lower.includes('market')) return 'business';
  if (lower.includes('learn') || lower.includes('education') || lower.includes('study')) return 'education';
  if (lower.includes('market') || lower.includes('sale') || lower.includes('campaign')) return 'marketing';
  if (lower.includes('pitch') || lower.includes('startup') || lower.includes('invest')) return 'pitch';
  return 'default';
}

export function extractKeywordsFromMarkdown(markdown: string): string[] {
  // Extract from both inline images and background attributes
  const inlineRegex = /!\[.*?\]\(IMAGE_PLACEHOLDER_(.+?)\)/g;
  const backgroundRegex = /background:\s*IMAGE_PLACEHOLDER_(.+?)(?:\s|$)/g;
  const keywords: string[] = [];
  let match;

  while ((match = inlineRegex.exec(markdown)) !== null) {
    if (!keywords.includes(match[1])) {
      keywords.push(match[1]);
    }
  }

  while ((match = backgroundRegex.exec(markdown)) !== null) {
    if (!keywords.includes(match[1])) {
      keywords.push(match[1]);
    }
  }

  return [...new Set(keywords)]; // Deduplicate
}

export async function replaceImagePlaceholders(markdown: string, progressCallback?: (status: string) => void): Promise<string> {
  const keywords = extractKeywordsFromMarkdown(markdown);
  
  if (keywords.length === 0) {
    return markdown;
  }

  try {
    progressCallback?.('Fetching images from Unsplash...');
    
    // Fetch images with timeout protection
    const imagePromises = keywords.map((keyword) => 
      Promise.race([
        searchImages(keyword, 1),
        new Promise<UnsplashImage[]>((_, reject) => 
          setTimeout(() => reject(new Error('Image fetch timeout')), 10000)
        )
      ]).catch(() => getPlaceholderImages(keyword, 1))
    );
    
    const imageResults = await Promise.all(imagePromises);

    let updatedMarkdown = markdown;
    let processedCount = 0;
    
    keywords.forEach((keyword, index) => {
      const images = imageResults[index];
      if (images && images.length > 0) {
        const url = images[0].url;
        
        // Replace in inline images
        updatedMarkdown = updatedMarkdown.replace(
          new RegExp(`!\\[([^\\]]*?)\\]\\(IMAGE_PLACEHOLDER_${escapeRegex(keyword)}\\)`, 'g'),
          `![$1](${url})`
        );
        
        // Replace in background attributes
        updatedMarkdown = updatedMarkdown.replace(
          new RegExp(`background:\\s*IMAGE_PLACEHOLDER_${escapeRegex(keyword)}`, 'g'),
          `background: ${url}`
        );
        
        processedCount++;
        progressCallback?.(`Image ${processedCount}/${keywords.length}: ${keyword}`);
      }
    });

    progressCallback?.('Image replacement complete!');
    return updatedMarkdown;
  } catch (error) {
    console.error('Error replacing image placeholders:', error);
    // Return original markdown if image replacement fails
    return markdown;
  }
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
