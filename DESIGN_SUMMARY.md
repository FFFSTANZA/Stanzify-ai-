# Stanzify - Design System Summary

## 🎨 Design Philosophy

Stanzify follows a modern, clean aesthetic inspired by leading AI tools like ChatGPT and Gamma. The design emphasizes:

- **Minimalism**: Clean layouts with purposeful use of space
- **Clarity**: Clear visual hierarchy and intuitive navigation
- **Elegance**: Subtle animations and smooth transitions
- **Professionalism**: Premium feel with attention to detail

## 🌈 Color System

### Primary Colors
- **Blue**: `hsl(217 91% 60%)` - Main brand color, trust and technology
- **Purple**: `hsl(271 91% 65%)` - Accent color, creativity and innovation
- **Gradient**: Blue to Purple - Used for CTAs and highlights

### Neutral Colors
- **Background**: White / Slate-950 (dark mode)
- **Foreground**: Slate-900 / White (dark mode)
- **Muted**: Slate-100 / Slate-800 (dark mode)
- **Border**: Slate-200 / Slate-700 (dark mode)

### Semantic Colors
- **Success**: Green-600
- **Warning**: Orange-600
- **Error**: Red-600
- **Info**: Blue-600

## 📐 Layout Structure

### Homepage Layout
```
┌─────────────────────────────────────┐
│ Header (sticky, backdrop blur)      │
├─────────────────────────────────────┤
│                                     │
│  Hero Section (centered)            │
│  - Badge with icon                  │
│  - Large heading with gradient      │
│  - Subtitle                         │
│                                     │
│  Input Card (elevated, shadow)      │
│  - Large textarea                   │
│  - Character count                  │
│  - Generate button (gradient)       │
│                                     │
│  Sample Prompts (3 cards)           │
│                                     │
│  Customization Panel (collapsible)  │
│  - Color palettes (5 options)       │
│  - Design styles (6 options)        │
│  - Image sources (3 options)        │
│  - Slide purposes (6 options)       │
│                                     │
│  Feature Cards (3 columns)          │
│                                     │
└─────────────────────────────────────┘
```

### Presentation Viewer Layout
```
┌─────────────────────────────────────┐
│ Top Bar (backdrop blur)             │
│ - Slide counter with gradient badge │
│ - Layout indicator                  │
│ - New / Download / Fullscreen       │
├─────────────────────────────────────┤
│                                     │
│  Slide Container (16:9 aspect)      │
│  - Rounded corners (3xl)            │
│  - Shadow (2xl, hover: elegant)     │
│  - Padding (responsive)             │
│  - Content with proper typography   │
│                                     │
├─────────────────────────────────────┤
│ Bottom Navigation (backdrop blur)   │
│ - Previous button                   │
│ - Dot indicators (gradient active)  │
│ - Next button                       │
│ - Keyboard shortcuts hint           │
└─────────────────────────────────────┘
```

### Loading State Layout
```
┌─────────────────────────────────────┐
│                                     │
│  Animated Logo (gradient, pulse)    │
│  - Sparkles icon                    │
│  - Glow effect                      │
│                                     │
│  Loading Text                       │
│  - Gradient heading                 │
│  - Subtitle                         │
│                                     │
│  Progress Steps (card)              │
│  - Animated dots                    │
│  - Staggered fade-in                │
│                                     │
│  Progress Bar (gradient)            │
│                                     │
└─────────────────────────────────────┘
```

## 🎭 Component Styles

### Buttons
- **Primary**: Gradient (blue to purple), white text, shadow
- **Outline**: Border, transparent background, hover effect
- **Ghost**: No border, transparent, subtle hover
- **Sizes**: sm (32px), default (40px), lg (48px)

### Cards
- **Elevation**: Border + shadow-lg
- **Hover**: shadow-xl, scale-105 (for interactive cards)
- **Radius**: rounded-2xl (16px)
- **Padding**: p-6 (24px)

### Input Fields
- **Textarea**: Large, borderless inside card, focus ring
- **Character Count**: Dynamic color (muted → green when ready)
- **Placeholder**: Muted foreground with 60% opacity

### Badges
- **Pill Shape**: rounded-full
- **Colors**: Contextual (blue, purple, pink)
- **Size**: px-4 py-2, text-sm

## ✨ Animations & Transitions

### Smooth Transitions
```css
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

### Hover Effects
- **Scale**: scale-105 (5% larger)
- **Shadow**: Elevation increase
- **Border**: Color change to primary

### Loading Animations
- **Pulse**: Logo and dots
- **Progress Bar**: 0% → 70% → 100% (3s loop)
- **Fade In**: Steps with staggered delay (0.3s each)

### Slide Navigation
- **Dot Indicators**: Width transition (2px → 32px)
- **Slide Change**: Smooth content swap
- **Fullscreen**: Fade transition

## 🔤 Typography

### Font Family
- **Primary**: Inter (modern, clean, professional)
- **Fallback**: system-ui, sans-serif

### Heading Scale
- **H1**: 5xl (48px) / 6xl (60px) on xl screens
- **H2**: 3xl (30px) / 4xl (36px) on xl screens
- **H3**: 2xl (24px)
- **H4**: xl (20px)

### Body Text
- **Base**: text-base (16px)
- **Large**: text-lg (18px)
- **Small**: text-sm (14px)
- **Extra Small**: text-xs (12px)

### Font Weights
- **Bold**: 700 (headings)
- **Semibold**: 600 (subheadings)
- **Medium**: 500 (labels)
- **Normal**: 400 (body)

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px (default)
- **Desktop**: ≥ 1280px (xl:)

### Mobile Adaptations
- Single column layouts
- Smaller padding (p-6 → p-4)
- Hidden text on small buttons
- Stacked navigation

### Desktop Enhancements
- Multi-column grids (3 columns)
- Larger padding (p-12, p-20)
- Full button labels
- Spacious layouts

## 🎯 Key Design Patterns

### Gradient Usage
- **CTAs**: Primary buttons, badges
- **Text**: Headings, brand name
- **Backgrounds**: Subtle page backgrounds
- **Active States**: Selected items, progress

### Backdrop Blur
- **Headers**: Sticky navigation
- **Overlays**: Modal backgrounds
- **Cards**: Floating elements

### Shadow Hierarchy
- **sm**: Subtle elevation
- **md**: Standard cards
- **lg**: Important cards
- **xl**: Hover states
- **2xl**: Slide container
- **elegant**: Custom with color tint

### Border Radius
- **sm**: 4px (small elements)
- **md**: 8px (buttons)
- **lg**: 12px (cards)
- **xl**: 16px (large cards)
- **2xl**: 24px (main containers)
- **3xl**: 32px (slide container)
- **full**: 9999px (pills, dots)

## 🎨 Customization Options

### Color Palettes (5)
1. **Minimal White** - Clean, professional
2. **Blue Tech** - Modern, trustworthy
3. **Sunset Orange** - Warm, energetic
4. **Forest Green** - Natural, calming
5. **Royal Purple** - Creative, bold

### Design Styles (6)
1. **Minimal Professional** - Lots of white space
2. **Modern Gradient** - Contemporary accents
3. **Corporate Sharp** - Business-focused
4. **Dark Mode** - Sleek and modern
5. **Creative / Vibrant** - Bold and striking
6. **Academic Clean** - Structured and dense

### Image Sources (3)
1. **Upload** - User's own images
2. **Unsplash** - Auto-fetch relevant images
3. **Text-only** - No images

### Slide Purposes (6)
1. **Pitch Deck** - Investor presentations
2. **Educational** - Teaching materials
3. **Business Report** - Corporate reports
4. **Marketing** - Product launches
5. **Webinar** - Online presentations
6. **Personal** - Creative projects

## 🚀 Performance Optimizations

### Loading Strategy
- Lazy load images
- Code splitting
- Minimal dependencies
- Optimized animations

### Rendering
- React memo for expensive components
- Debounced input handling
- Efficient markdown parsing
- Mermaid diagram caching

## ♿ Accessibility

### Keyboard Navigation
- Tab order follows visual flow
- Arrow keys for slide navigation
- Escape to exit fullscreen
- Enter to activate buttons

### Screen Readers
- Semantic HTML elements
- ARIA labels on interactive elements
- Alt text for images
- Clear focus indicators

### Color Contrast
- WCAG AA compliant
- Sufficient contrast ratios
- Dark mode support
- Colorblind-friendly palettes

## 📦 Component Library

### shadcn/ui Components Used
- Button (all variants)
- Textarea
- Card (custom styled)
- Badge (custom styled)
- Toast (Sonner)

### Custom Components
- SlideViewer
- LoadingState
- HomePage
- Sample prompt cards
- Customization panels

---

**Design System Version**: 1.0.0  
**Last Updated**: 2025-12-12  
**Maintained by**: Stanzify Team
