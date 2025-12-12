import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: "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",
  dangerouslyAllowBrowser: true,
});

const SLIDEV_PROMPT_TEMPLATE = `You are a Slidev markdown expert. Generate a professional presentation based on the user's topic.

Requirements:
- Start with a title slide that includes the main topic
- Create 5-7 content slides with clear information
- Use proper Slidev syntax with --- as slide separators
- Include clear headers using # or ##
- Use bullet points for lists
- Add one section divider slide (use # with just a title)
- Keep content concise and professional
- Use proper markdown formatting

Topic: {USER_PROMPT}

Output ONLY valid Slidev markdown. Do not include any explanations or additional text outside the markdown.

Example format:
---
# Main Title
Subtitle or tagline
---
# Section 1
- Point 1
- Point 2
- Point 3
---
# Section Divider
---
# Section 2
Content here
---`;

export interface GenerateSlidesOptions {
  prompt: string;
  onProgress?: (chunk: string) => void;
}

export async function generateSlides(
  options: GenerateSlidesOptions
): Promise<string> {
  const { prompt, onProgress } = options;

  const systemPrompt = SLIDEV_PROMPT_TEMPLATE.replace("{USER_PROMPT}", prompt);

  try {
    const stream = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: systemPrompt,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 2048,
      stream: true,
    });

    let fullContent = "";

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        fullContent += content;
        if (onProgress) {
          onProgress(content);
        }
      }
    }

    return fullContent;
  } catch (error) {
    console.error("Error generating slides:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to generate slides"
    );
  }
}
