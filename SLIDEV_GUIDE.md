# Using Your Generated Slidev Presentation

## 🎯 Quick Start

Your Stanzify presentation is ready! Here's how to use it with full Slidev power:

### 1. Download Your Presentation
Click the **"Download"** button in the viewer to get `presentation.md`

### 2. Install Slidev
```bash
npm install -g @slidev/cli
```

### 3. Run Your Presentation
```bash
slidev presentation.md
```

That's it! Your presentation will open in your browser with full Slidev features.

## 🚀 Slidev Features You'll Get

### Presenter Mode
Press `o` to open presenter mode with:
- Current slide and next slide preview
- Speaker notes
- Timer
- Slide controls

### Navigation
- **Arrow Keys**: Navigate slides
- **Space**: Next slide
- **f**: Fullscreen
- **o**: Overview mode
- **d**: Dark mode toggle
- **g**: Go to slide (type number)

### Code Highlighting
Your code blocks will have:
- Line-by-line reveal (click to step through)
- Syntax highlighting
- Line numbers
- Copy button

Example in your presentation:
```typescript {all|1-3|5-8}
// Click to reveal line by line
interface User {
  id: number
}

function getUser(id: number) {
  return database.find(id)
}
```

### Mermaid Diagrams
All your diagrams will be interactive:
- Flowcharts
- Sequence diagrams
- Class diagrams
- State diagrams

### Math Equations
Beautifully rendered with KaTeX:
- Inline: $E = mc^2$
- Display: $$\int_{a}^{b} f(x) dx$$

### Transitions
Smooth slide transitions between layouts

### Two-Column Layouts
Perfect side-by-side comparisons with `::right::`

## 📤 Exporting Your Presentation

### Export to PDF
```bash
slidev export presentation.md
```

This creates `presentation.pdf` ready for sharing.

### Export to PNG Images
```bash
slidev export presentation.md --format png
```

Creates individual PNG files for each slide.

### Build Static Site
```bash
slidev build presentation.md
```

Creates a `dist` folder you can deploy to:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting

## ✏️ Editing Your Presentation

Your markdown is fully editable! Open `presentation.md` in any text editor.

### Change a Slide Title
```markdown
---
layout: default
---

# Old Title  ← Change this
```

### Add a New Slide
Just add `---` and your content:
```markdown
---
layout: center
---

# New Slide
My new content here
```

### Change Layout
```markdown
---
layout: two-cols  ← Change to: center, fact, quote, etc.
---
```

### Add More Diagrams
```markdown
\`\`\`mermaid
graph TD
    A[Your] --> B[Custom]
    B --> C[Diagram]
\`\`\`
```

### Add Code Examples
```markdown
\`\`\`python {all|1-3|5}
def hello():
    print("Hello")
    return True

hello()
\`\`\`
```

## 🎨 Customizing Themes

### Change Theme
Add to first slide:
```markdown
---
theme: seriph
---
```

Popular themes:
- `default` - Clean and simple
- `seriph` - Elegant serif fonts
- `apple-basic` - Apple Keynote style
- `shibainu` - Cute and playful
- `bricks` - Modern and bold

### Install More Themes
```bash
npm install slidev-theme-seriph
```

Then use:
```markdown
---
theme: seriph
---
```

## 🔧 Advanced Features

### Speaker Notes
Add notes below slides:
```markdown
# My Slide

Content here

<!--
These are speaker notes
Only visible in presenter mode
-->
```

### Custom CSS
Add to first slide:
```markdown
---
css: unocss
---

<style>
.my-class {
  color: red;
}
</style>
```

### Animations
Use v-click for progressive disclosure:
```markdown
- First point
- Second point {v-click}
- Third point {v-click}
```

### Drawing Mode
Press `d` during presentation to draw on slides!

## 📱 Sharing Your Presentation

### Option 1: Share PDF
```bash
slidev export presentation.md
# Share presentation.pdf
```

### Option 2: Deploy Online
```bash
slidev build presentation.md
# Upload dist folder to Netlify/Vercel
```

### Option 3: Share Markdown
Just share `presentation.md` - anyone with Slidev can run it!

## 🎓 Learning More

### Official Docs
https://sli.dev

### Examples
https://sli.dev/showcases

### Themes
https://sli.dev/themes/gallery

### Addons
https://sli.dev/addons/use

## 💡 Tips & Tricks

### Tip 1: Use Presenter Mode
Always use presenter mode (`o`) when presenting - you'll see notes and next slide.

### Tip 2: Practice Navigation
Get comfortable with keyboard shortcuts before presenting.

### Tip 3: Test Exports
Export to PDF before your presentation as a backup.

### Tip 4: Use Speaker Notes
Add notes to complex slides to remember key points.

### Tip 5: Keep It Simple
Don't overuse animations - focus on content.

### Tip 6: Test on Target Device
Run your presentation on the device you'll use for presenting.

### Tip 7: Have a Backup
Always have a PDF backup in case of technical issues.

## 🆘 Troubleshooting

### Slidev Won't Install
Try:
```bash
npm cache clean --force
npm install -g @slidev/cli
```

### Presentation Won't Open
Check that you're in the right directory:
```bash
ls presentation.md  # Should show your file
slidev presentation.md
```

### Diagrams Not Showing
Mermaid diagrams need internet connection first time. After that they're cached.

### Math Not Rendering
Make sure you're using `$$` for display math and `$` for inline.

### Export Fails
Install Playwright browsers:
```bash
npx playwright install
```

## 🎉 You're Ready!

Your Stanzify-generated presentation has all the power of Slidev. Download, run, and present with confidence!

**Remember**: The preview in Stanzify is basic - the real magic happens when you run it with Slidev!

---

**Need Help?**
- Slidev Docs: https://sli.dev
- Slidev Discord: https://chat.sli.dev
- GitHub Issues: https://github.com/slidevjs/slidev
