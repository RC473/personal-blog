// 博客数据
const blogPosts = [
    {
    id: 1,
    title: 'Test',
    excerpt: '这是一个测试',
    content: `<h2>标题</h2><p>内容...</p>`,
    date: '2026-06-04',
    category: '测试',
    tags: ['测试', '多标签'],
    author: 'Ricky',
    comments: []
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
