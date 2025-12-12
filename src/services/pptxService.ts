import PptxGenJS from "pptxgenjs";

interface Slide {
  frontmatter: Record<string, string>;
  content: string;
  layout: string;
  background?: string;
  backgroundImage?: string;
  image?: string;
  transition?: string;
  leftContent?: string;
  rightContent?: string;
  isTwoColumn?: boolean;
  parsedElements?: ContentElement[];
}

interface ContentElement {
  type: 'heading' | 'paragraph' | 'list' | 'code' | 'mermaid' | 'image' | 'math' | 'blockquote' | 'divider';
  level?: number;
  content?: string;
  language?: string;
  items?: string[];
  ordered?: boolean;
  src?: string;
  alt?: string;
}

export async function exportToPPTX(slides: Slide[], title: string): Promise<void> {
  try {
    const pptx = new PptxGenJS();
    
    // Set presentation properties
    pptx.author = "Stanzify";
    pptx.company = "Stanzify";
    pptx.subject = title;
    pptx.title = title;
    
    // Define theme colors
    const colors = {
      primary: "3B82F6",
      secondary: "8B5CF6",
      accent: "EC4899",
      dark: "1E293B",
      medium: "64748B",
      light: "F8FAFC",
      white: "FFFFFF",
      blue: {
        50: "EFF6FF",
        500: "3B82F6",
        600: "2563EB",
        700: "1D4ED8"
      },
      purple: {
        500: "8B5CF6",
        600: "7C3AED"
      },
      pink: {
        500: "EC4899",
        600: "DB2777"
      },
      slate: {
        800: "1E293B",
        900: "0F172A"
      }
    };

    // Process each slide
    for (let i = 0; i < slides.length; i++) {
      const slideData = slides[i];
      const slide = pptx.addSlide();
      
      // Set background based on layout
      setupSlideBackground(slide, slideData, colors);
      
      // Render content based on layout type
      if (slideData.isTwoColumn) {
        await addTwoColumnContent(slide, slideData, colors);
      } else {
        await addSingleColumnContent(slide, slideData, colors);
      }
    }

    // Generate PPTX and trigger download
    // writeFile automatically handles browser download and Node.js file writing
    await (pptx as any).writeFile({ fileName: `${title.toLowerCase().replace(/\s+/g, '-')}.pptx` });
  } catch (error) {
    console.error('PPTX export error:', error);
    throw new Error(`Failed to export presentation: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function setupSlideBackground(slide: any, slideData: Slide, colors: any): void {
  switch (slideData.layout) {
    case 'cover':
    case 'intro':
      // Gradient background for cover
      slide.background = { fill: colors.blue[600] };
      slide.addShape('rect', {
        x: 0, y: 0, w: '100%', h: '100%',
        fill: { 
          type: 'solid',
          color: colors.blue[600],
          transparency: 10
        }
      });
      break;
    case 'section':
      slide.background = { fill: colors.slate[800] };
      break;
    case 'end':
      slide.background = { fill: colors.purple[600] };
      break;
    case 'quote':
      slide.background = { fill: colors.light };
      break;
    default:
      slide.background = { fill: colors.white };
  }
}

function getTextColor(layout: string, colors: any): string {
  switch (layout) {
    case 'cover':
    case 'intro':
    case 'section':
    case 'end':
      return colors.white;
    default:
      return colors.dark;
  }
}

async function addTwoColumnContent(slide: any, slideData: Slide, colors: any): Promise<void> {
  const textColor = getTextColor(slideData.layout, colors);
  
  // Left column
  await addContentColumn(slide, slideData.leftContent || '', {
    x: 0.5,
    y: 1.0,
    w: 4.25,
    h: 5.0
  }, textColor, colors);

  // Right column
  await addContentColumn(slide, slideData.rightContent || '', {
    x: 5.25,
    y: 1.0,
    w: 4.25,
    h: 5.0
  }, textColor, colors);
}

async function addContentColumn(
  slide: any, 
  content: string, 
  bounds: { x: number, y: number, w: number, h: number },
  textColor: string,
  colors: any
): Promise<void> {
  const elements = parseContent(content);
  let currentY = bounds.y;
  
  for (const element of elements) {
    if (currentY > bounds.y + bounds.h) break;
    
    await renderElement(slide, element, {
      x: bounds.x,
      y: currentY,
      w: bounds.w
    }, textColor, colors);
    
    currentY += getElementHeight(element);
  }
}

async function addSingleColumnContent(slide: any, slideData: Slide, colors: any): Promise<void> {
  const textColor = getTextColor(slideData.layout, colors);
  const content = slideData.content;
  const elements = parseContent(content);
  
  // Determine positioning based on layout
  let startX = 0.75;
  let startY = 1.2;
  let contentWidth = 8.5;
  let isCenter = false;

  switch (slideData.layout) {
    case 'cover':
    case 'intro':
    case 'section':
    case 'end':
    case 'center':
    case 'fact':
    case 'quote':
      isCenter = true;
      startY = 2.5;
      break;
    default:
      startY = 1.2;
  }

  let currentY = startY;
  
  // Render title separately if it's a centered layout
  if (isCenter && elements.length > 0 && elements[0].type === 'heading') {
    const titleElement = elements[0];
    const titleSize = getTitleFontSize(slideData.layout);
    
    slide.addText(cleanText(titleElement.content || ''), {
      x: 0.5,
      y: 1.2,
      w: 9.0,
      h: 1.5,
      fontSize: titleSize,
      bold: true,
      color: textColor,
      align: 'center',
      valign: 'middle'
    });
    
    currentY = 3.0;
    elements.shift(); // Remove title from elements
  }

  // Render remaining elements
  for (const element of elements) {
    if (currentY > 6.5) break;
    
    await renderElement(slide, element, {
      x: startX,
      y: currentY,
      w: contentWidth,
      align: isCenter ? 'center' : 'left'
    }, textColor, colors);
    
    currentY += getElementHeight(element);
  }
}

function parseContent(content: string): ContentElement[] {
  const elements: ContentElement[] = [];
  const lines = content.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) {
      i++;
      continue;
    }

    // Code blocks
    if (line.startsWith('```')) {
      const language = line.substring(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      const codeContent = codeLines.join('\n');
      
      if (language === 'mermaid') {
        elements.push({ type: 'mermaid', content: codeContent });
      } else {
        elements.push({ type: 'code', language, content: codeContent });
      }
      i++;
      continue;
    }

    // Headings
    if (line.startsWith('#')) {
      const level = line.match(/^#+/)?.[0].length || 1;
      const content = line.replace(/^#+\s*/, '');
      elements.push({ type: 'heading', level, content });
      i++;
      continue;
    }

    // Lists
    if (line.match(/^[-*+]\s/) || line.match(/^\d+\.\s/)) {
      const ordered = line.match(/^\d+\.\s/) !== null;
      const items: string[] = [];
      while (i < lines.length && (lines[i].trim().match(/^[-*+]\s/) || lines[i].trim().match(/^\d+\.\s/))) {
        const item = lines[i].trim().replace(/^[-*+]\s/, '').replace(/^\d+\.\s/, '');
        items.push(item);
        i++;
      }
      elements.push({ type: 'list', items, ordered });
      continue;
    }

    // Images
    if (line.match(/^!\[.*?\]\(.*?\)/)) {
      const match = line.match(/^!\[(.*?)\]\((.*?)\)/);
      if (match) {
        elements.push({ type: 'image', alt: match[1], src: match[2] });
      }
      i++;
      continue;
    }

    // Blockquotes
    if (line.startsWith('>')) {
      const content = line.replace(/^>\s*/, '');
      elements.push({ type: 'blockquote', content });
      i++;
      continue;
    }

    // Regular paragraph
    elements.push({ type: 'paragraph', content: line });
    i++;
  }

  return elements;
}

async function renderElement(
  slide: any,
  element: ContentElement,
  position: { x: number, y: number, w: number, align?: string },
  textColor: string,
  colors: any
): Promise<void> {
  const align = position.align || 'left';
  
  switch (element.type) {
    case 'heading':
      const headingSizes = [44, 36, 28, 24, 20, 18];
      const size = headingSizes[Math.min((element.level || 1) - 1, 5)];
      
      slide.addText(cleanText(element.content || ''), {
        x: position.x,
        y: position.y,
        w: position.w,
        h: 0.8,
        fontSize: size,
        bold: true,
        color: textColor,
        align: align as any
      });
      break;

    case 'paragraph':
      slide.addText(cleanText(element.content || ''), {
        x: position.x,
        y: position.y,
        w: position.w,
        h: 0.5,
        fontSize: 18,
        color: textColor,
        align: align as any
      });
      break;

    case 'list':
      const bulletPoints = (element.items || []).map((item, _idx) => ({
        text: cleanText(item),
        options: { 
          bullet: true,
          fontSize: 16,
          color: textColor,
          paraSpaceAfter: 8
        }
      }));
      
      slide.addText(bulletPoints, {
        x: position.x,
        y: position.y,
        w: position.w,
        h: Math.min((element.items?.length || 0) * 0.4, 3.0),
        align: align as any
      });
      break;

    case 'code':
      // Add code block with background
      slide.addShape('rect', {
        x: position.x,
        y: position.y,
        w: position.w,
        h: 1.5,
        fill: { color: colors.slate[900] },
        line: { color: colors.blue[500], width: 2 }
      });
      
      slide.addText(element.content || '', {
        x: position.x + 0.2,
        y: position.y + 0.2,
        w: position.w - 0.4,
        h: 1.1,
        fontSize: 12,
        fontFace: 'Courier New',
        color: colors.white,
        valign: 'top'
      });
      break;

    case 'mermaid':
      // Add placeholder for mermaid diagram
      slide.addShape('rect', {
        x: position.x,
        y: position.y,
        w: position.w,
        h: 2.5,
        fill: { color: colors.blue[50] },
        line: { color: colors.blue[500], width: 2 }
      });
      
      // Parse and render basic flowchart
      await renderMermaidDiagram(slide, element.content || '', {
        x: position.x,
        y: position.y,
        w: position.w,
        h: 2.5
      }, colors);
      break;

    case 'image':
      if (element.src && element.src.startsWith('http')) {
        try {
          slide.addImage({
            path: element.src,
            x: position.x,
            y: position.y,
            w: Math.min(position.w, 4.0),
            h: 2.0,
            sizing: { type: 'contain' }
          });
        } catch (error) {
          // Image loading failed, add placeholder
          slide.addShape('rect', {
            x: position.x,
            y: position.y,
            w: Math.min(position.w, 4.0),
            h: 2.0,
            fill: { color: colors.light },
            line: { color: colors.medium, width: 1 }
          });
          
          slide.addText(element.alt || 'Image', {
            x: position.x,
            y: position.y + 0.8,
            w: Math.min(position.w, 4.0),
            h: 0.4,
            fontSize: 14,
            color: colors.medium,
            align: 'center'
          });
        }
      }
      break;

    case 'blockquote':
      // Add quote with styled background
      slide.addShape('rect', {
        x: position.x,
        y: position.y,
        w: position.w,
        h: 0.8,
        fill: { color: colors.blue[50], transparency: 50 },
        line: { color: colors.blue[500], width: 3, pt: 'solid' }
      });
      
      slide.addText(cleanText(element.content || ''), {
        x: position.x + 0.2,
        y: position.y + 0.15,
        w: position.w - 0.4,
        h: 0.5,
        fontSize: 18,
        italic: true,
        color: textColor
      });
      break;
  }
}

async function renderMermaidDiagram(
  slide: any,
  mermaidCode: string,
  bounds: { x: number, y: number, w: number, h: number },
  colors: any
): Promise<void> {
  // Parse basic mermaid syntax and create flowchart
  const lines = mermaidCode.trim().split('\n').slice(1); // Skip first line (graph declaration)
  
  // Simple parser for flowchart nodes
  const nodes: { id: string, label: string, shape: string }[] = [];
  const edges: { from: string, to: string }[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Parse node definitions
    const nodeMatch = trimmed.match(/(\w+)\[(.*?)\]/);
    if (nodeMatch) {
      nodes.push({ id: nodeMatch[1], label: nodeMatch[2], shape: 'rect' });
    }
    
    const roundNodeMatch = trimmed.match(/(\w+)\((.*?)\)/);
    if (roundNodeMatch) {
      nodes.push({ id: roundNodeMatch[1], label: roundNodeMatch[2], shape: 'roundRect' });
    }
    
    // Parse edges
    const edgeMatch = trimmed.match(/(\w+)\s*--[->]+\s*(\w+)/);
    if (edgeMatch) {
      edges.push({ from: edgeMatch[1], to: edgeMatch[2] });
    }
  }
  
  // Render nodes and edges
  if (nodes.length > 0) {
    const nodeWidth = Math.min(bounds.w / Math.max(nodes.length, 2) - 0.3, 2.0);
    const nodeHeight = 0.6;
    const startX = bounds.x + (bounds.w - (nodes.length * (nodeWidth + 0.3))) / 2;
    const startY = bounds.y + bounds.h / 2 - nodeHeight / 2;
    
    // Draw nodes
    nodes.forEach((node, idx) => {
      const x = startX + idx * (nodeWidth + 0.3);
      const y = startY;
      
      slide.addShape('roundRect', {
        x, y,
        w: nodeWidth,
        h: nodeHeight,
        fill: { color: colors.blue[500] },
        line: { color: colors.blue[700], width: 2 }
      });
      
      slide.addText(node.label, {
        x, y,
        w: nodeWidth,
        h: nodeHeight,
        fontSize: 14,
        bold: true,
        color: colors.white,
        align: 'center',
        valign: 'middle'
      });
    });
    
    // Draw connecting arrows
    for (let i = 0; i < nodes.length - 1; i++) {
      const fromX = startX + i * (nodeWidth + 0.3) + nodeWidth;
      const toX = startX + (i + 1) * (nodeWidth + 0.3);
      const y = startY + nodeHeight / 2;
      
      slide.addShape('line', {
        x: fromX,
        y: y,
        w: toX - fromX,
        h: 0,
        line: { color: colors.blue[500], width: 3, endArrowType: 'triangle' }
      });
    }
  }
}

function getElementHeight(element: ContentElement): number {
  switch (element.type) {
    case 'heading':
      return 0.9;
    case 'paragraph':
      return 0.6;
    case 'list':
      return Math.min((element.items?.length || 1) * 0.4 + 0.2, 3.2);
    case 'code':
      return 1.7;
    case 'mermaid':
      return 2.7;
    case 'image':
      return 2.2;
    case 'blockquote':
      return 1.0;
    case 'divider':
      return 0.3;
    default:
      return 0.5;
  }
}

function getTitleFontSize(layout: string): number {
  switch (layout) {
    case 'cover':
    case 'intro':
      return 54;
    case 'section':
    case 'end':
      return 44;
    case 'center':
    case 'fact':
      return 40;
    default:
      return 36;
  }
}

function cleanText(text: string): string {
  // Remove markdown formatting
  let cleaned = text;
  
  // Remove v-click and directives
  cleaned = cleaned.replace(/v-click[^>]*/g, '');
  cleaned = cleaned.replace(/<div[^>]*>/g, '').replace(/<\/div>/g, '');
  cleaned = cleaned.replace(/<span[^>]*style="[^"]*"[^>]*>/g, '').replace(/<\/span>/g, '');
  
  // Remove inline code backticks
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');
  
  // Remove bold markers but keep text
  cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1');
  cleaned = cleaned.replace(/__([^_]+)__/g, '$1');
  
  // Remove italic markers
  cleaned = cleaned.replace(/\*([^*]+)\*/g, '$1');
  cleaned = cleaned.replace(/_([^_]+)_/g, '$1');
  
  // Remove links but keep text
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  
  // Clean up extra whitespace
  cleaned = cleaned.trim();
  
  return cleaned;
}

// Add pptx property to window for TypeScript
declare global {
  interface Window {
    pptx: typeof PptxGenJS;
  }
}

const pptx = PptxGenJS;
