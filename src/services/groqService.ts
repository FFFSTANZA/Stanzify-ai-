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
  };
  fonts: {
    heading: string;
    body: string;
  };
  style: string;
  purpose: string;
}

function buildAdvancedSlidevPrompt(userPrompt: string, theme: ThemeConfig): string {
  return `You are a MASTER Slidev presentation designer. Create PERFECT Slidev markdown that will be rendered by Slidev itself.

TOPIC: ${userPrompt}
THEME: ${theme.palette.name}
STYLE: ${theme.style}
PURPOSE: ${theme.purpose}

🎯 CRITICAL: Generate PURE Slidev markdown. Use Slidev's native features, NOT HTML/CSS.

═══════════════════════════════════════════════════════════════
SLIDEV MARKDOWN SYNTAX - FOLLOW EXACTLY
═══════════════════════════════════════════════════════════════

**SLIDE 1: COVER SLIDE**
---
layout: cover
background: https://source.unsplash.com/collection/94734566/1920x1080
---

# Your Compelling Title
## Engaging Subtitle

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Press Space to Start →
  </span>
</div>

---

**SLIDE 2: TABLE OF CONTENTS**
---
layout: default
---

# 📋 What We'll Cover

<Toc minDepth="1" maxDepth="2"></Toc>

---

**SLIDE 3: SECTION HEADER**
---
layout: section
background: https://source.unsplash.com/collection/94734566/1920x1080
---

# Section 1
## Main Topic Area

---

**SLIDE 4: TWO COLUMNS**
---
layout: two-cols
---

# Left Column

- Point 1
- Point 2  
- Point 3
- Point 4

::right::

# Right Column

\`\`\`mermaid
graph LR
  A[Start] --> B[Process]
  B --> C[End]
\`\`\`

---

**SLIDE 5: CODE WITH HIGHLIGHTING**
---
layout: default
---

# Code Example

\`\`\`ts {all|2|1-6|9|all}
interface User {
  id: number
  firstName: string
  lastName: string
  role: string
}

function updateUser(id: number, update: User) {
  const user = getUser(id)
  const newUser = { ...user, ...update }  
  saveUser(id, newUser)
}
\`\`\`

---

**SLIDE 6: MERMAID DIAGRAM**
---
layout: center
class: text-center
---

# Process Flow

\`\`\`mermaid {scale: 0.9}
graph TD
    A[Start] --> B{Is it?}
    B -->|Yes| C[OK]
    C --> D[Rethink]
    D --> B
    B ---->|No| E[End]
\`\`\`

---

**SLIDE 7: IMAGE RIGHT**
---
layout: image-right
image: https://source.unsplash.com/collection/94734566/1920x1080
---

# Key Points

- Important fact 1
- Important fact 2
- Important fact 3
- Important fact 4

---

**SLIDE 8: FACT/STATISTIC**
---
layout: fact
---

# 100%
Satisfaction Rate

---

**SLIDE 9: QUOTE**
---
layout: quote
---

# "An inspiring quote that reinforces your message"
## — Author Name

---

**SLIDE 10: COMPARISON**
---
layout: two-cols
---

# ❌ Before

- Problem 1
- Problem 2
- Problem 3

::right::

# ✅ After

- Solution 1
- Solution 2
- Solution 3

---

**SLIDE 11: MATH FORMULA**
---
layout: center
---

# The Formula

$$
E = mc^2
$$

$$
\\int_{a}^{b} f(x) dx = F(b) - F(a)
$$

---

**SLIDE 12: SEQUENCE DIAGRAM**
---
layout: default
---

# System Architecture

\`\`\`mermaid
sequenceDiagram
    participant A as User
    participant B as System
    participant C as Database
    A->>B: Request
    B->>C: Query
    C-->>B: Data
    B-->>A: Response
\`\`\`

---

**SLIDE 13: CONCLUSION**
---
layout: center
class: text-center
---

# Key Takeaways

1. First major point
2. Second major point  
3. Third major point

---

**SLIDE 14: THANK YOU**
---
layout: end
---

# Thank You!

Questions?

---

═══════════════════════════════════════════════════════════════
MANDATORY SLIDEV FEATURES TO USE:
═══════════════════════════════════════════════════════════════

1. **Layouts**: cover, default, center, two-cols, image-right, section, fact, quote, end
2. **Mermaid**: Use for flowcharts, sequence diagrams, graphs
3. **Code Highlighting**: Use {all|1-3|5-8} for line-by-line reveal
4. **Math**: Use $$ for display math, $ for inline
5. **Images**: Use Unsplash URLs or IMAGE_PLACEHOLDER_keyword
6. **Two Columns**: Use ::right:: to split content
7. **Emojis**: Use for visual interest (📊 💡 🚀 ✅ ❌ 🎯)
8. **Backgrounds**: Use background: property for images
9. **Classes**: Use class: property for styling
10. **Scale**: Use {scale: 0.9} for diagram sizing

═══════════════════════════════════════════════════════════════
STRUCTURE YOUR PRESENTATION:
═══════════════════════════════════════════════════════════════

Generate 12-18 slides:
1. Cover (layout: cover)
2. Table of Contents (with <Toc>)
3. Section Header (layout: section)
4. Content slides (vary layouts: default, two-cols, center)
5. Diagrams (2-3 Mermaid diagrams)
6. Code examples (if technical)
7. Statistics (layout: fact)
8. Images (layout: image-right)
9. Comparison (layout: two-cols)
10. Section Header (layout: section)
11. More content (vary layouts)
12. Conclusion (layout: center)
13. Thank You (layout: end)

═══════════════════════════════════════════════════════════════
RULES:
═══════════════════════════════════════════════════════════════

✅ DO:
- Use proper Slidev layouts
- Include 2-3 Mermaid diagrams
- Use code highlighting {all|1-3|5}
- Add math formulas if relevant
- Use ::right:: for two columns
- Add emojis for visual interest
- Vary layouts (never repeat same layout twice)
- Use Unsplash for background images
- Keep content concise (max 5 points per slide)

❌ DON'T:
- Use HTML <div> tags
- Use CSS classes like "grid grid-cols-2"
- Use v-click or <v-clicks> tags
- Write custom HTML/CSS
- Use inline styles
- Create complex HTML structures

═══════════════════════════════════════════════════════════════
OUTPUT:
═══════════════════════════════════════════════════════════════

Generate ONLY pure Slidev markdown. Start with first slide. Use layouts, Mermaid, code highlighting, and math. Make it POWERFUL.

BEGIN:`;
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



