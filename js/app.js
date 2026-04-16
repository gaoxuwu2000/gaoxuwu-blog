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

// ---- 初始化 ----
document.addEventListener('DOMContentLoaded', () => {
  updateNavForUser();
  renderArticles();
  initCatTabs();
  initHamburger();
  initPromoPage();

  // 注册页读取邀请码
  const refField = document.getElementById('refField');
  const refCode = getUrlParam('ref');
  if (refField && refCode) {
    refField.textContent = refCode;
    refField.closest('.invite-field')?.style.setProperty('display', 'flex');
  }
});

// CSS 动画
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
`;
document.head.appendChild(style);
