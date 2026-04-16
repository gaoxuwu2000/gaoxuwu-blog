// =============================================
// GaoXuWu Blog - Main JS
// =============================================

// ---- 数据 ----
const BLOG_DATA = {
  user: {
    name: '高绪武',
    username: 'gaoxuwu',
    phone: '15312636073',
    wechat: 'gaoxuwu',
    email: 'gaoxuwu@blog.com'
  },
  articles: [
    {
      id: 1, cat: 'tech', vip: false,
      title: '2026年最值得学习的10项技术技能',
      excerpt: '随着AI技术的爆炸式增长，掌握这些核心技术技能将让你在职场上脱颖而出，薪资翻倍不是梦...',
      date: '2026-04-10', views: 4821, likes: 312,
      cover: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600&q=80',
      tag: '💻 技术'
    },
    {
      id: 2, cat: 'finance', vip: false,
      title: '年轻人的第一桶金：从0开始的理财指南',
      excerpt: '月薪5000也能实现财务自由？这篇文章告诉你如何用最少的资金，构建属于自己的被动收入体系...',
      date: '2026-04-08', views: 6234, likes: 489,
      cover: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80',
      tag: '💰 理财'
    },
    {
      id: 3, cat: 'growth', vip: false,
      title: '高效能人士的7个习惯——我的实践笔记',
      excerpt: '读了不算，还要做到。这是我花了6个月践行这本书后写下的真实体验，有收获也有反思...',
      date: '2026-04-05', views: 3156, likes: 247,
      cover: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80',
      tag: '🧠 成长'
    },
    {
      id: 4, cat: 'tech', vip: true,
      title: '【会员专属】用AI打造个人SaaS产品：完整实战教程',
      excerpt: '从零到上线，我用GPT-4+Cursor在3天内做出了一个月收过万的SaaS产品，这里有所有细节...',
      date: '2026-04-03', views: 2890, likes: 378,
      cover: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80',
      tag: '👑 会员专属'
    },
    {
      id: 5, cat: 'life', vip: false,
      title: '在家工作两年，我总结出的效率工作法',
      excerpt: '远程工作并不意味着自由散漫，建立好自己的工作节奏，你会比在公司更高效...',
      date: '2026-04-01', views: 2445, likes: 198,
      cover: 'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=600&q=80',
      tag: '🌱 生活'
    },
    {
      id: 6, cat: 'finance', vip: true,
      title: '【会员专属】我的投资组合完整复盘：年化收益23%',
      excerpt: '这一年我是怎么配置资产的？有哪些坑踩过了？哪些机会抓住了？完整数据全公开...',
      date: '2026-03-28', views: 3670, likes: 521,
      cover: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80',
      tag: '👑 会员专属'
    }
  ]
};

// ---- 本地存储工具 ----
const Storage = {
  get: (key) => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
  set: (key, val) => localStorage.setItem(key, JSON.stringify(val)),
  remove: (key) => localStorage.removeItem(key)
};

// ---- 用户状态 ----
function getCurrentUser() {
  return Storage.get('currentUser');
}

function updateNavForUser() {
  const user = getCurrentUser();
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.querySelector('.btn-register');
  const userMenu = document.getElementById('userMenu');

  if (user) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (registerBtn) registerBtn.style.display = 'none';
    if (userMenu) userMenu.classList.remove('hidden');
    const avatar = document.getElementById('avatarImg');
    if (avatar) avatar.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`;
  }
}

function logout() {
  Storage.remove('currentUser');
  window.location.href = 'index.html';
}

// ---- 滚动效果 ----
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }
  if (backToTop) {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---- 弹窗 ----
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('active');
}

// 点击遮罩关闭
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
});

// ---- VIP 购买 ----
function handleVipPurchase(plan) {
  event && event.preventDefault();
  openModal('payModal');
}

// ---- 文章渲染 ----
function renderArticles(cat = 'all') {
  const grid = document.getElementById('articleGrid');
  if (!grid) return;

  const filtered = cat === 'all'
    ? BLOG_DATA.articles
    : BLOG_DATA.articles.filter(a => a.cat === cat);

  grid.innerHTML = filtered.map(a => `
    <div class="article-card ${a.vip ? 'lock-overlay' : ''}" onclick="goToArticle(${a.id})">
      <img class="article-thumb" src="${a.cover}" alt="${a.title}" loading="lazy" />
      <div class="article-body">
        <div class="article-meta">
          <span class="article-tag ${a.vip ? 'vip' : ''}">${a.tag}</span>
          <span>${a.date}</span>
        </div>
        <h3 class="article-title">${a.title}</h3>
        <p class="article-excerpt">${a.excerpt}</p>
        <div class="article-footer">
          <div class="article-stats">
            <span><i class="fas fa-eye"></i> ${formatNum(a.views)}</span>
            <span><i class="fas fa-heart"></i> ${formatNum(a.likes)}</span>
          </div>
          <span style="color:var(--primary);font-weight:500;font-size:.85rem">阅读全文 →</span>
        </div>
      </div>
    </div>
  `).join('');
}

function formatNum(n) {
  return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n;
}

function goToArticle(id) {
  const article = BLOG_DATA.articles.find(a => a.id === id);
  if (!article) return;
  if (article.vip && !isVipUser()) {
    openModal('payModal');
    return;
  }
  window.location.href = `article.html?id=${id}`;
}

function isVipUser() {
  const user = getCurrentUser();
  return user && user.isVip;
}

// ---- 分类切换 ----
function initCatTabs() {
  const tabs = document.querySelectorAll('.cat-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.cat;
      renderArticles(cat);
    });
  });
}

// ---- 推广链接 ----
function generatePromoLink() {
  const user = getCurrentUser();
  const code = user ? user.username : 'gaoxuwu';
  return `${window.location.origin}${window.location.pathname.replace(/[^/]*$/, '')}register.html?ref=${code}`;
}

function initPromoPage() {
  const linkInput = document.getElementById('promoLink');
  if (linkInput) {
    linkInput.value = generatePromoLink();
  }
}

function copyPromoLink() {
  const linkInput = document.getElementById('promoLink');
  const btn = document.getElementById('copyBtn');
  if (!linkInput) return;

  navigator.clipboard.writeText(linkInput.value).then(() => {
    if (btn) {
      btn.textContent = '✓ 已复制';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = '复制链接';
        btn.classList.remove('copied');
      }, 2000);
    }
  }).catch(() => {
    linkInput.select();
    document.execCommand('copy');
  });
}

// ---- 汉堡菜单 ----
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const nav = document.querySelector('.nav-links');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    const open = nav.style.display === 'flex';
    nav.style.display = open ? '' : 'flex';
    nav.style.flexDirection = open ? '' : 'column';
    nav.style.position = open ? '' : 'absolute';
    nav.style.top = open ? '' : 'var(--nav-h)';
    nav.style.left = open ? '' : '0';
    nav.style.right = open ? '' : '0';
    nav.style.background = open ? '' : 'white';
    nav.style.padding = open ? '' : '16px 24px';
    nav.style.borderBottom = open ? '' : '1px solid var(--border)';
    nav.style.boxShadow = open ? '' : '0 4px 12px rgba(0,0,0,.08)';
  });
}

// ---- 用户菜单下拉 ----
function initUserMenu() {
  const userMenu = document.getElementById('userMenu');
  const avatar = document.getElementById('avatarImg');
  const dropdown = document.getElementById('userDropdown');
  
  if (!userMenu || !avatar || !dropdown) return;
  
  // 点击头像切换菜单显示
  avatar.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('active');
  });
  
  // 点击页面其他地方关闭菜单
  document.addEventListener('click', () => {
    dropdown.classList.remove('active');
  });
  
  // 点击菜单项后关闭
  dropdown.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      dropdown.classList.remove('active');
    });
  });
}

// ---- 登录 ----
function handleLogin(e) {
  e && e.preventDefault();
  const username = document.getElementById('username')?.value?.trim();
  const password = document.getElementById('password')?.value?.trim();

  if (!username || !password) {
    showAlert('请填写用户名和密码', 'error');
    return;
  }

  // 存储的用户
  const users = Storage.get('users') || [];
  const found = users.find(u => (u.username === username || u.phone === username) && u.password === password);

  if (found || (username === 'gaoxuwu' && password === 'gaoxuwu521G')) {
    const userData = found || { username: 'gaoxuwu', name: '高绪武', isVip: true, isAdmin: true };
    Storage.set('currentUser', userData);
    showAlert('登录成功！', 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 800);
  } else {
    showAlert('用户名或密码错误', 'error');
  }
}

// ---- 注册 ----
function handleRegister(e) {
  e && e.preventDefault();
  const nickname = document.getElementById('nickname')?.value?.trim();
  const username = document.getElementById('regUsername')?.value?.trim();
  const phone = document.getElementById('phone')?.value?.trim();
  const password = document.getElementById('regPassword')?.value?.trim();
  const ref = getUrlParam('ref') || '';

  if (!nickname || !username || !phone || !password) {
    showAlert('请填写所有必填信息', 'error');
    return;
  }
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    showAlert('请输入正确的手机号', 'error');
    return;
  }

  const users = Storage.get('users') || [];
  if (users.find(u => u.username === username)) {
    showAlert('用户名已被注册', 'error');
    return;
  }

  const newUser = {
    id: Date.now(),
    nickname, username, phone, password,
    isVip: false, isAdmin: false,
    inviteBy: ref,
    createdAt: new Date().toISOString(),
    promoCode: username
  };

  users.push(newUser);
  Storage.set('users', users);

  // 推广统计
  if (ref) {
    const promoStats = Storage.get('promoStats') || {};
    promoStats[ref] = (promoStats[ref] || 0) + 1;
    Storage.set('promoStats', promoStats);
  }

  Storage.set('currentUser', newUser);
  showAlert('注册成功，欢迎加入！', 'success');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 800);
}

// ---- 工具函数 ----
function getUrlParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

function showAlert(msg, type = 'info') {
  const existing = document.getElementById('alertBox');
  if (existing) existing.remove();

  const box = document.createElement('div');
  box.id = 'alertBox';
  box.style.cssText = `
    position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
    background: ${type === 'success' ? '#ecfdf5' : type === 'error' ? '#fef2f2' : '#f0f9ff'};
    color: ${type === 'success' ? '#065f46' : type === 'error' ? '#991b1b' : '#0c4a6e'};
    border: 1px solid ${type === 'success' ? '#6ee7b7' : type === 'error' ? '#fca5a5' : '#7dd3fc'};
    padding: 12px 24px; border-radius: 10px; font-size: .9rem; font-weight: 500;
    z-index: 99999; box-shadow: 0 4px 16px rgba(0,0,0,.1);
    animation: slideDown .3s ease;
  `;
  box.textContent = msg;
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 3000);
}

// ---- 文章收藏功能 ----
function toggleBookmark(articleId) {
  const user = getCurrentUser();
  if (!user) {
    showAlert('请先登录', 'error');
    return;
  }
  
  const bookmarks = Storage.get('bookmarks') || {};
  const userBookmarks = bookmarks[user.username] || [];
  
  const idx = userBookmarks.indexOf(articleId);
  if (idx > -1) {
    userBookmarks.splice(idx, 1);
    showAlert('已取消收藏', 'success');
  } else {
    userBookmarks.push(articleId);
    showAlert('收藏成功', 'success');
  }
  
  bookmarks[user.username] = userBookmarks;
  Storage.set('bookmarks', bookmarks);
  updateBookmarkBtn(articleId);
}

function isBookmarked(articleId) {
  const user = getCurrentUser();
  if (!user) return false;
  const bookmarks = Storage.get('bookmarks') || {};
  const userBookmarks = bookmarks[user.username] || [];
  return userBookmarks.includes(articleId);
}

function updateBookmarkBtn(articleId) {
  const btn = document.getElementById('bookmarkBtn');
  if (!btn) return;
  const bookmarked = isBookmarked(articleId);
  btn.innerHTML = bookmarked ? '<i class="fas fa-bookmark"></i> 已收藏' : '<i class="far fa-bookmark"></i> 收藏';
  btn.style.color = bookmarked ? 'var(--primary)' : '';
}

// ---- 阅读进度记录 ----
function saveReadingProgress(articleId, percent) {
  const user = getCurrentUser();
  if (!user) return;
  
  const progress = Storage.get('readingProgress') || {};
  progress[user.username] = progress[user.username] || {};
  progress[user.username][articleId] = {
    percent: percent,
    lastRead: new Date().toISOString()
  };
  Storage.set('readingProgress', progress);
}

function getReadingProgress(articleId) {
  const user = getCurrentUser();
  if (!user) return 0;
  const progress = Storage.get('readingProgress') || {};
  return progress[user.username]?.[articleId]?.percent || 0;
}

// ---- 评论系统 ----
function submitComment(articleId) {
  const user = getCurrentUser();
  if (!user) {
    showAlert('请先登录后评论', 'error');
    return;
  }
  
  const content = document.getElementById('commentContent')?.value?.trim();
  if (!content) {
    showAlert('请输入评论内容', 'error');
    return;
  }
  
  const comments = Storage.get('comments') || {};
  const articleComments = comments[articleId] || [];
  
  articleComments.push({
    id: Date.now(),
    username: user.username,
    nickname: user.nickname || user.username,
    content: content,
    date: new Date().toLocaleString('zh-CN'),
    likes: 0
  });
  
  comments[articleId] = articleComments;
  Storage.set('comments', comments);
  
  document.getElementById('commentContent').value = '';
  showAlert('评论发布成功', 'success');
  renderComments(articleId);
}

function renderComments(articleId) {
  const container = document.getElementById('commentsList');
  if (!container) return;
  
  const comments = Storage.get('comments') || {};
  const articleComments = comments[articleId] || [];
  
  if (articleComments.length === 0) {
    container.innerHTML = '<p style="color:var(--text-light);text-align:center;padding:20px;">暂无评论，快来抢沙发吧！</p>';
    return;
  }
  
  container.innerHTML = articleComments.map(c => `
    <div class="comment-item" style="padding:16px;border-bottom:1px solid var(--border);">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${c.username}" style="width:32px;height:32px;border-radius:50%;" />
        <div>
          <div style="font-weight:600;font-size:.9rem;">${c.nickname}</div>
          <div style="font-size:.75rem;color:var(--text-light);">${c.date}</div>
        </div>
      </div>
      <p style="color:var(--text);line-height:1.6;">${c.content}</p>
      <div style="margin-top:8px;display:flex;gap:16px;font-size:.85rem;color:var(--text-light);">
        <span style="cursor:pointer;" onclick="likeComment(${c.id})"><i class="far fa-thumbs-up"></i> ${c.likes}</span>
        <span style="cursor:pointer;">回复</span>
      </div>
    </div>
  `).join('');
}

function likeComment(commentId) {
  showAlert('点赞功能开发中', 'info');
}

// ---- 文章点赞 ----
function likeArticle(articleId) {
  const user = getCurrentUser();
  if (!user) {
    showAlert('请先登录', 'error');
    return;
  }
  
  const likes = Storage.get('articleLikes') || {};
  const userLikes = likes[user.username] || [];
  
  if (userLikes.includes(articleId)) {
    showAlert('你已经点过赞了', 'info');
    return;
  }
  
  userLikes.push(articleId);
  likes[user.username] = userLikes;
  Storage.set('articleLikes', likes);
  
  // 更新文章点赞数
  const article = BLOG_DATA.articles.find(a => a.id === articleId);
  if (article) {
    article.likes++;
  }
  
  showAlert('点赞成功', 'success');
  updateLikeBtn(articleId);
}

function updateLikeBtn(articleId) {
  const btn = document.getElementById('likeBtn');
  if (!btn) return;
  
  const user = getCurrentUser();
  if (!user) return;
  
  const likes = Storage.get('articleLikes') || {};
  const userLikes = likes[user.username] || [];
  const liked = userLikes.includes(articleId);
  
  const article = BLOG_DATA.articles.find(a => a.id === articleId);
  btn.innerHTML = liked ? '<i class="fas fa-heart"></i> 已赞' : `<i class="far fa-heart"></i> 点赞`;
  btn.style.color = liked ? '#ff6584' : '';
}

// ---- 每日焦点文章采集系统 ----
const ArticleCollector = {
  // 采集源配置
  sources: [
    { name: '技术资讯', type: 'tech', keywords: ['AI', '编程', '技术', '开源'] },
    { name: '财经热点', type: 'finance', keywords: ['投资', '理财', '股票', '基金'] },
    { name: '成长干货', type: 'growth', keywords: ['效率', '习惯', '学习', '思维'] },
    { name: '生活方式', type: 'life', keywords: ['健康', '旅行', '美食', '家居'] }
  ],

  // 模拟文章库（实际项目中可接入RSS/API）
  mockArticles: [
    { title: 'OpenAI发布GPT-5：多模态能力大幅提升', summary: '最新一代大语言模型在理解和生成能力上实现突破，支持文本、图像、音频的统一处理...', source: '技术资讯', cat: 'tech', views: '12.5k' },
    { title: '2026年最值得关注的10只科技股', summary: '分析师精选的科技股名单，涵盖AI芯片、云计算、自动驾驶等前沿领域...', source: '财经热点', cat: 'finance', views: '8.3k' },
    { title: '深度工作：在碎片化时代保持专注的5个方法', summary: '如何在这个充满干扰的时代，找回深度工作的能力，提升10倍效率...', source: '成长干货', cat: 'growth', views: '15.2k' },
    { title: '极简生活实践：我如何扔掉80%的物品', summary: '一位极简主义者的真实记录，从囤积到精简，生活发生了哪些改变...', source: '生活方式', cat: 'life', views: '6.7k' },
    { title: 'Python 4.0新特性抢先看：性能提升40%', summary: '即将发布的Python新版本带来重大性能改进，异步编程更加简洁...', source: '技术资讯', cat: 'tech', views: '9.1k' },
    { title: '指数基金定投策略：穿越牛熊的秘诀', summary: '长期定投如何平滑市场波动？数据回测显示这种策略胜率最高...', source: '财经热点', cat: 'finance', views: '11.4k' },
    { title: '早起改变人生：我的5点起床实验', summary: '坚持早起30天后，我发现自己的精力、效率、情绪都有了明显改善...', source: '成长干货', cat: 'growth', views: '7.8k' },
    { title: '远程办公效率指南：在家也能高效工作', summary: '如何建立居家办公的仪式感？这些工具和习惯帮你保持专注...', source: '生活方式', cat: 'life', views: '5.9k' },
    { title: 'Rust vs Go：2026年后端开发选哪个？', summary: '两个热门系统编程语言的深度对比，从性能、生态、学习曲线全面分析...', source: '技术资讯', cat: 'tech', views: '13.6k' },
    { title: ' FIRE运动：30岁退休的可行性分析', summary: '财务独立提前退休运动在国内是否可行？算一笔账你就明白了...', source: '财经热点', cat: 'finance', views: '10.2k' }
  ],

  // 获取今日焦点文章
  getDailyFocus() {
    const today = new Date().toDateString();
    const cached = Storage.get('dailyFocusCache');
    
    // 检查缓存是否有效（同一天）
    if (cached && cached.date === today) {
      return cached.articles;
    }
    
    // 生成新的文章列表（模拟采集）
    const articles = this.collectArticles();
    
    // 保存缓存
    Storage.set('dailyFocusCache', {
      date: today,
      articles: articles
    });
    
    return articles;
  },

  // 采集文章（模拟）
  collectArticles() {
    // 随机打乱并取前10篇
    const shuffled = [...this.mockArticles].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);
    
    // 添加时间戳和ID
    return selected.map((article, index) => ({
      id: 'focus_' + Date.now() + '_' + index,
      title: article.title,
      summary: article.summary,
      source: article.source,
      cat: article.cat,
      views: article.views,
      time: this.getRandomTime(),
      collectedAt: new Date().toISOString()
    }));
  },

  // 生成随机时间
  getRandomTime() {
    const hours = Math.floor(Math.random() * 12) + 1;
    return `${hours}小时前`;
  },

  // 去重检查（基于标题相似度）
  isDuplicate(newTitle, existingArticles) {
    const normalized = newTitle.toLowerCase().replace(/[^\u4e00-\u9fa5a-z0-9]/g, '');
    return existingArticles.some(article => {
      const existing = article.title.toLowerCase().replace(/[^\u4e00-\u9fa5a-z0-9]/g, '');
      // 简单相似度检查：包含关系或编辑距离
      return normalized.includes(existing) || existing.includes(normalized) || 
             this.levenshteinDistance(normalized, existing) < 5;
    });
  },

  // 编辑距离算法
  levenshteinDistance(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        matrix[i][j] = b[i-1] === a[j-1] ? matrix[i-1][j-1] : 
          Math.min(matrix[i-1][j-1] + 1, matrix[i][j-1] + 1, matrix[i-1][j] + 1);
      }
    }
    return matrix[b.length][a.length];
  },

  // 发布文章到博客（将焦点文章转为正式文章）
  publishToBlog(focusArticle) {
    const extra = Storage.get('extraArticles') || [];
    const contents = Storage.get('articleContents') || {};
    
    const newId = Date.now();
    const newArt = {
      id: newId,
      cat: focusArticle.cat,
      vip: false,
      title: focusArticle.title,
      excerpt: focusArticle.summary,
      date: new Date().toLocaleDateString('zh-CN').replace(/\//g, '-'),
      views: 0,
      likes: 0,
      cover: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&q=80',
      tag: focusArticle.cat === 'tech' ? '💻 技术' : 
           focusArticle.cat === 'finance' ? '💰 理财' : 
           focusArticle.cat === 'growth' ? '🧠 成长' : '🌱 生活',
      source: focusArticle.source,
      isCollected: true
    };
    
    extra.push(newArt);
    contents[newId] = `<p>${focusArticle.summary}</p><p style="color:var(--text-light);margin-top:20px;padding-top:20px;border-top:1px solid var(--border);"><i class="fas fa-robot"></i> 本文由系统自动采集整理，仅供参考学习。</p>`;
    
    Storage.set('extraArticles', extra);
    Storage.set('articleContents', contents);
    
    return newId;
  },

  // 手动刷新
  refresh() {
    Storage.remove('dailyFocusCache');
    return this.getDailyFocus();
  }
};

// ---- 初始化 ----
document.addEventListener('DOMContentLoaded', () => {
  updateNavForUser();
  renderArticles();
  initCatTabs();
  initHamburger();
  initUserMenu();
  initPromoPage();
  
  // 加载每日焦点
  loadDailyFocus();

  // 注册页读取邀请码
  const refField = document.getElementById('refField');
  const refCode = getUrlParam('ref');
  if (refField && refCode) {
    refField.textContent = refCode;
    refField.closest('.invite-field')?.style.setProperty('display', 'flex');
  }
});

// 加载每日焦点文章
function loadDailyFocus() {
  const articles = ArticleCollector.getDailyFocus();
  Storage.set('dailyFocusArticles', articles);
  
  // 如果页面有焦点容器，渲染它
  const grid = document.getElementById('focusGrid');
  if (grid) {
    renderFocusArticles(articles, grid);
  }
}

// 渲染焦点文章
function renderFocusArticles(articles, container) {
  if (!articles || articles.length === 0) {
    container.innerHTML = `
      <div class="focus-card" style="grid-column:1/-1;text-align:center;padding:40px;">
        <i class="fas fa-robot" style="font-size:3rem;color:var(--primary);margin-bottom:16px;"></i>
        <h4 style="margin-bottom:8px;">每日焦点采集系统</h4>
        <p style="color:var(--text-light);">系统将在每天自动采集全网热门文章<br>去重筛选后呈现给您</p>
        <button onclick="refreshDailyFocus()" class="btn-sm btn-sm-primary" style="margin-top:16px;">
          <i class="fas fa-sync"></i> 立即刷新
        </button>
      </div>
    `;
    return;
  }
  
  container.innerHTML = articles.map(article => `
    <div class="focus-card" onclick="readFocusArticle('${article.id}')">
      <span class="focus-source">${article.source}</span>
      <h4>${article.title}</h4>
      <p>${article.summary}</p>
      <div class="focus-meta">
        <span><i class="far fa-clock"></i> ${article.time}</span>
        <span><i class="far fa-eye"></i> ${article.views}</span>
      </div>
    </div>
  `).join('');
}

// 刷新每日焦点
function refreshDailyFocus() {
  const articles = ArticleCollector.refresh();
  Storage.set('dailyFocusArticles', articles);
  const grid = document.getElementById('focusGrid');
  if (grid) {
    renderFocusArticles(articles, grid);
  }
  showAlert('已刷新今日焦点', 'success');
}

// 阅读焦点文章（可转为正式文章）
function readFocusArticle(focusId) {
  const articles = Storage.get('dailyFocusArticles') || [];
  const article = articles.find(a => a.id === focusId);
  if (!article) return;
  
  // 检查是否已发布
  const extra = Storage.get('extraArticles') || [];
  const published = extra.find(a => a.title === article.title);
  
  if (published) {
    // 已发布，跳转到文章页
    window.location.href = `article.html?id=${published.id}`;
  } else {
    // 未发布，询问是否发布
    if (confirm(`《${article.title}》\n\n这篇文章尚未发布到博客。\n\n是否立即发布？`)) {
      const newId = ArticleCollector.publishToBlog(article);
      showAlert('文章已发布！', 'success');
      setTimeout(() => {
        window.location.href = `article.html?id=${newId}`;
      }, 500);
    }
  }
}

// CSS 动画
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
`;
document.head.appendChild(style);
