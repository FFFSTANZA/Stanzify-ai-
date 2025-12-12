import Groq from "groq-sdk";
import type { PresentationTheme } from "@/types/theme";

const groq = new Groq({
  apiKey: "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",
  dangerouslyAllowBrowser: true,
});

function buildEnhancedPrompt(userPrompt: string, theme: PresentationTheme): string {
  return `You are an expert Slidev presentation designer. Generate a professional, visually engaging presentation.

TOPIC: ${userPrompt}
THEME: ${theme.palette.name}
COLORS: Primary: ${theme.palette.primary}, Secondary: ${theme.palette.secondary}, Accent: ${theme.palette.accent}
STYLE: ${theme.style} (${getStyleDescription(theme.style)})

REQUIREMENTS:

1. **Structure & Layout**:
   - Start with an engaging title slide
   - Create 5-7 well-structured content slides
   - Use section dividers every 3-4 slides
   - Max 5 bullets per slide (split long content)
   - Vary slide layouts (not all bullets)
   - End with a conclusion or call-to-action slide

2. **Advanced Features**:
   - Use Mermaid diagrams where appropriate (flowcharts, timelines, process diagrams)
   - Add code blocks with proper language tags if technical content
   - Use multi-column layouts for comparisons
   - Include callouts or blockquotes for important points
   - Add proper heading hierarchy (# for titles, ## for sections)

3. **Visual Elements**:
   - Identify 3-5 key slides that need images
   - Format: ![descriptive alt text](IMAGE_PLACEHOLDER_keyword)
   - Keywords should be specific and relevant (e.g., "business_meeting", "data_analytics", "team_collaboration")
   - Use emojis sparingly for visual interest

4. **Content Guidelines**:
   - Keep text concise and impactful
   - Use strong action verbs
   - Include relevant statistics or data points
   - Add speaker notes for key slides using <!-- notes --> syntax
   - Progressive disclosure with v-click where appropriate

5. **Markdown Syntax**:
   - Use --- to separate slides
   - Use proper markdown formatting (bold, italic, lists)
   - Include horizontal rules (---) for visual breaks within slides
   - Use > for blockquotes/callouts

OUTPUT FORMAT:
Generate ONLY valid Slidev markdown. Start directly with the first slide. Do not include explanations or meta-commentary.

Example structure:
---
# Main Title
Engaging subtitle

---
# Introduction
- Key point 1
- Key point 2
- Key point 3

![relevant image](IMAGE_PLACEHOLDER_introduction_concept)

---
# Section Divider
---
# Detailed Content
## Subsection

Content with **emphasis** and *style*

> Important callout or quote

---

Begin generating the presentation now:`;
}

function getStyleDescription(style: string): string {
  const descriptions: Record<string, string> = {
    minimal: 'Clean and simple with lots of white space',
    corporate: 'Professional and business-focused',
    creative: 'Bold and visually striking',
    academic: 'Structured and information-dense',
  };
  return descriptions[style] || 'Professional';
}

export interface GenerateSlidesOptions {
  prompt: string;
  theme: PresentationTheme;
  onProgress?: (chunk: string) => void;
}

export async function generateSlides(
  options: GenerateSlidesOptions
): Promise<string> {
  const { prompt, theme, onProgress } = options;

  const systemPrompt = buildEnhancedPrompt(prompt, theme);

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
      max_tokens: 3000,
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

