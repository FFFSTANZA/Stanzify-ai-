# Tanzify - AI Presentation Generator

## ✨ Features Implemented

### 🎨 Modern UI Design
- **Tech Blue Theme**: Professional color scheme with tech blue (#3B82F6) as primary color
- **Split Layout**: Left panel for input, right panel for live preview
- **Responsive Design**: Fully responsive layout that works on desktop and mobile
- **Dark Mode Support**: Built-in dark mode with seamless theme switching
- **Smooth Animations**: Elegant transitions and loading states

### 🤖 AI-Powered Generation
- **Groq API Integration**: Uses llama-3.1-8b-instant model for fast generation
- **Streaming Support**: Real-time slide generation with progressive rendering
- **Smart Prompting**: Optimized prompt template for high-quality presentations
- **Error Handling**: Comprehensive error handling with user-friendly messages

### 📊 Slide Viewer
- **Markdown Rendering**: Beautiful rendering of Slidev-format markdown
- **Navigation Controls**: Previous/Next buttons and keyboard shortcuts (Arrow keys)
- **Slide Indicators**: Visual dots showing current slide position
- **Fullscreen Mode**: Immersive presentation mode with Escape key support
- **Download Feature**: Export generated presentations as markdown files

### 💡 User Experience
- **Example Prompts**: Quick-start examples for inspiration
- **Loading States**: Clear feedback during generation
- **Toast Notifications**: Success and error messages
- **Keyboard Navigation**: Full keyboard support for accessibility
- **Empty State**: Helpful guidance when no slides are generated

## 🛠️ Technical Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Build Tool**: Vite
- **AI Integration**: Groq SDK with llama-3.1-8b-instant
- **Markdown**: react-markdown + remark-gfm
- **Routing**: React Router v7
- **Notifications**: Sonner (toast notifications)

## 📁 Project Structure

```
src/
├── components/
│   ├── LoadingState.tsx       # Loading animation component
│   ├── PromptInput.tsx        # Left panel input form
│   ├── SlideViewer.tsx        # Right panel slide display
│   └── ui/                    # shadcn/ui components
├── pages/
│   └── PresentationPage.tsx   # Main application page
├── services/
│   └── groqService.ts         # Groq API integration
├── index.css                  # Design system & custom styles
└── routes.tsx                 # Application routing
```

## 🎯 Key Features

1. **AI-Powered**: Leverages Groq's fast inference for quick slide generation
2. **Real-time Preview**: See slides being generated in real-time
3. **Professional Design**: Modern, clean interface inspired by GPT and Bolt
4. **Fully Responsive**: Works seamlessly on all screen sizes
5. **Keyboard Shortcuts**: Navigate slides with arrow keys
6. **Export Capability**: Download presentations as markdown files
7. **Fullscreen Mode**: Present directly from the application

## 🚀 Usage

1. Enter your presentation topic in the left panel
2. Click "Generate Slides" or use example prompts
3. Watch as AI generates your presentation in real-time
4. Navigate through slides using buttons or arrow keys
5. Use fullscreen mode for presenting
6. Download the markdown file for further editing

## 🎨 Design System

- **Primary Color**: Tech Blue (HSL: 217 91% 60%)
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent spacing using Tailwind's spacing scale
- **Shadows**: Elegant shadows for depth and visual interest
- **Transitions**: Smooth transitions for all interactive elements

## 🔑 API Configuration

The application uses Groq API with the provided API key. The key is configured in:
- `src/services/groqService.ts`

## ✅ Quality Assurance

- ✅ All TypeScript types properly defined
- ✅ No linting errors
- ✅ Responsive design tested
- ✅ Error handling implemented
- ✅ Accessibility features included
- ✅ Performance optimized
