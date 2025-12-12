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
  return `You are an expert Slidev presentation designer with deep knowledge of advanced presentation features. Generate a POWERFUL, professional, visually stunning presentation using FULL Slidev capabilities.

TOPIC: ${userPrompt}
THEME: ${theme.palette.name}
COLORS: Primary: ${theme.palette.primary}, Secondary: ${theme.palette.secondary}, Accent: ${theme.palette.accent}
STYLE: ${theme.style} (${getStyleDescription(theme.style)})
PURPOSE: ${theme.purpose}

CRITICAL REQUIREMENTS - USE ADVANCED FEATURES:

1. **Slidev Frontmatter** (First slide MUST have):
\`\`\`yaml
---
theme: default
background: gradient
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: [Your Title]
---
\`\`\`

2. **Advanced Layouts** - Use these Slidev layouts:
   - \`layout: cover\` - For title slide with full background
   - \`layout: center\` - For centered content
   - \`layout: two-cols\` - For side-by-side comparisons
   - \`layout: image-right\` - Image on right, content on left
   - \`layout: quote\` - For impactful quotes
   - \`layout: section\` - For section dividers
   - \`layout: fact\` - For highlighting key statistics

Example:
\`\`\`
---
layout: two-cols
---

# Left Column
Content here

::right::

# Right Column
Content here
\`\`\`

3. **Transitions** - Add different transitions:
   - \`transition: slide-left\`
   - \`transition: slide-up\`
   - \`transition: fade\`
   - \`transition: zoom\`

4. **v-click Animations** - Progressive disclosure:
\`\`\`
- First point
- Second point {.v-click}
- Third point {.v-click}
- Fourth point {.v-click}
\`\`\`

5. **Code Blocks with Advanced Features**:
\`\`\`typescript {all|1-3|5-8|10}
// Line highlighting and stepping
function example() {
  const data = fetchData();
  
  return data.map(item => ({
    id: item.id,
    name: item.name
  }));
  
  console.log('Done!');
}
\`\`\`

6. **Mermaid Diagrams** - Use extensively:
\`\`\`mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E
\`\`\`

\`\`\`mermaid
sequenceDiagram
    participant User
    participant System
    User->>System: Request
    System-->>User: Response
\`\`\`

7. **Custom Styling with Classes**:
   - \`{.text-gradient}\` - Gradient text
   - \`{.text-shadow}\` - Text with shadow
   - \`{.opacity-80}\` - Transparency
   - \`{.text-3xl}\` - Large text

8. **Images with Positioning**:
\`\`\`
![Image Description](IMAGE_PLACEHOLDER_keyword){.absolute.top-10.right-10.w-40.rounded-lg.shadow-xl}
\`\`\`

9. **Math Equations** (if relevant):
\`\`\`
$E = mc^2$

$$
\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$
\`\`\`

10. **Speaker Notes**:
\`\`\`
<!--
Key talking points:
- Emphasize this
- Don't forget to mention that
- Time: 2 minutes
-->
\`\`\`

11. **Custom CSS Classes**:
\`\`\`
<div class="grid grid-cols-3 gap-4">
  <div class="bg-blue-500 p-4 rounded">Box 1</div>
  <div class="bg-green-500 p-4 rounded">Box 2</div>
  <div class="bg-red-500 p-4 rounded">Box 3</div>
</div>
\`\`\`

STRUCTURE REQUIREMENTS:

1. **Title Slide** (layout: cover):
   - Engaging title
   - Compelling subtitle
   - Background gradient or image

2. **Agenda/Overview** (layout: default):
   - Use v-click for each point
   - 4-6 main topics

3. **Content Slides** (8-12 slides):
   - Vary layouts (two-cols, center, image-right)
   - Use v-click extensively
   - Include 2-3 Mermaid diagrams
   - Add code blocks if technical
   - Use custom styling
   - Max 5 points per slide

4. **Data/Statistics** (layout: fact):
   - Highlight key numbers
   - Use large text
   - Visual emphasis

5. **Section Dividers** (layout: section):
   - Between major topics
   - Bold, centered text

6. **Conclusion** (layout: center):
   - Key takeaways with v-click
   - Call to action

7. **Thank You** (layout: end):
   - Contact information
   - Q&A prompt

VISUAL ELEMENTS:
- Identify 5-7 slides needing images
- Format: ![alt](IMAGE_PLACEHOLDER_keyword)
- Use emojis strategically (📊 📈 💡 🚀 ⚡ 🎯)
- Add custom CSS classes for styling
- Use gradients and shadows

CONTENT GUIDELINES:
- Concise, impactful text
- Strong action verbs
- Data-driven insights
- Progressive disclosure with v-click
- Speaker notes for complex slides
- Varied slide layouts (no repetition)

OUTPUT FORMAT:
Generate ONLY valid Slidev markdown. Start with frontmatter. Use advanced features extensively. Make it POWERFUL and PROFESSIONAL.

Begin generating the presentation now:`;
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



