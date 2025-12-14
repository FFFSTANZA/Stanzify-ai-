import type { ComponentMetadata } from '@/types/componentSlide';

import { HeroSlide } from './HeroSlide';
import { TwoColumnSlide } from './TwoColumnSlide';
import { ThreeColumnSlide } from './ThreeColumnSlide';
import { GridSlide } from './GridSlide';
import { CardSlide } from './CardSlide';
import { StatsSlide } from './StatsSlide';
import { TimelineSlide } from './TimelineSlide';
import { ProcessSlide } from './ProcessSlide';
import { ComparisonSlide } from './ComparisonSlide';
import { QuizSlide } from './QuizSlide';
import { AccordionSlide } from './AccordionSlide';
import { TabsSlide } from './TabsSlide';
import { FlashcardSlide } from './FlashcardSlide';
import { QuoteSlide } from './QuoteSlide';
import { ImageGallerySlide } from './ImageGallerySlide';
import { FeatureSlide } from './FeatureSlide';
import { TeamSlide } from './TeamSlide';
import { CTASlide } from './CTASlide';
import { PricingSlide } from './PricingSlide';
import { RoadmapSlide } from './RoadmapSlide';
import { BeforeAfterSlide } from './BeforeAfterSlide';
import { VideoSlide } from './VideoSlide';
import { CodeDemoSlide } from './CodeDemoSlide';
import { BulletListSlide } from './BulletListSlide';
import { SectionSlide } from './SectionSlide';
import { TableSlide } from './TableSlide';
import { ChartSlide } from './ChartSlide';
import { EndSlide } from './EndSlide';

export const COMPONENT_REGISTRY: Record<string, ComponentMetadata> = {
  hero: {
    id: 'hero',
    name: 'Hero Slide',
    category: 'hero',
    description: 'Full-screen hero slide with title, subtitle, and call-to-action',
    useCases: ['Opening slides', 'Product launches', 'Big announcements'],
    tags: ['hero', 'intro', 'cover', 'opening'],
    propsSchema: {
      title: { type: 'string', required: true, description: 'Main headline' },
      subtitle: { type: 'string', description: 'Subheadline' },
      description: { type: 'string', description: 'Additional description' },
      cta: { type: 'object', description: 'Call-to-action buttons' },
      icon: { type: 'string', description: 'Emoji or icon' },
    },
  },
  
  two_column: {
    id: 'two_column',
    name: 'Two Column Layout',
    category: 'layout',
    description: 'Split content into two columns with customizable ratio',
    useCases: ['Comparison', 'Before/after', 'Content with images'],
    tags: ['layout', 'two-column', 'split', 'comparison'],
    propsSchema: {
      title: { type: 'string', description: 'Slide title' },
      leftContent: { type: 'string', required: true, description: 'Left column content (markdown)' },
      rightContent: { type: 'string', required: true, description: 'Right column content (markdown)' },
      split: { type: 'enum', enumValues: ['50-50', '60-40', '40-60', '70-30', '30-70'], default: '50-50' },
    },
  },
  
  three_column: {
    id: 'three_column',
    name: 'Three Column Layout',
    category: 'layout',
    description: 'Display content in three equal columns',
    useCases: ['Feature comparison', 'Process steps', 'Benefits'],
    tags: ['layout', 'three-column', 'grid'],
    propsSchema: {
      title: { type: 'string', description: 'Slide title' },
      columns: { type: 'array', required: true, description: 'Array of column data' },
    },
  },
  
  grid: {
    id: 'grid',
    name: 'Grid Layout',
    category: 'layout',
    description: 'Flexible grid layout for cards or items',
    useCases: ['Feature showcase', 'Product catalog', 'Info cards'],
    tags: ['layout', 'grid', 'cards', 'responsive'],
    propsSchema: {
      title: { type: 'string', description: 'Slide title' },
      items: { type: 'array', required: true, description: 'Grid items' },
      columns: { type: 'enum', enumValues: ['2', '3', '4'], default: '3' },
      itemStyle: { type: 'enum', enumValues: ['card', 'minimal', 'bordered'], default: 'card' },
    },
  },
  
  card: {
    id: 'card',
    name: 'Card Slide',
    category: 'content',
    description: 'Centered card with title, content, and optional image',
    useCases: ['Key message', 'Highlight', 'Focus content'],
    tags: ['content', 'card', 'highlight', 'focus'],
    propsSchema: {
      title: { type: 'string', required: true, description: 'Card title' },
      content: { type: 'string', required: true, description: 'Card content (markdown)' },
      image: { type: 'string', description: 'Image URL' },
      imagePosition: { type: 'enum', enumValues: ['top', 'left', 'right', 'background'], default: 'top' },
    },
  },
  
  stats: {
    id: 'stats',
    name: 'Stats Display',
    category: 'data',
    description: 'Showcase key metrics and statistics',
    useCases: ['KPIs', 'Achievements', 'Metrics', 'Results'],
    tags: ['data', 'stats', 'metrics', 'numbers', 'kpi'],
    propsSchema: {
      title: { type: 'string', description: 'Slide title' },
      stats: { type: 'array', required: true, description: 'Array of stat objects' },
      layout: { type: 'enum', enumValues: ['grid', 'horizontal', 'vertical'], default: 'grid' },
    },
  },
  
  timeline: {
    id: 'timeline',
    name: 'Timeline',
    category: 'visualization',
    description: 'Visual timeline for events or milestones',
    useCases: ['Company history', 'Project timeline', 'Milestones'],
    tags: ['timeline', 'history', 'events', 'chronological'],
    propsSchema: {
      title: { type: 'string', description: 'Timeline title' },
      items: { type: 'array', required: true, description: 'Timeline events' },
      orientation: { type: 'enum', enumValues: ['horizontal', 'vertical'], default: 'horizontal' },
    },
  },
  
  process: {
    id: 'process',
    name: 'Process Steps',
    category: 'visualization',
    description: 'Step-by-step process visualization',
    useCases: ['How it works', 'Methodology', 'Workflow'],
    tags: ['process', 'steps', 'workflow', 'how-to'],
    propsSchema: {
      title: { type: 'string', description: 'Process title' },
      steps: { type: 'array', required: true, description: 'Process steps' },
      layout: { type: 'enum', enumValues: ['horizontal', 'vertical', 'circular'], default: 'horizontal' },
    },
  },
  
  comparison: {
    id: 'comparison',
    name: 'Comparison Table',
    category: 'data',
    description: 'Side-by-side comparison of two options',
    useCases: ['Product comparison', 'Competitive analysis', 'Options'],
    tags: ['comparison', 'vs', 'table', 'options'],
    propsSchema: {
      title: { type: 'string', description: 'Comparison title' },
      leftTitle: { type: 'string', required: true, description: 'Left option name' },
      rightTitle: { type: 'string', required: true, description: 'Right option name' },
      items: { type: 'array', required: true, description: 'Comparison items' },
      highlightBest: { type: 'enum', enumValues: ['left', 'right', 'none'], default: 'none' },
    },
  },
  
  quiz: {
    id: 'quiz',
    name: 'Quiz/Poll',
    category: 'interactive',
    description: 'Interactive quiz or poll slide',
    useCases: ['Engagement', 'Testing knowledge', 'Polls'],
    tags: ['quiz', 'interactive', 'poll', 'questions'],
    propsSchema: {
      question: { type: 'string', required: true, description: 'Quiz question' },
      options: { type: 'array', required: true, description: 'Answer options' },
      multipleChoice: { type: 'boolean', default: false, description: 'Allow multiple selections' },
    },
  },
  
  accordion: {
    id: 'accordion',
    name: 'Accordion',
    category: 'interactive',
    description: 'Expandable accordion sections',
    useCases: ['FAQ', 'Detailed content', 'Progressive disclosure'],
    tags: ['accordion', 'collapsible', 'faq', 'expandable'],
    propsSchema: {
      title: { type: 'string', description: 'Slide title' },
      items: { type: 'array', required: true, description: 'Accordion items' },
      allowMultiple: { type: 'boolean', default: false, description: 'Allow multiple open sections' },
    },
  },
  
  tabs: {
    id: 'tabs',
    name: 'Tabs',
    category: 'interactive',
    description: 'Tabbed content sections',
    useCases: ['Organizing content', 'Category sections', 'Multiple topics'],
    tags: ['tabs', 'navigation', 'sections'],
    propsSchema: {
      title: { type: 'string', description: 'Slide title' },
      tabs: { type: 'array', required: true, description: 'Tab sections' },
    },
  },
  
  flashcard: {
    id: 'flashcard',
    name: 'Flashcards',
    category: 'interactive',
    description: 'Flippable flashcards for learning',
    useCases: ['Education', 'Training', 'Key concepts'],
    tags: ['flashcard', 'learning', 'flip', 'education'],
    propsSchema: {
      title: { type: 'string', description: 'Slide title' },
      cards: { type: 'array', required: true, description: 'Flashcard data' },
      currentCard: { type: 'number', default: 0, description: 'Starting card index' },
    },
  },
  
  quote: {
    id: 'quote',
    name: 'Quote',
    category: 'special',
    description: 'Display impactful quotes or testimonials',
    useCases: ['Testimonials', 'Inspiration', 'Social proof'],
    tags: ['quote', 'testimonial', 'citation'],
    propsSchema: {
      quote: { type: 'string', required: true, description: 'Quote text' },
      author: { type: 'string', required: true, description: 'Quote author' },
      role: { type: 'string', description: 'Author role/title' },
      image: { type: 'string', description: 'Author image URL' },
      large: { type: 'boolean', default: false, description: 'Use large text' },
    },
  },
  
  image_gallery: {
    id: 'image_gallery',
    name: 'Image Gallery',
    category: 'media',
    description: 'Display multiple images in a gallery',
    useCases: ['Portfolio', 'Product photos', 'Gallery'],
    tags: ['gallery', 'images', 'photos', 'portfolio'],
    propsSchema: {
      title: { type: 'string', description: 'Gallery title' },
      images: { type: 'array', required: true, description: 'Array of images' },
      layout: { type: 'enum', enumValues: ['grid', 'masonry', 'carousel'], default: 'grid' },
    },
  },
  
  feature: {
    id: 'feature',
    name: 'Feature Showcase',
    category: 'content',
    description: 'Highlight product or service features',
    useCases: ['Product features', 'Benefits', 'Capabilities'],
    tags: ['features', 'benefits', 'showcase'],
    propsSchema: {
      title: { type: 'string', description: 'Feature section title' },
      subtitle: { type: 'string', description: 'Section subtitle' },
      features: { type: 'array', required: true, description: 'Feature items' },
      layout: { type: 'enum', enumValues: ['grid', 'list'], default: 'grid' },
    },
  },
  
  team: {
    id: 'team',
    name: 'Team Members',
    category: 'special',
    description: 'Showcase team members',
    useCases: ['About us', 'Team intro', 'Leadership'],
    tags: ['team', 'people', 'members', 'about'],
    propsSchema: {
      title: { type: 'string', description: 'Team section title' },
      members: { type: 'array', required: true, description: 'Team member data' },
    },
  },
  
  cta: {
    id: 'cta',
    name: 'Call to Action',
    category: 'special',
    description: 'Strong call-to-action slide',
    useCases: ['Action prompt', 'Sign up', 'Get started'],
    tags: ['cta', 'action', 'conversion', 'signup'],
    propsSchema: {
      title: { type: 'string', required: true, description: 'CTA headline' },
      subtitle: { type: 'string', description: 'Supporting text' },
      description: { type: 'string', description: 'Additional description' },
      primaryButton: { type: 'object', required: true, description: 'Primary button' },
      secondaryButton: { type: 'object', description: 'Secondary button' },
      features: { type: 'array', description: 'Feature highlights' },
    },
  },
  
  pricing: {
    id: 'pricing',
    name: 'Pricing Plans',
    category: 'data',
    description: 'Display pricing tiers and plans',
    useCases: ['Pricing', 'Plans', 'Packages'],
    tags: ['pricing', 'plans', 'packages', 'cost'],
    propsSchema: {
      title: { type: 'string', description: 'Pricing title' },
      plans: { type: 'array', required: true, description: 'Pricing plans' },
    },
  },
  
  roadmap: {
    id: 'roadmap',
    name: 'Roadmap',
    category: 'visualization',
    description: 'Product or project roadmap',
    useCases: ['Product roadmap', 'Planning', 'Future plans'],
    tags: ['roadmap', 'planning', 'phases', 'timeline'],
    propsSchema: {
      title: { type: 'string', description: 'Roadmap title' },
      phases: { type: 'array', required: true, description: 'Roadmap phases' },
    },
  },
  
  before_after: {
    id: 'before_after',
    name: 'Before/After',
    category: 'content',
    description: 'Show transformation or comparison',
    useCases: ['Transformation', 'Problem/solution', 'Impact'],
    tags: ['before-after', 'transformation', 'change', 'impact'],
    propsSchema: {
      title: { type: 'string', description: 'Slide title' },
      before: { type: 'object', required: true, description: 'Before state' },
      after: { type: 'object', required: true, description: 'After state' },
    },
  },
  
  video: {
    id: 'video',
    name: 'Video Embed',
    category: 'media',
    description: 'Embed video from YouTube, Vimeo, or direct link',
    useCases: ['Product demo', 'Tutorial', 'Video content'],
    tags: ['video', 'media', 'embed', 'youtube', 'vimeo'],
    propsSchema: {
      title: { type: 'string', description: 'Video title' },
      description: { type: 'string', description: 'Video description' },
      videoUrl: { type: 'string', required: true, description: 'Video URL' },
      autoPlay: { type: 'boolean', default: false, description: 'Auto-play video' },
    },
  },
  
  code_demo: {
    id: 'code_demo',
    name: 'Code Demo',
    category: 'special',
    description: 'Display code with syntax highlighting',
    useCases: ['Technical presentations', 'Tutorials', 'Code examples'],
    tags: ['code', 'programming', 'syntax', 'demo'],
    propsSchema: {
      title: { type: 'string', description: 'Code demo title' },
      description: { type: 'string', description: 'Demo description' },
      code: { type: 'string', required: true, description: 'Code snippet' },
      language: { type: 'string', required: true, description: 'Programming language' },
      output: { type: 'string', description: 'Code output' },
      highlightLines: { type: 'array', description: 'Line numbers to highlight' },
    },
  },
  
  bullet_list: {
    id: 'bullet_list',
    name: 'Bullet List',
    category: 'content',
    description: 'Simple bullet point list',
    useCases: ['Key points', 'Agenda', 'Summary'],
    tags: ['list', 'bullets', 'points', 'content'],
    propsSchema: {
      title: { type: 'string', required: true, description: 'List title' },
      subtitle: { type: 'string', description: 'List subtitle' },
      items: { type: 'array', required: true, description: 'List items' },
      numbered: { type: 'boolean', default: false, description: 'Use numbers instead of bullets' },
      large: { type: 'boolean', default: false, description: 'Use large text' },
    },
  },
  
  section: {
    id: 'section',
    name: 'Section Divider',
    category: 'special',
    description: 'Section break or chapter divider',
    useCases: ['Section break', 'Chapter divider', 'Transition'],
    tags: ['section', 'divider', 'break', 'chapter'],
    propsSchema: {
      title: { type: 'string', required: true, description: 'Section title' },
      subtitle: { type: 'string', description: 'Section subtitle' },
      icon: { type: 'string', description: 'Section icon' },
      number: { type: 'number', description: 'Section number' },
    },
  },
  
  table: {
    id: 'table',
    name: 'Data Table',
    category: 'data',
    description: 'Display structured data in table format',
    useCases: ['Data presentation', 'Comparison', 'Results'],
    tags: ['table', 'data', 'grid', 'structured'],
    propsSchema: {
      title: { type: 'string', description: 'Table title' },
      headers: { type: 'array', required: true, description: 'Column headers' },
      rows: { type: 'array', required: true, description: 'Table rows' },
      highlightFirstColumn: { type: 'boolean', default: false },
      highlightFirstRow: { type: 'boolean', default: false },
    },
  },
  
  chart: {
    id: 'chart',
    name: 'Chart Visualization',
    category: 'data',
    description: 'Display data using charts (bar, line, pie, area)',
    useCases: ['Data trends', 'Statistics', 'Comparisons', 'Distributions'],
    tags: ['chart', 'graph', 'data', 'visualization', 'bar', 'pie', 'line'],
    propsSchema: {
      title: { type: 'string', description: 'Chart title' },
      chartType: { type: 'enum', enumValues: ['bar', 'line', 'pie', 'area', 'donut'], required: true, default: 'bar' },
      data: { type: 'array', required: true, description: 'Data points with name and value' },
      description: { type: 'string', description: 'Chart description' },
      xAxisLabel: { type: 'string', description: 'X-axis label' },
      yAxisLabel: { type: 'string', description: 'Y-axis label' },
    },
  },
  
  end: {
    id: 'end',
    name: 'End Slide',
    category: 'special',
    description: 'Closing slide with contact information',
    useCases: ['Thank you', 'Closing', 'Contact info'],
    tags: ['end', 'thank-you', 'contact', 'closing'],
    propsSchema: {
      title: { type: 'string', required: true, description: 'Closing message' },
      subtitle: { type: 'string', description: 'Additional message' },
      contactInfo: { type: 'object', description: 'Contact information' },
      qrCode: { type: 'string', description: 'QR code image URL' },
    },
  },
};

export const COMPONENT_MAP: Record<string, any> = {
  hero: HeroSlide,
  two_column: TwoColumnSlide,
  three_column: ThreeColumnSlide,
  grid: GridSlide,
  card: CardSlide,
  stats: StatsSlide,
  timeline: TimelineSlide,
  process: ProcessSlide,
  comparison: ComparisonSlide,
  quiz: QuizSlide,
  accordion: AccordionSlide,
  tabs: TabsSlide,
  flashcard: FlashcardSlide,
  quote: QuoteSlide,
  image_gallery: ImageGallerySlide,
  feature: FeatureSlide,
  team: TeamSlide,
  cta: CTASlide,
  pricing: PricingSlide,
  roadmap: RoadmapSlide,
  before_after: BeforeAfterSlide,
  video: VideoSlide,
  code_demo: CodeDemoSlide,
  bullet_list: BulletListSlide,
  section: SectionSlide,
  table: TableSlide,
  chart: ChartSlide,
  end: EndSlide,
};

export function getComponent(componentId: string) {
  return COMPONENT_MAP[componentId];
}

export function getComponentMetadata(componentId: string): ComponentMetadata | undefined {
  return COMPONENT_REGISTRY[componentId];
}

export function getAllComponents(): ComponentMetadata[] {
  return Object.values(COMPONENT_REGISTRY);
}

export function getComponentsByCategory(category: string): ComponentMetadata[] {
  return Object.values(COMPONENT_REGISTRY).filter(c => c.category === category);
}

export function searchComponents(query: string): ComponentMetadata[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(COMPONENT_REGISTRY).filter(c => 
    c.name.toLowerCase().includes(lowerQuery) ||
    c.description.toLowerCase().includes(lowerQuery) ||
    c.tags.some(tag => tag.includes(lowerQuery)) ||
    c.useCases.some(useCase => useCase.toLowerCase().includes(lowerQuery))
  );
}
