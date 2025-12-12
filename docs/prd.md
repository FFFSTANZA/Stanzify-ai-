# Stanzify - AI演示文稿生成器需求文档

## 1. 项目概述\nStanzify 是一个基于 AI 的演示文稿生成工具，通过 Groq AI 和 Slidev 渲染技术，将用户的简单文本提示转换为精美、专业的演示文稿。采用两页面工作流设计（类似 Bolt、Rocket、MeDo），提供清晰、高端的用户体验。

## 2. 页面架构

### 2.1 两页面工作流
- **页面1**：创建演示文稿页面（Prompt Page）- 用户输入和配置页面
- **页面2**：演示文稿查看器页面（Slide Viewer Page）- 结果展示和编辑页面
-页面间切换流畅，保持界面清晰和高端感

## 3. 页面1- 创建演示文稿页面

### 3.1 整体布局风格
- 参考 Bolt、Rocket、Loveable 的设计风格
- 全白/干净背景
- 居中对齐的提示框
- 大字体排版
- 极简主义、高端 UI
- 流畅动画效果
- 最少干扰元素

### 3.2 步骤1：生成前样式选择
\n#### 3.2.1 配色方案选择
预设调色板（类似 Tailwind 配色）：
- Minimal White（极简白）
- Blue Tech（科技蓝）
- Sunset Orange（日落橙）\n- Forest Green（森林绿）
- Royal Purple（皇家紫）
\n每个调色板展示：
- 背景色
- 强调色
- 字体颜色

#### 3.2.2 设计风格选择
- Minimal Professional（极简专业）
- Modern Gradient（现代渐变）
- Corporate Sharp（企业锐利）
- Dark Mode（暗黑模式）
- Creative / Vibrant（创意/活力）
- Academic Clean（学术简洁）

#### 3.2.3 图片来源偏好
- 上传我自己的图片
- 从 Unsplash 自动获取（基于关键词）
- 无图片（纯文本）

#### 3.2.4 幻灯片用途
- Pitch Deck（融资演示）
- Educational lesson（教育课程）
- Business report（商业报告）
- Marketing slides（营销幻灯片）\n- Webinar slides（网络研讨会幻灯片）
- Personal / Creative（个人/创意）

### 3.3 步骤2：用户输入提示
\n#### 3.3.1 输入区域设计
- 大型文本区域（类似 Bolt/Loveable）
- 圆角边缘\n- 可扩展文本框
- 轻微阴影效果
- 打字动画效果
\n#### 3.3.2 示例提示
- '为解决电动汽车充电桩正常运行时间问题的AI 初创公司创建融资演示'
- '制作关于区块链共识机制的课堂演示'
- '制作解释印度电动汽车生态系统的报告式演示文稿'

#### 3.3.3 生成按钮
- CTA 按钮：'生成演示文稿 →'
- 醒目设计，带悬停效果
\n## 4. 页面2 - 演示文稿查看器页面

### 4.1 页面切换\n- 点击'生成演示文稿'后，系统切换到完全不同的页面
- 类似 Bolt 从提示屏幕切换到代码编辑器的方式
- 保持 UI 清晰和高端感

### 4.2 页面内容
\n#### 4.2.1 核心展示区域
- Slidev 渲染的演示文稿\n- 全屏预览模式
- 幻灯片导航面板
- 下载按钮
- 重新生成按钮
- 编辑 markdown 按钮（可选）

#### 4.2.2 UI 设计灵感
- MeDo：清晰的结果页面
- Bolt代码工作区：与提示分离
- Rocket：清晰的右侧输出窗口
\n### 4.3 核心功能

#### 4.3.1 实时 Slidev 渲染器
- 即时渲染 Slidev markdown
- 支持功能：
  - 动画效果
  - 主题\n  - 布局
  - 图片
  - 代码块
  - 图表\n\n#### 4.3.2 导出选项
- PDF 格式
- HTML 格式
- 图片序列
- Markdown 文件

#### 4.3.3 重新生成/优化功能
- 更改主题
- 更改布局
- 添加幻灯片
- 使其更专业
- '用更好的解释重写内容'
-所有操作通过 Groq 再次处理

## 5. AI 集成

### 5.1 Groq API 配置
- 集成 Groq API\n- 使用 llama-3.1-8b-instruct 模型
- API Key: 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
- 发送结构化提示指令（包含用户选择的样式参数）
- 接收 Slidev markdown 格式返回

### 5.2 增强版 AI 提示模板
```\nYou are an expert Slidev presentation designer. Generate a presentation:\n\nTOPIC: {user_prompt}
THEME: {selected_theme}
COLORS: Primary: {primary_color}, Accent: {accent_color}\nSTYLE: {style_preference} (minimal/corporate/creative/academic)\nPURPOSE: {slide_purpose}\n
REQUIREMENTS:
1. Use Slidev advanced features:\n   - Mermaid diagrams where appropriate
   - Multi-column layouts for comparisons
   - Code blocks if technical content
   - Proper heading hierarchy
\n2. Layout rules:
   - Max 5 bullets per slide
   - Split long content into multiple slides
   - Use section dividers every 3-4 slides
   - Add speaker notes for key slides

3. Image placeholders:
   - Identify3-5 key slides needing images
   - Format: ![alt text](IMAGE_PLACEHOLDER_keyword)
   - Keywords should be specific and relevant

4. Visual hierarchy:
   - Vary slide layouts (not all bullets)
   - Use callouts for important points
   - Include at least one diagram/chart
   - Progressive disclosure with v-clicks

Output valid Slidev markdown with proper frontmatter.
```
\n## 6. 支持的幻灯片类型
- 标题幻灯片
- 内容幻灯片（项目符号、文本）
- 章节分隔符\n- 多列布局
- Mermaid 图表（流程图、时间线）
- 代码块（带语法高亮）
- 图片幻灯片
\n## 7. 图片处理流程
1. Groq 生成包含 IMAGE_PLACEHOLDER_keyword 的 markdown\n2. 从占位符中提取所有关键词
3. 并行从 Unsplash API 获取图片
4. 用实际图片 URL 替换占位符\n5. 使用图片重新渲染 Slidev\n
## 8. 技术实现
\n### 8.1 前端技术栈
- React + Vite
- Tailwind CSS（UI 样式）
- @slidev/client（幻灯片渲染）
\n### 8.2 API 集成
- groq-sdk\n- llama-3.1-8b-instruct 模型
- Unsplash API\n\n### 8.3 状态管理
- React useState/useContext
- 页面间状态传递
\n### 8.4 文件结构
```
/src
  /pages
    - CreatePage.jsx（页面1：创建演示文稿页面）
    - ViewerPage.jsx（页面2：查看器页面）
  /components
    /create\n      - StyleSelector.jsx（样式选择器）
      - ColorPalettePicker.jsx（配色方案选择器）
      - DesignStylePicker.jsx（设计风格选择器）
      - ImageSourceSelector.jsx（图片来源选择器）
      - PurposeSelector.jsx（用途选择器）
      - PromptInput.jsx（提示输入框）
      - GenerateButton.jsx（生成按钮）
    /viewer
      - SlideViewer.jsx（Slidev 渲染器）
      - NavigationPanel.jsx（导航面板）
      - ExportButtons.jsx（导出按钮组）
      - RegeneratePanel.jsx（重新生成面板）
      - MarkdownEditor.jsx（Markdown 编辑器）
    - LoadingState.jsx（加载状态）
  /services
    - groqService.js（Groq API 调用）
    - unsplashService.js（Unsplash API 调用）
    - imageProcessor.js（图片处理）
  /utils
    - markdownValidator.js（markdown 验证）
  /hooks
    - useTheme.js（主题管理）
    - useImageSearch.js（图片搜索）
    - useNavigation.js（页面导航）
  App.jsx\n  main.jsx
```

## 9. 设计风格

### 9.1 页面1设计风格
- 配色方案：纯白背景，搭配品牌蓝色作为强调色
- 布局方式：垂直居中的单列布局，逐步展开的选择卡片\n- 交互细节：卡片悬停时轻微上浮效果，选中状态带蓝色边框高亮，流畅的展开/收起动画

### 9.2 页面2设计风格\n- 配色方案：浅灰背景，左侧导航栏深色，主预览区白色
- 布局方式：左侧幻灯片缩略图导航栏，右侧大幅预览区的分栏式布局
- 交互细节：幻灯片切换带淡入淡出效果，工具栏悬浮显示，导出按钮带下载进度动画

## 10. 性能目标
- 用户输入提示后15 秒内显示幻灯片
- 幻灯片可导航且可读
- 无崩溃或API 错误
- 支持桌面浏览器
- 输出质量达到 Gamma 的 80% 水平
- 页面切换流畅，无明显延迟

## 11. 成功标准
✅ 两页面工作流清晰分离，用户体验流畅
✅ 用户可在生成前自定义主题、颜色、风格、用途
✅ 图片自动从 Unsplash 填充或支持用户上传
✅ 幻灯片包含图表和多样化布局
✅ 输出效果专业（达到 Gamma 80% 质量）
✅ 生成时间在 15 秒以内
✅ 支持多种导出格式\n✅ 支持重新生成和优化功能