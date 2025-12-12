# Stanzify - AI-Powered Slidev Presentation Generator

A premium AI-powered presentation generator that creates professional slidev presentations with Gamma/Canva-level quality. Transform your ideas into stunning presentations using the full power of slidev, Groq AI, and advanced design templates.

## 🚀 Features

### Core AI-Powered Capabilities
- **Premium Content Generation**: Advanced Groq AI prompts for Gamma/Canva-quality presentations
- **Real-time Streaming**: Watch your presentation generate live with progress tracking
- **Intelligent Layout Selection**: AI-powered layout optimization based on content type
- **Advanced Theme Support**: Multiple color schemes and design styles
- **Interactive Elements**: Mermaid diagrams, code highlighting, math equations

### Slidev Integration
- **Full Slidev Engine**: Complete slidev integration with all advanced features
- **Multiple Layouts**: cover, two-cols, image-right, image-left, center, fact, quote, section, end
- **Live Development Server**: Real-time slidev development with hot reload
- **Export Capabilities**: PDF, PNG, HTML, SVG, PPTX export formats
- **Presenter Mode**: Full presenter mode with speaker notes and remote control
- **Interactive Components**: Mermaid diagrams, code blocks, math rendering

### Advanced Features
- **Presentation Analysis**: AI-powered quality scoring and improvement suggestions
- **Template System**: Premium templates for executive dashboards, product launches, academic research
- **Auto-play Mode**: Automated presentation with customizable timing
- **Keyboard Shortcuts**: Full keyboard navigation and shortcuts
- **Responsive Design**: Optimized for desktop, tablet, and mobile viewing
- **Speaker Notes**: Built-in speaker notes system

## 🛠️ Tech Stack

- **Frontend**: Vite + React 18 + TypeScript
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **AI Integration**: Groq SDK with llama-3.3-70b-versatile model
- **Presentation Engine**: Slidev with advanced themes and layouts
- **Interactive Elements**: Mermaid diagrams, KaTeX math, Prism syntax highlighting
- **State Management**: React hooks with localStorage persistence
- **Build Tools**: TypeScript, PostCSS, Autoprefixer

## 🎯 Quick Start

### Prerequisites
- Node.js ≥ 20
- npm ≥ 10
- Groq API key (included)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd stanzify

# Install dependencies
npm install

# Start development server
npm run dev
```

### Slidev Commands

```bash
# Start slidev development server
npm run slidev:dev

# Build presentation for production
npm run slidev:build

# Export to PDF
npm run slidev:export-pdf

# Export to PNG
npm run slidev:export-png
```

## 🎨 Usage

### 1. Create a Presentation
1. Visit the home page
2. Enter your presentation topic or choose an example
3. Customize design settings (colors, fonts, layout)
4. Click "Generate Presentation"

### 2. Customize Your Design
- **Color Schemes**: Corporate blue, modern gray, executive navy, innovation purple
- **Fonts**: Inter, Modern Sans, Fira Code for different content types
- **Layout Styles**: Professional, creative, academic, minimal
- **Image Sources**: Unsplash integration with AI keyword matching

### 3. Advanced Features
- **Real-time Preview**: Watch slides generate in real-time
- **Interactive Diagrams**: Automatic Mermaid diagram generation
- **Speaker Notes**: Add detailed notes for each slide
- **Export Options**: Multiple format support for sharing and presenting

## 🏗️ Architecture

### Core Services

#### `slidevService.ts`
- Advanced slidev presentation generation
- Premium template system
- Quality analysis and optimization
- Enhanced Groq AI integration

#### `slidevRuntime.ts`
- Slidev server management
- Build and export operations
- Process lifecycle management
- Real-time development server

#### `slidevTemplates.ts`
- Premium presentation templates
- Template customization system
- Layout optimization
- Animation and interaction support

#### `groqService.ts`
- Legacy service compatibility
- Enhanced prompt engineering
- Fallback generation methods
- Quality analysis integration

### Component Architecture

#### `SlideViewer.tsx`
- Advanced slidev viewer with full feature support
- Keyboard navigation and shortcuts
- Presenter mode and auto-play
- Export and download capabilities
- Quality analysis integration

#### `ViewerPage.tsx`
- Enhanced loading states with progress tracking
- Real-time generation preview
- Error handling and recovery
- Multi-step workflow support

## 📋 API Reference

### Generate Presentation
```typescript
import { generateSlides } from '@/services/groqService';

const result = await generateSlides({
  prompt: "Your presentation topic",
  theme: {
    palette: { primary: '#3b82f6', accent: '#8b5cf6' },
    style: 'professional',
    purpose: 'pitch'
  },
  temperature: 0.8,
  maxRetries: 3
});
```

### Export Presentation
```typescript
import { slidevRuntime } from '@/services/slidevRuntime';

const exportResult = await slidevRuntime.exportPresentation(
  'presentation.md',
  { format: 'pdf', width: 1920, height: 1080 }
);
```

### Template Generation
```typescript
import { generateSlidevFromTemplate } from '@/services/slidevTemplates';

const presentation = generateSlidevFromTemplate(
  PREMIUM_SLIDEV_TEMPLATES[0],
  {
    colorScheme: 'corporate-blue',
    fontFamily: 'Inter',
    includeAnimations: true,
    includeSpeakerNotes: true
  },
  {
    title: "My Presentation",
    subtitle: "Professional slidev deck"
  }
);
```

## 🎪 Premium Templates

### Executive Dashboard
Professional executive presentations with KPIs, data visualization, and strategic insights.

### Product Launch
Dynamic product presentations with compelling storytelling, feature showcases, and customer testimonials.

### Academic Research
Comprehensive research presentations with methodology, data analysis, and scholarly formatting.

## 🎮 Keyboard Shortcuts

- `← →` or `H L`: Navigate slides
- `F`: Toggle fullscreen
- `P`: Presenter mode
- `S`: Auto-play toggle
- `N`: Speaker notes
- `R`: Quality analysis
- `Home/End`: First/last slide
- `Space`: Next slide

## 🔧 Configuration

### Slidev Configuration (`slidev.config.ts`)
```typescript
export default defineConfig({
  title: 'Stanzify Presentation',
  themes: ['@slidev/theme-default', '@slidev/theme-seriph'],
  export: { format: 'pdf', timeout: 30000 },
  remoteAssets: true,
  controller: true,
  presenter: true
});
```

### Environment Variables
```env
VITE_GROQ_API_KEY=your_groq_api_key
VITE_SLIDEV_PORT=3030
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_key
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Slidev Presentations
```bash
# Start production slidev server
npm run slidev:dev

# Export static files
npm run slidev:export
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Slidev](https://sli.dev/) - Presentation framework
- [Groq](https://groq.com/) - AI inference platform
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Unsplash](https://unsplash.com/) - Beautiful images

## 🔗 Links

- [Live Demo](https://your-demo-url.com)
- [Documentation](https://docs.your-docs-url.com)
- [Slidev Documentation](https://sli.dev/)
- [Groq Documentation](https://docs.groq.com/)

---

**Built with ❤️ using the full power of AI and slidev**