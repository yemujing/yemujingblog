// 使用 localStorage 存储文章数据
let posts = JSON.parse(localStorage.getItem('posts')) || [
    {
        id: 1,
        title: "设计师必备的五款效率工具",
        excerpt: "提升工作效率，让设计更有趣...",
        image: "https://picsum.photos/id/1/600/400",
        date: "2024-03-15"
    },
    {
        id: 2,
        title: "极简主义工作法则",
        excerpt: "如何用更少的工具完成更多事情...",
        image: "https://picsum.photos/id/2/600/400",
        date: "2024-03-14"
    },
    {
        id: 3,
        title: "下一代笔记应用探索",
        excerpt: "重新定义数字时代的知识管理...",
        image: "https://picsum.photos/id/3/600/400",
        date: "2024-03-13"
    }
];

// 保存文章到 localStorage
function savePosts() {
    localStorage.setItem('posts', JSON.stringify(posts));
}

// 加载文章到页面
function loadPosts() {
    const postGrid = document.querySelector('.post-grid');
    postGrid.innerHTML = ''; // 清空现有内容
    
    posts.forEach(post => {
        const postElement = document.createElement('article');
        postElement.className = 'post-card';
        
        postElement.innerHTML = `
            <img src="${post.image}" alt="${post.title}">
            <div class="post-content">
                <h4>${post.title}</h4>
                <p>${post.excerpt}</p>
                <div class="post-meta">
                    <small>${post.date}</small>
                </div>
                <div class="post-actions">
                    <button class="edit-btn" onclick="editPost(${post.id})">编辑</button>
                    <button class="delete-btn" onclick="deletePost(${post.id})">删除</button>
                </div>
            </div>
        `;
        
        postGrid.appendChild(postElement);
    });
}

// 打开模态框
function openPostModal() {
    document.getElementById('postModal').style.display = 'block';
    document.getElementById('modalTitle').textContent = '发布新文章';
    document.getElementById('postForm').reset();
    document.getElementById('postId').value = '';
}

// 关闭模态框
function closePostModal() {
    document.getElementById('postModal').style.display = 'none';
}

// 编辑文章
function editPost(id) {
    const post = posts.find(p => p.id === id);
    if (post) {
        document.getElementById('postId').value = post.id;
        document.getElementById('title').value = post.title;
        document.getElementById('excerpt').value = post.excerpt;
        document.getElementById('image').value = post.image;
        document.getElementById('modalTitle').textContent = '编辑文章';
        openPostModal();
    }
}

// 删除文章
function deletePost(id) {
    if (confirm('确定要删除这篇文章吗？')) {
        posts = posts.filter(p => p.id !== id);
        savePosts();
        loadPosts();
    }
}

// 处理表单提交
document.getElementById('postForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const postId = document.getElementById('postId').value;
    const newPost = {
        id: postId ? parseInt(postId) : Date.now(),
        title: document.getElementById('title').value,
        excerpt: document.getElementById('excerpt').value,
        image: document.getElementById('image').value,
        date: new Date().toISOString().split('T')[0]
    };

    if (postId) {
        // 更新现有文章
        const index = posts.findIndex(p => p.id === parseInt(postId));
        if (index !== -1) {
            posts[index] = newPost;
        }
    } else {
        // 添加新文章
        posts.unshift(newPost);
    }

    savePosts();
    loadPosts();
    closePostModal();
});

// 点击模态框外部关闭
window.onclick = function(event) {
    const modal = document.getElementById('postModal');
    if (event.target === modal) {
        closePostModal();
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 获取当前页面路径
    const currentPath = window.location.pathname;
    
    // 根据页面加载不同的内容
    if (currentPath.includes('products.html')) {
        // 产品页面
        loadProducts();
        
        // 添加产品筛选功能
        const filterBtns = document.querySelectorAll('.filter-btn');
        if (filterBtns.length > 0) {
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    const category = btn.dataset.category;
                    filterProducts(category);
                });
            });
        }

        // 添加重置数据按钮功能
        const resetBtn = document.querySelector('.reset-data-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                localStorage.removeItem('productHuntData');
                location.reload();
            });
        }
    } else {
        // 首页
        loadPosts();
    }

    // 通用功能：添加新建文章按钮事件
    const addPostBtn = document.querySelector('.add-post-btn');
    if (addPostBtn) {
        addPostBtn.addEventListener('click', openPostModal);
    }

    // 通用功能：导航项目点击处理
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            navItems.forEach(i => i.classList.remove('active'));
            e.currentTarget.classList.add('active');
        });
    });

    // 通用功能：侧栏折叠
    const sideNav = document.querySelector('.side-nav');
    const mainContent = document.querySelector('.main-content');
    const navToggle = document.createElement('button');
    navToggle.className = 'nav-toggle';
    navToggle.innerHTML = '◀';
    
    document.querySelector('.nav-header').appendChild(navToggle);

    navToggle.addEventListener('click', () => {
        sideNav.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
        navToggle.innerHTML = sideNav.classList.contains('collapsed') ? '▶' : '◀';
    });

    sideNav.addEventListener('mouseenter', () => {
        if (sideNav.classList.contains('collapsed')) {
            sideNav.style.width = '250px';
            document.querySelectorAll('.nav-item span:not(.nav-icon)').forEach(span => {
                span.style.opacity = '1';
                span.style.width = 'auto';
            });
            document.querySelector('.site-title').style.opacity = '1';
            document.querySelector('.site-title').style.width = 'auto';
        }
    });

    sideNav.addEventListener('mouseleave', () => {
        if (sideNav.classList.contains('collapsed')) {
            sideNav.style.width = '60px';
            document.querySelectorAll('.nav-item span:not(.nav-icon)').forEach(span => {
                span.style.opacity = '0';
                span.style.width = '0';
            });
            document.querySelector('.site-title').style.opacity = '0';
            document.querySelector('.site-title').style.width = '0';
        }
    });
});

function loadProducts() {
    const productGrid = document.querySelector('.product-grid');
    const products = JSON.parse(localStorage.getItem('productHuntData'));
    
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productElement = document.createElement('article');
        productElement.className = 'product-card';
        
        productElement.innerHTML = `
            <div class="product-header">
                <img src="${product.image}" alt="${product.name}" class="product-icon">
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p class="product-description">${product.description}</p>
                    <div class="product-categories">
                        ${product.categories.map(cat => `
                            <span class="category-tag">${cat}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="product-meta-info">
                <div class="product-maker">
                    <span>By ${product.maker.join(', ')}</span>
                </div>
                ${product.pricing ? `
                    <div class="product-pricing">
                        ${product.pricing}
                    </div>
                ` : ''}
            </div>
            <div class="product-meta">
                <div class="product-stats">
                    <div class="votes-count">
                        ▲ <span>${product.votes}</span> votes
                    </div>
                    <div class="launch-date">
                        🚀 ${new Date(product.launchDate).toLocaleDateString()}
                    </div>
                </div>
                <a href="${product.link}" target="_blank" rel="noopener noreferrer" class="visit-btn">
                    访问产品
                </a>
            </div>
        `;
        
        productGrid.appendChild(productElement);
    });
}

// 添加产品筛选函数
function filterProducts(category) {
    const products = JSON.parse(localStorage.getItem('productHuntData'));
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.categories.includes(category));
    
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const productElement = document.createElement('article');
        productElement.className = 'product-card';
        
        productElement.innerHTML = `
            <div class="product-header">
                <img src="${product.image}" alt="${product.name}" class="product-icon">
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p class="product-description">${product.description}</p>
                    <div class="product-categories">
                        ${product.categories.map(cat => `
                            <span class="category-tag">${cat}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="product-meta-info">
                <div class="product-maker">
                    <span>By ${product.maker.join(', ')}</span>
                </div>
                ${product.pricing ? `
                    <div class="product-pricing">
                        ${product.pricing}
                    </div>
                ` : ''}
            </div>
            <div class="product-meta">
                <div class="product-stats">
                    <div class="votes-count">
                        ▲ <span>${product.votes}</span> votes
                    </div>
                    <div class="launch-date">
                        🚀 ${new Date(product.launchDate).toLocaleDateString()}
                    </div>
                </div>
                <a href="${product.link}" target="_blank" rel="noopener noreferrer" class="visit-btn">
                    访问产品
                </a>
            </div>
        `;
        
        productGrid.appendChild(productElement);
    });
} 