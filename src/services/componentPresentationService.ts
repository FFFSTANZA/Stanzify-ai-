import Groq from "groq-sdk";
import type { ComponentPresentationData } from '@/types/componentSlide';
import { COMPONENT_REGISTRY } from '@/components/slides/registry';

const groq = new Groq({
  apiKey: "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",
  dangerouslyAllowBrowser: true,
});

interface GenerateComponentPresentationOptions {
  prompt: string;
  theme: {
    palette: {
      name: string;
      primary: string;
      secondary: string;
      accent: string;
      background: string;
    };
    style: string;
    purpose: string;
  };
  onProgress?: (chunk: string) => void;
  temperature?: number;
  maxRetries?: number;
}

function buildComponentRegistryPrompt(): string {
  const components = Object.values(COMPONENT_REGISTRY);
  
  return components.map(comp => `
Component ID: ${comp.id}
Name: ${comp.name}
Category: ${comp.category}
Description: ${comp.description}
Use Cases: ${comp.useCases.join(', ')}
Tags: ${comp.tags.join(', ')}
Props: ${Object.keys(comp.propsSchema).join(', ')}
`).join('\n');
}

function buildComponentPresentationPrompt(
  userPrompt: string,
  theme: GenerateComponentPresentationOptions['theme']
): string {
  const componentLibrary = buildComponentRegistryPrompt();
  
  return `You are an EXPERT presentation designer creating a component-based presentation.

USER REQUEST: ${userPrompt}

THEME CONFIGURATION:
- Palette: ${theme.palette.name}
- Primary Color: ${theme.palette.primary}
- Secondary Color: ${theme.palette.secondary}
- Accent Color: ${theme.palette.accent}
- Background: ${theme.palette.background}
- Design Style: ${theme.style}
- Purpose: ${theme.purpose}

AVAILABLE COMPONENTS:
${componentLibrary}

YOUR TASK:
1. Analyze the user's request and determine the best slide structure
2. For EACH slide, select the MOST APPROPRIATE component from the library
3. Fill in ALL required props for each component
4. Create a cohesive, professional presentation (8-15 slides)
5. Use variety - don't repeat the same component type unless necessary

OUTPUT FORMAT (CRITICAL):
You MUST output ONLY valid JSON in this EXACT structure:
{
  "title": "Presentation Title",
  "subtitle": "Optional subtitle",
  "theme": "${theme.style}",
  "slides": [
    {
      "id": "slide-1",
      "componentId": "hero",
      "props": {
        "title": "Main Title",
        "subtitle": "Subtitle",
        "description": "Description text",
        "cta": {
          "text": "Primary Button",
          "secondary": "Secondary Button"
        },
        "icon": "🚀"
      }
    },
    {
      "id": "slide-2",
      "componentId": "bullet_list",
      "props": {
        "title": "Key Points",
        "items": ["Point 1", "Point 2", "Point 3"],
        "icon": "📋"
      }
    }
  ]
}

COMPONENT SELECTION RULES:
1. **hero** - Use for opening/cover slide only
2. **section** - Use for section dividers between major topics
3. **bullet_list** - Use for key points, agenda, takeaways
4. **two_column** or **three_column** - Use for comparisons, explanations
5. **stats** - Use for metrics, KPIs, achievements, numbers
6. **timeline** - Use for chronological events, history, roadmap
7. **process** - Use for step-by-step workflows, "how it works"
8. **feature** - Use for product features, benefits, capabilities
9. **comparison** - Use for side-by-side comparisons, pros/cons
10. **quote** - Use for testimonials, impactful quotes, social proof
11. **pricing** - Use for pricing tiers, packages, plans
12. **team** - Use for team introductions, about us
13. **cta** - Use for strong calls-to-action, signup prompts
14. **before_after** - Use for transformation, problem/solution
15. **code_demo** - Use for technical content, code examples
16. **quiz** - Use for engagement, testing knowledge
17. **accordion** or **tabs** - Use for organizing detailed content
18. **table** - Use for structured data, detailed comparisons
19. **grid** - Use for showcasing multiple items/cards
20. **card** - Use for highlighting single important message
21. **image_gallery** - Use when multiple images needed
22. **video** - Use for video content (provide placeholder)
23. **roadmap** - Use for future plans, phases
24. **flashcard** - Use for education, key concepts
25. **end** - Use for closing/thank you slide only

CONTENT GUIDELINES:
- Make content specific and relevant to the user's topic
- Use appropriate emojis/icons where helpful (not excessive)
- Keep text concise and scannable
- Use action-oriented language
- Include specific data/numbers when relevant
- Create a logical narrative flow
- Match the tone to the purpose (${theme.purpose})

CRITICAL RULES:
- Output ONLY valid JSON (no markdown, no code fences, no explanations)
- First slide MUST be "hero" component
- Last slide MUST be "end" component
- Include 8-15 slides total
- Each slide MUST have valid componentId from the library
- All required props MUST be filled
- Use variety in component selection
- Apply theme colors where appropriate (in descriptions, emphasis)

START GENERATING NOW - OUTPUT ONLY JSON:`;
}

export async function generateComponentPresentation(
  options: GenerateComponentPresentationOptions
): Promise<ComponentPresentationData> {
  const {
    prompt,
    theme,
    onProgress,
    temperature = 0.7,
    maxRetries = 3,
  } = options;

  const systemPrompt = buildComponentPresentationPrompt(prompt, theme);

  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt <= maxRetries) {
    try {
      const stream = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a world-class presentation designer and AI architect. You create structured, component-based presentations using a library of reusable UI components.

Your output MUST be valid JSON only - no markdown, no explanations, no code fences.

You are an expert at:
- Selecting the perfect component for each type of content
- Creating logical narrative flow
- Writing compelling, concise copy
- Using visual hierarchy and design principles
- Matching content to the user's goals and audience`,
          },
          {
            role: "user",
            content: systemPrompt,
          },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: temperature,
        max_tokens: 16000,
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

        if (Date.now() - lastChunkTime > 15000) {
          throw new Error("Stream timeout - generation took too long");
        }
      }

      if (fullContent.trim().length < 50) {
        throw new Error("Generated content too short");
      }

      // Clean the response - remove markdown code fences if present
      let cleanedContent = fullContent.trim();
      
      // Remove markdown code fences
      cleanedContent = cleanedContent.replace(/^```json\s*/i, '');
      cleanedContent = cleanedContent.replace(/^```\s*/i, '');
      cleanedContent = cleanedContent.replace(/\s*```\s*$/i, '');
      cleanedContent = cleanedContent.trim();

      // Find JSON object boundaries
      const startIdx = cleanedContent.indexOf('{');
      const lastIdx = cleanedContent.lastIndexOf('}');
      
      if (startIdx === -1 || lastIdx === -1) {
        throw new Error("No valid JSON found in response");
      }
      
      cleanedContent = cleanedContent.substring(startIdx, lastIdx + 1);

      // Parse and validate JSON
      const presentationData: ComponentPresentationData = JSON.parse(cleanedContent);

      // Validate structure
      if (!presentationData.title || !presentationData.slides || !Array.isArray(presentationData.slides)) {
        throw new Error("Invalid presentation structure");
      }

      if (presentationData.slides.length < 3) {
        throw new Error("Presentation must have at least 3 slides");
      }

      // Validate each slide has required fields
      for (const slide of presentationData.slides) {
        if (!slide.id || !slide.componentId || !slide.props) {
          throw new Error(`Invalid slide structure: ${JSON.stringify(slide)}`);
        }

        // Check if component exists
        if (!COMPONENT_REGISTRY[slide.componentId]) {
          throw new Error(`Unknown component: ${slide.componentId}`);
        }
      }

      console.log('Successfully generated component presentation:', {
        title: presentationData.title,
        slideCount: presentationData.slides.length,
        components: presentationData.slides.map(s => s.componentId),
      });

      return presentationData;

    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error");
      attempt++;

      console.error(`Component presentation generation attempt ${attempt}/${maxRetries + 1} failed:`, {
        message: lastError.message,
        error: error,
        prompt: prompt.substring(0, 100) + "...",
      });

      if (attempt <= maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt * 2));
      }
    }
  }

  throw new Error(
    `Failed to generate component presentation after ${maxRetries + 1} attempts: ${lastError?.message || 'Unknown error'}`
  );
}
