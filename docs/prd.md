# Stanzify - AI演示文稿生成器需求文档

## 1. 项目概述\nStanzify 是一个基于 AI 的演示文稿生成工具，通过 Groq AI 和 Slidev 渲染技术，将用户的简单文本提示转换为精美、专业的演示文稿。支持主题定制、智能布局、图片集成等高级功能。

## 2. 核心功能

### 2.1 输入界面\n- 单个文本输入区域，用于接收用户提示
- '生成幻灯片' 按钮\n- 基础加载状态显示

### 2.2 AI 集成
- 集成 Groq API
- 使用 llama-3.1-8b-instruct 模型
- API Key: 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
- 发送结构化提示指令
- 接收 Slidev markdown 格式返回

### 2.3 幻灯片渲染
- 使用 Slidev 查看器显示生成的 markdown
- 支持自定义主题
- 支持基础幻灯片导航

### 2.4 支持的幻灯片类型
- 标题幻灯片
- 内容幻灯片（项目符号、文本）
- 章节分隔符\n- 多列布局
- Mermaid 图表（流程图、时间线）\n- 代码块（带语法高亮）
- 图片幻灯片\n
## 3. 第二阶段功能：增强设计与定制

### 3.1 主题定制
- 调色板选择器（5 种预设配色方案）
- 自定义颜色选择器（主色、辅助色、强调色）
- 字体配对选择器（3-4 种组合）
- 背景样式选项（纯色、渐变、图片）

### 3.2 高级 Slidev 特性
- Mermaid 图表（流程图、时间线）\n- 代码块（带语法高亮）
- 多列布局
- Unsplash 图片集成
- 过渡动画
- 演讲者备注

### 3.3 布局智能\n- 自动检测内容类型（文本密集型、视觉型、数据型）
- 智能幻灯片拆分（每张幻灯片最多 5 个要点）
- 混合内容的平衡布局
- 响应式图片定位

### 3.4 图片集成\n- Unsplash API 集成\n- 从提示中提取关键词\n- 自动获取相关图片
- 用户图片上传选项
- 图片裁剪/定位

### 3.5 预览与编辑
- 生成时实时预览
- 基础markdown 编辑器（可选调整）
- 重新生成特定幻灯片
- 幻灯片重新排序

## 4. 技术实现

### 4.1 前端技术栈
- React + Vite
- Tailwind CSS（UI 样式）
- @slidev/client（幻灯片渲染）

### 4.2 API 集成
- groq-sdk\n- llama-3.1-8b-instruct 模型
- Unsplash API
\n### 4.3 状态管理
- React useState/useContext

### 4.4 文件结构
```
/src
  /components
    - PromptInput.jsx（输入表单）
    - SlideViewer.jsx（Slidev 渲染器）
    - LoadingState.jsx（加载状态）
    /customization
      - ThemePicker.jsx（主题选择器）
      - ColorSelector.jsx（颜色选择器）
      - FontPicker.jsx（字体选择器）
      - StyleSelector.jsx（风格选择器）
    /editor
      - MarkdownEditor.jsx（Markdown 编辑器）\n      - SlideReorderer.jsx（幻灯片排序器）
    /preview
      - LivePreview.jsx（实时预览）
  /services
    - groqService.js（Groq API 调用）\n    - unsplashService.js（Unsplash API 调用）
    - imageProcessor.js（图片处理）
  /utils
    - markdownValidator.js（markdown 验证）\n  /hooks
    - useTheme.js（主题管理）
    - useImageSearch.js（图片搜索）
  App.jsx
  main.jsx
```\n
## 5. 增强版AI 提示模板
```
You are an expert Slidev presentation designer. Generate a presentation:\n
TOPIC: {user_prompt}
THEME: {selected_theme}
COLORS: Primary: {primary_color}, Accent: {accent_color}
STYLE: {style_preference} (minimal/corporate/creative/academic)

REQUIREMENTS:
1. Use Slidev advanced features:
   - Mermaid diagrams where appropriate
   - Multi-column layouts for comparisons
   - Code blocks if technical content
   - Proper heading hierarchy

2. Layout rules:
   - Max 5 bullets per slide
   - Split long content into multiple slides
   - Use section dividers every 3-4 slides
   - Add speaker notes for key slides

3. Image placeholders:
   - Identify 3-5 key slides needing images
   - Format: ![alt text](IMAGE_PLACEHOLDER_keyword)
   - Keywords should be specific and relevant\n
4. Visual hierarchy:\n   - Vary slide layouts (not all bullets)
   - Use callouts for important points
   - Include at least one diagram/chart
   - Progressive disclosure with v-clicks

Output valid Slidev markdown with proper frontmatter.
```

## 6. 图片处理流程
1. Groq 生成包含 IMAGE_PLACEHOLDER_keyword 的 markdown
2. 从占位符中提取所有关键词
3. 并行从 Unsplash API 获取图片
4. 用实际图片 URL 替换占位符\n5. 使用图片重新渲染 Slidev

## 7. 性能目标
- 用户输入提示后 15 秒内显示幻灯片
- 幻灯片可导航且可读
- 无崩溃或 API 错误
- 支持桌面浏览器
- 输出质量达到 Gamma 的 80% 水平

## 8. 设计风格
- 界面风格：参考 GPT、Bolt、Gamma 等现代 AI 工具的简洁界面
- 配色方案：科技感蓝色为主色调，搭配中性灰和白色背景\n- 布局方式：左侧输入与定制区域，右侧实时预览区域的分栏式布局
- 交互细节：流畅的加载动画，平滑的幻灯片切换过渡效果，响应式颜色和主题切换

## 9. 成功标准
✅ 用户可自定义主题/颜色
✅ 图片自动从 Unsplash 填充
✅ 幻灯片包含图表和多样化布局
✅ 输出效果专业（达到 Gamma 80% 质量）
✅ 生成时间在 15 秒以内