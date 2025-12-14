import Groq from "groq-sdk";
import type { ComponentPresentationData, PropSchema } from '@/types/componentSlide';
import { COMPONENT_REGISTRY } from '@/components/slides/registry';

/**
 * Validates if content looks like raw text instead of component-based JSON
 * This prevents the AI from outputting raw prose/markdown
 */
function isLikelyRawText(content: string): boolean {
  const rawTextIndicators = [
    // Raw text patterns that should trigger rejection
    /transition:\s*fade-?out/i,
    /click to reveal/i,
    /click for more/i,
    /implementation timeline/i,
    /pricing tiers?/i,
    /get started today/i,
    /basic:\s*\$\d+/i,
    /premium:\s*\$\d+/i,
    /enterprise:/i,
    
    // General prose patterns that indicate raw text
    /^[a-zA-Z][\w\s,.:;-]+$/m, // Starts with regular sentence
    /the impact of our solution/i,
    /we offer/i,
    /we have/i,
    /this presentation/i,
    /in this section/i,
    /as you can see/i,
    /let me show you/i,
    /next, we will/i,
    
    // Date sequences that indicate raw timeline text
    /^\d{4}-\d{2}-\d{2}$/m,
    
    // Markdown-like patterns
    /^#+ /m, // Headers
    /\*\*(.+?)\*\*/g, // Bold text
    /^(?:[-*+]|\d+\.)\s/m, // List items without component structure
    
    // Missing component structure
    /componentId.*:\s*[a-z_]+/i, // Has componentId but also has raw text
    /"slides":\s*\[/i, // Has slides but content looks wrong
  ];

  // Check if content looks like it has both raw text AND component structure
  const hasRawText = rawTextIndicators.some(pattern => pattern.test(content));
  const hasComponentStructure = /"componentId":\s*"[^"]*"/i.test(content);
  
  // If it has raw text indicators AND component structure, it's mixed (bad)
  if (hasRawText && hasComponentStructure) {
    return true;
  }
  
  // If it's almost entirely raw text (no proper component structure)
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  const componentLines = lines.filter(line => /"componentId":/i.test(line));
  const rawLines = lines.filter(line => !/"[^"]*":\s*[{\[]/i.test(line) && !line.trim().startsWith('{') && !line.trim().startsWith('['));
  
  // If more than 50% of non-empty lines are raw text
  if (rawLines.length > componentLines.length * 2 && rawLines.length > 3) {
    return true;
  }
  
  return false;
}

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

function formatPropSchemaLine(propName: string, schema: PropSchema): string {
  const parts: string[] = [`- ${propName}: ${schema.type}`];

  if (schema.type === 'enum' && schema.enumValues?.length) {
    parts.push(`[${schema.enumValues.join(' | ')}]`);
  }

  if (schema.required) {
    parts.push('(required)');
  }

  if (schema.default !== undefined) {
    parts.push(`(default: ${JSON.stringify(schema.default)})`);
  }

  if (schema.description) {
    parts.push(`- ${schema.description}`);
  }

  return parts.join(' ');
}

function buildComponentRegistryPrompt(): string {
  const components = Object.values(COMPONENT_REGISTRY);

  return components
    .map((comp) => {
      const propsSchemaLines = Object.entries(comp.propsSchema)
        .map(([propName, schema]) => formatPropSchemaLine(propName, schema))
        .join('\n');

      return `Component ID: ${comp.id}
Name: ${comp.name}
Category: ${comp.category}
Description: ${comp.description}
Use Cases: ${comp.useCases.join(', ')}
Tags: ${comp.tags.join(', ')}
Props Schema:\n${propsSchemaLines}`;
    })
    .join('\n\n');
}

/**
 * Predictive algorithm to determine the best components for a prompt
 */
function predictBestComponents(userPrompt: string): string[] {
  const prompt = userPrompt.toLowerCase();
  const componentScores: Record<string, number> = {};
  
  // Score components based on keywords
  const keywordMappings = [
    { keywords: ['timeline', 'roadmap', 'schedule', 'implementation', 'milestones', 'dates', '2014', '2015', '2016'], components: ['timeline', 'roadmap'] },
    { keywords: ['statistics', 'metrics', 'data', 'numbers', 'kpi', 'performance', 'impact'], components: ['stats', 'chart'] },
    { keywords: ['features', 'benefits', 'capabilities', 'advantages', 'highlights'], components: ['feature', 'grid'] },
    { keywords: ['process', 'steps', 'workflow', 'methodology', 'how it works'], components: ['process'] },
    { keywords: ['pricing', 'plans', 'tiers', 'packages', 'cost', 'expensive', 'cheap'], components: ['pricing'] },
    { keywords: ['team', 'people', 'staff', 'members', 'about us'], components: ['team'] },
    { keywords: ['comparison', 'vs', 'versus', 'before', 'after', 'alternative'], components: ['comparison', 'before_after'] },
    { keywords: ['quote', 'testimonial', 'feedback', 'review'], components: ['quote'] },
    { keywords: ['call to action', 'signup', 'get started', 'contact us'], components: ['cta'] },
    { keywords: ['gallery', 'images', 'photos', 'visual'], components: ['image_gallery'] },
    { keywords: ['video', 'demo', 'presentation'], components: ['video'] },
    { keywords: ['code', 'api', 'technical', 'development'], components: ['code_demo'] },
    { keywords: ['table', 'data', 'specifications', 'comparison table'], components: ['table'] },
  ];
  
  // Score based on keyword matches
  keywordMappings.forEach(({ keywords, components }) => {
    const matches = keywords.filter(keyword => prompt.includes(keyword)).length;
    if (matches > 0) {
      components.forEach(component => {
        componentScores[component] = (componentScores[component] || 0) + matches;
      });
    }
  });
  
  // Always include hero and end
  const guaranteedComponents = ['hero', 'end'];
  guaranteedComponents.forEach(comp => {
    componentScores[comp] = (componentScores[comp] || 0) + 10;
  });
  
  // Get top components, ensuring we have at least 8 different ones
  const sortedComponents = Object.entries(componentScores)
    .sort(([, a], [, b]) => b - a)
    .map(([component]) => component);
  
  // Ensure diversity by adding more components if needed
  const allComponents = Object.keys(COMPONENT_REGISTRY);
  const remainingComponents = allComponents.filter(comp => !sortedComponents.includes(comp));
  
  // Add components for diversity
  const diversityComponents = ['stats', 'feature', 'process', 'timeline', 'comparison', 'grid', 'two_column'];
  diversityComponents.forEach(comp => {
    if (!sortedComponents.includes(comp) && remainingComponents.includes(comp)) {
      sortedComponents.push(comp);
    }
  });
  
  // Fill with remaining components
  remainingComponents.forEach(comp => {
    if (!sortedComponents.includes(comp) && sortedComponents.length < 12) {
      sortedComponents.push(comp);
    }
  });
  
  return sortedComponents.slice(0, 12);
}

function buildComponentPresentationPrompt(
  userPrompt: string,
  theme: GenerateComponentPresentationOptions['theme']
): string {
  const componentLibrary = buildComponentRegistryPrompt();
  const predictedComponents = predictBestComponents(userPrompt);
  
  return `🔥 MANDATORY COMPONENT-BASED PRESENTATION GENERATOR 🔥

ABSOLUTELY FORBIDDEN TO OUTPUT RAW TEXT OR MARKDOWN. 
YOU MUST USE STRUCTURED JSON WITH COMPONENTS OR YOU WILL FAIL.

USER REQUEST: ${userPrompt}

🎯 AI PREDICTION: Based on the prompt analysis, prioritize these components:
${predictedComponents.map((comp, idx) => `${idx + 1}. ${comp}`).join('\n')}

THEME CONFIGURATION:
- Palette: ${theme.palette.name}
- Primary Color: ${theme.palette.primary}
- Secondary Color: ${theme.palette.secondary}
- Accent Color: ${theme.palette.accent}
- Background: ${theme.palette.background}
- Design Style: ${theme.style}
- Purpose: ${theme.purpose}

STRICT COMPONENT LIBRARY (YOU MUST USE THESE EXACTLY):
${componentLibrary}

🔴 CRITICAL FAILURE CONDITIONS (YOU WILL BE REJECTED IF YOU DO ANY OF THESE):
- ❌ NEVER output raw text like "transition: fade-out" or "Click to reveal more statistics"
- ❌ NEVER use bullet lists unless explicitly using the "bullet_list" component
- ❌ NEVER output markdown or prose text
- ❌ NEVER skip component IDs - every slide MUST have a valid componentId
- ❌ NEVER use less than 8 different component types

🟢 MANDATORY REQUIREMENTS (ZERO TOLERANCE):
- ✅ MUST output ONLY valid JSON matching the exact schema below
- ✅ First slide MUST be "hero" componentId
- ✅ Last slide MUST be "end" componentId  
- ✅ MUST use at least 8 DISTINCT componentId values
- ✅ MUST use 10-15 slides total
- ✅ Maximum 1 "bullet_list" component allowed
- ✅ All slides except first and last can be ANY of the 27 components

EXACT OUTPUT FORMAT (NON-NEGOTIABLE):
{
  "title": "Presentation Title",
  "subtitle": "Optional subtitle", 
  "theme": "${theme.style}",
  "slides": [
    {
      "id": "slide-1",
      "componentId": "hero",
      "props": {
        "title": "Compelling Title",
        "subtitle": "Engaging subtitle",
        "description": "Brief description",
        "cta": { "text": "Primary CTA", "secondary": "Secondary CTA" },
        "icon": "🚀"
      }
    },
    {
      "id": "slide-2", 
      "componentId": "stats",
      "props": {
        "title": "Key Statistics",
        "stats": [
          { "value": "500K+", "label": "Users", "icon": "👥" },
          { "value": "99.9%", "label": "Uptime", "icon": "⚡" },
          { "value": "4.9/5", "label": "Rating", "icon": "⭐" }
        ],
        "layout": "horizontal"
      }
    }
    // Continue with 8+ more DIFFERENT components...
  ]
}

🎯 SMART COMPONENT SELECTION ALGORITHM:

CONTENT TYPE → COMPONENT MAPPING:
📊 Statistics/Numbers/Metrics → "stats" component
🚀 Features/Benefits/Capabilities → "feature" component  
📈 Timeline/History/Roadmap → "timeline" component
⚡ Process/Steps/Workflow → "process" component
💰 Pricing/Plans/Packages → "pricing" component
🏢 Team/About/People → "team" component
📝 Comparison/Contrast → "comparison" component
💬 Quote/Testimonial → "quote" component
🎯 Call-to-Action → "cta" component
🃏 Multiple Items/Cards → "grid" component
💻 Code/Technical → "code_demo" component
📋 Structured Data → "table" component
📸 Images/Gallery → "image_gallery" component
📹 Video Content → "video" component
🔄 Before/After → "before_after" component
📊 Charts/Graphs → "chart" component

⚡ PREDICTIVE ALGORITHM RULES:
1. If prompt mentions "implementation timeline" → use "timeline" component
2. If prompt mentions "statistics" or numbers → use "stats" component  
3. If prompt mentions "pricing" or "plans" → use "pricing" component
4. If prompt mentions "features" or "benefits" → use "feature" component
5. If prompt mentions "process" or "steps" → use "process" component
6. If prompt mentions "team" or "people" → use "team" component

🔥 ENFORCED DIVERSITY ALGORITHM:
- Slide 1: MUST be "hero"
- Slides 2-9: Use 7+ different components from the library
- Slide 10+: Use remaining components for variety
- Slide Last: MUST be "end"

ERROR-PROOFING CHECKLIST:
□ Every slide has valid componentId from the library
□ First slide is "hero"  
□ Last slide is "end"
□ At least 8 different componentId values used
□ All required props are filled with meaningful content
□ No raw text or prose output
□ Valid JSON structure
□ 10-15 slides total
□ Maximum 1 bullet_list used

🎨 CONTENT QUALITY REQUIREMENTS:
- Use specific, relevant emojis/icons
- Create compelling, action-oriented copy
- Include realistic numbers and statistics
- Match tone to purpose (${theme.purpose})
- Apply theme colors in descriptions
- Make each slide visually distinct

🚨 FINAL WARNING: 
This system will REJECT any output that doesn't follow these rules exactly.
Raw text = FAILURE. Component JSON = SUCCESS.

START GENERATING VALID JSON NOW:`;
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

type Slide = ComponentPresentationData['slides'][number];

const FALLBACK_ICONS = ['✨', '⚡', '🎯', '🧠', '📈', '🧩', '✅', '🚀'];

function cleanListItem(text: string): string {
  return text
    .replace(/^[\s•▸*✓-]+/g, '')
    .replace(/^\d+\s*[\).]\s*/g, '')
    .trim();
}

function toStringArray(value: unknown): string[] | null {
  if (Array.isArray(value)) {
    const items = value
      .map((v) => (typeof v === 'string' ? v : String(v)))
      .map(cleanListItem)
      .filter(Boolean);

    return items.length ? items : null;
  }

  if (typeof value === 'string') {
    const items = value
      .split(/\r?\n/)
      .map(cleanListItem)
      .filter(Boolean);

    return items.length ? items : null;
  }

  return null;
}

function shortTitleFromSentence(text: string): string {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= 5) return text;
  return `${words.slice(0, 5).join(' ')}…`;
}

function splitItemToTitleAndDescription(text: string): { title: string; description: string } {
  const cleaned = cleanListItem(text);

  const match = cleaned.match(/^(.+?)\s*(?:[:–—-])\s*(.+)$/);
  if (match) {
    const title = match[1].trim();
    const description = match[2].trim();
    return {
      title: title || shortTitleFromSentence(cleaned),
      description: description || cleaned,
    };
  }

  return {
    title: shortTitleFromSentence(cleaned),
    description: cleaned,
  };
}

function parseStatsFromItems(items: string[]) {
  const stats: Array<{ value: string; label: string; icon?: string }> = [];

  for (const [idx, item] of items.entries()) {
    const cleaned = cleanListItem(item);

    const valueFirst = cleaned.match(
      /^([~<>]?\s*(?:(?:\$|€|£)\s?)?\d+(?:[\.,]\d+)?%?(?:\s?[kKmMbB])?|\d+(?:\.\d+)?x)\s*(.+)$/i
    );

    if (valueFirst) {
      const value = valueFirst[1].trim();
      const label = valueFirst[2].replace(/^[:–—-]\s*/g, '').trim();
      if (value && label) {
        stats.push({ value, label, icon: FALLBACK_ICONS[idx % FALLBACK_ICONS.length] });
      }
      continue;
    }

    const valueLast = cleaned.match(
      /^(.+?)\s*(?:[:–—-])\s*([~<>]?\s*(?:(?:\$|€|£)\s?)?\d+(?:[\.,]\d+)?%?(?:\s?[kKmMbB])?|\d+(?:\.\d+)?x)$/i
    );

    if (valueLast) {
      const label = valueLast[1].trim();
      const value = valueLast[2].trim();
      if (value && label) {
        stats.push({ value, label, icon: FALLBACK_ICONS[idx % FALLBACK_ICONS.length] });
      }
    }
  }

  return stats;
}

function fallbackSlideToCard(slide: Slide) {
  const props = (slide.props ?? {}) as Record<string, any>;
  const title = typeof props.title === 'string' && props.title.trim() ? props.title.trim() : 'Overview';
  const subtitle = typeof props.subtitle === 'string' && props.subtitle.trim() ? props.subtitle.trim() : undefined;

  let content = '';

  const items = toStringArray(props.items);
  if (items?.length) {
    content = items.map((i) => `- ${i}`).join('\n');
  } else if (typeof props.content === 'string' && props.content.trim()) {
    content = props.content.trim();
  } else {
    const strings: string[] = [];
    collectStrings(props, strings);
    const lines = strings
      .flatMap((s) => s.split(/\r?\n/))
      .map((l) => l.trim())
      .filter(Boolean)
      .filter((l) => l !== title && l !== subtitle);

    content = Array.from(new Set(lines)).slice(0, 12).join('\n');
  }

  slide.componentId = 'card';
  slide.props = {
    title,
    ...(subtitle ? { subtitle } : {}),
    content: content || '- (content unavailable)',
  };
}

function isValidValueForSchema(value: unknown, schema: PropSchema): boolean {
  if (schema.type === 'string') return typeof value === 'string' && value.trim().length > 0;
  if (schema.type === 'number') return typeof value === 'number' && Number.isFinite(value);
  if (schema.type === 'boolean') return typeof value === 'boolean';
  if (schema.type === 'array') return Array.isArray(value);
  if (schema.type === 'object') return !!value && typeof value === 'object' && !Array.isArray(value);
  if (schema.type === 'enum') {
    if (typeof value !== 'string' && typeof value !== 'number') return false;
    if (!schema.enumValues?.length) return true;
    return schema.enumValues.includes(String(value));
  }
  return true;
}

function hasRequiredProps(componentId: string, props: Record<string, any>) {
  const schema = COMPONENT_REGISTRY[componentId]?.propsSchema;
  if (!schema) return true;

  for (const [key, propSchema] of Object.entries(schema)) {
    if (!propSchema.required) continue;
    if (!isValidValueForSchema(props[key], propSchema)) return false;
  }

  return true;
}

function coerceBulletListToRichComponent(slide: Slide): boolean {
  const props = (slide.props ?? {}) as Record<string, any>;
  const title = typeof props.title === 'string' ? props.title.trim() : '';
  const subtitle = typeof props.subtitle === 'string' ? props.subtitle.trim() : undefined;
  const items = toStringArray(props.items);

  if (!items?.length) return false;

  const stats = parseStatsFromItems(items);
  if (stats.length >= 2 && stats.length <= 6 && !/pricing|plans|tiers|packages/i.test(title)) {
    slide.componentId = 'stats';
    slide.props = {
      ...(title ? { title } : {}),
      stats: stats.slice(0, 4).map((s) => ({ value: s.value, label: s.label, icon: s.icon })),
      layout: 'horizontal',
    };
    return true;
  }

  const processLike =
    /how\s+it\s+works|process|steps|workflow|method|approach/i.test(title) ||
    items.some((i) => /^\d+\s*[\).]/.test(i) || /\bstep\b/i.test(i));

  if (processLike && items.length >= 3) {
    slide.componentId = 'process';
    slide.props = {
      ...(title ? { title } : {}),
      steps: items.slice(0, 6).map((item, idx) => {
        const { title: stepTitle, description } = splitItemToTitleAndDescription(item);
        return {
          title: stepTitle,
          description,
          icon: FALLBACK_ICONS[idx % FALLBACK_ICONS.length],
        };
      }),
      layout: 'horizontal',
    };
    return true;
  }

  const featureLike = /features|benefits|capabilities|what\s+you\s+get|highlights/i.test(title);

  if (featureLike && items.length >= 3) {
    slide.componentId = 'feature';
    slide.props = {
      ...(title ? { title } : {}),
      ...(subtitle ? { subtitle } : {}),
      features: items.slice(0, 6).map((item, idx) => {
        const { title: featureTitle, description } = splitItemToTitleAndDescription(item);
        return {
          title: featureTitle,
          description,
          icon: FALLBACK_ICONS[idx % FALLBACK_ICONS.length],
        };
      }),
      layout: items.length > 4 ? 'grid' : 'list',
    };
    return true;
  }

  if (items.length >= 4) {
    slide.componentId = 'grid';
    slide.props = {
      ...(title ? { title } : {}),
      items: items.slice(0, 8).map((item, idx) => {
        const { title: itemTitle, description } = splitItemToTitleAndDescription(item);
        return {
          title: itemTitle,
          description,
          icon: FALLBACK_ICONS[idx % FALLBACK_ICONS.length],
        };
      }),
      columns: items.length >= 8 ? 4 : items.length >= 6 ? 3 : 2,
      itemStyle: 'card',
    };
    return true;
  }

  slide.componentId = 'card';
  slide.props = {
    title: title || 'Overview',
    ...(subtitle ? { subtitle } : {}),
    content: items.map((i) => `- ${i}`).join('\n'),
  };

  return true;
}

function sanitizeComponentSlides(presentationData: ComponentPresentationData) {
  for (const slide of presentationData.slides) {
    if (!slide.props || typeof slide.props !== 'object') {
      slide.props = {};
    }

    const props = slide.props as Record<string, any>;

    if (slide.componentId === 'hero') {
      if (typeof props.title !== 'string' || !props.title.trim()) {
        props.title = presentationData.title || 'Presentation';
      }
      continue;
    }

    if (slide.componentId === 'end') {
      if (typeof props.title !== 'string' || !props.title.trim()) {
        props.title = 'Thank you';
      }
      continue;
    }

    if (slide.componentId === 'bullet_list') {
      if (typeof props.title !== 'string' || !props.title.trim()) {
        props.title = 'Key Points';
      }

      const items = toStringArray(props.items);
      props.items = items ?? [];
      props.items = (props.items as string[]).map(cleanListItem).filter(Boolean);

      if (!(props.items as string[]).length) {
        fallbackSlideToCard(slide);
        continue;
      }
    }

    if (slide.componentId === 'grid') {
      if (typeof props.columns === 'string') {
        const parsed = parseInt(props.columns, 10);
        if ([2, 3, 4].includes(parsed)) props.columns = parsed;
      }

      const items = Array.isArray(props.items) ? props.items : null;
      if (items) {
        props.items = items.slice(0, 8).map((item, idx) => {
          if (typeof item === 'string') {
            const { title, description } = splitItemToTitleAndDescription(item);
            return { title, description, icon: FALLBACK_ICONS[idx % FALLBACK_ICONS.length] };
          }

          const obj = (item ?? {}) as Record<string, any>;
          const title = typeof obj.title === 'string' && obj.title.trim() ? obj.title.trim() : `Item ${idx + 1}`;
          const description =
            typeof obj.description === 'string' && obj.description.trim() ? obj.description.trim() : title;
          const icon =
            typeof obj.icon === 'string' && obj.icon.trim() ? obj.icon.trim() : FALLBACK_ICONS[idx % FALLBACK_ICONS.length];
          const image = typeof obj.image === 'string' && obj.image.trim() ? obj.image.trim() : undefined;

          return { title, description, icon, ...(image ? { image } : {}) };
        });
      }
    }

    if (slide.componentId === 'feature') {
      const features = Array.isArray(props.features) ? props.features : null;
      if (features) {
        props.features = features.slice(0, 6).map((feature, idx) => {
          if (typeof feature === 'string') {
            const { title, description } = splitItemToTitleAndDescription(feature);
            return { title, description, icon: FALLBACK_ICONS[idx % FALLBACK_ICONS.length] };
          }

          const obj = (feature ?? {}) as Record<string, any>;
          const title = typeof obj.title === 'string' && obj.title.trim() ? obj.title.trim() : `Feature ${idx + 1}`;
          const description =
            typeof obj.description === 'string' && obj.description.trim() ? obj.description.trim() : title;
          const icon =
            typeof obj.icon === 'string' && obj.icon.trim() ? obj.icon.trim() : FALLBACK_ICONS[idx % FALLBACK_ICONS.length];

          return { title, description, icon };
        });
      }
    }

    if (slide.componentId === 'process') {
      const steps = Array.isArray(props.steps) ? props.steps : null;
      if (steps) {
        props.steps = steps.slice(0, 6).map((step, idx) => {
          if (typeof step === 'string') {
            const { title, description } = splitItemToTitleAndDescription(step);
            return { title, description, icon: FALLBACK_ICONS[idx % FALLBACK_ICONS.length] };
          }

          const obj = (step ?? {}) as Record<string, any>;
          const title = typeof obj.title === 'string' && obj.title.trim() ? obj.title.trim() : `Step ${idx + 1}`;
          const description =
            typeof obj.description === 'string' && obj.description.trim() ? obj.description.trim() : title;
          const icon = typeof obj.icon === 'string' && obj.icon.trim() ? obj.icon.trim() : undefined;

          return { title, description, ...(icon ? { icon } : {}) };
        });
      }
    }

    if (slide.componentId === 'stats') {
      const stats = Array.isArray(props.stats) ? props.stats : null;
      if (stats) {
        if (stats.every((s) => typeof s === 'string')) {
          const parsed = parseStatsFromItems(stats as string[]);
          props.stats = parsed.slice(0, 4).map((s) => ({ value: s.value, label: s.label, icon: s.icon }));
        } else {
          props.stats = stats.slice(0, 4).map((stat, idx) => {
            if (typeof stat === 'string') {
              const parsed = parseStatsFromItems([stat]);
              if (parsed[0]) return { value: parsed[0].value, label: parsed[0].label, icon: parsed[0].icon };
              return { value: String(idx + 1), label: cleanListItem(stat), icon: FALLBACK_ICONS[idx % FALLBACK_ICONS.length] };
            }

            const obj = (stat ?? {}) as Record<string, any>;
            const value =
              typeof obj.value === 'string'
                ? obj.value.trim()
                : typeof obj.value === 'number'
                  ? String(obj.value)
                  : '';
            const label = typeof obj.label === 'string' && obj.label.trim() ? obj.label.trim() : `Metric ${idx + 1}`;
            const icon = typeof obj.icon === 'string' && obj.icon.trim() ? obj.icon.trim() : FALLBACK_ICONS[idx % FALLBACK_ICONS.length];
            const description = typeof obj.description === 'string' && obj.description.trim() ? obj.description.trim() : undefined;

            return { value: value || String(idx + 1), label, icon, ...(description ? { description } : {}) };
          });
        }
      }
    }

    if (slide.componentId === 'pricing') {
      if (Array.isArray(props.plans)) {
        props.plans = (props.plans as any[]).map((p, idx) => {
          const name = typeof p?.name === 'string' && p.name.trim() ? p.name.trim() : `Plan ${idx + 1}`;
          const features = toStringArray(p?.features) ?? defaultFeaturesForPlanName(name, idx, (props.plans as any[]).length);

          return {
            ...p,
            name,
            price: typeof p?.price === 'string' && p.price.trim() ? p.price.trim() : 'Custom',
            period: normalizePeriod(typeof p?.period === 'string' ? p.period : undefined),
            features,
            highlighted: typeof p?.highlighted === 'boolean' ? p.highlighted : idx === 1,
            cta: typeof p?.cta === 'string' && p.cta.trim() ? p.cta.trim() : `Choose ${name}`,
          };
        });
      }
    }

    if (!hasRequiredProps(slide.componentId, props)) {
      fallbackSlideToCard(slide);
    }
  }
}

function ensureComponentVariety(presentationData: ComponentPresentationData) {
  const slides = presentationData.slides;

  // Convert ALL bullet_list slides (except maybe 1) to rich components
  const bulletIndices = slides
    .map((s, idx) => (s.componentId === 'bullet_list' ? idx : -1))
    .filter((idx) => idx >= 0)
    .filter((idx) => idx !== 0 && idx !== slides.length - 1);

  // Keep maximum 1 bullet_list, convert the rest
  if (bulletIndices.length > 1) {
    for (const idx of bulletIndices.slice(1)) {
      coerceBulletListToRichComponent(slides[idx]);
    }
  }

  // Convert ALL card slides to rich components
  for (let i = 1; i < slides.length - 1; i++) {
    const slide = slides[i];
    if (slide.componentId !== 'card') continue;

    const content = typeof (slide.props as any)?.content === 'string' ? (slide.props as any).content : '';
    const listItems = toStringArray(content);

    if (listItems && listItems.length >= 3) {
      slide.componentId = 'feature';
      slide.props = {
        title: (slide.props as any)?.title || 'Highlights',
        subtitle: (slide.props as any)?.subtitle,
        features: listItems.slice(0, 6).map((item, idx) => {
          const { title, description } = splitItemToTitleAndDescription(item);
          return { title, description, icon: FALLBACK_ICONS[idx % FALLBACK_ICONS.length] };
        }),
        layout: 'list',
      };
    }
  }

  // Check component diversity
  const uniqueComponents = new Set(slides.map((s) => s.componentId));
  const componentCounts = slides.map(s => s.componentId);
  
  console.log('Component variety check:', {
    totalSlides: slides.length,
    uniqueComponents: uniqueComponents.size,
    componentBreakdown: Array.from(uniqueComponents).map(id => ({
      id,
      count: componentCounts.filter(c => c === id).length
    }))
  });

  if (uniqueComponents.size < 6) {
    console.warn(`LOW COMPONENT DIVERSITY: Only ${uniqueComponents.size} unique components used. Target is 8+.`);
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
            content: `You are a world-class presentation designer (like Canva/Gamma.app) creating component-based presentations. You have access to 27+ specialized UI components.

CRITICAL RULES (NO EXCEPTIONS):
1. Output ONLY valid JSON - no markdown, no explanations, no code fences
2. NEVER use "bullet_list" unless absolutely necessary (max 1 time)
3. ALWAYS use specialized components: feature, stats, process, timeline, grid, chart, comparison, etc.
4. MUST use at least 8 DISTINCT component types per presentation
5. Every slide must use the MOST APPROPRIATE specialized component for its content

You are an EXPERT at:
- Intelligently mapping content to the perfect specialized component
- Creating visually stunning, diverse presentations
- Using rich components (feature, stats, process, grid) instead of plain lists
- Writing compelling, concise copy with proper structure
- Maximizing component variety and visual impact

REMEMBER: Your presentations use BEAUTIFUL visual components, NOT plain text or bullet lists!`,
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

      // CRITICAL VALIDATION: Check if this looks like raw text vs component JSON
      if (isLikelyRawText(cleanedContent)) {
        throw new Error("AI generated raw text instead of component-based JSON. This violates the mandatory component requirements.");
      }

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
          console.warn(`Unknown componentId "${slide.componentId}" - falling back to card slide.`);
          fallbackSlideToCard(slide);
        }
      }

      // Apply transformations
      coercePricingSlides(presentationData);
      sanitizeComponentSlides(presentationData);
      ensureComponentVariety(presentationData);
      sanitizeComponentSlides(presentationData);

      // Validate component diversity BEFORE accepting
      const componentIds = presentationData.slides.map(s => s.componentId);
      const uniqueComponents = new Set(componentIds);
      const bulletListCount = componentIds.filter(id => id === 'bullet_list').length;
      
      console.log('Generated component presentation:', {
        title: presentationData.title,
        slideCount: presentationData.slides.length,
        uniqueComponents: uniqueComponents.size,
        bulletListCount,
        components: componentIds,
      });

      // Enforce diversity requirements
      if (uniqueComponents.size < 6) {
        throw new Error(
          `Insufficient component diversity: Only ${uniqueComponents.size} unique components used (minimum 6 required). ` +
          `Components: ${Array.from(uniqueComponents).join(', ')}`
        );
      }

      if (bulletListCount > 2) {
        throw new Error(
          `Too many bullet_list slides: ${bulletListCount} used (maximum 2 allowed). ` +
          `Use specialized components like feature, stats, process, grid instead.`
        );
      }

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

  // All AI attempts failed, use fallback generator
  console.warn('All AI generation attempts failed, using fallback presentation generator');
  
  try {
    const fallbackPresentation = generateFallbackPresentation(prompt, theme);
    console.log('Generated fallback presentation:', {
      title: fallbackPresentation.title,
      slideCount: fallbackPresentation.slides.length,
      components: fallbackPresentation.slides.map(s => s.componentId),
    });
    return fallbackPresentation;
  } catch (fallbackError) {
    console.error('Fallback generation also failed:', fallbackError);
    throw new Error(
      `Failed to generate component presentation after AI attempts and fallback: ${lastError?.message || fallbackError?.message || 'Unknown error'}`
    );
  }
}

/**
 * Fallback component-based presentation generator
 * Creates a high-quality presentation when AI fails
 */
function generateFallbackPresentation(
  prompt: string,
  theme: GenerateComponentPresentationOptions['theme']
): ComponentPresentationData {
  const predictedComponents = predictBestComponents(prompt);
  const title = prompt.length > 50 ? prompt.substring(0, 50) + "..." : prompt;
  
  const slides: ComponentPresentationData['slides'] = [];
  
  // Hero slide
  slides.push({
    id: 'slide-1',
    componentId: 'hero',
    props: {
      title: title,
      subtitle: 'Professional Presentation',
      description: 'Comprehensive analysis and insights',
      cta: { text: 'Get Started', secondary: 'Learn More' },
      icon: '🚀'
    }
  });
  
  // Stats slide (high priority based on user's issue)
  if (predictedComponents.includes('stats')) {
    slides.push({
      id: 'slide-2',
      componentId: 'stats',
      props: {
        title: 'Key Performance Indicators',
        stats: [
          { value: '95%', label: 'Success Rate', icon: '📊', revealText: 'Based on comprehensive data analysis' },
          { value: '3x', label: 'Performance Boost', icon: '⚡', revealText: 'Compared to baseline metrics' },
          { value: '24/7', label: 'Availability', icon: '🕒', revealText: 'Round-the-clock monitoring' }
        ],
        layout: 'horizontal'
      }
    });
  }
  
  // Timeline slide (based on user's specific dates)
  if (predictedComponents.includes('timeline') || prompt.toLowerCase().includes('timeline')) {
    slides.push({
      id: 'slide-3',
      componentId: 'timeline',
      props: {
        title: 'Implementation Timeline',
        items: [
          {
            date: '2014-01-05',
            title: 'Project Initiation',
            description: 'Kick-off and team assembly',
            icon: '🎯',
            subTasks: ['Stakeholder alignment', 'Resource allocation', 'Risk assessment']
          },
          {
            date: '2014-01-19',
            title: 'Phase 1 Completion',
            description: 'Core functionality delivery',
            icon: '✅',
            subTasks: ['Module development', 'Initial testing', 'User feedback collection']
          },
          {
            date: '2014-02-02',
            title: 'Integration Phase',
            description: 'System integration and optimization',
            icon: '🔧',
            subTasks: ['API development', 'Data migration', 'Performance tuning']
          },
          {
            date: '2014-02-16',
            title: 'Final Deployment',
            description: 'Production release and monitoring',
            icon: '🚀',
            subTasks: ['Go-live preparation', 'Monitoring setup', 'Documentation finalization']
          }
        ],
        orientation: 'vertical'
      }
    });
  }
  
  // Feature slide
  if (predictedComponents.includes('feature')) {
    slides.push({
      id: 'slide-4',
      componentId: 'feature',
      props: {
        title: 'Core Capabilities',
        features: [
          { title: 'Advanced Analytics', description: 'Real-time data processing and insights', icon: '📈' },
          { title: 'Seamless Integration', description: 'Easy setup and configuration', icon: '🔗' },
          { title: 'Scalable Architecture', description: 'Grows with your business needs', icon: '📊' }
        ],
        layout: 'grid'
      }
    });
  }
  
  // Process slide
  if (predictedComponents.includes('process')) {
    slides.push({
      id: 'slide-5',
      componentId: 'process',
      props: {
        title: 'Implementation Process',
        steps: [
          { title: 'Analysis', description: 'Comprehensive requirement gathering', icon: '1️⃣' },
          { title: 'Development', description: 'Agile development with continuous testing', icon: '2️⃣' },
          { title: 'Deployment', description: 'Staged rollout with monitoring', icon: '3️⃣' },
          { title: 'Optimization', description: 'Continuous improvement and scaling', icon: '4️⃣' }
        ],
        layout: 'horizontal'
      }
    });
  }
  
  // Comparison slide
  if (predictedComponents.includes('comparison')) {
    slides.push({
      id: 'slide-6',
      componentId: 'comparison',
      props: {
        title: 'Solution Comparison',
        before: {
          title: 'Traditional Approach',
          points: ['Manual processes', 'Limited scalability', 'Higher costs', 'Slower deployment']
        },
        after: {
          title: 'Our Solution',
          points: ['Automated workflows', 'Infinite scalability', 'Cost-effective', 'Rapid deployment']
        }
      }
    });
  }
  
  // Grid slide
  if (predictedComponents.includes('grid')) {
    slides.push({
      id: 'slide-7',
      componentId: 'grid',
      props: {
        title: 'Key Benefits',
        items: [
          { title: 'Efficiency', description: 'Streamlined operations', icon: '⚡' },
          { title: 'Reliability', description: '99.9% uptime guarantee', icon: '🛡️' },
          { title: 'Innovation', description: 'Cutting-edge technology', icon: '💡' },
          { title: 'Support', description: '24/7 expert assistance', icon: '🤝' }
        ],
        columns: 2
      }
    });
  }
  
  // Pricing slide (based on user's specific pricing)
  if (predictedComponents.includes('pricing') || prompt.toLowerCase().includes('pricing')) {
    slides.push({
      id: 'slide-8',
      componentId: 'pricing',
      props: {
        title: 'Pricing Tiers',
        plans: [
          {
            name: 'Basic',
            price: '$99',
            period: 'month',
            features: ['Core features', 'Standard support', 'Basic analytics', 'Email assistance'],
            highlighted: false,
            cta: 'Choose Basic'
          },
          {
            name: 'Premium',
            price: '$299',
            period: 'month',
            features: ['All Basic features', 'Priority support', 'Advanced analytics', 'Custom integrations'],
            highlighted: true,
            cta: 'Choose Premium'
          },
          {
            name: 'Enterprise',
            price: 'Custom',
            period: 'month',
            features: ['All Premium features', 'Dedicated support', 'Custom development', 'SLA guarantee'],
            highlighted: false,
            cta: 'Contact Sales'
          }
        ]
      }
    });
  }
  
  // Two-column slide
  slides.push({
    id: 'slide-9',
    componentId: 'two_column',
    props: {
      title: 'Solution Overview',
      left: {
        title: 'Technical Excellence',
        content: 'Built with modern architecture and best practices for maximum performance and reliability.',
        icon: '⚙️'
      },
      right: {
        title: 'Business Impact',
        content: 'Delivers measurable results with improved efficiency and reduced operational costs.',
        icon: '📈'
      }
    }
  });
  
  // CTA slide
  slides.push({
    id: 'slide-10',
    componentId: 'cta',
    props: {
      title: 'Get Started Today',
      subtitle: 'Transform your business with our solution',
      description: 'Join thousands of satisfied customers who have already experienced the benefits.',
      primaryCTA: 'Start Free Trial',
      secondaryCTA: 'Schedule Demo',
      icon: '🚀'
    }
  });
  
  // End slide
  slides.push({
    id: 'slide-11',
    componentId: 'end',
    props: {
      title: 'Thank You',
      subtitle: 'Questions & Discussion',
      description: 'We appreciate your time and look forward to partnering with you.',
      icon: '🙏'
    }
  });
  
  return {
    title: title,
    subtitle: 'Professional Presentation',
    theme: theme.style,
    slides
  };
}
