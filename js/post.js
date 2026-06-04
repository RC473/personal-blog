// 文章详情页面逻辑

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    if (postId) {
        displayPost(postId);
        renderRelatedPosts(postId);
    } else {
        window.location.href = 'index.html';
    }
    
    attachEventListeners();
});

// 显示文章
function displayPost(postId) {
    const post = getPostById(postId);
    
    if (!post) {
        window.location.href = 'index.html';
        return;
    }
    
    // 设置标题
    document.title = post.title + ' - My Blog';
    
    // 填充文章信息
    document.getElementById('post-title').textContent = post.title;
    document.getElementById('post-date').textContent = '📅 ' + formatDate(post.date);
    document.getElementById('post-category').textContent = '📂 ' + post.category;
    
    // 填充标签
    const tagsContainer = document.getElementById('post-tags');
    tagsContainer.innerHTML = post.tags.map(tag => `
        <span class="post-tag" onclick="filterByTag('${escapeHtml(tag)}')">#${escapeHtml(tag)}</span>
    `).join('');
    
    // 填充内容
    document.getElementById('post-content').innerHTML = post.content;
    
    // 填充评论
    renderComments(post.comments);
    
    // 保存当前文章 ID 供评论使用
    window.currentPostId = postId;
}

// 显示相关文章
function renderRelatedPosts(postId) {
    const relatedPosts = getRelatedPosts(postId, 3);
    const container = document.getElementById('related-posts-list');
    
    if (relatedPosts.length === 0) {
        container.innerHTML = '<p>暂无相关文章</p>';
        return;
    }
    
    container.innerHTML = relatedPosts.map(post => `
        <div class="post-card" onclick="goToPost(${post.id})">
            <h3>${escapeHtml(post.title)}</h3>
            <div class="post-meta">
                <span>${formatDate(post.date)}</span>
                <span>${escapeHtml(post.category)}</span>
            </div>
            <p style="color: var(--text-light); margin: 0.5rem 0;">${escapeHtml(post.excerpt)}</p>
        </div>
    `).join('');
}

// 渲染评论
function renderComments(comments) {
    const commentsList = document.getElementById('comments-list');
    
    if (comments.length === 0) {
        commentsList.innerHTML = '<p style="color: var(--text-light);">还没有评论，成为第一个评论者吧！</p>';
        return;
    }
    
    commentsList.innerHTML = comments.map((comment, index) => `
        <div class="comment-item">
            <div class="comment-author">${escapeHtml(comment.name)}</div>
            <div class="comment-date">${formatDate(comment.date)}</div>
            <div class="comment-text">${escapeHtml(comment.text)}</div>
        </div>
    `).join('');
}

// 附加事件监听
function attachEventListeners() {
    // 提交评论
    document.getElementById('submit-comment').addEventListener('click', submitComment);
    
    // 分类链接
    document.getElementById('categories-link').addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'index.html';
    });
    
    // 标签链接
    document.getElementById('tags-link').addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'index.html';
    });
    
    // 关于链接
    document.getElementById('about-link').addEventListener('click', function(e) {
        e.preventDefault();
        alert('这是一个现代化的静态个人博客。\n\n功能特性：\n• 文章分类和标签\n• 搜索功能\n• 评论系统\n• 响应式设计\n\n欢迎访问！');
    });
}

// 提交评论
function submitComment() {
    const name = document.getElementById('comment-name').value.trim();
    const text = document.getElementById('comment-text').value.trim();
    
    if (!name || !text) {
        alert('请填写名字和评论内容');
        return;
    }
    
    // 创建新评论
    const newComment = {
        name: name,
        text: text,
        date: new Date().toISOString().split('T')[0]
    };
    
    // 获取当前文章
    const post = getPostById(window.currentPostId);
    if (post) {
        post.comments.push(newComment);
        renderComments(post.comments);
        
        // 清空表单
        document.getElementById('comment-name').value = '';
        document.getElementById('comment-text').value = '';
        
        alert('评论已发布！');
    }
}

// 按标签过滤（返回主页）
function filterByTag(tag) {
    window.location.href = `index.html?tag=${encodeURIComponent(tag)}`;
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