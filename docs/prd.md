# Stanzify - AI演示文稿生成器需求文档

## 1. 项目概述
Stanzify 是一个基于 AI 的演示文稿生成工具，通过 Groq AI 和 Slidev 渲染技术，将用户的简单文本提示转换为精美、专业的演示文稿。采用三页面工作流设计，**幻灯片预览直接在 Web 端实现**，充分利用 Slidev 的全部功能和内置工具，提供清晰、高端的用户体验。

## 2. 页面架构

### 2.1 三页面工作流
- **页面1**：提示输入页面（Prompt Page）- 用户输入演示文稿主题\n- **页面2**：模式选择页面（Mode Selection Page）- 用户配置样式和参数
- **页面3**：查看和演示页面（View & Present Page）- **完整的 Slidev 幻灯片预览直接在 Web 端渲染**，支持编辑和演示
-页面间切换流畅，保持界面清晰和高端感

## 3. 页面1 - 提示输入页面

### 3.1 整体布局风格
- 参考 Bolt、Rocket、Loveable 的设计风格
- 全白/干净背景\n- 居中对齐的提示框
- 大字体排版
- 极简主义、高端 UI\n- 流畅动画效果
- 最少干扰元素

### 3.2 用户输入提示
\n#### 3.2.1 输入区域设计
- 大型文本区域（类似 Bolt/Loveable）
- 圆角边缘
- 可扩展文本框
- 轻微阴影效果
- 打字动画效果

#### 3.2.2 示例提示
- '为解决电动汽车充电桩正常运行时间问题的AI初创公司创建融资演示'\n- '制作关于区块链共识机制的课堂演示'\n- '制作解释印度电动汽车生态系统的报告式演示文稿'

#### 3.2.3 继续按钮
- CTA 按钮：'继续 →'\n- 醒目设计，带悬停效果
- 点击后进入页面2

## 4. 页面2 - 模式选择页面\n
### 4.1 整体布局风格\n- 延续页面1的极简高端风格
- 卡片式布局展示各选项
- 流畅的展开/收起动画
- 选中状态带视觉反馈
\n### 4.2 配色方案选择
预设调色板（类似 Tailwind 配色）：
- Minimal White（极简白）
- Blue Tech（科技蓝）
- Sunset Orange（日落橙）\n- Forest Green（森林绿）\n- Royal Purple（皇家紫）
\n每个调色板展示：
- 背景色\n- 强调色
- 字体颜色
\n### 4.3 设计风格选择
- Minimal Professional（极简专业）
- Modern Gradient（现代渐变）\n- Corporate Sharp（企业锐利）\n- Dark Mode（暗黑模式）
- Creative / Vibrant（创意/活力）
- Academic Clean（学术简洁）

### 4.4 图片来源偏好
- 上传我自己的图片
- 从 Unsplash 自动获取（基于关键词）
- 无图片（纯文本）
\n### 4.5 幻灯片用途
- Pitch Deck（融资演示）
- Educational lesson（教育课程）
- Business report（商业报告）
- Marketing slides（营销幻灯片）
- Webinar slides（网络研讨会幻灯片）
- Personal / Creative（个人/创意）

### 4.6 生成按钮
- CTA 按钮：'生成演示文稿 →'
- 醒目设计，带悬停效果
- 点击后进入页面3

## 5. 页面3 - 查看和演示页面

### 5.1 页面切换\n- 点击'生成演示文稿'后，系统切换到完全不同的页面
- 类似 Bolt 从提示屏幕切换到代码编辑器的方式
- 保持 UI 清晰和高端感

### 5.2 页面内容
\n#### 5.2.1 核心展示区域
- **完整的 Slidev 幻灯片预览直接在 Web 端渲染**，充分利用 Slidev 内置工具和功能
- 全屏预览模式
- 演示者模式（带备注和计时器）
- 幻灯片导航面板
- 下载按钮\n- 重新生成按钮
- 编辑 markdown 按钮

#### 5.2.2 UI 设计灵感
- MeDo：清晰的结果页面
- Bolt代码工作区：与提示分离\n- Rocket：清晰的右侧输出窗口
\n### 5.3 核心功能
\n#### 5.3.1 实时 Slidev 全功能渲染器（Web 端实现）
- **直接在 Web 端即时渲染 Slidev markdown**
- 支持 Slidev 全部高级功能：
  - 动画效果（v-click、v-after、v-motion）
  - 主题系统（内置主题和自定义主题）
  - 多种布局（default、center、cover、intro、section、quote、image-right、image-left、two-cols、iframe）
  - 图片和媒体（支持本地和远程图片、视频嵌入）
  - 代码块（语法高亮、行号、代码聚焦、代码动画）
  - Mermaid 图表（流程图、时序图、甘特图、类图等）
  - Monaco 编辑器（可交互代码编辑）
  - LaTeX 数学公式\n  - 图标集成（Carbon、Tabler、Iconify）
  - 组件系统（自定义 Vue 组件）
  - 演示者模式（备注、计时器、下一张预览）
  - 录制功能（录制演示过程）
  - 导出功能（PDF、PNG、SPA）
  - 绘图模式（在幻灯片上绘图标注）
  - 键盘快捷键\n  - 触摸手势支持
  - 暗黑模式切换
  - 幻灯片缩放
  - 全屏模式
\n#### 5.3.2 演示者模式
- 双屏显示：主屏幕显示幻灯片，演示者屏幕显示备注和控制面板
- 计时器和进度条\n- 下一张幻灯片预览
- 演讲者备注显示
- 幻灯片导航控制

#### 5.3.3 导出选项
- PDF 格式（高质量矢量输出）
- HTML 格式（单页应用）
- PNG 图片序列\n- Markdown 文件\n- 录制视频（演示过程录制）
\n#### 5.3.4 重新生成/优化功能
- 更改主题\n- 更改布局
- 添加幻灯片
- 使其更专业
- '用更好的解释重写内容'
-所有操作通过 Groq 再次处理

## 6. AI 集成

### 6.1 Groq API 配置
- 集成 Groq API\n- 使用 llama-3.1-8b-instruct 模型
- API Key: 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
- 发送结构化提示指令（包含用户选择的样式参数）
- 接收 Slidev markdown 格式返回

### 6.2 Stanzify-AI 系统提示模板
\n**系统角色提示（System Prompt）：**

```\nYou are Stanzify-AI, a Slidev Markdown generation engine.
Your job is to generate beautiful, clean, production-grade slides using Slidev Markdown.
The output MUST follow these rules:
\n1. GENERAL RULES
- Output only valid Slidev Markdown (no comments, no explanations).
- Use clean, modern, premium design similar to Canva, Gamma, Beautiful.ai, Pitch, etc.
- All slides should maintain consistent spacing, typography hierarchy, and color balance.
- Use the provided primary color palette across headings, accents, shapes, backgrounds.\n- NEVER output HTML or JSX. Use pure Markdown + Slidev directives.
\n2. TYPOGRAPHY RULES
- Use strong typographic hierarchy:\n  - H1 → bold, large (titles)
  - H2 → medium bold (section headers)
  - H3 / paragraphs → clean readable body text
- Bullet points must be minimal & concise
- Prefer short phrases → not long paragraphs
\n3. LAYOUT RULES
- Use different layout patterns across slides:
  - Title slide\n  - Two-column layout
  - Image + text\n  - Full-bleed image
  - Stats / numbers
  - Quote slides
  - Comparison layout
  - Process / steps
  - Timeline
  - Call-to-action ending
- Mix layouts to avoid repetition.\n- You may use:
  - ::left::
  - ::right::\n  - ---
    layout: image-right
    ---
  - layout: cover
\n4. COLOR PALETTE HANDLING
- User gives: primary, secondary, accent, background, text
- You must:
  - Use primary for titles
  - Secondary for highlights
  - Accent for shapes/emphasis
  - Maintain high contrast
  - Keep colors consistent across all slides

5. IMAGE HANDLING RULES
- The user may provide:
  - Uploaded image URLs
  - or'Auto-fit images from Unsplash for topic'
- If user requests auto images:
  - Predict relevant, aesthetic Unsplash images
  - Use keyword-based URLs with:
    ![alt](https://source.unsplash.com/featured/?keyword)
  - Use 1–2 images per slide, NEVER overload.\n
6. SLIDE COUNT
- Always generate:
  - 12–20 slides for big topics
  - 6–10 slides for small topics\n  - User input overrides this

7. TONE GUIDELINES
- Professional but friendly
- Simple sentence structure
- No jargon unless user requests it\n- Gamma/Canva-like clarity

8. FINAL OUTPUT FORMAT
- Output ONLY valid Slidev Markdown.
- No explanations.\n- No triple backticks.\n- No extra text.
```

**用户提示格式（User Prompt）：**

```\nTopic: [用户输入的主题]

Color Palette:
Primary: [主色]\nSecondary: [次色]
Accent: [强调色]
Background: [背景色]
Text: [文字色]

Design Style: [设计风格]

Image Mode: [图片模式：auto-unsplash / user-upload / none]

Slide Count: [幻灯片数量]

Extra Notes: [额外要求]
```

**示例：**

```
Topic: Next-Gen EV Charging Network for India

Color Palette:
Primary: #0A84FF
Secondary: #1D1D1F
Accent: #FFD60A
Background: #FFFFFF
Text: #000000

Design Style: corporate\nImage Mode: auto-unsplash
Slide Count: 15
Extra Notes: highlight scalability and reliability.\n```

Groq 输出纯 Slidev Markdown 幻灯片。\n
## 7. 支持的幻灯片类型和功能

### 7.1 布局类型
- default：默认布局\n- cover：封面页
- intro：介绍页
- section：章节分隔页
- quote：引用页
- image-right：右侧图片布局
- image-left：左侧图片布局
- two-cols：双列布局
- iframe：嵌入网页
- center：居中布局
- fact：事实陈述布局
- statement：声明布局
\n### 7.2 动画和交互
- v-click：点击显示动画
- v-after：延迟显示\n- v-motion：高级动画效果
- 代码行聚焦动画
- 幻灯片过渡效果
\n### 7.3 内容类型
- 标题和文本
- 项目符号列表
- 代码块（支持多种语言）
- Mermaid 图表（流程图、时序图、甘特图、类图、状态图、饼图等）
- LaTeX 数学公式
- 图片和视频\n- 图标\n- 表格
- 引用块
\n### 7.4 演示功能
- 演示者模式\n- 绘图模式
- 录制功能
- 全屏模式
- 暗黑模式
- 键盘导航
- 触摸手势
\n## 8. 图片处理流程
1. Groq 生成包含 Unsplash 图片 URL 或用户上传图片路径的 markdown\n2. 从占位符中提取所有关键词
3. 并行从 Unsplash API 获取图片（如选择自动获取）
4. 用实际图片 URL 替换占位符\n5. 使用图片在 Web 端重新渲染 Slidev

## 9. 技术实现\n
### 9.1 前端技术栈
- React + Vite
- Tailwind CSS（UI 样式）
- @slidev/client（幻灯片渲染）
- @slidev/parser（markdown 解析）
- @slidev/types（类型定义）
- **充分利用 Slidev 内置工具，实现 Web 端完整预览**

### 9.2 API 集成
- groq-sdk\n- llama-3.1-8b-instruct 模型
- Unsplash API\n\n### 9.3 状态管理
- React useState/useContext
- 页面间状态传递
\n### 9.4 文件结构
```
/src
  /pages
    -PromptPage.jsx（页面1：提示输入页面）
    - ModeSelectionPage.jsx（页面2：模式选择页面）
    - ViewPresentPage.jsx（页面3：查看和演示页面，Web 端完整预览）
  /components
    /prompt\n      - PromptInput.jsx（提示输入框）
      - ExamplePrompts.jsx（示例提示）
      - ContinueButton.jsx（继续按钮）
    /mode\n      - ColorPalettePicker.jsx（配色方案选择器）
      - DesignStylePicker.jsx（设计风格选择器）\n      - ImageSourceSelector.jsx（图片来源选择器）
      - PurposeSelector.jsx（用途选择器）
      - GenerateButton.jsx（生成按钮）
    /viewer
      - SlideViewer.jsx（Slidev 全功能渲染器，Web 端实现）
      - PresenterMode.jsx（演示者模式）
      - NavigationPanel.jsx（导航面板）
      - ExportButtons.jsx（导出按钮组）
      - RegeneratePanel.jsx（重新生成面板）
      - MarkdownEditor.jsx（Markdown 编辑器）
      - DrawingMode.jsx（绘图模式）
      - RecordingPanel.jsx（录制面板）
    - LoadingState.jsx（加载状态）
  /services
    - groqService.js（Groq API 调用）
    - unsplashService.js（Unsplash API 调用）
    - imageProcessor.js（图片处理）
    - slidevRenderer.js（Slidev 渲染服务，Web 端实现）
  /utils
    - markdownValidator.js（markdown 验证）
    - slidevParser.js（Slidev 解析器）
  /hooks
    - useTheme.js（主题管理）
    - useImageSearch.js（图片搜索）
    - useNavigation.js（页面导航）
    - usePresenterMode.js（演示者模式）
    - useSlidevFeatures.js（Slidev 功能管理）
  App.jsx\n  main.jsx
```

## 10. 设计风格

### 10.1 页面1设计风格
- 配色方案：纯白背景，搭配品牌蓝色作为强调色
- 布局方式：垂直居中的单列布局，大型输入框居中显示
- 交互细节：输入框聚焦时轻微放大效果，打字时流畅的动画反馈，继续按钮悬停时颜色加深

### 10.2 页面2设计风格
- 配色方案：纯白背景，搭配品牌蓝色作为强调色
- 布局方式：垂直居中的单列布局，逐步展开的选择卡片\n- 交互细节：卡片悬停时轻微上浮效果，选中状态带蓝色边框高亮，流畅的展开/收起动画

### 10.3 页面3设计风格\n- 配色方案：浅灰背景，左侧导航栏深色，主预览区白色
- 布局方式：左侧幻灯片缩略图导航栏，右侧大幅预览区的分栏式布局
- 交互细节：幻灯片切换带淡入淡出效果，工具栏悬浮显示，导出按钮带下载进度动画，演示者模式切换流畅

## 11. 性能目标
- 用户输入提示后15秒内显示幻灯片
- **幻灯片完整预览直接在 Web 端渲染，无需外部工具**
- 幻灯片可导航且可读\n- 无崩溃或API错误
- 支持桌面浏览器
- 充分利用 Slidev 全部功能，输出质量达到专业水平
- 页面切换流畅，无明显延迟
- 演示者模式响应迅速\n- 支持大型演示文稿（50+ 幻灯片）\n
## 12. 成功标准
✅ 三页面工作流清晰分离，用户体验流畅
✅ 页面1专注于提示输入，简洁高效
✅ 页面2提供完整的样式和参数配置
✅ **页面3完整的 Slidev 幻灯片预览直接在 Web 端实现，充分利用 Slidev 内置工具**
✅ 支持多种布局类型和高级动画\n✅ 支持 Mermaid 图表、代码高亮、LaTeX 公式等高级功能
✅ 演示者模式功能完善\n✅ 图片自动从Unsplash 填充或支持用户上传
✅ 输出效果专业，充分利用 Slidev 能力
✅ 生成时间在15 秒以内
✅ 支持多种导出格式
✅ 支持重新生成和优化功能
✅ 支持绘图和录制功能
✅ **使用 Stanzify-AI 系统提示模板生成高质量 Slidev Markdown**