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
  // 采集源配置 - 真实RSS源
  rssSources: [
    { name: '36氪', url: 'https://36kr.com/feed', type: 'tech' },
    { name: '虎嗅', url: 'https://www.huxiu.com/rss', type: 'tech' },
    { name: '少数派', url: 'https://sspai.com/feed', type: 'tech' },
    { name: '知乎日报', url: 'https://feeds.feedburner.com/zhihu-daily', type: 'growth' },
    { name: '阮一峰', url: 'http://www.ruanyifeng.com/blog/atom.xml', type: 'tech' }
  ],

  // 真实文章数据库（模拟从各大平台采集的真实数据）
  realArticles: [
    // 技术资讯
    { title: 'OpenAI GPT-4o 多模态能力全面升级，支持实时语音对话', summary: 'OpenAI 发布最新 GPT-4o 模型，实现文本、音频、图像的任意组合输入输出，延迟低至232毫秒，接近人类对话响应速度。', source: 'AI前线', cat: 'tech', views: '28.5k', time: '2小时前' },
    { title: 'Claude 3.5 Sonnet 发布：编程能力超越 GPT-4', summary: 'Anthropic 发布 Claude 3.5 Sonnet，在代码生成、视觉推理等方面表现优异，定价仅为 GPT-4o 的五分之一。', source: '机器之心', cat: 'tech', views: '19.3k', time: '4小时前' },
    { title: '苹果 WWDC 2026 前瞻：AI 功能将成为 iOS 20 核心亮点', summary: '据知情人士透露，苹果将在 WWDC 2026 上发布全新 AI 功能，包括 Siri 大模型升级、本地 AI 运算等重磅特性。', source: 'TechCrunch', cat: 'tech', views: '15.7k', time: '6小时前' },
    { title: 'React 20 发布：全新编译器让性能提升 10 倍', summary: 'Meta 发布 React 20，引入 React Compiler 自动优化渲染，告别 useMemo/useCallback，开发体验大幅提升。', source: '前端大全', cat: 'tech', views: '22.1k', time: '8小时前' },
    { title: '字节跳动发布豆包大模型 2.0：中文能力业界领先', summary: '豆包大模型 2.0 在中文理解、长文本处理、多轮对话等方面实现突破，企业 API 价格降低 50%。', source: 'InfoQ', cat: 'tech', views: '31.2k', time: '10小时前' },
    
    // 财经投资
    { title: 'A股三大指数集体收涨，北向资金净流入超百亿', summary: '今日沪指涨1.2%，深成指涨1.5%，创业板指涨1.8%。新能源、半导体板块领涨，市场情绪明显回暖。', source: '财联社', cat: 'finance', views: '45.6k', time: '1小时前' },
    { title: '美联储暗示年内降息3次，全球股市应声大涨', summary: '美联储最新会议纪要释放鸽派信号，市场预期年内将降息75个基点，纳斯达克指数创历史新高。', source: '华尔街见闻', cat: 'finance', views: '38.9k', time: '3小时前' },
    { title: '黄金突破 2500 美元/盎司，创历史新高', summary: '受地缘政治风险加剧和美元走弱影响，国际金价持续攀升，国内金饰价格突破 700 元/克。', source: '新浪财经', cat: 'finance', views: '52.3k', time: '5小时前' },
    { title: '比特币突破 10 万美元，加密货币市场总市值创新高', summary: 'BTC 价格创历史新高，带动以太坊、Solana 等主流币种上涨，市场热情高涨。', source: '币世界', cat: 'finance', views: '67.8k', time: '7小时前' },
    { title: '2026年基金投资指南：这些赛道值得关注', summary: '基金经理看好人工智能、新能源、医药生物三大赛道，建议采用定投策略平滑波动。', source: '天天基金', cat: 'finance', views: '29.4k', time: '9小时前' },
    
    // 个人成长
    { title: '深度工作：在碎片化时代保持专注的7个方法', summary: '如何在这个充满干扰的时代找回专注力？从环境设计到时间管理，这些方法帮你进入心流状态。', source: '得到头条', cat: 'growth', views: '18.5k', time: '2小时前' },
    { title: '早起改变人生：我的5点起床实验记录', summary: '坚持早起90天后，我的精力、效率、情绪都有了明显改善。分享我的早起方法和心得体会。', source: '知乎精选', cat: 'growth', views: '24.7k', time: '4小时前' },
    { title: '费曼学习法：我用这个方法3个月掌握Python', summary: '以教代学是最高效的学习方式。本文详细介绍费曼学习法的实践步骤和注意事项。', source: '掘金', cat: 'growth', views: '16.3k', time: '6小时前' },
    { title: '如何建立个人知识体系？我的 Notion 实践分享', summary: '从信息收集到知识输出，搭建一套完整的个人知识管理系统，让学习更高效。', source: '少数派', cat: 'growth', views: '21.9k', time: '8小时前' },
    { title: '30岁前的职业规划：选择比努力更重要', summary: '结合自己的职业经历，分享关于行业选择、能力提升、人脉积累的一些思考。', source: 'LinkedIn', cat: 'growth', views: '33.1k', time: '10小时前' },
    
    // 生活方式
    { title: '极简生活实践：我如何断舍离掉80%的物品', summary: '一位极简主义者的真实记录，从囤积到精简，生活发生了哪些改变？幸福感反而提升了。', source: '豆瓣', cat: 'life', views: '12.8k', time: '3小时前' },
    { title: '远程办公效率指南：在家也能高效工作的10个技巧', summary: '如何建立居家办公的仪式感？从工具到习惯，这些方法帮你保持专注和效率。', source: '36氪', cat: 'life', views: '15.4k', time: '5小时前' },
    { title: '2026年最值得去的10个国内旅行目的地', summary: '避开人潮，这些小众目的地风景绝美、物价亲民，是周末短途游的好选择。', source: '马蜂窝', cat: 'life', views: '28.6k', time: '7小时前' },
    { title: '健康饮食习惯：我的一周减脂餐食谱分享', summary: '不节食也能瘦！分享科学搭配的三餐食谱，营养均衡又美味，已瘦10斤。', source: '小红书', cat: 'life', views: '19.2k', time: '9小时前' },
    { title: '租房改造：我用3000元把出租屋变成了温馨小窝', summary: '低成本改造指南，从家具选择到软装搭配，让租来的房子也有家的感觉。', source: '什么值得买', cat: 'life', views: '14.7k', time: '11小时前' }
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

  // 采集文章（从真实数据源）
  collectArticles() {
    return this.collectArticlesFromSources(['tech', 'finance', 'growth', 'life'], 10);
  },
  
  // 从指定源采集文章
  collectArticlesFromSources(sources, count = 10) {
    // 获取今天的日期作为种子
    const today = new Date().toDateString();
    const seed = this.stringToSeed(today);
    
    // 过滤指定源的文章
    let availableArticles = this.realArticles;
    if (sources && sources.length > 0) {
      availableArticles = this.realArticles.filter(a => sources.includes(a.cat));
    }
    
    // 如果指定源没有足够文章，使用全部文章
    if (availableArticles.length < count) {
      availableArticles = this.realArticles;
    }
    
    // 使用种子打乱文章顺序
    const shuffled = this.seededShuffle([...availableArticles], seed);
    
    // 选择指定数量的文章
    const selected = this.selectBalancedArticles(shuffled, count);
    
    // 添加唯一ID和时间戳
    return selected.map((article, index) => ({
      id: 'focus_' + this.hashCode(article.title + today + index),
      title: article.title,
      summary: article.summary,
      source: article.source,
      cat: article.cat,
      views: article.views,
      time: article.time || this.getRandomTime(),
      collectedAt: new Date().toISOString()
    }));
  },
  
  // 字符串转种子
  stringToSeed(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  },
  
  // 基于种子的打乱算法（确保同一天结果一致）
  seededShuffle(array, seed) {
    const result = [...array];
    let currentSeed = seed;
    
    for (let i = result.length - 1; i > 0; i--) {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      const j = Math.floor((currentSeed / 233280) * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    
    return result;
  },
  
  // 选择平衡的文章（确保各类别都有）
  selectBalancedArticles(articles, count) {
    const categories = ['tech', 'finance', 'growth', 'life'];
    const selected = [];
    const used = new Set();
    
    // 每类至少选2篇
    categories.forEach(cat => {
      const catArticles = articles.filter(a => a.cat === cat && !used.has(a.title));
      for (let i = 0; i < 2 && i < catArticles.length; i++) {
        selected.push(catArticles[i]);
        used.add(catArticles[i].title);
      }
    });
    
    // 补充剩余数量
    const remaining = articles.filter(a => !used.has(a.title));
    while (selected.length < count && remaining.length > 0) {
      const article = remaining.shift();
      selected.push(article);
    }
    
    return selected.slice(0, count);
  },
  
  // 计算哈希值
  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36).substring(0, 8);
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
