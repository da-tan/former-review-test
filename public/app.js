const DIMENSIONS = {
  responsiveness: '被理解感',
  reliability: '日常可靠度',
  repair: '冲突修复力',
  growth: '共同成长感',
  boundaries: '边界式偏爱',
  memory: '关系记忆感'
};

const OPTIONS = ['非常不符合', '比较不符合', '不确定', '比较符合', '非常符合'];

const QUESTIONS = [
  ['responsiveness', '对方说“没事”，但我察觉 TA 状态不对时，我会先关心，而不是顺势翻篇。'],
  ['responsiveness', '对方因为加班、考试、求职、换城市而焦虑时，我会先确认 TA 真正担心的是什么。'],
  ['responsiveness', '对方讲一件别人觉得“小题大做”的事时，我通常能理解那件事为什么会让 TA 难受。'],
  ['responsiveness', '即使我不同意对方的选择，我也会让 TA 知道：我理解 TA 为什么会这样想。'],
  ['responsiveness', '对方脆弱、尴尬或失败时，我不会把这些经历拿来开玩笑或翻旧账。'],
  ['responsiveness', '我习惯立刻给解决方案，即使对方当下其实只想被陪一会儿。', true],
  ['reliability', '我答应对方的事，哪怕只是周末见面、一起吃饭，也会尽量做到；做不到会提前说明。'],
  ['reliability', '对方生病、赶早班、搬家、面试或情绪很差时，我会提供具体帮助，而不只是说“多喝热水”。'],
  ['reliability', '遇到工作安排、节假日回家、异地见面等现实问题时，我愿意一起协调，而不是把难题丢给对方。'],
  ['reliability', '对方做重要决定时，我会认真讨论，而不是只在结果出来后发表意见。'],
  ['reliability', '对消费、储蓄、送礼、旅行预算等容易尴尬的话题，我愿意坦诚沟通。'],
  ['reliability', '只有当我感觉对方可能要离开时，我才会突然变得特别上心。', true],
  ['repair', '吵架时，我会尽量讨论“这件事”，而不是给对方贴“你就是这样的人”的标签。'],
  ['repair', '冷静下来后，我愿意主动重新开启对话，而不是等对方先低头。'],
  ['repair', '我道歉时能说清楚自己具体做错了什么，而不是只说“行，都是我的错”。'],
  ['repair', '对回复频率、异性边界、消费习惯、见父母等冲突，我更愿意商量规则，而不是靠猜。'],
  ['repair', '即使很生气，我也会避免用拉黑、失联、故意冷淡来惩罚对方。'],
  ['repair', '我相信“谁先联系谁就输”，所以争吵后通常会硬撑到底。', true],
  ['growth', '我们会一起尝试没做过的事，例如学技能、短途旅行、看展、运动、逛陌生街区。'],
  ['growth', '对方想考证、转行、读研、换城市或培养新爱好时，我会支持，而不是把 TA 的成长理解成“要离开我”。'],
  ['growth', '我不会要求对方为了关系放弃朋友、兴趣或重要机会。'],
  ['growth', '在那段关系里，对方曾因为我而更愿意表达、尝试或相信自己。'],
  ['growth', '我们会认真聊未来，但不会把“未来”变成逼迫对方立刻牺牲的工具。'],
  ['growth', '我更希望对方把大部分时间、兴趣和情绪都围着我转。', true],
  ['boundaries', '我能直接表达“我需要陪伴”“我需要一点空间”“这件事让我不舒服”，而不是让对方猜。'],
  ['boundaries', '我尊重对方的手机、社交圈、私人时间，不把查看、定位和报备当作爱的证明。'],
  ['boundaries', '我愿意在关系中付出，但不会把牺牲当成要求对方偿还的筹码。'],
  ['boundaries', '当我无法满足对方的请求时，我会说明原因，而不是敷衍、消失或积攒怨气。'],
  ['boundaries', '我能分辨“在乎”和“控制”的区别。'],
  ['boundaries', '我会故意说分手、拉黑或让对方吃醋，来验证 TA 是否真的在乎我。', true],
  ['memory', '我记得对方不少细小偏好，例如口味、通勤习惯、压力大时的状态或不愿提起的话题。'],
  ['memory', '我们有一些不必隆重、却会重复发生的小仪式，例如到家报平安、周末散步、共享歌单或固定的一餐。'],
  ['memory', '即使没什么大事，我也愿意和对方分享一天里很细碎的片段。'],
  ['memory', '异地、出差、换工作或生活节奏变化时，我会主动想办法维持连接，而不只是等待关系自然变淡。'],
  ['memory', '我们之间有一些只有彼此听得懂的玩笑、暗号或记忆。'],
  ['memory', '除非对方直接提要求，否则我很少主动留意 TA 的偏好和变化。', true]
].map(([dimension, text, reversed], index) => ({ id: index + 1, dimension, text, reversed: Boolean(reversed) }));

const RESULTS = {
  'emotional-translator': {
    type: '情绪翻译官',
    headline: 'TA 最不甘心失去的，是一个听得懂“我没事”的人。',
    quote: '你未必每次都能解决问题，但你会先让对方知道：我不必先表现得很好，才值得被理解。',
    insight: '你的稀缺感，来自情绪被看见。你会留意语气里的停顿、分享欲的减少和那些不好意思说出口的委屈。',
    theory: '亲密关系研究把“被理解、被接纳、被支持”的体验称为感知伴侣回应性。它是安全感与亲密感的重要来源。',
    growth: '理解不等于替对方扛完情绪。先确认感受，再问“你希望我陪你，还是一起想办法？”'
  },
  'steady-anchor': {
    type: '日子里的主心骨',
    headline: 'TA 最不甘心失去的，是“有你在，日子就不会散”的确定感。',
    quote: '你不一定最浪漫，却会在赶早班、搬家、改计划和低谷时，真的出现。',
    insight: '你的关系价值不是轰轰烈烈，而是让生活有着落。你愿意面对预算、行程和现实的麻烦。',
    theory: '长期关系中的安全感，常常由许多看似微小但持续的兑现构成：守约、沟通和现实协商。',
    growth: '可靠不是 24 小时待命。清楚说明能做什么、不能做什么，比勉强答应后失联更值得信任。'
  },
  repairer: {
    type: '不散场修复师',
    headline: 'TA 最不甘心失去的，是一个愿意把问题留在桌面上谈的人。',
    quote: '你不一定从不争吵，但你知道关系里最伤人的，是把彼此变成敌人。',
    insight: '你最难得的能力，是在情绪退潮后重新敲门。你愿意说清哪里受伤，也愿意为具体行为道歉。',
    theory: '关系研究会区分“有没有冲突”和“冲突后能不能恢复”。真正影响关系走向的，往往是后者。',
    growth: '修复不是无限原谅。持续羞辱、暴力、背叛或控制，不该由某一个人负责修复。'
  },
  expander: {
    type: '人生扩容者',
    headline: 'TA 最不甘心失去的，是那个让自己看见更大世界的人。',
    quote: '和你在一起，不只是多了一个恋人，也多了一点敢尝试、敢表达、敢相信自己的勇气。',
    insight: '你给关系带来的，是一种“可以变得更多”的许可。你更愿意支持对方成长，而不是把成长当成威胁。',
    theory: '自我扩展理论认为，亲密关系可以通过共同的新体验、新能力和新视角，扩展一个人的自我概念。',
    growth: '真正的成长不是把对方改成你期待的样子，而是支持 TA 成为 TA 想成为的样子。'
  },
  'boundary-love': {
    type: '边界感偏爱',
    headline: 'TA 最不甘心失去的，是一份不窒息的偏爱。',
    quote: '你会爱、会在乎，也会说“不”。你不需要靠控制、试探或占有来证明爱。',
    insight: '你给人的安全感，来自清楚而温柔。对方知道可以靠近你，也知道不必因此失去自己。',
    theory: '稳定亲密不是没有距离，而是双方能表达需要、拒绝不舒服的事，并保持各自的生活与尊严。',
    growth: '边界不是“我不需要你”，而是“我愿意和你在一起，但我们都不必失去自己”。'
  },
  'memory-curator': {
    type: '细节收藏家',
    headline: 'TA 最不甘心失去的，是那些再也没法对别人复刻的细节。',
    quote: '以后也许有人会对 TA 好，但未必有人知道 TA 为什么不吃香菜，为什么听到那首歌会沉默。',
    insight: '你擅长把感情落在具体生活里：偏好、小习惯、固定仪式和只有两个人听得懂的话。',
    theory: '共享仪式、私有语言和关系特有的记忆，会让“我们”从抽象感情变成具体生活。',
    growth: '珍惜细节，但别把怀念误认为必须回头。记忆的价值，有时就在于它完成过陪伴。'
  },
  'high-fit-partner': {
    type: '高配同行者',
    headline: 'TA 最不甘心失去的，不是一个恋人，而是一个能一起过关的人。',
    quote: '预算不够、计划落空、父母催婚、异地疲惫、工作失意，你不会假装问题不存在。',
    insight: '你的稳定来自两件事：愿意一起处理现实，也愿意在冲突后回来继续谈。',
    theory: '真正决定长期关系韧性的，往往不是没有困难，而是双方是否能在困难出现后维持合作与修复。',
    growth: '你适合的不是只会制造心动的人，而是同样愿意沟通、负责、修复的人。'
  },
  'shared-language': {
    type: '默契共同体',
    headline: 'TA 最不甘心失去的，是一个曾经像“自己人”一样懂自己的人。',
    quote: '一个表情、一句“到了”、一首旧歌，就足以让人明白对方今天经历了什么。',
    insight: '你们之间最难替代的，可能不是高光时刻，而是那些不用解释的日常默契。',
    theory: '被理解感和共同记忆会共同塑造“我们感”。它让亲密不止是喜欢，更像一个可安放自己的共同空间。',
    growth: '默契最动人的地方是自然，不是牺牲。不要因为“只有我最懂 TA”，就放弃自己的新生活。'
  },
  rebuilding: {
    type: '重新整理关系的人',
    headline: '你最不该失去的，是重新认识自己的机会。',
    quote: '这不是“你不值得被怀念”。它更像一次提醒：下一段关系里，你可以更清楚地选择想留下什么。',
    insight: '这份画像没有明显的单一高分优势，可能是因为你当时投入有限、关系本身不稳定，或正在诚实复盘。',
    theory: '测评记录的是你的回顾，不是价值判决。关系能力不是固定人格，而是可以在一次次选择中练习的行为。',
    growth: '从一项最有感觉的维度开始，不必一次成为“完美恋人”。先练习清楚表达，再练习稳定回应。'
  }
};

const app = document.querySelector('#app');
const modalRoot = document.querySelector('#modal-root');
const toast = document.querySelector('#toast');
const STORAGE_KEY = 'former-review-session-token';
const API_BASE_URL = String(window.APP_CONFIG?.apiBaseUrl || '').trim().replace(/\/$/, '');
let state = { sessionToken: localStorage.getItem(STORAGE_KEY), index: 0, answers: Array(QUESTIONS.length).fill(null), result: null, publicId: null };
let toastTimer;

const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char]));

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

function apiUrl(action, query = {}) {
  if (!API_BASE_URL) {
    if (action === 'share') return `/api/share/${encodeURIComponent(query.id || '')}`;
    return `/api/${action}`;
  }
  const url = new URL(API_BASE_URL);
  url.searchParams.set('action', action);
  Object.entries(query).forEach(([key, value]) => url.searchParams.set(key, String(value)));
  return url.toString();
}

async function request(action, options = {}) {
  const { query, headers, ...fetchOptions } = options;
  const response = await fetch(apiUrl(action, query), {
    ...fetchOptions,
    headers: { 'Content-Type': 'application/json', ...(headers || {}) }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || '请求失败，请稍后再试。');
  return data;
}

function brand() {
  return '<div class="brand"><span class="brand-mark">TA</span><span>匿名关系遗产测评</span></div>';
}

function renderWelcome() {
  app.innerHTML = `
    ${brand()}
    <section class="hero">
      <p class="eyebrow">RELATIONSHIP LEGACY PROFILE</p>
      <h1>如果前任匿名评价你，<br>TA 最不甘心失去什么？</h1>
      <p>这不是读心术。它会从你在一段关系里的真实行为，梳理出你最容易被怀念的关系价值。</p>
    </section>
    <section class="card">
      <h2 class="card-title">开始前，请输入测试密码</h2>
      <p class="card-copy">每个密码仅可开启一次完整测试。答题约需 8--10 分钟，建议回想一段你认真投入过的关系。</p>
      <div class="notice"><b>温和提醒</b><span>本测评仅供娱乐与自我探索，不代表前任真实想法，也不用于判断是否应该复合。</span></div>
      <form id="access-form" class="password-form">
        <input class="password-input" id="password" autocomplete="off" autocapitalize="characters" placeholder="请输入测试密码" aria-label="测试密码" required />
        <p id="password-error" class="field-error"></p>
        <button id="access-button" class="primary-button" type="submit">验证密码，开始测试</button>
      </form>
      <p class="footnote">你提交的答案不会出现在任何分享结果中。</p>
    </section>`;
  document.querySelector('#access-form').addEventListener('submit', unlockAssessment);
}

async function unlockAssessment(event) {
  event.preventDefault();
  const input = document.querySelector('#password');
  const error = document.querySelector('#password-error');
  const button = document.querySelector('#access-button');
  const password = input.value.trim();
  if (!password) { error.textContent = '请输入测试密码。'; return; }
  button.disabled = true;
  button.textContent = '正在验证…';
  error.textContent = '';
  try {
    const data = await request('access', { method: 'POST', body: JSON.stringify({ password }) });
    state.sessionToken = data.sessionToken;
    localStorage.setItem(STORAGE_KEY, data.sessionToken);
    renderStart();
  } catch (error) {
    document.querySelector('#password-error').textContent = error.message;
  } finally {
    button.disabled = false;
    button.textContent = '验证密码，开始测试';
  }
}

function renderStart() {
  app.innerHTML = `
    ${brand()}
    <section class="hero">
      <p class="eyebrow">ONE RELATIONSHIP · ONE HONEST ANSWER</p>
      <h1>请回到一段<br>你认真投入过的关系。</h1>
      <p>每道题都没有标准答案。请按那段关系中“通常的你”作答，而不是按你希望成为的样子选择。</p>
    </section>
    <section class="card">
      <h2 class="card-title">36 个问题，6 个关系维度</h2>
      <p class="card-copy">被理解感、日常可靠度、冲突修复力、共同成长感、边界式偏爱与关系记忆感。你可以返回上一题修改答案。</p>
      <div class="notice"><b>答题建议</b><span>请不要代入多段关系。想到哪一段，就始终围绕那一段完成作答。</span></div>
      <button id="start-button" class="primary-button">开始测试</button>
    </section>`;
  document.querySelector('#start-button').addEventListener('click', () => renderQuestion(0));
}

function renderQuestion(index) {
  state.index = index;
  const question = QUESTIONS[index];
  const selected = state.answers[index];
  const progress = Math.round(((index + 1) / QUESTIONS.length) * 100);
  const isLast = index === QUESTIONS.length - 1;
  app.innerHTML = `
    <div class="test-header">
      <span class="brand"><span class="brand-mark">TA</span><span>匿名关系遗产测评</span></span>
      <span class="progress-label">${index + 1} / ${QUESTIONS.length}</span>
    </div>
    <div class="progress-track" aria-label="答题进度"><div class="progress-value" style="width:${progress}%"></div></div>
    <section class="question-card">
      <span class="dimension-label">${DIMENSIONS[question.dimension]}</span>
      <p class="question-number">QUESTION ${String(index + 1).padStart(2, '0')}</p>
      <h1 class="question-title">${question.text}</h1>
      <div class="options" role="radiogroup" aria-label="选择你的答案">
        ${OPTIONS.map((label, optionIndex) => `<button class="option ${selected === optionIndex + 1 ? 'selected' : ''}" type="button" data-value="${optionIndex + 1}" role="radio" aria-checked="${selected === optionIndex + 1}"><span class="option-dot">✓</span><span>${label}</span></button>`).join('')}
      </div>
      <div class="question-actions">
        <button id="back-button" class="secondary-button" ${index === 0 ? '' : ''}>${index === 0 ? '返回说明' : '上一题'}</button>
        <button id="next-button" class="primary-button" ${selected ? '' : 'disabled'}>${isLast ? '查看测评结果' : '下一题'}</button>
      </div>
    </section>`;
  document.querySelectorAll('.option').forEach((button) => button.addEventListener('click', () => {
    state.answers[index] = Number(button.dataset.value);
    renderQuestion(index);
  }));
  document.querySelector('#back-button').addEventListener('click', () => index === 0 ? renderStart() : renderQuestion(index - 1));
  document.querySelector('#next-button').addEventListener('click', () => isLast ? finishAssessment() : renderQuestion(index + 1));
}

function calculateScores() {
  const buckets = Object.fromEntries(Object.keys(DIMENSIONS).map((key) => [key, []]));
  QUESTIONS.forEach((question, index) => {
    const raw = state.answers[index];
    buckets[question.dimension].push(question.reversed ? 6 - raw : raw);
  });
  return Object.fromEntries(Object.entries(buckets).map(([key, values]) => [key, Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 100) / 100]));
}

function determineResult(scores) {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [firstKey, firstScore] = sorted[0];
  const [secondKey, secondScore] = sorted[1];
  if (firstScore < 3.2) return 'rebuilding';
  if (scores.reliability >= 4 && scores.repair >= 4 && Math.abs(scores.reliability - scores.repair) <= .25) return 'high-fit-partner';
  if (scores.responsiveness >= 4 && scores.memory >= 4 && Math.abs(scores.responsiveness - scores.memory) <= .25) return 'shared-language';
  const map = {
    responsiveness: 'emotional-translator', reliability: 'steady-anchor', repair: 'repairer',
    growth: 'expander', boundaries: 'boundary-love', memory: 'memory-curator'
  };
  return map[firstKey] || map[secondKey];
}

async function finishAssessment() {
  if (state.answers.some((answer) => answer === null)) return showToast('还有题目没有完成。');
  const scores = calculateScores();
  const resultType = determineResult(scores);
  state.result = { resultType, scores };
  app.innerHTML = '<div class="loading">正在整理你的关系遗产画像…</div>';
  try {
    const data = await request('result', {
      method: 'POST', headers: { 'X-Session-Token': state.sessionToken }, body: JSON.stringify(state.result)
    });
    state.publicId = data.publicId;
    renderResult(state.result, data.publicId);
  } catch (error) {
    renderResult(state.result, null);
    showToast(`结果已生成，但分享链接暂不可用：${error.message}`);
  }
}

function formatScore(score) { return score.toFixed(1); }

function captureHtml(result) {
  const copy = RESULTS[result.resultType];
  const rows = Object.entries(DIMENSIONS).map(([key, label]) => `
    <div class="dimension-row"><span>${label}</span><div class="dimension-bar"><div class="dimension-fill" style="width:${result.scores[key] * 20}%"></div></div><span class="dimension-score">${formatScore(result.scores[key])}</span></div>`).join('');
  return `
    <article id="result-capture" class="capture-sheet">
      <header class="capture-cover">
        <p class="eyebrow">RELATIONSHIP LEGACY PROFILE</p>
        <p class="result-type">${copy.type}</p>
        <h1 class="result-title">${copy.headline}</h1>
        <p class="result-quote">${copy.quote}</p>
      </header>
      <div class="capture-content">
        <p class="section-label">你的关系遗产</p>
        <p class="result-copy">${copy.insight}</p>
        <div class="theory-box"><p><b>你可以学到：</b>${copy.theory}</p></div>
        <div class="dimension-list">${rows}</div>
        <div class="growth-box"><p><b>给下一段关系的提醒：</b>${copy.growth}</p></div>
        <p class="result-disclaimer">本测评基于你的自我回顾生成，仅供娱乐与自我探索，不代表任何前任的真实想法。</p>
      </div>
    </article>`;
}

function renderResult(result, publicId, isShared = false) {
  const shareUrl = publicId ? `${window.location.origin}${window.location.pathname}?result=${encodeURIComponent(publicId)}` : '';
  app.innerHTML = `
    <section class="result-page">
      ${isShared ? '<div class="brand"><span class="brand-mark">TA</span><span>来自匿名分享的关系遗产画像</span></div>' : brand()}
      ${captureHtml(result)}
      <div class="result-actions">
        <button id="save-button" class="primary-button">保存结果长图</button>
        <button id="review-button" class="secondary-button">好评有礼</button>
      </div>
      ${shareUrl ? `<div class="share-row"><input class="share-input" value="${escapeHtml(shareUrl)}" aria-label="分享链接" readonly><button id="copy-button" class="copy-button">复制链接</button></div><p class="link-caption">链接只分享本次结果类型和维度分数，不包含你的答题内容。</p>` : ''}
      ${isShared ? '<div class="post-actions"><button id="home-button" class="secondary-button">我也想测一测</button></div>' : '<div class="post-actions"><button id="retry-button" class="secondary-button">再测一次</button><button id="restart-button" class="secondary-button">回到首页</button></div>'}
    </section>`;
  document.querySelector('#save-button').addEventListener('click', saveResultImage);
  document.querySelector('#review-button').addEventListener('click', showReviewModal);
  if (shareUrl) document.querySelector('#copy-button').addEventListener('click', () => copyText(shareUrl));
  if (isShared) document.querySelector('#home-button').addEventListener('click', () => { history.replaceState({}, '', window.location.pathname); state = { sessionToken: null, index: 0, answers: Array(QUESTIONS.length).fill(null), result: null, publicId: null }; renderWelcome(); });
  else {
    document.querySelector('#retry-button').addEventListener('click', retryAssessment);
    document.querySelector('#restart-button').addEventListener('click', () => renderStart());
  }
}

function retryAssessment() {
  if (!window.confirm('重新答题将覆盖当前密码对应的分享结果，确定继续吗？')) return;
  state.answers = Array(QUESTIONS.length).fill(null);
  state.result = null;
  renderQuestion(0);
}

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
    showToast('结果链接已复制，可直接分享给朋友。');
  } catch {
    const input = document.querySelector('.share-input');
    input.select();
    document.execCommand('copy');
    showToast('结果链接已复制。');
  }
}

async function saveResultImage() {
  const target = document.querySelector('#result-capture');
  const button = document.querySelector('#save-button');
  if (!window.html2canvas || !target) return showToast('长图组件暂未加载，请刷新后重试。');
  button.disabled = true;
  button.textContent = '正在生成长图…';
  try {
    const canvas = await window.html2canvas(target, { scale: 2, backgroundColor: '#fffaf5', useCORS: true, logging: false });
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('图片生成失败。');
    const filename = `前任匿名评价-${RESULTS[state.result?.resultType || 'rebuilding'].type}.png`;
    const file = new File([blob], filename, { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] }) && /iPhone|iPad|Android/i.test(navigator.userAgent)) {
      await navigator.share({ files: [file], title: '我的关系遗产画像' });
      showToast('请在系统分享面板选择“存储图像”或保存到相册。');
    } else {
      const href = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.download = filename;
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(href);
      showToast('长图已下载，请在设备的下载文件夹或照片应用中查看。');
    }
  } catch (error) {
    if (error?.name !== 'AbortError') showToast('长图生成失败，请稍后重试。');
  } finally {
    button.disabled = false;
    button.textContent = '保存结果长图';
  }
}

function showReviewModal() {
  modalRoot.innerHTML = `
    <div class="modal-backdrop" id="review-backdrop">
      <section class="modal" role="dialog" aria-modal="true" aria-labelledby="review-title">
        <div class="modal-handle"></div>
        <h2 id="review-title">谢谢你的认可</h2>
        <p>如果你喜欢这次测评，欢迎到店铺留下真实好评。<br><br>店铺好评后，请联系客户并发送好评截图，即可获得 <b>1 元返现</b>。</p>
        <button id="close-review" class="primary-button">我知道了</button>
      </section>
    </div>`;
  document.querySelector('#close-review').addEventListener('click', closeModal);
  document.querySelector('#review-backdrop').addEventListener('click', (event) => { if (event.target.id === 'review-backdrop') closeModal(); });
}

function closeModal() { modalRoot.innerHTML = ''; }

async function renderSharedResult(id) {
  app.innerHTML = '<div class="loading">正在打开匿名结果…</div>';
  try {
    const data = await request('share', { query: { id } });
    state.result = { resultType: data.resultType, scores: data.scores };
    state.publicId = data.publicId;
    renderResult(state.result, data.publicId, true);
  } catch (error) {
    app.innerHTML = `${brand()}<section class="card"><h1 class="card-title">这个结果链接已经失效</h1><p class="card-copy">请让分享者重新复制链接，或回到首页完成你自己的测评。</p><button id="go-home" class="primary-button">回到首页</button></section>`;
    document.querySelector('#go-home').addEventListener('click', () => { history.replaceState({}, '', window.location.pathname); renderWelcome(); });
  }
}

const sharedId = new URLSearchParams(window.location.search).get('result');
if (sharedId) renderSharedResult(sharedId);
else if (state.sessionToken) renderStart();
else renderWelcome();
