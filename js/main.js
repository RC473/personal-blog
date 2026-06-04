// 主页面逻辑

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    renderPosts(blogPosts);
    renderCategories();
    renderTagsCloud();
    attachEventListeners();
});

// 渲染文章列表
function renderPosts(posts) {
    const postsList = document.getElementById('posts-list');
    const noPosts = document.getElementById('no-posts');
    
    if (posts.length === 0) {
        postsList.innerHTML = '';
        noPosts.style.display = 'block';
        return;
    }
    
    noPosts.style.display = 'none';
    postsList.innerHTML = posts.map(post => `
        <div class="post-card" onclick="goToPost(${post.id})">
            <h2>${escapeHtml(post.title)}</h2>
            <div class="post-meta">
                <span>📅 ${formatDate(post.date)}</span>
                <span>📂 ${escapeHtml(post.category)}</span>
            </div>
            <p class="post-excerpt">${escapeHtml(post.excerpt)}</p>
            <div class="post-footer">
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="post-tag">#${escapeHtml(tag)}</span>`).join('')}
                </div>
                <a href="#" class="read-more">阅读全文 →</a>
            </div>
        </div>
    `).join('');
}

// 渲染分类
function renderCategories() {
    const categoriesList = document.getElementById('categories-list');
    const categories = getAllCategories();
    
    categoriesList.innerHTML = categories.map(category => {
        const count = getPostsByCategory(category).length;
        return `
            <li>
                <a href="#" onclick="filterByCategory('${escapeHtml(category)}'); return false;">
                    <span>${escapeHtml(category)}</span>
                    <span class="category-count">${count}</span>
                </a>
            </li>
        `;
    }).join('');
}

// 渲染标签云
function renderTagsCloud() {
    const tagsCloud = document.getElementById('tags-cloud');
    const tags = getAllTags();
    
    tagsCloud.innerHTML = tags.map(tag => `
        <span class="tag" onclick="filterByTag('${escapeHtml(tag)}')">#${escapeHtml(tag)}</span>
    `).join('');
}

// 附加事件监听
function attachEventListeners() {
    // 搜索功能
    document.getElementById('search-btn').addEventListener('click', performSearch);
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performSearch();
    });
    
    // 分类链接
    document.getElementById('categories-link').addEventListener('click', function(e) {
        e.preventDefault();
        showCategoriesModal();
    });
    
    // 标签链接
    document.getElementById('tags-link').addEventListener('click', function(e) {
        e.preventDefault();
        showTagsModal();
    });
    
    // 关于链接
    document.getElementById('about-link').addEventListener('click', function(e) {
        e.preventDefault();
        alert('这是一个现代化的静态个人博客。\n\n功能特性：\n• 文章分类和标签\n• 搜索功能\n• 评论系统\n• 响应式设计\n\n欢迎访问！');
    });
    
    // 关闭模态框
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(e) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// 执行搜索
function performSearch() {
    const query = document.getElementById('search-input').value.trim();
    if (query === '') {
        renderPosts(blogPosts);
        return;
    }
    
    const results = searchPosts(query);
    renderPosts(results);
}

// 按分类过滤
function filterByCategory(category) {
    const posts = getPostsByCategory(category);
    renderPosts(posts);
    document.getElementById('search-input').value = '';
    window.scrollTo(0, 0);
}

// 按标签过滤
function filterByTag(tag) {
    const posts = getPostsByTag(tag);
    renderPosts(posts);
    document.getElementById('search-input').value = '';
    window.scrollTo(0, 0);
}

// 显示分类模态框
function showCategoriesModal() {
    const modal = document.getElementById('category-modal');
    const title = document.getElementById('category-title');
    const content = document.getElementById('category-posts');
    
    const categories = getAllCategories();
    title.textContent = '所有分类';
    content.innerHTML = categories.map(category => {
        const posts = getPostsByCategory(category);
        return `
            <div style="margin-bottom: 1.5rem;">
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;">${escapeHtml(category)} (${posts.length})</h3>
                <ul style="list-style: none;">
                    ${posts.map(post => `
                        <li style="margin-bottom: 0.5rem;">
                            <a href="#" onclick="goToPost(${post.id}); return false;" style="color: var(--primary-color); text-decoration: none;">
                                ${escapeHtml(post.title)}
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }).join('');
    
    modal.style.display = 'block';
}

// 显示标签模态框
function showTagsModal() {
    const modal = document.getElementById('tag-modal');
    const title = document.getElementById('tag-title');
    const content = document.getElementById('tag-posts');
    
    const tags = getAllTags();
    title.textContent = '所有标签';
    content.innerHTML = tags.map(tag => {
        const posts = getPostsByTag(tag);
        return `
            <div style="margin-bottom: 1.5rem;">
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;">标签: #${escapeHtml(tag)} (${posts.length})</h3>
                <ul style="list-style: none;">
                    ${posts.map(post => `
                        <li style="margin-bottom: 0.5rem;">
                            <a href="#" onclick="goToPost(${post.id}); return false;" style="color: var(--primary-color); text-decoration: none;">
                                ${escapeHtml(post.title)}
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }).join('');
    
    modal.style.display = 'block';
}

// 跳转到文章页面
function goToPost(postId) {
    window.location.href = `post.html?id=${postId}`;
}

// 辅助函数：转义 HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// 辅助函数：格式化日期
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('zh-CN', options);
}