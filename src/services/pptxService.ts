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
}

export async function exportToPPTX(slides: Slide[], title: string): Promise<void> {
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
    light: "F8FAFC",
    white: "FFFFFF",
  };

  slides.forEach((slideData, index) => {
    const slide = pptx.addSlide();
    
    // Set background
    if (slideData.backgroundImage || slideData.background) {
      // For background images, we'll use a solid color as fallback since URLs need to be downloaded
      slide.background = { color: colors.primary };
    } else {
      // Set background color based on layout
      const bgColor = getBackgroundColor(slideData.layout, colors);
      slide.background = { color: bgColor };
    }

    // Process content based on layout
    if (slideData.isTwoColumn) {
      // Two-column layout
      addTwoColumnContent(slide, slideData, colors);
    } else {
      // Single column layout
      addSingleColumnContent(slide, slideData, colors);
    }
  });

  // Save the presentation
  const filename = `${title.toLowerCase().replace(/\s+/g, '-')}.pptx`;
  await pptx.writeFile({ fileName: filename });
}

function getBackgroundColor(layout: string, colors: any): string {
  switch (layout) {
    case 'cover':
    case 'intro':
      return colors.primary;
    case 'section':
      return colors.dark;
    case 'end':
      return colors.secondary;
    case 'quote':
      return colors.light;
    default:
      return colors.white;
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

function addTwoColumnContent(slide: any, slideData: Slide, colors: any) {
  const textColor = getTextColor(slideData.layout, colors);
  
  // Left column
  const leftText = parseMarkdownToPptx(slideData.leftContent || '');
  slide.addText(leftText, {
    x: 0.5,
    y: 1.0,
    w: 4.5,
    h: 4.5,
    fontSize: 18,
    color: textColor,
    valign: 'top',
    align: 'left',
  });

  // Right column
  const rightText = parseMarkdownToPptx(slideData.rightContent || '');
  slide.addText(rightText, {
    x: 5.2,
    y: 1.0,
    w: 4.5,
    h: 4.5,
    fontSize: 18,
    color: textColor,
    valign: 'top',
    align: 'left',
  });
}

function addSingleColumnContent(slide: any, slideData: Slide, colors: any) {
  const textColor = getTextColor(slideData.layout, colors);
  const content = parseMarkdownToPptx(slideData.content);
  
  // Determine positioning based on layout
  let x = 0.5;
  let y = 1.0;
  let w = 9.0;
  let h = 5.0;
  let align: 'left' | 'center' | 'right' = 'left';
  let valign: 'top' | 'middle' | 'bottom' = 'top';

  switch (slideData.layout) {
    case 'cover':
    case 'intro':
    case 'section':
    case 'end':
    case 'center':
    case 'fact':
    case 'quote':
      align = 'center';
      valign = 'middle';
      y = 0.5;
      h = 6.0;
      break;
    default:
      align = 'left';
      valign = 'top';
  }

  // Parse content to extract title and body
  const lines = content.split('\n').filter(line => line.trim());
  let titleText = '';
  let bodyText = '';

  if (lines.length > 0) {
    // First line as title if it looks like a heading
    if (lines[0].startsWith('#') || lines[0].length < 100) {
      titleText = lines[0].replace(/^#+\s*/, '');
      bodyText = lines.slice(1).join('\n');
    } else {
      bodyText = content;
    }
  }

  // Add title if present
  if (titleText) {
    const titleFontSize = getTitleFontSize(slideData.layout);
    slide.addText(titleText, {
      x: 0.5,
      y: 0.5,
      w: 9.0,
      h: 1.5,
      fontSize: titleFontSize,
      bold: true,
      color: textColor,
      align: align,
    });
    
    // Adjust body position
    y = 2.2;
    h = 4.3;
  }

  // Add body text if present
  if (bodyText) {
    slide.addText(bodyText, {
      x: x,
      y: y,
      w: w,
      h: h,
      fontSize: 18,
      color: textColor,
      valign: valign,
      align: align,
    });
  }
}

function getTitleFontSize(layout: string): number {
  switch (layout) {
    case 'cover':
    case 'intro':
      return 48;
    case 'section':
    case 'end':
      return 40;
    case 'center':
    case 'fact':
      return 36;
    default:
      return 32;
  }
}

function parseMarkdownToPptx(markdown: string): string {
  // Remove code blocks
  let text = markdown.replace(/```[\s\S]*?```/g, '[Code Block]');
  
  // Remove inline code
  text = text.replace(/`([^`]+)`/g, '$1');
  
  // Remove images
  text = text.replace(/!\[.*?\]\(.*?\)/g, '[Image]');
  
  // Remove links but keep text
  text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  
  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, '');
  
  // Convert headings to plain text
  text = text.replace(/^#{1,6}\s+/gm, '');
  
  // Convert bold
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  text = text.replace(/__([^_]+)__/g, '$1');
  
  // Convert italic
  text = text.replace(/\*([^*]+)\*/g, '$1');
  text = text.replace(/_([^_]+)_/g, '$1');
  
  // Convert lists to bullet points
  text = text.replace(/^[-*+]\s+/gm, '• ');
  text = text.replace(/^\d+\.\s+/gm, '• ');
  
  // Remove blockquote markers
  text = text.replace(/^>\s+/gm, '');
  
  // Remove horizontal rules
  text = text.replace(/^---+$/gm, '');
  
  // Remove v-click and other directives
  text = text.replace(/v-click[^>]*/g, '');
  text = text.replace(/<div[^>]*>/g, '');
  text = text.replace(/<\/div>/g, '');
  text = text.replace(/<span[^>]*>/g, '');
  text = text.replace(/<\/span>/g, '');
  
  // Clean up extra whitespace
  text = text.replace(/\n{3,}/g, '\n\n');
  text = text.trim();
  
  return text;
}
