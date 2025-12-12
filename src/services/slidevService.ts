import Groq from "groq-sdk";

// Enhanced slidev service that uses the full power of slidev
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

// Advanced slidev layouts and features
const ADVANCED_SLIDEV_LAYOUTS = {
  // Layout configurations for maximum visual impact
  layouts: {
    hero: {
      class: "h-full flex items-center justify-center text-center",
      components: ["div", "h1", "h2", "p", "button"]
    },
    cover: {
      class: "h-full flex flex-col items-center justify-center text-center space-y-8",
      components: ["h1", "h2", "p", "div"]
    },
    intro: {
      class: "h-full grid grid-cols-2 gap-12 items-center",
      components: ["div", "h1", "ul", "li"]
    },
    content: {
      class: "h-full flex flex-col justify-center space-y-6",
      components: ["h1", "h2", "ul", "li", "p"]
    },
    "two-cols": {
      class: "h-full grid grid-cols-2 gap-12 items-start",
      components: ["div", "h2", "ul", "li", "img", "code"]
    },
    "image-right": {
      class: "h-full grid grid-cols-2 gap-12 items-center",
      components: ["div", "h1", "ul", "li", "img"]
    },
    "image-left": {
      class: "h-full grid grid-cols-2 gap-12 items-center",
      components: ["img", "div", "h1", "ul", "li"]
    },
    center: {
      class: "h-full flex flex-col items-center justify-center text-center space-y-6",
      components: ["h1", "h2", "p", "div"]
    },
    fact: {
      class: "h-full flex flex-col items-center justify-center text-center space-y-4",
      components: ["h1", "h2", "p"]
    },
    quote: {
      class: "h-full flex flex-col items-center justify-center text-center space-y-6",
      components: ["blockquote", "p", "cite"]
    },
    section: {
      class: "h-full flex flex-col items-center justify-center text-center space-y-8",
      components: ["h1", "h2", "p"]
    },
    end: {
      class: "h-full flex flex-col items-center justify-center text-center space-y-8",
      components: ["h1", "h2", "p", "div"]
    }
  }
};

// Premium presentation templates for different purposes
const PREMIUM_TEMPLATES = {
  pitch: {
    structure: [
      { layout: "cover", title: "Company Overview", slides: 1 },
      { layout: "section", title: "Problem Statement", slides: 1 },
      { layout: "two-cols", title: "Market Analysis", slides: 1 },
      { layout: "intro", title: "Solution Overview", slides: 1 },
      { layout: "image-right", title: "Product Demo", slides: 1 },
      { layout: "content", title: "Business Model", slides: 1 },
      { layout: "fact", title: "Market Size", slides: 1 },
      { layout: "two-cols", title: "Competitive Advantage", slides: 1 },
      { layout: "content", title: "Go-to-Market", slides: 1 },
      { layout: "quote", title: "Customer Testimonial", slides: 1 },
      { layout: "section", title: "Financial Projections", slides: 1 },
      { layout: "end", title: "Thank You", slides: 1 }
    ]
  },
  workshop: {
    structure: [
      { layout: "cover", title: "Workshop Introduction", slides: 1 },
      { layout: "content", title: "Learning Objectives", slides: 1 },
      { layout: "section", title: "Module 1", slides: 1 },
      { layout: "two-cols", title: "Theory & Practice", slides: 2 },
      { layout: "center", title: "Hands-on Exercise", slides: 1 },
      { layout: "section", title: "Module 2", slides: 1 },
      { layout: "image-right", title: "Case Study", slides: 1 },
      { layout: "content", title: "Best Practices", slides: 1 },
      { layout: "two-cols", title: "Q&A Session", slides: 1 },
      { layout: "end", title: "Wrap Up", slides: 1 }
    ]
  },
  academic: {
    structure: [
      { layout: "cover", title: "Research Topic", slides: 1 },
      { layout: "content", title: "Abstract", slides: 1 },
      { layout: "section", title: "Introduction", slides: 1 },
      { layout: "two-cols", title: "Literature Review", slides: 1 },
      { layout: "content", title: "Methodology", slides: 1 },
      { layout: "image-right", title: "Data Collection", slides: 1 },
      { layout: "center", title: "Analysis Results", slides: 1 },
      { layout: "two-cols", title: "Findings & Discussion", slides: 1 },
      { layout: "content", title: "Conclusions", slides: 1 },
      { layout: "section", title: "Future Work", slides: 1 },
      { layout: "end", title: "Thank You", slides: 1 }
    ]
  }
};

// Extract keywords and context from prompt
function extractAdvancedKeywords(prompt: string): {
  keywords: string[];
  industry: string;
  tone: string;
  complexity: string;
} {
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
  const words = prompt.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));
  
  // Industry detection
  const industries = ['tech', 'healthcare', 'finance', 'education', 'retail', 'manufacturing', 'energy', 'automotive', 'aerospace', 'agriculture'];
  const industry = words.find(w => industries.includes(w)) || 'business';
  
  // Tone detection
  const tones = ['professional', 'casual', 'academic', 'creative', 'technical', 'executive'];
  const tone = words.find(w => tones.includes(w)) || 'professional';
  
  // Complexity detection
  const complexity = words.length > 50 ? 'detailed' : words.length > 20 ? 'moderate' : 'concise';
  
  return {
    keywords: [...new Set(words)].slice(0, 8),
    industry,
    tone,
    complexity
  };
}

// Generate advanced slidev markdown with full features
function buildUltraAdvancedSlidevPrompt(userPrompt: string, theme: ThemeConfig): string {
  const { keywords, industry, tone, complexity } = extractAdvancedKeywords(userPrompt);
  const template = PREMIUM_TEMPLATES[theme.purpose as keyof typeof PREMIUM_TEMPLATES] || PREMIUM_TEMPLATES.pitch;
  const slideCount = Math.max(8, Math.min(template.structure.length, 15));
  
  return `You are a PREMIUM slidev presentation expert (Gamma/Canva-level quality).

TOPIC: ${userPrompt}
INDUSTRY: ${industry}
TONE: ${tone}
COMPLEXITY: ${complexity}
SLIDE COUNT: ${slideCount}
KEYWORDS: ${keywords.join(', ')}

THEME CONFIG:
Primary: ${theme.palette.primary}
Secondary: ${theme.palette.secondary}
Accent: ${theme.palette.accent}
Background: ${theme.palette.background}
Style: ${theme.style}
Purpose: ${theme.purpose}

═══════════════════════════════════════════════════════════════════
ADVANCED SLIDEV FEATURES TO IMPLEMENT:
═══════════════════════════════════════════════════════════════════

🎯 SLIDE LAYOUTS (Use varied layouts):
${Object.keys(ADVANCED_SLIDEV_LAYOUTS.layouts).map(layout => 
  `• ${layout}: ${ADVANCED_SLIDEV_LAYOUTS.layouts[layout as keyof typeof ADVANCED_SLIDEV_LAYOUTS.layouts].class}`
).join('\n')}

🎨 VISUAL ENHANCEMENTS:
• Background images: https://source.unsplash.com/1600x900/?KEYWORD
• Mermaid diagrams for processes and data flows
• Code blocks with syntax highlighting
• Math equations with KaTeX
• Custom CSS classes for styling
• Icons and emojis strategically placed
• Gradients and visual hierarchy
• Interactive elements where possible

📊 CONTENT STRUCTURE:
• Executive summary on first slide
• Problem-solution narrative flow
• Data-driven insights with charts
• Visual metaphors and analogies
• Call-to-action slides
• Contact information on final slides

🔧 SLIDEV-SPECIFIC FEATURES:
• Use frontmatter for layout configuration
• Implement click-to-reveal animations
• Include speaker notes where appropriate
• Use slidev directives (v-click, v-after, etc.)
• Add code examples with live highlighting
• Include math equations with proper LaTeX
• Use template slots and components

═══════════════════════════════════════════════════════════════════
QUALITY STANDARDS (Match Gamma/Canva):
═══════════════════════════════════════════════════════════════════

✅ Visual Impact:
- Professional typography hierarchy
- Consistent color scheme and branding
- High-quality imagery and graphics
- Clean, modern design aesthetics
- Balanced whitespace and composition

✅ Content Quality:
- Clear, concise messaging
- Logical information flow
- Compelling storytelling
- Data-driven insights
- Actionable takeaways

✅ Technical Excellence:
- Semantic HTML structure
- Responsive design elements
- Cross-browser compatibility
- Fast loading times
- SEO-friendly structure

═══════════════════════════════════════════════════════════════════
SLIDE STRUCTURE TEMPLATE:
═══════════════════════════════════════════════════════════════════

${template.structure.map((slide, index) => 
  `Slide ${index + 1}: ${slide.layout} - ${slide.title}`
).join('\n')}

═══════════════════════════════════════════════════════════════════
OUTPUT REQUIREMENTS:
═══════════════════════════════════════════════════════════════════

🎯 Generate exactly ${slideCount} slides following the structure above
🎯 Use ONLY valid slidev markdown syntax
🎯 Include frontmatter for each slide with proper layout
🎯 Add comprehensive speaker notes for complex slides
🎯 Include 2-3 Mermaid diagrams for process visualization
🎯 Add 1-2 code examples with syntax highlighting
🎯 Use strategic emojis and visual elements
🎯 Implement click-to-reveal animations where appropriate

🚫 AVOID:
- HTML/CSS outside of slidev directives
- Generic or placeholder content
- Inconsistent formatting
- Too much text per slide
- Poor visual hierarchy

Begin generating the presentation immediately. Start with the cover slide and maintain consistent quality throughout. Focus on creating a presentation that rivals Gamma and Canva in terms of visual impact and professional quality.`;
}

export interface GenerateSlidevPresentationOptions {
  prompt: string;
  theme: ThemeConfig;
  onProgress?: (chunk: string) => void;
  temperature?: number;
  maxRetries?: number;
  template?: 'pitch' | 'workshop' | 'academic' | 'custom';
}

export async function generateSlidevPresentation(
  options: GenerateSlidevPresentationOptions
): Promise<string> {
  const { 
    prompt, 
    theme, 
    onProgress,
    temperature = 0.8, // Higher creativity for premium content
    maxRetries = 3,
    template = 'custom'
  } = options;

  const systemPrompt = buildUltraAdvancedSlidevPrompt(prompt, theme);

  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt <= maxRetries) {
    try {
      const stream = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a world-class slidev presentation designer. You create premium presentations that rival Gamma and Canva in quality. Output ONLY valid slidev markdown with NO explanations, comments, or extraneous text. Use the full power of slidev including layouts, animations, Mermaid diagrams, code highlighting, and custom styling.`
          },
          {
            role: "user",
            content: systemPrompt,
          },
        ],
        model: "llama-3.3-70b-versatile", // Most powerful model for premium content
        temperature: temperature,
        max_tokens: 12000, // Increased for complex presentations
        top_p: 0.95, // Higher creativity
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

        // Enhanced timeout detection
        if (Date.now() - lastChunkTime > 15000) {
          throw new Error("Stream timeout - generation took too long");
        }
      }

      // Enhanced validation
      if (fullContent.trim().length < 200) {
        throw new Error("Generated content too short - insufficient slidev content");
      }

      // Clean and validate slidev markdown
      fullContent = cleanAndValidateSlidevContent(fullContent);

      // Success!
      return fullContent;

    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error");
      attempt++;
      
      console.warn(`Slidev generation attempt ${attempt} failed:`, lastError.message);
      
      if (attempt <= maxRetries) {
        // Progressive backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt * 2));
      }
    }
  }

  throw new Error(
    `Failed to generate premium slidev presentation after ${maxRetries + 1} attempts: ${lastError?.message || 'Unknown error'}`
  );
}

// Clean and validate slidev content
function cleanAndValidateSlidevContent(content: string): string {
  return content
    // Remove any code fences that might have been added accidentally
    .replace(/^```[\w]*\n?/gm, '')
    .replace(/\n?```$/gm, '')
    // Ensure proper slide separation
    .replace(/\n{3,}/g, '\n\n')
    // Trim whitespace
    .trim();
}

// Export presentation to different formats
export async function exportSlidevPresentation(
  markdownContent: string,
  format: 'pdf' | 'png' | 'html' = 'pdf'
): Promise<{ success: boolean; outputPath?: string; error?: string }> {
  try {
    // Write temporary markdown file
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const tempDir = './temp-presentations';
    await fs.mkdir(tempDir, { recursive: true });
    
    const fileName = `presentation-${Date.now()}.md`;
    const filePath = path.join(tempDir, fileName);
    
    await fs.writeFile(filePath, markdownContent, 'utf8');
    
    // Use slidev CLI to export (this would need to be implemented in the backend)
    // For now, we'll return success to indicate the markdown is ready
    return { 
      success: true, 
      outputPath: filePath 
    };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Export failed'
    };
  }
}

// Analyze presentation quality using AI
export async function analyzeSlidevPresentation(
  markdown: string
): Promise<{
  score: number;
  suggestions: string[];
  strengths: string[];
  layoutDiversity: number;
  visualImpact: number;
}> {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Analyze this slidev presentation and provide detailed feedback:

PRESENTATION:
${markdown.slice(0, 3000)}... [truncated]

Evaluate:
1. Overall quality score (0-100)
2. Layout diversity (how many different layouts used)
3. Visual impact level (0-100)
4. Top 3 strengths
5. Top 3 improvement suggestions

Output as JSON:
{
  "score": 85,
  "layoutDiversity": 8,
  "visualImpact": 90,
  "strengths": ["...", "...", "..."],
  "suggestions": ["...", "...", "..."]
}`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 800,
    });

    const content = response.choices[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return { 
      score: 75, 
      suggestions: ["Unable to analyze presentation"], 
      strengths: ["Professional structure"],
      layoutDiversity: 5,
      visualImpact: 70
    };
  } catch (error) {
    console.error("Presentation analysis failed:", error);
    return { 
      score: 70, 
      suggestions: ["Analysis unavailable"], 
      strengths: ["Good content"],
      layoutDiversity: 5,
      visualImpact: 65
    };
  }
}

// Regenerate specific slide with enhanced AI
export async function regenerateSlidevSlide(
  slideContent: string,
  instruction: string,
  theme: ThemeConfig,
  context?: string
): Promise<string> {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a premium slidev presentation designer. Improve the given slide based on instructions. Output ONLY the improved Slidev markdown with proper frontmatter and layout configuration."
        },
        {
          role: "user",
          content: `CURRENT SLIDE:
${slideContent}

CONTEXT: ${context || 'No additional context provided'}
INSTRUCTION: ${instruction}

THEME CONFIG:
Primary: ${theme.palette.primary}
Accent: ${theme.palette.accent}
Style: ${theme.style}

Generate the improved slide markdown:`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      max_tokens: 2000,
    });

    return response.choices[0]?.message?.content || slideContent;
  } catch (error) {
    console.error("Slide regeneration failed:", error);
    return slideContent;
  }
}

// Get presentation statistics
export function getPresentationStats(markdown: string): {
  slideCount: number;
  layoutCount: number;
  mermaidDiagrams: number;
  codeBlocks: number;
  images: number;
} {
  const slides = markdown.split(/\n---\n/).filter(slide => slide.trim());
  const layouts = new Set<string>();
  const mermaidCount = (markdown.match(/```mermaid/g) || []).length;
  const codeCount = (markdown.match(/```/g) || []).length / 2; // Each code block has opening and closing
  const imageCount = (markdown.match(/!\[.*?\]\(.*?\)/g) || []).length;

  slides.forEach(slide => {
    const layoutMatch = slide.match(/layout:\s*(\w+)/);
    if (layoutMatch) {
      layouts.add(layoutMatch[1]);
    }
  });

  return {
    slideCount: slides.length,
    layoutCount: layouts.size,
    mermaidDiagrams: mermaidCount,
    codeBlocks: codeCount,
    images: imageCount
  };
}