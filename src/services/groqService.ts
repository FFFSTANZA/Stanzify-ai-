import Groq from "groq-sdk";

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

// Token optimization: Cache common prompts
const promptCache = new Map<string, string>();

// Intelligent slide count based on topic complexity
function calculateOptimalSlideCount(prompt: string, purpose: string): string {
  const wordCount = prompt.split(' ').length;
  
  if (purpose === 'pitch') return '8-12'; // Pitch decks are concise
  if (purpose === 'academic') return '15-20'; // Academic needs detail
  if (purpose === 'workshop') return '20-30'; // Workshops need more
  if (wordCount < 10) return '8-12'; // Short prompt = fewer slides
  if (wordCount > 50) return '15-20'; // Detailed prompt = more slides
  
  return '12-15'; // Default sweet spot
}

// Extract keywords for better image selection
function extractKeywords(prompt: string): string[] {
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
  const words = prompt.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopWords.has(w));
  
  return [...new Set(words)].slice(0, 5); // Top 5 unique keywords
}

// Build ultra-optimized prompt (token-efficient)
function buildAdvancedSlidevPrompt(userPrompt: string, theme: ThemeConfig): string {
  const keywords = extractKeywords(userPrompt);
  const slideCount = calculateOptimalSlideCount(userPrompt, theme.purpose);
  const cacheKey = `${userPrompt}-${theme.style}-${theme.purpose}`;
  
  // Check cache first (save tokens on regeneration)
  if (promptCache.has(cacheKey)) {
    return promptCache.get(cacheKey)!;
  }

  const prompt = `You are a PREMIUM presentation designer (Gamma/Canva level).

TOPIC: ${userPrompt}
STYLE: ${theme.style}
PURPOSE: ${theme.purpose}
SLIDES: ${slideCount}
KEYWORDS: ${keywords.join(', ')}

COLORS:
Primary: ${theme.palette.primary}
Accent: ${theme.palette.accent}
BG: ${theme.palette.background}

═══ RULES ═══
✅ Output PURE Slidev markdown (no explanations)
✅ Use varied layouts (cover, two-cols, center, fact, quote, section, end)
✅ Include 2-3 Mermaid diagrams
✅ Add 1-2 powerful stats/facts
✅ Use emojis strategically (🚀 💡 📊 ✨ 🎯)
✅ Keep text minimal (3-5 bullets max per slide)
✅ Use unsplash images: https://source.unsplash.com/1600x900/?KEYWORD

❌ NO HTML/CSS
❌ NO v-click directives
❌ NO long paragraphs
❌ NO repeated layouts back-to-back

═══ LAYOUT DISTRIBUTION ═══
Slide 1: Cover (with dramatic background)
Slides 2-3: Problem/Context (two-cols or center)
Slide 4: Section divider
Slides 5-7: Core content (mix: two-cols, image-right, center)
Slide 8: Fact/stat slide
Slides 9-11: Solutions/Features (varied layouts)
Slide 12: Mermaid diagram
Slide 13: Quote (if appropriate)
Slide 14: Call-to-action
Slide 15: End

═══ QUALITY STANDARDS ═══
• Gamma-level visual hierarchy
• Professional typography
• Balanced spacing
• High-contrast colors
• Impactful headlines
• Data-driven when possible
• Storytelling flow

═══ EXAMPLES ═══

COVER:
---
layout: cover
background: https://source.unsplash.com/1600x900/?${keywords[0] || 'technology'}
class: text-center
---

# ${userPrompt.split(' ').slice(0, 5).join(' ')}
## Elevate Your Presentation Game

<div class="abs-br m-6 text-xl">
  <div>Powered by Stanzify</div>
</div>

---

TWO-COLS:
---
layout: two-cols
---

# 💡 Key Insight

- Concise point
- Data-backed claim
- Visual metaphor

::right::

<div class="mt-20">

\`\`\`mermaid
pie
  "Success" : 60
  "Growth" : 30
  "Innovation" : 10
\`\`\`

</div>

---

FACT:
---
layout: fact
---

# 10X
## Faster Results

---

SECTION:
---
layout: section
background: ${theme.palette.primary}
---

# Section Title
## Transition Message

---

IMAGE-RIGHT:
---
layout: image-right
image: https://source.unsplash.com/1600x900/?${keywords[1] || 'business'}
---

# Visual Impact

- Clean bullet
- Strong claim
- Call to action

---

CENTER WITH DIAGRAM:
---
layout: center
---

# Process Flow

\`\`\`mermaid
graph LR
    A[Start] -->|Action| B[Process]
    B --> C[Result]
    C --> D[Success]
    style D fill:${theme.palette.accent}
\`\`\`

---

QUOTE:
---
layout: quote
---

# "Innovation distinguishes between a leader and a follower"
## — Steve Jobs

---

END:
---
layout: end
background: https://source.unsplash.com/1600x900/?${keywords[0] || 'success'}
---

# Thank You 🙏

### Questions?

<div class="abs-br m-6 flex gap-2">
  <a href="https://github.com" target="_blank" class="text-xl icon-btn opacity-50 !border-none !hover:text-white">
    <carbon-logo-github />
  </a>
</div>

---

NOW GENERATE ${slideCount} SLIDES. Start immediately with markdown:`;

  promptCache.set(cacheKey, prompt);
  return prompt;
}

export interface GenerateSlidesOptions {
  prompt: string;
  theme: ThemeConfig;
  onProgress?: (chunk: string) => void;
  temperature?: number; // Control creativity
  maxRetries?: number; // Retry on failure
}

export async function generateSlides(
  options: GenerateSlidesOptions
): Promise<string> {
  const { 
    prompt, 
    theme, 
    onProgress,
    temperature = 0.75, // Balanced creativity
    maxRetries = 2
  } = options;

  const systemPrompt = buildAdvancedSlidevPrompt(prompt, theme);

  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt <= maxRetries) {
    try {
      const stream = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a world-class presentation designer. Output ONLY valid Slidev markdown with NO explanations."
          },
          {
            role: "user",
            content: systemPrompt,
          },
        ],
        model: "llama-3.3-70b-versatile", // More powerful model
        temperature: temperature,
        max_tokens: 8000, // Increased for complex presentations
        top_p: 0.9, // Focused creativity
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

        // Timeout detection (if no chunks for 10s)
        if (Date.now() - lastChunkTime > 10000) {
          throw new Error("Stream timeout");
        }
      }

      // Validate output
      if (fullContent.trim().length < 100) {
        throw new Error("Generated content too short");
      }

      // Clean up output (remove any accidental code fences)
      fullContent = fullContent
        .replace(/^```.*\n/gm, '')
        .replace(/\n```$/gm, '')
        .trim();

      // Success - clear cache and return
      return fullContent;

    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error");
      attempt++;
      
      console.warn(`Generation attempt ${attempt} failed:`, lastError.message);
      
      if (attempt <= maxRetries) {
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  // All retries failed
  throw new Error(
    `Failed to generate slides after ${maxRetries + 1} attempts: ${lastError?.message || 'Unknown error'}`
  );
}

// Regenerate specific slide (token-efficient)
export async function regenerateSlide(
  slideContent: string,
  instruction: string,
  theme: ThemeConfig
): Promise<string> {
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

INSTRUCTION: ${instruction}

THEME COLORS:
Primary: ${theme.palette.primary}
Accent: ${theme.palette.accent}

Output the improved slide markdown:`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      max_tokens: 1500,
    });

    return response.choices[0]?.message?.content || slideContent;
  } catch (error) {
    console.error("Slide regeneration failed:", error);
    return slideContent; // Return original on failure
  }
}

// Analyze and suggest improvements (optional feature)
export async function analyzePresentationQuality(
  markdown: string
): Promise<{
  score: number;
  suggestions: string[];
}> {
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
      return JSON.parse(jsonMatch[0]);
    }
    
    return { score: 70, suggestions: ["Unable to analyze"] };
  } catch (error) {
    console.error("Analysis failed:", error);
    return { score: 70, suggestions: ["Analysis unavailable"] };
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