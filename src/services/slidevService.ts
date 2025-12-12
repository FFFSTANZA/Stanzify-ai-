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
      { layout: "end", title: "Thank You", slides: 1 },
    ],
  },

  business: {
    structure: [
      { layout: "cover", title: "Business Report", slides: 1 },
      { layout: "section", title: "Executive Summary", slides: 1 },
      { layout: "two-cols", title: "Key Metrics", slides: 1 },
      { layout: "content", title: "Context & Assumptions", slides: 1 },
      { layout: "two-cols", title: "Trends & Insights", slides: 1 },
      { layout: "content", title: "Risks & Mitigations", slides: 1 },
      { layout: "center", title: "Recommendations", slides: 1 },
      { layout: "fact", title: "North Star Metric", slides: 1 },
      { layout: "end", title: "Next Steps", slides: 1 },
    ],
  },

  marketing: {
    structure: [
      { layout: "cover", title: "Campaign Overview", slides: 1 },
      { layout: "section", title: "The Big Idea", slides: 1 },
      { layout: "two-cols", title: "Audience & Persona", slides: 1 },
      { layout: "image-right", title: "Messaging & Positioning", slides: 1 },
      { layout: "two-cols", title: "Funnel & Journey", slides: 1 },
      { layout: "content", title: "Channel Mix", slides: 1 },
      { layout: "fact", title: "KPIs & Targets", slides: 1 },
      { layout: "quote", title: "Social Proof", slides: 1 },
      { layout: "end", title: "Launch Plan", slides: 1 },
    ],
  },

  webinar: {
    structure: [
      { layout: "cover", title: "Webinar Title", slides: 1 },
      { layout: "content", title: "Agenda & Outcomes", slides: 1 },
      { layout: "section", title: "Section 1", slides: 1 },
      { layout: "two-cols", title: "Concept + Demo", slides: 2 },
      { layout: "center", title: "Interactive Moment", slides: 1 },
      { layout: "section", title: "Section 2", slides: 1 },
      { layout: "content", title: "Key Takeaways", slides: 1 },
      { layout: "two-cols", title: "Q&A", slides: 1 },
      { layout: "end", title: "Thank You", slides: 1 },
    ],
  },

  educational: {
    structure: [
      { layout: "cover", title: "Lesson Title", slides: 1 },
      { layout: "content", title: "Learning Objectives", slides: 1 },
      { layout: "section", title: "Core Concept", slides: 1 },
      { layout: "two-cols", title: "Explanation + Diagram", slides: 1 },
      { layout: "center", title: "Worked Example", slides: 1 },
      { layout: "content", title: "Common Misconceptions", slides: 1 },
      { layout: "two-cols", title: "Practice", slides: 1 },
      { layout: "end", title: "Summary", slides: 1 },
    ],
  },

  personal: {
    structure: [
      { layout: "cover", title: "Story", slides: 1 },
      { layout: "intro", title: "Why This Matters", slides: 1 },
      { layout: "content", title: "The Journey", slides: 1 },
      { layout: "two-cols", title: "Challenges & Learnings", slides: 1 },
      { layout: "quote", title: "A Key Quote", slides: 1 },
      { layout: "center", title: "What I’d Do Next", slides: 1 },
      { layout: "end", title: "Thank You", slides: 1 },
    ],
  },

  // Legacy/internal keys
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
      { layout: "end", title: "Wrap Up", slides: 1 },
    ],
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
      { layout: "end", title: "Thank You", slides: 1 },
    ],
  },
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

  const templateKey = (PREMIUM_TEMPLATES as Record<string, unknown>)[theme.purpose]
    ? (theme.purpose as keyof typeof PREMIUM_TEMPLATES)
    : theme.purpose === 'workshop'
      ? ('webinar' as keyof typeof PREMIUM_TEMPLATES)
      : theme.purpose === 'academic'
        ? ('educational' as keyof typeof PREMIUM_TEMPLATES)
        : ('pitch' as keyof typeof PREMIUM_TEMPLATES);

  const template = PREMIUM_TEMPLATES[templateKey] || PREMIUM_TEMPLATES.pitch;
  const rawSlideCount = template.structure.reduce((sum, s) => sum + (s.slides || 1), 0);
  const slideCount = Math.max(8, Math.min(rawSlideCount, 18));
  const slideStructureLines = template.structure.map((slide: any, idx: number) => 
    `${idx + 1}. Layout: ${slide.layout} - Title: ${slide.title}`
  ).join('\n');
  
  return `You are a PREMIUM slidev presentation expert (Gamma/Canva-level quality). You generate PRODUCTION-READY slidev markdown.

TOPIC: ${userPrompt}
INDUSTRY: ${industry}
TONE: ${tone}
COMPLEXITY: ${complexity}
SLIDE COUNT: Exactly ${slideCount} slides
KEYWORDS: ${keywords.join(', ')}

THEME CONFIG:
Primary Color: ${theme.palette.primary}
Secondary Color: ${theme.palette.secondary}
Accent Color: ${theme.palette.accent}
Background: ${theme.palette.background}
Design Style: ${theme.style}
Purpose: ${theme.purpose}
Image Source: ${theme.imageSource}

CUSTOMIZATION RULES (MUST FOLLOW):
- Palette: use the provided colors for emphasis (HTML spans) and for Mermaid themeVariables.
- Design Style:
  - minimal: clean, whitespace, minimal emojis, short bullet lists
  - modern/creative: stronger visual hierarchy, tasteful gradients/accents, bolder diagrams
  - corporate/business: KPI-driven, structured, fewer gimmicks
  - dark: prefer dark-friendly backgrounds and high-contrast text
- Image policy:
  - If Image Source is "none": do NOT include background/image lines, and do NOT use markdown images.
  - Otherwise: use IMAGE_PLACEHOLDER_<keyword> for all images/backgrounds (never direct Unsplash URLs). Example: IMAGE_PLACEHOLDER_climate

═══════════════════════════════════════════════════════════════════
CRITICAL MARKDOWN FORMAT REQUIREMENTS:
═══════════════════════════════════════════════════════════════════

EVERY slide MUST start with frontmatter block delimited by --- on separate lines:
---
layout: [layout-name]
---
[slide content here]

Slide separator: --- (blank line above and below)

COMPATIBILITY / CLEAN OUTPUT RULES (VERY IMPORTANT):
- DO NOT output raw HTML lists/tables. Never use <ul>, <ol>, or <li>.
- Use Markdown lists only:
  - Unordered: - item
  - Ordered: 1. item
- Images MUST be Markdown format only: ![alt](IMAGE_PLACEHOLDER_keyword). Never use <img>.
- Avoid HTML/CSS layout hacks; rely on layouts + Markdown + blank lines for spacing.

Example format:
---
layout: cover
background: IMAGE_PLACEHOLDER_business
---
# Title
## Subtitle

---
layout: two-cols
---
::left::
Left content

::right::
Right content

═══════════════════════════════════════════════════════════════════
ANIMATIONS & INTERACTIONS (REQUIRED):
═══════════════════════════════════════════════════════════════════

🎬 Click Animations (v-click):
- <div v-click>Content appears on click</div>
- Use v-click inside a Markdown list item:
  - <span v-click>List item reveals</span>
- Multiple clicks: v-click=3

🎬 Transitions:
- Add at start of slide: transition: fade-out
- Add at start of slide: transition: slide-left

🎬 Code Highlighting:
\`\`\`javascript
const feature = "syntax highlighting with line numbers";
\`\`\`

🎬 Mermaid Diagrams (NEAT, flowchart-first, napkin-like):
\`\`\`mermaid
%%{init: {'theme':'base','flowchart':{'curve':'basis'},'themeVariables':{'primaryColor':'${theme.palette.primary}','primaryBorderColor':'${theme.palette.accent}','lineColor':'${theme.palette.secondary}','fontFamily':'Inter, system-ui, sans-serif','fontSize':'18px'}}}%%
flowchart LR
  A[Market Need] --> B[Our Solution] --> C[Competitive Advantage]
\`\`\`

═══════════════════════════════════════════════════════════════════
VISUAL ELEMENTS & STYLING:
═══════════════════════════════════════════════════════════════════

🎨 Use these elements:
• Strategic emojis for visual interest
• Bold text: **important**
• Colored text with HTML: <span style="color: ${theme.palette.accent}">text</span>
• Code examples with proper language tags
• Mermaid diagrams for flows and structures
• Math equations: $E = mc^2$
• Lists with v-click for progressive reveal
• Images: ![alt](IMAGE_PLACEHOLDER_<keyword>)

═══════════════════════════════════════════════════════════════════
SLIDE STRUCTURE (${slideCount} SLIDES) — FOR PLANNING ONLY (DO NOT INCLUDE THIS OUTLINE IN OUTPUT):
═══════════════════════════════════════════════════════════════════

${slideStructureLines}

═══════════════════════════════════════════════════════════════════
MANDATORY FEATURES IN OUTPUT:
═══════════════════════════════════════════════════════════════════

✅ Structure:
- First slide: COVER layout with background image
- Last slide: END layout with thank you message
- Middle slides: Mix of two-cols, content, section, center layouts

✅ Animations (MUST INCLUDE):
- At least 5 v-click elements throughout presentation
- At least 2 transitions between slides
- Progressive reveals for lists and key points

✅ Visual Elements (MUST INCLUDE):
- At least 3 Mermaid diagrams (flowcharts, system maps, timelines)
- At least 1 code block with syntax highlighting
- At least 1 math equation if technical topic
- If Image Source is not "none": include multiple background images using IMAGE_PLACEHOLDER_KEYWORD
- Strategic use of color from theme palette

✅ Content Quality:
- Clear, concise messaging (max 2-3 bullets per slide)
- Professional typography hierarchy
- Logical narrative flow
- Data-driven insights
- Compelling storytelling

═══════════════════════════════════════════════════════════════════
LAYOUT OPTIONS (Use variety):
═══════════════════════════════════════════════════════════════════

• cover: Full-screen title slide with background
• two-cols: Split left/right content with ::left:: and ::right::
• section: Section header with large text
• center: Centered content
• content: Standard vertical content layout
• fact: Large statistic or quote centered
• quote: Quote layout with attribution
• image-right: Content on left, image on right
• image-left: Image on left, content on right
• intro: Two-column intro with title and list

═══════════════════════════════════════════════════════════════════
OUTPUT RULES (CRITICAL):
═══════════════════════════════════════════════════════════════════

⚠️ MUST START with frontmatter and content immediately
⚠️ EVERY slide must have --- separator before AND after
⚠️ First line must be: ---
⚠️ NO explanations, NO comments. Do not wrap the entire output in a single code-fenced block.
⚠️ Output ONLY valid slidev markdown
⚠️ Use v-click for animations (not other methods)
⚠️ Use mermaid for diagrams (not raw SVG)
⚠️ Ensure proper spacing: blank lines between sections

ABSOLUTE OUTPUT FORMAT:
---
layout: cover
background: IMAGE_PLACEHOLDER_keyword
---
[slide content]

---
layout: [next layout]
---
[next slide content]

Generate the presentation NOW. Start immediately with first slide. Ensure every slide is production-ready.`;
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
    maxRetries = 3
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
            content: `You are a world-class Premium Presentation Designer (Gamma/Beautiful.ai/Canva-level). You are an expert in:
- Enterprise-grade slidev markdown generation
- Professional color theory and design systems
- Complex diagram creation (flowcharts, mindmaps, sequences)
- Data visualization and storytelling
- Accessibility and responsive design
- Animation and interactive elements

MANDATORY: 
- Output ONLY valid slidev markdown - NO explanations
- Apply theme colors EVERYWHERE intelligently
- Include 3+ different diagram types
- Strategic animations and transitions
- Perfect formatting with proper spacing
- Enterprise-quality content structure`
          },
          {
            role: "user",
            content: systemPrompt,
          },
        ],
        model: "llama-3.3-70b-versatile", // High-capability model for premium content generation
        temperature: temperature,
        max_tokens: 16000, // More tokens for premium content with diagrams
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
      validateGeneratedSlidevContent(fullContent, theme);

      // Success!
      return fullContent;

    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error");
      attempt++;
      
      console.error(`Slidev generation attempt ${attempt}/${maxRetries + 1} failed:`, {
        message: lastError.message,
        error: error,
        prompt: prompt.substring(0, 100) + "..."
      });
      
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

function normalizeHtmlToMarkdown(content: string): string {
  let out = content;

  const stripNonSpanTags = (s: string) =>
    s
      .replace(/<br\s*\/?\s*>/gi, ' ')
      .replace(/<(?!\/?span\b)[^>]+>/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

  const convertHtmlList = (block: string, ordered: boolean) => {
    const items = Array.from(block.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi))
      .map((m) => stripNonSpanTags(m[1]))
      .filter(Boolean);

    if (items.length === 0) return block;

    return items
      .map((item, idx) => (ordered ? `${idx + 1}. ${item}` : `- ${item}`))
      .join('\n');
  };

  out = out.replace(/<ul\b[^>]*>[\s\S]*?<\/ul>/gi, (m) => convertHtmlList(m, false));
  out = out.replace(/<ol\b[^>]*>[\s\S]*?<\/ol>/gi, (m) => convertHtmlList(m, true));

  // Standalone <li> lines (common when models mix HTML + Markdown)
  out = out.replace(/^\s*<li\b[^>]*>([\s\S]*?)<\/li>\s*$/gmi, (_m, inner) => `- ${stripNonSpanTags(inner)}`);

  out = out.replace(/<img\b[^>]*>/gi, (tag) => {
    const src = tag.match(/src\s*=\s*['"]([^'"]+)['"]/i)?.[1];
    if (!src) return '';

    const alt = tag.match(/alt\s*=\s*['"]([^'"]*)['"]/i)?.[1] ?? '';
    return `![${alt}](${src})`;
  });

  return out;
}

// Clean and validate slidev content
function cleanAndValidateSlidevContent(content: string): string {
  let cleaned = content.replace(/\r\n/g, '\n').trim();

  // Sometimes the model wraps the entire response in a single fenced block (```...```).
  // Strip only the outer wrapper while preserving legitimate internal fences (mermaid/code).
  const wrapperMatch = cleaned.match(/^```(?:[\w-]+)?\s*\n([\s\S]*?)\n```\s*$/);
  if (wrapperMatch) {
    cleaned = wrapperMatch[1].trim();
  }

  cleaned = normalizeHtmlToMarkdown(cleaned);

  return cleaned
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function validateGeneratedSlidevContent(content: string, theme: ThemeConfig): void {
  const trimmed = content.trim();
  if (!trimmed.startsWith('---')) {
    throw new Error('Invalid slidev output: must start with frontmatter (---)');
  }

  const layoutCount = (trimmed.match(/^layout:\s*\S+/gm) ?? []).length;
  if (layoutCount < 6) {
    throw new Error('Invalid slidev output: missing slide layout frontmatter blocks');
  }

  const mermaidCount = (trimmed.match(/```mermaid/g) ?? []).length;
  if (mermaidCount < 2) {
    throw new Error('Invalid slidev output: missing Mermaid diagrams (need at least 2)');
  }

  const hasFlowchart = /```mermaid[\s\S]*?(?:flowchart\b|graph\b)/i.test(trimmed);
  if (!hasFlowchart) {
    throw new Error('Invalid slidev output: must include at least one Mermaid flowchart/graph');
  }

  if (theme.imageSource !== 'none') {
    const placeholders = (trimmed.match(/IMAGE_PLACEHOLDER_/g) ?? []).length;
    if (placeholders < 2) {
      throw new Error('Invalid slidev output: missing image/background placeholders (IMAGE_PLACEHOLDER_...)');
    }
  }

  if (/<(ul|ol|li)\b/i.test(trimmed)) {
    throw new Error('Invalid slidev output: contains HTML lists (<ul>/<ol>/<li>). Use Markdown lists only.');
  }
}

// Export presentation to different formats
// Note: This function requires Node.js APIs and will not work in the browser.
// It's kept for potential server-side usage but should not be called from client code.
export async function exportSlidevPresentation(
  markdownContent: string,
  _format: 'pdf' | 'png' | 'html' = 'pdf'
): Promise<{ success: boolean; outputPath?: string; error?: string }> {
  // Browser environment - return not implemented
  if (typeof window !== 'undefined') {
    return {
      success: false,
      error: 'Export functionality requires a Node.js backend. Please use download options in the UI instead.'
    };
  }
  
  // This would only work in a Node.js environment
  try {
    // Dynamic imports for Node.js-only modules
    // @ts-ignore - Node.js modules not available in browser
    const fs = await import('fs/promises');
    // @ts-ignore - Node.js modules not available in browser
    const path = await import('path');
    
    const tempDir = './temp-presentations';
    await fs.mkdir(tempDir, { recursive: true });
    
    const fileName = `presentation-${Date.now()}.md`;
    const filePath = path.join(tempDir, fileName);
    
    await fs.writeFile(filePath, markdownContent, 'utf8');
    
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