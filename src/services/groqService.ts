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

function buildAdvancedSlidevPrompt(userPrompt: string, theme: ThemeConfig): string {
  return `You are Stanzify-AI, a Slidev Markdown generation engine.
Your job is to generate beautiful, clean, production-grade slides using Slidev Markdown.

═══════════════════════════════════════════════════════════════
USER INPUT
═══════════════════════════════════════════════════════════════

Topic: ${userPrompt}

Color Palette:
Primary: ${theme.palette.primary}
Secondary: ${theme.palette.secondary}
Accent: ${theme.palette.accent}
Background: ${theme.palette.background}
Text: #1F2937

Design Style: ${theme.style}
Image Mode: ${theme.imageSource === 'unsplash' ? 'auto-unsplash' : 'none'}
Slide Count: 12-18
Purpose: ${theme.purpose}

═══════════════════════════════════════════════════════════════
MANDATORY RULES
═══════════════════════════════════════════════════════════════

1. GENERAL RULES
   - Output ONLY valid Slidev Markdown (no comments, no explanations)
   - Use clean, modern, premium design (Canva, Gamma, Beautiful.ai style)
   - Maintain consistent spacing, typography, color balance
   - Use provided color palette across headings, accents, backgrounds
   - NEVER output HTML or JSX - pure Markdown + Slidev directives only

2. TYPOGRAPHY RULES
   - H1 → bold, large (titles)
   - H2 → medium bold (section headers)
   - H3 / paragraphs → clean readable body text
   - Bullet points: minimal & concise
   - Short phrases, not long paragraphs

3. LAYOUT RULES
   Use different layout patterns:
   - Title slide (layout: cover)
   - Two-column layout (layout: two-cols with ::right::)
   - Image + text (layout: image-right)
   - Center content (layout: center)
   - Stats / numbers (layout: fact)
   - Quote slides (layout: quote)
   - Section dividers (layout: section)
   - Process / steps (layout: default)
   - Call-to-action ending (layout: end)
   
   Mix layouts to avoid repetition.

4. COLOR PALETTE
   - Use primary for titles
   - Secondary for highlights
   - Accent for shapes/emphasis
   - Maintain high contrast
   - Keep colors consistent

5. IMAGE HANDLING
   ${theme.imageSource === 'unsplash' 
     ? '- Use Unsplash images: https://source.unsplash.com/featured/?keyword\n   - Use 1-2 images per slide, never overload\n   - Choose relevant, aesthetic images'
     : '- Use IMAGE_PLACEHOLDER_keyword format\n   - Keep slides text-focused'}

6. SLIDE COUNT
   - Generate 12-18 slides
   - Vary layouts throughout
   - Never repeat same layout twice in a row

7. TONE
   - Professional but friendly
   - Simple sentence structure
   - No jargon unless needed
   - Gamma/Canva-like clarity

═══════════════════════════════════════════════════════════════
SLIDEV SYNTAX EXAMPLES
═══════════════════════════════════════════════════════════════

**COVER SLIDE:**
---
layout: cover
background: https://source.unsplash.com/featured/?${userPrompt.split(' ')[0]}
---

# Main Title
## Compelling Subtitle

---

**TWO COLUMNS:**
---
layout: two-cols
---

# Left Side

- Point 1
- Point 2
- Point 3

::right::

# Right Side

\`\`\`mermaid
graph LR
  A --> B --> C
\`\`\`

---

**IMAGE RIGHT:**
---
layout: image-right
image: https://source.unsplash.com/featured/?business
---

# Content Title

- Key point 1
- Key point 2
- Key point 3

---

**FACT SLIDE:**
---
layout: fact
---

# 85%
Growth Rate

---

**SECTION:**
---
layout: section
---

# Section Title
## Subtitle

---

**CENTER:**
---
layout: center
---

# Centered Content

Key message here

---

**QUOTE:**
---
layout: quote
---

# "Inspiring quote here"
## — Author Name

---

**CODE (if technical):**
---
layout: default
---

# Code Example

\`\`\`typescript {all|1-3|5}
interface User {
  id: number
  name: string
}

function getUser(id: number) { }
\`\`\`

---

**MERMAID DIAGRAM:**
---
layout: center
---

# Process Flow

\`\`\`mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action]
    B -->|No| D[End]
\`\`\`

---

**END SLIDE:**
---
layout: end
---

# Thank You!

Questions?

---

═══════════════════════════════════════════════════════════════
MANDATORY FEATURES TO INCLUDE
═══════════════════════════════════════════════════════════════

✅ MUST INCLUDE:
- 1 cover slide (layout: cover)
- 2-3 two-column slides (layout: two-cols with ::right::)
- 1-2 section dividers (layout: section)
- 2-3 Mermaid diagrams
- 1-2 fact/stat slides (layout: fact)
- 1 quote slide (layout: quote) if appropriate
- 1 end slide (layout: end)
- Code examples if technical topic
- Math formulas if relevant (use $$ for display, $ for inline)
- Emojis for visual interest (📊 💡 🚀 ✅ ❌ 🎯 📈 💻 🔄 ⚡)

❌ DO NOT:
- Use HTML tags
- Use CSS classes
- Use v-click or <v-clicks>
- Write explanations or comments
- Output anything except pure Slidev markdown

═══════════════════════════════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════════════════════════════

Output ONLY valid Slidev Markdown.
No explanations. No triple backticks. No extra text.
Start with first slide immediately.

BEGIN GENERATION NOW:`;
}

function getStyleDescription(style: string): string {
  const descriptions: Record<string, string> = {
    minimal: 'Clean and simple with lots of white space',
    modern: 'Contemporary with gradient accents and animations',
    corporate: 'Professional and business-focused with data emphasis',
    dark: 'Sleek dark theme for modern presentations',
    creative: 'Bold and visually striking with unique layouts',
    academic: 'Structured and information-dense with citations',
  };
  return descriptions[style] || 'Professional';
}

export interface GenerateSlidesOptions {
  prompt: string;
  theme: ThemeConfig;
  onProgress?: (chunk: string) => void;
}

export async function generateSlides(
  options: GenerateSlidesOptions
): Promise<string> {
  const { prompt, theme, onProgress } = options;

  const systemPrompt = buildAdvancedSlidevPrompt(prompt, theme);

  try {
    const stream = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: systemPrompt,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 4000,
      stream: true,
    });

    let fullContent = "";

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        fullContent += content;
        if (onProgress) {
          onProgress(content);
        }
      }
    }

    return fullContent;
  } catch (error) {
    console.error("Error generating slides:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to generate slides"
    );
  }
}



