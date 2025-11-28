# Tanzify - AI演示文稿生成器需求文档

## 1. 项目概述
Tanzify 是一个基于 AI 的演示文稿生成工具，通过 Groq AI 和 Slidev 渲染技术，将用户的简单文本提示转换为精美、专业的演示文稿。

## 2. 核心功能

### 2.1 输入界面
- 单个文本输入区域，用于接收用户提示
- '生成幻灯片' 按钮\n- 基础加载状态显示

### 2.2 AI 集成
- 集成 Groq API\n- 使用 llama-3.1-8b-instruct 模型
- API Key: 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
- 发送结构化提示指令
- 接收 Slidev markdown 格式返回

### 2.3 幻灯片渲染\n- 使用 Slidev 查看器显示生成的 markdown
- 采用默认主题\n- 支持基础幻灯片导航

### 2.4 支持的幻灯片类型
- 标题幻灯片
- 内容幻灯片（项目符号、文本）
- 章节分隔符\n- 简单布局\n
## 3. 技术实现

### 3.1 前端技术栈
- React + Vite
- Tailwind CSS（UI 样式）
- @slidev/client（幻灯片渲染）

### 3.2 API 集成
- groq-sdk\n- llama-3.1-8b-instruct 模型
\n### 3.3 状态管理
- React useState/useContext
\n### 3.4 文件结构
```
/src
  /components
    - PromptInput.jsx（输入表单）
    - SlideViewer.jsx（Slidev 渲染器）
    - LoadingState.jsx（加载状态）\n  /services
    - groqService.js（API 调用）
  /utils
    - markdownValidator.js（markdown 验证）
  App.jsx
  main.jsx
```

## 4. AI 提示模板
```\nYou are a Slidev markdown expert. Generate a presentation with:
- Title slide with main topic
- 5-7 content slides\n- Clear headers and bullet points\n- One section divider
- Use proper Slidev syntax with --- separators
\nTopic: {user_prompt}
\nOutput ONLY valid Slidev markdown.
```

## 5. 性能目标
- 用户输入提示后5-10 秒内显示幻灯片
- 幻灯片可导航且可读
- 无崩溃或 API 错误
- 支持桌面浏览器

## 6. 设计风格
- 界面风格：参考 GPT、Loveable、Rocket、Bolt 等现代 AI 工具的简洁界面
- 配色方案：科技感蓝色为主色调，搭配中性灰和白色背景
- 布局方式：左侧输入区域，右侧实时预览区域的分栏式布局
- 交互细节：流畅的加载动画，平滑的幻灯片切换过渡效果