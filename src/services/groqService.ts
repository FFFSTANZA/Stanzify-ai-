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
  return `You are a MASTER Slidev presentation designer. Create a STUNNING, PROFESSIONAL presentation using FULL Slidev power.

TOPIC: ${userPrompt}
THEME: ${theme.palette.name}
COLORS: Primary: ${theme.palette.primary}, Secondary: ${theme.palette.secondary}, Accent: ${theme.palette.accent}
STYLE: ${theme.style}
PURPOSE: ${theme.purpose}

🎯 CRITICAL: Follow Slidev syntax EXACTLY as shown in examples below.

═══════════════════════════════════════════════════════════════
SLIDE 1: TITLE SLIDE (MANDATORY)
═══════════════════════════════════════════════════════════════
---
layout: cover
background: gradient-to-br from-blue-500 to-purple-600
class: text-center text-white
---

# Your Compelling Title Here
## Engaging Subtitle That Hooks The Audience

<div class="pt-12">
  <span class="px-4 py-2 rounded-full bg-white bg-opacity-20 text-sm">
    ${theme.purpose.toUpperCase()} PRESENTATION
  </span>
</div>

---

═══════════════════════════════════════════════════════════════
SLIDE 2: AGENDA/OVERVIEW
═══════════════════════════════════════════════════════════════
---
layout: default
---

# 📋 Agenda

<div class="grid grid-cols-2 gap-8 mt-8">

<div v-click class="p-6 rounded-lg bg-blue-50 dark:bg-blue-900">
  <h3 class="text-2xl mb-2">📊 Section 1</h3>
  <p class="text-gray-600 dark:text-gray-300">Brief description</p>
</div>

<div v-click class="p-6 rounded-lg bg-green-50 dark:bg-green-900">
  <h3 class="text-2xl mb-2">💡 Section 2</h3>
  <p class="text-gray-600 dark:text-gray-300">Brief description</p>
</div>

<div v-click class="p-6 rounded-lg bg-purple-50 dark:bg-purple-900">
  <h3 class="text-2xl mb-2">🚀 Section 3</h3>
  <p class="text-gray-600 dark:text-gray-300">Brief description</p>
</div>

<div v-click class="p-6 rounded-lg bg-orange-50 dark:bg-orange-900">
  <h3 class="text-2xl mb-2">🎯 Section 4</h3>
  <p class="text-gray-600 dark:text-gray-300">Brief description</p>
</div>

</div>

---

═══════════════════════════════════════════════════════════════
SLIDE 3: SECTION DIVIDER
═══════════════════════════════════════════════════════════════
---
layout: section
class: text-center
---

# 🚀 Section Title
## Subtitle for this section

---

═══════════════════════════════════════════════════════════════
SLIDE 4: TWO-COLUMN LAYOUT (USE THIS OFTEN!)
═══════════════════════════════════════════════════════════════
---
layout: two-cols
---

# Left Side Title

<v-clicks>

- First key point with details
- Second important point
- Third critical insight
- Fourth supporting fact

</v-clicks>

::right::

# Right Side Title

<div class="mt-4">

\`\`\`mermaid
graph LR
    A[Start] --> B[Process]
    B --> C[Result]
    C --> D[Success]
\`\`\`

</div>

---

═══════════════════════════════════════════════════════════════
SLIDE 5: CODE EXAMPLE (For technical content)
═══════════════════════════════════════════════════════════════
---
layout: default
---

# 💻 Code Implementation

\`\`\`typescript {all|1-3|5-8|10-12}
// Advanced TypeScript example
interface DataModel {
  id: string;
  name: string;
}

async function fetchData(): Promise<DataModel[]> {
  const response = await fetch('/api/data');
  return response.json();
}

// Usage
const data = await fetchData();
console.log(data);
\`\`\`

<v-click>

**Key Features:**
- Type safety with TypeScript
- Async/await for clean code
- Error handling built-in

</v-click>

---

═══════════════════════════════════════════════════════════════
SLIDE 6: STATISTICS/FACT SLIDE
═══════════════════════════════════════════════════════════════
---
layout: fact
---

# 📈 85%
## Growth in market adoption over last year

<div class="text-sm opacity-75 mt-8">
Source: Industry Report 2024
</div>

---

═══════════════════════════════════════════════════════════════
SLIDE 7: PROCESS DIAGRAM
═══════════════════════════════════════════════════════════════
---
layout: center
---

# 🔄 Our Process

\`\`\`mermaid
graph TD
    A[Discovery Phase] --> B{Analysis}
    B -->|Data Found| C[Design Solution]
    B -->|No Data| D[Research More]
    D --> A
    C --> E[Implementation]
    E --> F[Testing]
    F --> G{Quality Check}
    G -->|Pass| H[Deploy]
    G -->|Fail| E
    H --> I[Monitor & Optimize]
\`\`\`

---

═══════════════════════════════════════════════════════════════
SLIDE 8: IMAGE WITH CONTENT
═══════════════════════════════════════════════════════════════
---
layout: image-right
image: IMAGE_PLACEHOLDER_business_team
---

# Key Benefits

<v-clicks>

- ✅ **Benefit 1**: Detailed explanation of first major benefit
- ✅ **Benefit 2**: How this helps your audience
- ✅ **Benefit 3**: Measurable impact
- ✅ **Benefit 4**: Long-term value

</v-clicks>

<div v-click class="mt-8 p-4 bg-green-100 dark:bg-green-900 rounded-lg">
💡 <strong>Pro Tip:</strong> Additional insight or recommendation
</div>

---

═══════════════════════════════════════════════════════════════
SLIDE 9: COMPARISON TABLE
═══════════════════════════════════════════════════════════════
---
layout: two-cols
---

# ❌ Before

<v-clicks>

- Problem point 1
- Challenge 2
- Issue 3
- Pain point 4

</v-clicks>

::right::

# ✅ After

<v-clicks>

- Solution 1
- Improvement 2
- Benefit 3
- Success 4

</v-clicks>

---

═══════════════════════════════════════════════════════════════
SLIDE 10: QUOTE/TESTIMONIAL
═══════════════════════════════════════════════════════════════
---
layout: quote
---

# "This is an impactful quote that reinforces your message"
## — Attribution, Title/Company

---

═══════════════════════════════════════════════════════════════
SLIDE 11: MATH/FORMULA (If relevant)
═══════════════════════════════════════════════════════════════
---
layout: center
---

# 📐 The Formula

$$
ROI = \\frac{(Gain - Cost)}{Cost} \\times 100\\%
$$

<v-click>

**Example Calculation:**
- Initial Investment: $10,000
- Return: $15,000
- ROI: 50%

</v-click>

---

═══════════════════════════════════════════════════════════════
SLIDE 12: CONCLUSION
═══════════════════════════════════════════════════════════════
---
layout: center
class: text-center
---

# 🎯 Key Takeaways

<v-clicks>

1. **First Major Point**: Brief summary
2. **Second Major Point**: Key insight
3. **Third Major Point**: Action item

</v-clicks>

<div v-click class="mt-12">

## 🚀 Next Steps

Take action today!

</div>

---

═══════════════════════════════════════════════════════════════
SLIDE 13: THANK YOU
═══════════════════════════════════════════════════════════════
---
layout: end
class: text-center
---

# Thank You! 🙏

## Questions?

<div class="mt-8 text-sm opacity-75">
Contact: your@email.com | Website: yoursite.com
</div>

---

═══════════════════════════════════════════════════════════════
MANDATORY REQUIREMENTS:
═══════════════════════════════════════════════════════════════

1. **ALWAYS use layout:** on every slide (cover, default, two-cols, center, section, fact, quote, end, image-right)
2. **ALWAYS use v-click or <v-clicks>** for progressive disclosure
3. **ALWAYS use emojis** for visual interest (📊 💡 🚀 ✅ ❌ 🎯 📈 💻 🔄 ⚡)
4. **ALWAYS use HTML/CSS** for styling (grid, flex, colors, spacing)
5. **ALWAYS include 2-3 Mermaid diagrams** (flowchart, sequence, or graph)
6. **ALWAYS use two-cols layout** for comparisons (with ::right::)
7. **ALWAYS add images** with IMAGE_PLACEHOLDER_keyword format
8. **ALWAYS use code blocks** if technical (with line highlighting {all|1-3|5-8})
9. **ALWAYS use math** if relevant (with $$ for display, $ for inline)
10. **ALWAYS vary layouts** - never repeat the same layout twice in a row

═══════════════════════════════════════════════════════════════
STRUCTURE FOR YOUR PRESENTATION:
═══════════════════════════════════════════════════════════════

Generate 10-15 slides following this pattern:
1. Cover slide (layout: cover)
2. Agenda (layout: default with grid)
3. Section divider (layout: section)
4. Content with two-cols (layout: two-cols)
5. Process diagram (layout: center with mermaid)
6. More content (vary layouts)
7. Statistics (layout: fact)
8. Code example if technical (layout: default)
9. Benefits (layout: image-right)
10. Comparison (layout: two-cols)
11. Section divider (layout: section)
12. More content (vary layouts)
13. Conclusion (layout: center)
14. Thank you (layout: end)

═══════════════════════════════════════════════════════════════
OUTPUT FORMAT:
═══════════════════════════════════════════════════════════════

Generate ONLY valid Slidev markdown. Start with first slide. Use EXACT syntax from examples above. Make it POWERFUL and PROFESSIONAL.

Begin generating NOW:`;
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



