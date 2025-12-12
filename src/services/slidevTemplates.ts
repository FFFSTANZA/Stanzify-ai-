// Slidev Template Generator - Creates premium slidev presentations with advanced features
export interface SlidevTemplate {
  name: string;
  description: string;
  layouts: string[];
  colorSchemes: string[];
  features: string[];
  structure: SlideStructure[];
}

export interface SlideStructure {
  index: number;
  layout: string;
  title: string;
  content: string;
  background?: string;
  components?: string[];
  animations?: string[];
}

// Premium slidev templates that match Gamma/Canva quality
export const PREMIUM_SLIDEV_TEMPLATES: SlidevTemplate[] = [
  {
    name: "executive-dashboard",
    description: "Professional executive dashboard with data visualization and KPIs",
    layouts: ["cover", "two-cols", "image-right", "fact", "center", "end"],
    colorSchemes: ["corporate-blue", "modern-gray", "executive-navy"],
    features: ["mermaid-diagrams", "data-charts", "kpi-cards", "timeline", "comparison-tables"],
    structure: [
      {
        index: 1,
        layout: "cover",
        title: "Executive Dashboard",
        content: "# Company Performance Overview\n## Q4 2024 Results & Strategic Initiatives\n\n<div class=\"abs-br m-6 text-xl\">\n  <div>Powered by Stanzify AI</div>\n</div>",
        background: "corporate-gradient"
      },
      {
        index: 2,
        layout: "two-cols",
        title: "Key Performance Indicators",
        content: "# 📊 Q4 Highlights\n\n- Revenue: $2.4M (+23% YoY)\n- Customer Growth: +45%\n- Market Share: 15.2%\n- NPS Score: 72\n\n::right::\n\n<div class=\"mt-20\">\n\n\`\`\`mermaid\npie\n  \"North America\" : 45\n  \"Europe\" : 30\n  \"Asia Pacific\" : 25\n\`\`\`\n\n</div>"
      },
      {
        index: 3,
        layout: "image-right",
        title: "Strategic Growth Initiatives",
        content: "# 🚀 Growth Strategy\n\n- Market Expansion: EU & APAC\n- Product Innovation: AI Integration\n- Partnership Ecosystem\n- Customer Success Programs\n\n- **Target**: 50% growth in 2025\n- **Investment**: $5M in R&D\n- **Timeline**: 18 months",
        background: "growth-strategy"
      }
    ]
  },
  {
    name: "product-launch",
    description: "Dynamic product launch presentation with compelling storytelling",
    layouts: ["cover", "section", "two-cols", "image-left", "fact", "quote", "end"],
    colorSchemes: ["innovation-purple", "tech-blue", "startup-green"],
    features: ["product-showcase", "feature-comparison", "roadmap", "customer-testimonials", "pricing-tiers"],
    structure: [
      {
        index: 1,
        layout: "cover",
        title: "Product Launch",
        content: "# Next-Gen AI Platform\n## Revolutionizing Business Intelligence\n\n<div class=\"abs-br m-6 text-xl\">\n  <div>Launch Event 2024</div>\n</div>",
        background: "product-launch-gradient"
      },
      {
        index: 2,
        layout: "section",
        title: "The Problem",
        content: "# ❌ Current Challenges\n\n## Businesses struggle with:\n\n- Fragmented data sources\n- Manual reporting processes\n- Limited predictive insights\n- High operational costs"
      },
      {
        index: 3,
        layout: "two-cols",
        title: "Our Solution",
        content: "# ✅ Revolutionary Platform\n\n## Key Features:\n\n- **Unified Data Hub**: Single source of truth\n- **AI-Powered Analytics**: Predictive insights\n- **Real-time Dashboards**: Live monitoring\n- **Automated Reports**: Zero manual work\n\n::right::\n\n<div class=\"mt-16\">\n\n\`\`\`mermaid\ngraph LR\n    A[Data Sources] --> B[AI Platform]\n    B --> C[Insights]\n    C --> D[Actions]\n    style B fill:#8b5cf6\n\`\`\`\n\n</div>"
      }
    ]
  },
  {
    name: "academic-research",
    description: "Comprehensive academic research presentation with methodology and findings",
    layouts: ["cover", "content", "two-cols", "center", "image-right", "section", "end"],
    colorSchemes: ["academic-blue", "research-green", "scholar-gray"],
    features: ["methodology-flow", "data-visualization", "literature-review", "results-analysis", "future-work"],
    structure: [
      {
        index: 1,
        layout: "cover",
        title: "Research Presentation",
        content: "# Machine Learning in Healthcare\n## A Comprehensive Study on Diagnostic Accuracy\n\n<div class=\"abs-br m-6 text-xl\">\n  <div>Academic Conference 2024</div>\n</div>",
        background: "academic-gradient"
      },
      {
        index: 2,
        layout: "content",
        title: "Research Objectives",
        content: "# 🎯 Study Goals\n\n## Primary Objectives:\n\n1. Evaluate ML diagnostic accuracy\n2. Compare traditional vs AI methods\n3. Assess clinical implementation feasibility\n4. Identify optimization opportunities\n\n## Methodology: Retrospective analysis of 10,000 cases"
      },
      {
        index: 3,
        layout: "two-cols",
        title: "Key Findings",
        content: "# 📈 Results\n\n## Performance Metrics:\n\n- **Accuracy**: 94.2% (vs 87.1% traditional)\n- **Sensitivity**: 96.8%\n- **Specificity**: 91.5%\n- **Processing Time**: 0.3s average\n\n::right::\n\n<div class=\"mt-12\">\n\n## Statistical Significance\n\n- p-value < 0.001\n- 95% Confidence Interval\n- Effect size: Large (Cohen's d = 1.2)\n\n</div>"
      }
    ]
  }
];

// Template customization options
export interface TemplateCustomization {
  colorScheme: string;
  fontFamily: string;
  includeAnimations: boolean;
  includeSpeakerNotes: boolean;
  diagramStyle: 'default' | 'dark' | 'colorful';
  chartTheme: 'corporate' | 'academic' | 'creative';
}

// Generate a complete slidev presentation from template
export function generateSlidevFromTemplate(
  template: SlidevTemplate,
  customization: TemplateCustomization,
  userContent?: {
    title?: string;
    subtitle?: string;
    company?: string;
    date?: string;
    customSlides?: SlideStructure[];
  }
): string {
  let markdown = `---
layout: cover
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
class: text-center
fonts:
  sans: ${customization.fontFamily}
  serif: ${customization.fontFamily}
  mono: Fira Code
---

# ${userContent?.title || template.name.replace('-', ' ').toUpperCase()}
## ${userContent?.subtitle || template.description}

<div class="abs-br m-6 text-xl">
  <div>${userContent?.company || 'Powered by Stanzify AI'}</div>
</div>

---

`;

  // Add custom slides if provided
  const slidesToUse = userContent?.customSlides || template.structure;
  
  slidesToUse.forEach((slide, _index) => {
    const backgroundStyle = slide.background 
      ? `\nbackground: ${getBackgroundStyle(slide.background, customization.colorScheme)}`
      : '';
    
    markdown += `---
layout: ${slide.layout}${backgroundStyle}
class: ${getLayoutClass(slide.layout)}
---

`;

    // Process slide content with customization
    let processedContent = slide.content;
    
    if (customization.includeAnimations && slide.animations) {
      processedContent = addAnimations(processedContent, slide.animations);
    }
    
    if (customization.includeSpeakerNotes) {
      processedContent = addSpeakerNotes(processedContent, `Speaker notes for slide ${slide.index}: ${slide.title}`);
    }
    
    markdown += processedContent + "\n\n---\n\n";
  });

  return markdown;
}

// Helper functions
function getBackgroundStyle(backgroundName: string, _colorScheme: string): string {
  const backgrounds = {
    'corporate-gradient': 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    'product-launch-gradient': 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
    'academic-gradient': 'linear-gradient(135deg, #059669 0%, #0891b2 100%)',
    'growth-strategy': 'linear-gradient(135deg, #dc2626 0%, #f59e0b 100%)'
  };
  
  return backgrounds[backgroundName as keyof typeof backgrounds] || backgrounds['corporate-gradient'];
}

function getLayoutClass(layout: string): string {
  const layoutClasses = {
    'cover': 'text-center h-full flex items-center justify-center',
    'two-cols': 'grid grid-cols-2 gap-12 items-start',
    'image-right': 'grid grid-cols-2 gap-12 items-center',
    'image-left': 'grid grid-cols-2 gap-12 items-center',
    'center': 'text-center h-full flex flex-col items-center justify-center',
    'fact': 'text-center h-full flex flex-col items-center justify-center',
    'section': 'text-center h-full flex flex-col items-center justify-center',
    'end': 'text-center h-full flex flex-col items-center justify-center'
  };
  
  return layoutClasses[layout as keyof typeof layoutClasses] || '';
}

function addAnimations(content: string, animations: string[]): string {
  let animatedContent = content;
  
  animations.forEach((animation, _index) => {
    switch (animation) {
      case 'fade-in':
        animatedContent = animatedContent.replace(/(#{1,6}\s+.*)/g, `$1\n<v-after>\n`);
        break;
      case 'slide-up':
        animatedContent = animatedContent.replace(/(-\s+.*)/g, `<v-click>\n$1\n</v-click>\n`);
        break;
      case 'zoom-in':
        animatedContent = animatedContent.replace(/(```mermaid[\s\S]*?```)/g, `<v-click>\n$1\n</v-click>\n`);
        break;
    }
  });
  
  return animatedContent;
}

function addSpeakerNotes(content: string, notes: string): string {
  return `${content}

:::notes
${notes}
:::`;
}

// Template validation and optimization
export function validateTemplate(template: SlidevTemplate): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate structure
  if (!template.structure || template.structure.length === 0) {
    errors.push("Template must have a structure");
  }

  // Validate layouts
  template.structure.forEach((slide, index) => {
    if (!slide.layout) {
      errors.push(`Slide ${index + 1} is missing layout`);
    }
    if (!slide.title) {
      warnings.push(`Slide ${index + 1} is missing title`);
    }
    if (!slide.content) {
      errors.push(`Slide ${index + 1} is missing content`);
    }
  });

  // Check for layout diversity
  const uniqueLayouts = new Set(template.structure.map(s => s.layout));
  if (uniqueLayouts.size < 3) {
    warnings.push("Template should use at least 3 different layouts");
  }

  // Check for interactive elements
  const hasMermaid = template.features.includes('mermaid-diagrams');
  const hasCode = template.structure.some(s => s.content.includes('```'));
  const hasImages = template.structure.some(s => s.background || s.content.includes('!['));

  if (!hasMermaid && !hasCode && !hasImages) {
    warnings.push("Template should include interactive elements (diagrams, code, or images)");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// Optimize template for better performance
export function optimizeTemplate(template: SlidevTemplate): SlidevTemplate {
  const optimized = { ...template };

  // Ensure first slide is always cover
  if (optimized.structure[0]?.layout !== 'cover') {
    optimized.structure.unshift({
      index: 0,
      layout: 'cover',
      title: 'Presentation Title',
      content: '# Your Presentation Title\n## Subtitle or Description'
    });
  }

  // Ensure last slide is always end
  const lastSlide = optimized.structure[optimized.structure.length - 1];
  if (lastSlide && lastSlide.layout !== 'end') {
    optimized.structure.push({
      index: optimized.structure.length,
      layout: 'end',
      title: 'Thank You',
      content: '# Thank You\n## Questions?'
    });
  }

  // Add variety to layouts
  const layouts = ['cover', 'section', 'two-cols', 'image-right', 'center', 'fact', 'quote', 'end'];
  optimized.structure.forEach((slide, index) => {
    if (index > 0 && index < optimized.structure.length - 1) {
      // Cycle through different layouts for content slides
      slide.layout = layouts[index % (layouts.length - 2) + 1];
    }
  });

  return optimized;
}