# Component-Based Presentation System

## Overview

Stanzify now features a powerful three-layer architecture for creating beautiful, reusable presentations using AI-selected components.

## Architecture

### 1. Component Layer (`src/components/slides/`)

**27+ Reusable UI Components** organized by category:

#### Hero Components
- `HeroSlide` - Full-screen hero with title, subtitle, CTA, and icon

#### Layout Components
- `TwoColumnSlide` - Split content with customizable ratios (50-50, 60-40, etc.)
- `ThreeColumnSlide` - Three equal columns with icons/images
- `GridSlide` - Flexible grid layout (2-4 columns) with card/minimal/bordered styles

#### Content Components
- `CardSlide` - Centered card with title, content, and image positioning
- `BulletListSlide` - Simple bullet or numbered lists
- `SectionSlide` - Section divider with large title and optional icon/number

#### Data Components
- `StatsSlide` - Showcase KPIs and metrics (grid/horizontal/vertical layouts)
- `TableSlide` - Structured data tables with highlighting options
- `PricingSlide` - Pricing tiers with features and CTA buttons

#### Visualization Components
- `TimelineSlide` - Chronological events (horizontal/vertical)
- `ProcessSlide` - Step-by-step workflows (horizontal/vertical/circular)
- `RoadmapSlide` - Product/project roadmap with phases and status

#### Comparison Components
- `ComparisonSlide` - Side-by-side feature comparison tables
- `BeforeAfterSlide` - Transformation or problem/solution showcase

#### Interactive Components
- `QuizSlide` - Interactive quiz with instant feedback
- `AccordionSlide` - Expandable/collapsible sections
- `TabsSlide` - Tabbed content organization
- `FlashcardSlide` - Flippable learning cards

#### Media Components
- `ImageGallerySlide` - Multiple images (grid/masonry layouts)
- `VideoSlide` - YouTube, Vimeo, or direct video embeds
- `CodeDemoSlide` - Code with syntax highlighting and output

#### Special Components
- `QuoteSlide` - Impactful quotes and testimonials
- `FeatureSlide` - Product features showcase (grid/list layouts)
- `TeamSlide` - Team member profiles
- `CTASlide` - Strong call-to-action with features
- `EndSlide` - Closing slide with contact info and QR code

### 2. Rules Layer (AI Selection Engine)

**File:** `src/services/componentPresentationService.ts`

The AI analyzes user prompts and intelligently selects the best component for each slide:

```typescript
{
  "title": "Presentation Title",
  "theme": "modern",
  "slides": [
    {
      "id": "slide-1",
      "componentId": "hero",
      "props": {
        "title": "Welcome",
        "subtitle": "To the future",
        "cta": { "text": "Get Started" }
      }
    },
    // ... more slides
  ]
}
```

**Component Selection Rules:**
- `hero` → Opening/cover slides
- `section` → Section dividers
- `bullet_list` → Key points, agendas
- `stats` → Metrics, KPIs, numbers
- `timeline` → Chronological events
- `process` → Step-by-step workflows
- `comparison` → Side-by-side options
- `feature` → Product capabilities
- `pricing` → Pricing tiers
- `team` → Team introductions
- `cta` → Action prompts
- `quiz` → Engagement, polls
- `end` → Closing/thank you

### 3. Asset/Theme Layer

**Files:** `src/themes/*.css`

Six pre-built design themes:

#### Corporate
- Clean, professional, business-focused
- Sharp borders, structured layouts
- Sans-serif fonts, uppercase buttons

#### Modern
- Contemporary with gradients
- Smooth animations, elevated shadows
- Gradient text effects

#### Minimal
- Clean, lots of whitespace
- Subtle shadows, simple borders
- Light borders, outline buttons

#### Dark
- Sleek dark backgrounds
- High contrast, glowing effects
- Neon accent highlights

#### Creative
- Bold, visually striking
- Italic headings, gradient effects
- Playful button animations

#### Academic
- Scholarly, information-dense
- Serif fonts, left-aligned quotes
- Traditional, structured

## Usage

### In ViewerPage

Toggle between presentation modes:

```tsx
<Button onClick={() => setPresentationMode('component')}>
  Components
</Button>
<Button onClick={() => setPresentationMode('slidev')}>
  Slidev
</Button>
```

### Component Viewer

```tsx
<ComponentSlideViewer
  presentationData={componentData}
  palette={palette}
  onNewPresentation={handleBack}
/>
```

### Creating New Components

1. Create component file in `src/components/slides/`
2. Extend `BaseSlide` for consistent behavior
3. Accept `SlideComponentProps` for theming
4. Register in `registry.ts` with metadata
5. Export from `index.ts`

Example:

```tsx
import { BaseSlide, BaseSlideProps } from './BaseSlide';

export interface MySlideProps extends Omit<BaseSlideProps, 'children'> {
  title: string;
  content: string;
}

export function MySlide({ title, content, ...baseProps }: MySlideProps) {
  return (
    <BaseSlide {...baseProps}>
      <h1 style={{ color: baseProps.palette?.primary }}>{title}</h1>
      <p>{content}</p>
    </BaseSlide>
  );
}
```

## Component Registry

Access component metadata and search:

```typescript
import { 
  getComponent, 
  getComponentMetadata, 
  searchComponents,
  getAllComponents 
} from '@/components/slides/registry';

// Get component by ID
const HeroComponent = getComponent('hero');

// Search components
const results = searchComponents('timeline');

// Get all components
const all = getAllComponents();
```

## Theme System

Themes use CSS variables:

```css
:root[data-theme="modern"] {
  --slide-font-heading: 'Space Grotesk', sans-serif;
  --slide-border-radius: 1rem;
  --slide-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}
```

Components automatically apply theme styles via:

```tsx
<div data-theme={theme}>
  <Component palette={palette} theme={theme} />
</div>
```

## AI Prompt Engineering

The component presentation service uses a comprehensive prompt that:

1. Lists all available components with metadata
2. Defines component selection rules
3. Specifies JSON output format
4. Provides content guidelines
5. Ensures proper narrative flow

## Benefits

✅ **Reusability** - 27+ components cover all presentation needs
✅ **Consistency** - Unified theming across all slides
✅ **Scalability** - Easy to add new components
✅ **AI-Powered** - Smart component selection
✅ **Type Safety** - Full TypeScript support
✅ **Themable** - Six design themes + easy customization
✅ **Interactive** - Quiz, accordion, tabs, flashcards
✅ **Beautiful** - Professional animations and transitions

## Future Enhancements

- [ ] Component customization UI
- [ ] More theme options
- [ ] Component preview gallery
- [ ] Custom component builder
- [ ] Animation editor
- [ ] Export to PowerPoint/PDF
- [ ] Collaborative editing
- [ ] Component marketplace
