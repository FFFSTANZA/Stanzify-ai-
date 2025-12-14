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
6. **chart** - Use for visual data trends (bar, line, pie, area, donut)
7. **timeline** - Use for chronological events, history, roadmap
8. **process** - Use for step-by-step workflows, "how it works"
9. **feature** - Use for product features, benefits, capabilities
10. **comparison** - Use for side-by-side comparisons, pros/cons
11. **quote** - Use for testimonials, impactful quotes, social proof
12. **pricing** - Use for pricing tiers, packages, plans
13. **team** - Use for team introductions, about us
14. **cta** - Use for strong calls-to-action, signup prompts
15. **before_after** - Use for transformation, problem/solution
16. **code_demo** - Use for technical content, code examples
17. **quiz** - Use for engagement, testing knowledge
18. **accordion** or **tabs** - Use for organizing detailed content
19. **table** - Use for structured data, detailed comparisons
20. **grid** - Use for showcasing multiple items/cards
21. **card** - Use for highlighting single important message
22. **image_gallery** - Use when multiple images needed
23. **video** - Use for video content (provide placeholder)
24. **roadmap** - Use for future plans, phases
25. **flashcard** - Use for education, key concepts
26. **end** - Use for closing/thank you slide only

PRICING COMPONENT (IMPORTANT):
- If a slide contains multiple plans/tiers/packages + prices, you MUST use componentId "pricing" (never bullet_list for pricing).
- For "pricing" component, props MUST be:
  {
    "title": "Pricing Tiers",
    "plans": [
      {
        "name": "Basic",
        "price": "$99",
        "period": "month",
        "features": ["Feature 1", "Feature 2", "Feature 3"],
        "highlighted": false,
        "cta": "Choose Basic"
      }
    ]
  }
- Each plan MUST include a non-empty "features" array (3-6 items).

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

type PricingPlan = {
  name: string;
  price: string;
  period?: string;
  features: string[];
  highlighted?: boolean;
  cta?: string;
};

function collectStrings(value: unknown, out: string[]) {
  if (typeof value === 'string') {
    out.push(value);
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, out);
    return;
  }

  if (value && typeof value === 'object') {
    for (const v of Object.values(value as Record<string, unknown>)) {
      collectStrings(v, out);
    }
  }
}

function normalizePeriod(raw?: string): string | undefined {
  if (!raw) return undefined;
  const p = raw.trim().toLowerCase();
  if (!p) return undefined;
  if (p === 'mo' || p === 'mos' || p === 'month' || p === 'monthly') return 'month';
  if (p === 'yr' || p === 'yrs' || p === 'year' || p === 'yearly' || p === 'annual') return 'year';
  if (p === 'week' || p === 'wk' || p === 'weekly') return 'week';
  if (p === 'day' || p === 'daily') return 'day';
  return p;
}

function pickPricingTitle(slideProps: Record<string, any>, lines: string[]): string {
  const fromProps = typeof slideProps.title === 'string' ? slideProps.title.trim() : '';
  if (fromProps) return fromProps;

  const fromLines = lines.find((l) => /pricing|plans|tiers|packages/i.test(l));
  return fromLines?.trim() || 'Pricing';
}

function extractFeaturesFromLineRemainder(remainder: string): string[] {
  const cleaned = remainder.replace(/^\s*[-–—|•]+\s*/g, '').trim();
  if (!cleaned) return [];

  const parts = cleaned
    .split(/\s*(?:,|;|\||•)\s*/g)
    .map((p) => p.trim())
    .filter(Boolean)
    .filter((p) => !/(?:\$|€|£)\s*\d/.test(p))
    .filter((p) => !/\b(?:mo|month|yr|year|week|day)\b/i.test(p));

  return parts.slice(0, 6);
}

function defaultFeaturesForPlanName(name: string, index: number, total: number): string[] {
  const lower = name.toLowerCase();

  if (/(enterprise|business|team|company)/.test(lower)) {
    return ['Custom integrations', 'Dedicated support & onboarding', 'Advanced security & SSO', 'SLA & compliance options'];
  }

  if (/(premium|pro|plus|growth)/.test(lower)) {
    return ['Everything in Basic', 'Priority support', 'Advanced analytics', 'Team collaboration features'];
  }

  if (/(free|starter|basic|essentials)/.test(lower) || index === 0) {
    return ['Core features included', 'Standard templates', 'Email support', 'Upgrade anytime'];
  }

  if (total === 3 && index === 1) {
    return ['Most popular feature set', 'Faster support response', 'More usage / seats', 'Advanced customization'];
  }

  return ['Core features included', 'Email support', 'Upgrade anytime'];
}

function parsePricingPlansFromLines(lines: string[]): PricingPlan[] | null {
  const currencyRegex = /(?:\$|€|£)\s?\d+(?:[\.,]\d+)?(?:\s?[kKmM])?/;

  const candidates = lines
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.replace(/^[\s•▸*✓-]+/g, '').trim())
    .filter(Boolean);

  const plans: PricingPlan[] = [];

  for (const line of candidates) {
    const isLikelyPlanLine =
      currencyRegex.test(line) || /\bcustom\b|contact\s*us|call\s*us|free\b/i.test(line);

    if (!isLikelyPlanLine) continue;

    const named = line.match(/^(.+?)\s*(?:[:–—-])\s*(.+)$/);
    const spaced = line.match(/^(.+?)\s+((?:\$|€|£).+)$/);

    const name = (named?.[1] || spaced?.[1] || '').trim();
    const rest = (named?.[2] || spaced?.[2] || '').trim();
    if (!name || !rest) continue;

    if (/\bcustom\b|contact\s*us|call\s*us/i.test(rest)) {
      plans.push({
        name,
        price: 'Custom',
        features: defaultFeaturesForPlanName(name, plans.length, 0),
        cta: 'Contact Sales',
      });
      continue;
    }

    if (/\bfree\b/i.test(rest)) {
      plans.push({
        name,
        price: 'Free',
        features: defaultFeaturesForPlanName(name, plans.length, 0),
        cta: 'Get Started',
      });
      continue;
    }

    const match = rest.match(
      new RegExp(`(${currencyRegex.source})(?:\\s*(?:\\/|per\\s+)([a-zA-Z]+))?`, 'i')
    );

    const price = match?.[1]?.trim();
    const period = normalizePeriod(match?.[2]);
    if (!price) continue;

    const afterPrice = match?.index !== undefined ? rest.slice(match.index + match[0].length) : '';
    const featuresFromLine = extractFeaturesFromLineRemainder(afterPrice);

    plans.push({
      name,
      price,
      period,
      features: featuresFromLine.length
        ? featuresFromLine
        : defaultFeaturesForPlanName(name, plans.length, 0),
      cta: `Choose ${name}`,
    });
  }

  if (plans.length < 2) return null;

  const highlightedIndex = (() => {
    const keywordIndex = plans.findIndex((p) => /(premium|pro|plus|recommended|popular)/i.test(p.name));
    if (keywordIndex >= 0) return keywordIndex;
    if (plans.length === 3) return 1;
    return Math.min(1, plans.length - 1);
  })();

  return plans.map((p, idx) => ({
    ...p,
    features: p.features?.length ? p.features : defaultFeaturesForPlanName(p.name, idx, plans.length),
    highlighted: idx === highlightedIndex,
  }));
}

function coercePricingSlides(presentationData: ComponentPresentationData) {
  for (const slide of presentationData.slides) {
    if (slide.componentId === 'pricing') continue;

    const strings: string[] = [];
    collectStrings(slide.props, strings);

    const lines = strings
      .flatMap((s) => s.split(/\r?\n/))
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) continue;

    const joined = lines.join(' ');

    const hasPricingKeyword = /\bpricing\b|\bplans\b|\btiers\b|\bpackages\b/i.test(joined);
    const hasPlanWord = /\b(?:basic|starter|standard|premium|pro|plus|enterprise|business|free)\b/i.test(joined);
    const hasCurrency = /(?:\$|€|£)\s?\d/.test(joined);

    const looksLikePricing = hasPricingKeyword || (hasPlanWord && hasCurrency);

    if (!looksLikePricing) continue;

    const plans = parsePricingPlansFromLines(lines);
    if (!plans) continue;

    slide.componentId = 'pricing';
    slide.props = {
      title: pickPricingTitle(slide.props, lines),
      plans,
    };
  }
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

      coercePricingSlides(presentationData);

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
