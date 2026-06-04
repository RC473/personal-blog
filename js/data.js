// 博客数据
const blogPosts = [
    {
        id: 1,
        title: '如何开始学习前端开发',
        excerpt: '前端开发是一个充满机遇的领域。本文将为你介绍学习前端的最佳路径和资源。',
        content: `<h2>引言</h2>
<p>前端开发已成为最热门的技术领域之一。如果你想进入这个行业，本文将为你指引方向。</p>

<h2>基础知识</h2>
<p>首先，你需要学习三大基础技术：</p>
<ul>
<li><strong>HTML</strong> - 页面结构</li>
<li><strong>CSS</strong> - 页面样式</li>
<li><strong>JavaScript</strong> - 交互逻辑</li>
</ul>

<h2>推荐学习路线</h2>
<ol>
<li>HTML 基础（1-2周）</li>
<li>CSS 基础和进阶（2-3周）</li>
<li>JavaScript 基础（3-4周）</li>
<li>JavaScript 进阶（4-6周）</li>
<li>现代框架（React/Vue/Angular）（4-8周）</li>
</ol>

<h2>实战项目</h2>
<p>理论学习后，立即进行实战项目是最重要的步骤。建议从简单的项目开始，逐步提升难度。</p>

<h2>总结</h2>
<p>博持学习，不断实践，你一定能成为一名优秀的前端开发工程师！</p>`,
        date: '2026-06-01',
        category: '技术',
        tags: ['前端', 'JavaScript', '学习'],
        author: '博主',
        comments: [
            { name: '张三', text: '非常有帮助！', date: '2026-06-02' },
            { name: '李四', text: '期待更多内容', date: '2026-06-02' }
        ]
    },
    {
        id: 2,
        title: 'Vue.js 入门指南',
        excerpt: 'Vue.js 是一个易学易用的 JavaScript 框架。让我们一起探索如何用 Vue 构建现代 Web 应用。',
        content: `<h2>什么是 Vue.js？</h2>
<p>Vue.js 是一个用于构建用户界面的 JavaScript 框架，具有简洁的 API 和卓越的性能。</p>

<h2>核心特性</h2>
<ul>
<li>声明式渲染</li>
<li>组件系统</li>
<li>单文件组件</li>
<li>易学的 API</li>
</ul>

<h2>第一个 Vue 应用</h2>
<p>创建一个简单的 Vue 应用非常简单：</p>
<pre><code>new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})</code></pre>

<h2>总结</h2>
<p>Vue.js 凭借其简洁优雅的设计，正在成为越来越多开发者的选择。</p>`,
        date: '2026-05-28',
        category: '技术',
        tags: ['Vue', '前端框架', 'JavaScript'],
        author: '博主',
        comments: []
    },
    {
        id: 3,
        title: '2026年技术趋势预测',
        excerpt: '回顾过去，展望未来。2026年哪些技术将成为焦点？让我们一起探讨。',
        content: `<h2>AI 和机器学习</h2>
<p>AI 技术继续发展，越来越多的应用场景被开启。</p>

<h2>云计算和边缘计算</h2>
<p>云计算已成为企业标准，边缘计算也逐渐兴起。</p>

<h2>WebAssembly</h2>
<p>WebAssembly 为 Web 带来了原生级别的性能。</p>

<h2>低代码开发</h2>
<p>低代码平台正在改变软件开发的方式。</p>

<h2>总结</h2>
<p>技术的发展永无止境，我们需要不断学习和适应新的变化。</p>`,
        date: '2026-05-25',
        category: '观点',
        tags: ['技术趋势', '2026', 'AI'],
        author: '博主',
        comments: [
            { name: '王五', text: '很有见地', date: '2026-05-26' }
        ]
    },
    {
        id: 4,
        title: '如何高效学习编程',
        excerpt: '学习编程需要正确的方法。本文分享一些高效学习编程的技巧。',
        content: `<h2>建立正确的心态</h2>
<p>学习编程首先需要有正确的心态：不怕出错，勇于尝试。</p>

<h2>实践是最好的老师</h2>
<p>不要只看教程，要立即动手编码。通过实践才能真正掌握知识。</p>

<h2>阅读他人的代码</h2>
<p>阅读优秀代码能帮助你学到最佳实践。</p>

<h2>参与开源项目</h2>
<p>参与开源项目能加速你的学习进度。</p>

<h2>总结</h2>
<p>博持、实践、反思，这三点是成功的关键。</p>`,
        date: '2026-05-20',
        category: '学习',
        tags: ['编程', '学习方法', '效率'],
        author: '博主',
        comments: []
    },
    {
        id: 5,
        title: '深入理解 JavaScript 闭包',
        excerpt: '闭包是 JavaScript 中最重要的概念之一。让我们深入理解闭包的本质。',
        content: `<h2>什么是闭包？</h2>
<p>闭包是一个函数能够访问其外层函数的变量。</p>

<h2>闭包的形成</h2>
<p>当一个内层函数访问外层函数的变量时，就形成了闭包。</p>

<h2>闭包的应用</h2>
<ul>
<li>数据封装</li>
<li>模块模式</li>
<li>防止变量污染</li>
<li>回调函数</li>
</ul>

<h2>常见问题</h2>
<p>理解闭包可以帮助我们写出更好的 JavaScript 代码。</p>

<h2>总结</h2>
<p>掌握闭包对成为 JavaScript 高手至关重要。</p>`,
        date: '2026-05-15',
        category: '技术',
        tags: ['JavaScript', '闭包', '进阶'],
        author: '博主',
        comments: [
            { name: '赵六', text: '很清楚的解释', date: '2026-05-16' },
            { name: '孙七', text: '+1，帮助很大', date: '2026-05-17' }
        ]
    },
    {
        id: 6,
        title: '我的博客搭建之旅',
        excerpt: '从想法到实现，分享我构建这个个人博客的全过程。',
        content: `<h2>初心</h2>
<p>一直想有一个地方记录自己的学习和思考。终于，我决定搭建一个属于自己的博客。</p>

<h2>技术选择</h2>
<p>我选择了静态博客，使用 HTML、CSS 和 JavaScript 构建。</p>

<h2>功能特性</h2>
<ul>
<li>文章分类和标签</li>
<li>搜索功能</li>
<li>评论系统</li>
<li>响应式设计</li>
</ul>

<h2>学到的东西</h2>
<p>在搭建过程中学到了很多关于前端开发的知识。</p>

<h2>未来计划</h2>
<p>未来还会持续优化和添加新功能。</p>

<h2>总结</h2>
<p>搭建博客是一个很好的实战项目。希望大家也能博持写作和记录。</p>`,
        date: '2026-05-10',
        category: '生活',
        tags: ['博客', '建站', '分享'],
        author: '博主',
        comments: [
            { name: '周八', text: '棒！准备学习你的代码', date: '2026-05-11' }
        ]
    }
];

// 获取所有分类
function getAllCategories() {
    const categories = new Set();
    blogPosts.forEach(post => categories.add(post.category));
    return Array.from(categories);
}

// 获取所有标签
function getAllTags() {
    const tags = new Set();
    blogPosts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags);
}

// 按分类获取文章
function getPostsByCategory(category) {
    return blogPosts.filter(post => post.category === category);
}

// 按标签获取文章
function getPostsByTag(tag) {
    return blogPosts.filter(post => post.tags.includes(tag));
}

// 搜索文章
function searchPosts(query) {
    const lowerQuery = query.toLowerCase();
    return blogPosts.filter(post => 
        post.title.toLowerCase().includes(lowerQuery) ||
        post.excerpt.toLowerCase().includes(lowerQuery) ||
        post.content.toLowerCase().includes(lowerQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
}

// 按 ID 获取文章
function getPostById(id) {
    return blogPosts.find(post => post.id === parseInt(id));
}

// 获取相关文章
function getRelatedPosts(postId, limit = 3) {
    const post = getPostById(postId);
    if (!post) return [];
    
    return blogPosts
        .filter(p => p.id !== postId)
        .filter(p => p.tags.some(tag => post.tags.includes(tag)))
        .slice(0, limit);
}