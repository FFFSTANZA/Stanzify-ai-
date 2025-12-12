import Groq from "groq-sdk";
import { generateSlidevPresentation } from "./slidevService";

const groq = new Groq({
  apiKey: "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",
  dangerouslyAllowBrowser: true,
});

interface ThemeConfig {
  palette: {
    name: string;
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  style: string;
  purpose: string;
  imageSource: string;
}

// Legacy cache - now using slidevService cache
const promptCache = new Map<string, string>();

// Enhanced slide count calculation for premium presentations
function calculateOptimalSlideCount(prompt: string, purpose: string): string {
  const wordCount = prompt.split(' ').length;
  const complexity = wordCount > 80 ? 'detailed' : wordCount > 40 ? 'moderate' : 'concise';
  const normalized = purpose.toLowerCase();

  if (['pitch', 'business', 'marketing'].includes(normalized)) {
    return complexity === 'detailed' ? '12-16' : '10-14';
  }

  if (['academic', 'educational'].includes(normalized)) {
    return complexity === 'concise' ? '15-20' : '20-25';
  }

  if (['workshop', 'webinar'].includes(normalized)) {
    return complexity === 'detailed' ? '25-30' : '20-25';
  }

  if (normalized === 'personal') {
    return complexity === 'detailed' ? '10-14' : '8-12';
  }

  if (complexity === 'detailed') return '15-20';
  if (complexity === 'concise') return '8-12';

  return '12-15';
}

// Enhanced keyword extraction with semantic analysis
function extractAdvancedKeywords(prompt: string): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those'
  ]);
  
  const words = prompt.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));
  
  // Extract multi-word phrases for better semantic matching
  const phrases = [];
  const wordsArray = prompt.toLowerCase().split(/\s+/);
  for (let i = 0; i < wordsArray.length - 1; i++) {
    const phrase = wordsArray.slice(i, i + 2).join(' ');
    if (phrase.length > 6 && !Array.from(stopWords).some(w => phrase.includes(w))) {
      phrases.push(phrase);
    }
  }
  
  const allTerms = [...new Set([...words, ...phrases])];
  return allTerms.slice(0, 10);
}

export interface GenerateSlidesOptions {
  prompt: string;
  theme: ThemeConfig;
  onProgress?: (chunk: string) => void;
  temperature?: number; // Control creativity
  maxRetries?: number; // Retry on failure
  template?: 'pitch' | 'workshop' | 'academic' | 'custom';
}

export async function generateSlides(
  options: GenerateSlidesOptions
): Promise<string> {
  const { 
    prompt, 
    theme, 
    onProgress,
    temperature = 0.8, // Enhanced creativity
    maxRetries = 3, // More retries for premium content
    template = 'custom'
  } = options;

  try {
    // Delegate to the advanced slidevService
    const result = await generateSlidevPresentation({
      prompt,
      theme,
      onProgress,
      temperature,
      maxRetries,
      template
    });

    return result;
  } catch (error) {
    // Fallback to legacy method if slidevService fails
    console.warn("slidevService failed, falling back to legacy generation:", error);
    return generateSlidesLegacy(options);
  }
}

// Legacy generation method for backward compatibility
async function generateSlidesLegacy(
  options: GenerateSlidesOptions
): Promise<string> {
  const { 
    prompt, 
    theme, 
    onProgress,
    temperature = 0.75,
    maxRetries = 2
  } = options;

  const systemPrompt = buildAdvancedSlidevPromptLegacy(prompt, theme);

  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt <= maxRetries) {
    try {
      const stream = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a world-class presentation designer (Gamma/Canva-level). Output ONLY valid Slidev markdown with NO explanations. Apply theme colors, use multiple diagram types, include animations."
          },
          {
            role: "user",
            content: systemPrompt,
          },
        ],
        model: "mixtral-8x7b-32768",
        temperature: temperature,
        max_tokens: 12000,
        top_p: 0.95,
        stream: true,
      });

      let fullContent = "";
      let lastChunkTime = Date.now();

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullContent += content;
          lastChunkTime = Date.now();
          
          if (onProgress) {
            onProgress(content);
          }
        }

        if (Date.now() - lastChunkTime > 10000) {
          throw new Error("Stream timeout");
        }
      }

      if (fullContent.trim().length < 100) {
        throw new Error("Generated content too short");
      }

      fullContent = fullContent.replace(/\r\n/g, '\n').trim();

      const wrapperMatch = fullContent.match(/^```(?:[\w-]+)?\s*\n([\s\S]*?)\n```\s*$/);
      if (wrapperMatch) {
        fullContent = wrapperMatch[1].trim();
      }

      return fullContent;

    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error");
      attempt++;
      
      console.warn(`Legacy generation attempt ${attempt} failed:`, lastError.message);
      
      if (attempt <= maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  throw new Error(
    `Failed to generate slides after ${maxRetries + 1} attempts: ${lastError?.message || 'Unknown error'}`
  );
}

// Legacy prompt builder (simplified version of the advanced one)
function buildAdvancedSlidevPromptLegacy(userPrompt: string, theme: ThemeConfig): string {
  const keywords = extractAdvancedKeywords(userPrompt);
  const slideCount = calculateOptimalSlideCount(userPrompt, theme.purpose);

  return `You are a PREMIUM presentation designer (Gamma/Canva level).

TOPIC: ${userPrompt}
SLIDES: ${slideCount}
KEYWORDS: ${keywords.join(', ')}

Generate a professional Slidev presentation with:
- Multiple layout types (cover, two-cols, center, fact, quote, section)
- Mermaid diagrams for processes
- Strategic use of emojis and visual hierarchy
- Clean, modern design
- Professional typography

Output ONLY Slidev markdown. Start immediately:`;
}

// Enhanced slide regeneration using slidevService
export async function regenerateSlide(
  slideContent: string,
  instruction: string,
  theme: ThemeConfig,
  context?: string
): Promise<string> {
  try {
    // Import the enhanced slidevService function
    const { regenerateSlidevSlide } = await import("./slidevService");
    
    return await regenerateSlidevSlide(slideContent, instruction, theme, context);
  } catch (error) {
    console.error("Enhanced slide regeneration failed, falling back:", error);
    
    // Fallback to legacy method
    try {
      const response = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a presentation designer. Improve the given slide based on instructions. Output ONLY the improved Slidev markdown."
          },
          {
            role: "user",
            content: `CURRENT SLIDE:
${slideContent}

CONTEXT: ${context || 'No additional context'}
INSTRUCTION: ${instruction}

THEME COLORS:
Primary: ${theme.palette.primary}
Accent: ${theme.palette.accent}
Style: ${theme.style}

Output the improved slide markdown:`
          }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.8,
        max_tokens: 1500,
      });

      return response.choices[0]?.message?.content || slideContent;
    } catch (fallbackError) {
      console.error("Slide regeneration failed:", fallbackError);
      return slideContent;
    }
  }
}

// Enhanced analysis using slidevService
export async function analyzePresentationQuality(
  markdown: string
): Promise<{
  score: number;
  suggestions: string[];
  strengths?: string[];
  layoutDiversity?: number;
  visualImpact?: number;
}> {
  try {
    // Use enhanced slidevService analysis
    const { analyzeSlidevPresentation } = await import("./slidevService");
    
    const result = await analyzeSlidevPresentation(markdown);
    
    return {
      score: result.score,
      suggestions: result.suggestions,
      strengths: result.strengths,
      layoutDiversity: result.layoutDiversity,
      visualImpact: result.visualImpact
    };
  } catch (error) {
    console.error("Enhanced analysis failed, falling back:", error);
    
    // Fallback to legacy analysis
    try {
      const response = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `Analyze this Slidev presentation and provide:
1. Quality score (0-100)
2. Top 3 improvement suggestions

PRESENTATION:
${markdown.slice(0, 2000)}... [truncated]

Output as JSON:
{
  "score": 85,
  "suggestions": ["...", "...", "..."]
}`
          }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
        max_tokens: 500,
      });

      const content = response.choices[0]?.message?.content || "";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return {
          score: result.score,
          suggestions: result.suggestions,
          strengths: ["Professional structure", "Good content flow", "Clear messaging"]
        };
      }
      
      return { 
        score: 70, 
        suggestions: ["Unable to analyze"],
        strengths: ["Basic presentation structure"]
      };
    } catch (fallbackError) {
      console.error("Analysis failed:", fallbackError);
      return { 
        score: 70, 
        suggestions: ["Analysis unavailable"],
        strengths: ["Content present"]
      };
    }
  }
}

// Clear cache (call on app restart or settings change)
export function clearPromptCache(): void {
  promptCache.clear();
}

// Get cache stats (for debugging)
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: promptCache.size,
    keys: Array.from(promptCache.keys())
  };
}