# 个人博客 - Personal Blog

一个现代化的静态个人博客系统，使用纯 HTML、CSS 和 JavaScript 构建。

## ✨ 功能特性

- 📝 **文章管理** - 支持多篇文章，采用数据驱动的方式
- 🏷️ **分类和标签** - 灵活的文章分类和标签系统
- 🔍 **搜索功能** - 实时搜索文章标题、内容和标签
- 💬 **评论系统** - 简单的本地评论功能（基于浏览器存储）
- 📱 **响应式设计** - 完美支持各种设备（桌面、平板、手机）
- 🎨 **现代化界面** - 使用渐变色和阴影的现代 UI 设计
- ⚡ **高性能** - 纯静态文件，无需后端服务

## 📂 项目结构

```
personal-blog/
├── index.html          # 首页
├── post.html          # 文章详情页
├── styles/
│   ├── main.css       # 主样式
│   ├── post.css       # 文章详情页样式
│   └── responsive.css # 响应式样式
├── js/
│   ├── data.js        # 文章数据和辅助函数
│   ├── main.js        # 首页逻辑
│   └── post.js        # 文章页逻辑
└── README.md          # 项目文档
```

## 🚀 快速开始

### 方式 1：直接在浏览器打开

1. 克隆或下载本仓库
2. 打开 `index.html` 文件

### 方式 2：使用本地服务器（推荐）

使用 Python：
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

然后在浏览器访问 `http://localhost:8000`

使用 Node.js（http-server）：
```bash
npm install -g http-server
http-server
```

## 📝 如何添加文章

编辑 `js/data.js` 文件中的 `blogPosts` 数组：

```javascript
{
    id: 7,
    title: '文章标题',
    excerpt: '文章摘要',
    content: `<h2>标题</h2><p>内容...</p>`,
    date: '2026-06-04',
    category: '分类名称',
    tags: ['标签1', '标签2'],
    author: '作者名',
    comments: []
}
```

## 🎨 定制样式

编辑 `styles/main.css` 中的 CSS 变量来自定义颜色主题：

```css
:root {
    --primary-color: #667eea;      /* 主色 */
    --secondary-color: #764ba2;    /* 副色 */
    --text-color: #333;            /* 文本色 */
    --bg-color: #f9f9f9;          /* 背景色 */
}
```

## 🌐 部署

这个博客可以轻松部署到：

- **GitHub Pages** - 免费托管
- **Netlify** - 自动构建和部署
- **Vercel** - 最佳性能
- **任何支持静态文件的服务器** - Apache、Nginx 等

### 部署到 GitHub Pages

1. 创建一个名为 `username.github.io` 的仓库
2. 将项目文件推送到主分支
3. 访问 `https://username.github.io`

## 💡 功能说明

### 文章列表
- 显示所有文章的列表
- 支持按标题、内容和标签搜索
- 点击文章卡片进入详情页

### 分类系统
- 左侧边栏显示所有分类
- 点击分类可过滤文章
- 显示每个分类的文章数量

### 标签系统
- 标签云显示在左侧边栏
- 支持点击标签过滤文章
- 文章页面显示所有相关标签

### 搜索功能
- 实时搜索文章
- 支持搜索标题、内容和标签
- 显示搜索结果数量

### 评论系统
- 在文章详情页评论
- 评论存储在浏览器本地
- 支持添加新评论

### 相关文章
- 文章详情页自动显示相关文章
- 基于标签的关联性查找
- 点击可跳转到相关文章

## 🛠️ 技术栈

- **HTML5** - 页面结构
- **CSS3** - 样式设计
- **Vanilla JavaScript** - 交互逻辑
- **无需框架** - 轻量级、易维护

## 📱 浏览器兼容性

- Chrome 最新版本
- Firefox 最新版本
- Safari 最新版本
- Edge 最新版本
- 移动浏览器 (iOS Safari, Chrome Mobile)

## 🔮 改进空间

未来可以添加的功能：

- [ ] 数据持久化（使用 localStorage 或后端 API）
- [ ] 分页功能
- [ ] 深色模式
- [ ] 多语言支持
- [ ] RSS 订阅
- [ ] 社交分享
- [ ] 阅读统计
- [ ] SEO 优化
- [ ] 代码高亮
- [ ] 目录生成

## 📄 许可证

MIT License - 自由使用和修改

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！


---

**祝你的博客发展顺利！** 🎉
