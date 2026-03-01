// Screener state
const selections = {};

function selectOpt(btn, category, value) {
  selections[category] = value;
  const parent = btn.closest('.screener-q');
  parent.querySelectorAll('.screener-opt').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  updateScreenerSubmitState();
}

function updateScreenerSubmitState() {
  const btn = document.getElementById('showResourcesBtn');
  const hint = document.getElementById('screenerHint');
  if (!btn) {
    return;
  }

  const ready = Boolean(selections.need && selections.city && selections.who);
  btn.disabled = !ready;
  if (hint) {
    hint.textContent = ready
      ? 'Looks good. You can now view your matched resources.'
      : 'Answer all 3 questions to see your matched resources.';
  }
}

const allResults = [
  { cat: 'food', title: 'Alameda County Food Bank', desc: 'Free groceries and produce for East Bay families. No ID required.', tag: '🥗 Food', link: 'https://accfb.org' },
  { cat: 'food', title: 'CalFresh / EBT', desc: 'Monthly food funds loaded on an EBT card. Family of 4 may receive up to $973/month.', tag: '🥗 Food', link: 'apply.html' },
  { cat: 'food', title: 'WIC Program', desc: 'Free food, formula, and nutrition support for pregnant women and kids under 5.', tag: '🥗 Food · Family', link: 'https://acphd.org/wic/' },
  { cat: 'health', title: 'La Clínica de La Raza', desc: 'Free and sliding-scale care in Oakland, Hayward, Fruitvale. Spanish-speaking staff.', tag: '🏥 Healthcare', link: 'https://laclinica.org' },
  { cat: 'health', title: 'Medi-Cal (Free Health Insurance)', desc: 'State health insurance covering doctor visits, dental, prescriptions, mental health.', tag: '🏥 Healthcare', link: 'apply.html' },
  { cat: 'health', title: 'Alameda County Free Vaccines', desc: 'Free immunizations for children and adults without insurance at county health clinics.', tag: '🏥 Healthcare', link: 'https://acphd.org' },
  { cat: 'housing', title: 'Alameda County 211', desc: 'Free 24/7 hotline to find emergency shelter, food, and services tonight. Call or text 211.', tag: '🏠 Housing', link: 'tel:211' },
  { cat: 'housing', title: 'BOSS Oakland', desc: 'Shelter, housing, and support services in Oakland for individuals and families.', tag: '🏠 Housing', link: 'https://www.self-sufficiency.org/' },
  { cat: 'money', title: 'PG&E REACH Program', desc: 'Emergency bill assistance for qualifying low-income PG&E customers.', tag: '💰 Financial', link: 'https://pge.com' },
  { cat: 'money', title: 'VITA Free Tax Prep', desc: 'Free tax preparation help for households earning under $67,000. Catch credits you may have missed.', tag: '💰 Financial', link: 'https://irs.gov/vita' },
  { cat: 'kids', title: 'Early Head Start Program', desc: 'Free preschool and early learning programs for low-income families across Alameda County.', tag: '👧 Kids & Family', link: 'https://www.ymcaeastbay.org/early-care?gad_source=1&gad_campaignid=23262874253&gbraid=0AAAAADeaGbn-sOTSGzpH3VBJzZ38vmBAd&gclid=CjwKCAiA-__MBhAKEiwASBmsBHnO9XONVSkx9KpWEyPlcsSQMfDUN1Z2JAaK0MXA2iqL9fRw6Z_b4BoCJQkQAvD_BwE' },
  { cat: 'kids', title: "Oakland's Summer Food Service Program", desc: 'Free meals for children under 18 at sites throughout Oakland during summer.', tag: '👧 Kids & Family · Food', link: 'https://www.oaklandca.gov/Community/Food-Services/Summer-Food-Program' },
  { cat: 'legal', title: 'Bay Area Legal Aid', desc: 'Free civil legal help for low-income East Bay residents — housing, benefits, immigration.', tag: '⚖️ Legal', link: 'https://baylegal.org' },
  { cat: 'jobs', title: 'Alameda County Workforce Development', desc: 'Free job training, resume help, and placement services at Eastmont WorkSource Center.', tag: '💼 Jobs', link: 'https://acwdb.org' },
];

function showResults() {
  const form = document.getElementById('screenerForm');
  const results = document.getElementById('screenerResults');
  const resultSub = document.getElementById('resultSub');
  const resultCards = document.getElementById('resultCards');
  if (!form || !results || !resultSub || !resultCards) {
    return;
  }

  if (!selections.need || !selections.city || !selections.who) {
    updateScreenerSubmitState();
    return;
  }

  form.style.display = 'none';
  results.classList.add('active');

  const need = selections['need'] || 'all';
  const city = selections['city'] || '';
  const who = selections['who'] || '';

  let filtered = need === 'all' ? allResults : allResults.filter(r => r.cat === need || r.tag.toLowerCase().includes(need));
  if (filtered.length === 0) filtered = allResults.slice(0, 6);
  if (filtered.length > 6) filtered = filtered.slice(0, 6);

  const sub = city ? `Resources near ${city.charAt(0).toUpperCase()+city.slice(1)} for ${who || 'you'}.` : 'Based on your answers, here are the most relevant East Bay resources.';
  resultSub.textContent = sub;

  const cards = filtered.map(r => `
    <div class="result-card">
      <div class="result-card-tag">${r.tag}</div>
      <h4>${r.title}</h4>
      <p>${r.desc}</p>
      <a class="result-card-link" href="${r.link}">Learn More & Apply →</a>
    </div>
  `).join('');

  resultCards.innerHTML = cards;
}

function resetScreener() {
  const form = document.getElementById('screenerForm');
  const results = document.getElementById('screenerResults');
  if (!form || !results) {
    return;
  }

  Object.keys(selections).forEach(k => delete selections[k]);
  form.style.display = 'block';
  results.classList.remove('active');
  document.querySelectorAll('.screener-opt').forEach(b => b.classList.remove('selected'));
  updateScreenerSubmitState();
}

// Resource Directory
const resources = [
  {
    id: 'ac-food-bank',
    cat: 'food',
    icon: '🥗',
    iconClass: 'icon-food',
    title: 'Alameda County Food Bank',
    sub: 'Food',
    desc: 'Free groceries and produce distribution across East Bay.',
    location: '7900 Edgewater Dr, Oakland, CA 94621',
    phone: '(510) 635-3663',
    email: 'info@accfb.org',
    website: 'https://www.accfb.org',
    applyUrl: 'https://www.accfb.org/get-food/',
    detail: 'Provides groceries through partner pantries and mobile distributions for East Bay households facing food insecurity.',
    tags: ['free', 'no-id-required', 'immediate-help']
  },
  {
    id: 'calfresh',
    cat: 'food',
    icon: '🥗',
    iconClass: 'icon-food',
    title: 'CalFresh / EBT Food Program',
    sub: 'Food',
    desc: 'Monthly grocery funds for eligible households.',
    location: '2000 San Pablo Ave, Oakland, CA 94612',
    phone: '(888) 999-4772',
    email: 'socialservices@acgov.org',
    website: 'https://benefitscal.com',
    applyUrl: 'https://benefitscal.com',
    detail: 'State nutrition benefit that provides monthly EBT funds for groceries and participating markets.',
    tags: ['free', 'apply-online']
  },
  {
    id: 'wic',
    cat: 'food',
    icon: '🥗',
    iconClass: 'icon-food',
    title: 'WIC (Women, Infants & Children)',
    sub: 'Food · Family',
    desc: 'Nutrition support, healthy food benefits, and formula assistance.',
    location: '111 Fairmont Dr, San Leandro, CA 94578',
    phone: '(888) 942-9675',
    email: 'wic@acgov.org',
    website: 'https://acphd.org/wic/',
    applyUrl: 'https://acphd.org/wic/',
    detail: 'Supports pregnant/postpartum parents and children under five with food benefits, breastfeeding support, and nutrition counseling.',
    tags: ['free', 'ages-under-18', 'apply-online']
  },
  {
    id: 'la-clinica',
    cat: 'health',
    icon: '🏥',
    iconClass: 'icon-health',
    title: 'La Clínica de La Raza',
    sub: 'Healthcare',
    desc: 'Community clinics with low-cost care and multilingual support.',
    location: '1450 Fruitvale Ave, Oakland, CA 94601',
    phone: '(510) 535-4000',
    email: 'info@laclinica.org',
    website: 'https://www.laclinica.org',
    applyUrl: 'https://www.laclinica.org/patients/',
    detail: 'Provides primary care, dental, behavioral health, and preventive services regardless of insurance status.',
    tags: ['free', 'immediate-help']
  },
  {
    id: 'medi-cal',
    cat: 'health',
    icon: '🏥',
    iconClass: 'icon-health',
    title: 'Medi-Cal',
    sub: 'Healthcare',
    desc: 'Free or low-cost health coverage for California residents.',
    location: '2000 San Pablo Ave, Oakland, CA 94612',
    phone: '(888) 999-4772',
    email: 'socialservices@acgov.org',
    website: 'https://www.coveredca.com/health/medi-cal/',
    applyUrl: 'https://benefitscal.com',
    detail: 'Public health insurance covering doctor visits, prescriptions, mental health, emergency care, and more.',
    tags: ['free', 'apply-online']
  },
  {
    id: 'roots',
    cat: 'health',
    icon: '🏥',
    iconClass: 'icon-health',
    title: 'Roots Community Health Center',
    sub: 'Healthcare',
    desc: 'Primary care and behavioral health in East Oakland.',
    location: '9925 International Blvd, Oakland, CA 94603',
    phone: '(510) 777-1177',
    email: 'info@rootsclinic.org',
    website: 'https://www.rootsclinic.org',
    applyUrl: 'https://www.rootsclinic.org/make-an-appointment',
    detail: 'Offers culturally responsive healthcare, preventive screenings, and mental health services.',
    tags: ['free', 'immediate-help']
  },
  {
    id: 'free-vaccines',
    cat: 'health',
    icon: '💉',
    iconClass: 'icon-health',
    title: 'Free Vaccines (No Insurance)',
    sub: 'Healthcare',
    desc: 'No-cost immunizations for children and adults.',
    location: '1000 Broadway, Oakland, CA 94607',
    phone: '(510) 267-8000',
    email: 'immunizations@acgov.org',
    website: 'https://acphd.org/immunization',
    applyUrl: 'https://acphd.org/immunization',
    detail: 'County health services providing routine and seasonal vaccines even if you are uninsured.',
    tags: ['free', 'no-id-required', 'ages-under-18']
  },
  {
    id: 'ac-211',
    cat: 'housing',
    icon: '🏠',
    iconClass: 'icon-housing',
    title: 'Alameda County 211',
    sub: 'Housing',
    desc: '24/7 hotline for shelter, food, and crisis support.',
    location: 'Alameda County (phone-based countywide service)',
    phone: '211',
    email: 'help@211alamedacounty.org',
    website: 'https://www.211alamedacounty.org',
    applyUrl: 'https://www.211alamedacounty.org',
    detail: 'Connects residents to emergency shelter, food, legal and utility help based on immediate need.',
    tags: ['free', 'immediate-help']
  },
  {
    id: 'boss',
    cat: 'housing',
    icon: '🏠',
    iconClass: 'icon-housing',
    title: 'BOSS Oakland',
    sub: 'Housing',
    desc: 'Housing navigation and emergency shelter support.',
    location: '2065 Kittredge St, Berkeley, CA 94704',
    phone: '(510) 649-1930',
    email: 'info@self-sufficiency.org',
    website: 'https://www.self-sufficiency.org/',
    applyUrl: 'https://www.self-sufficiency.org/',
    detail: 'Provides shelter placement, case management, and transition planning for individuals and families.',
    tags: ['free', 'immediate-help']
  },
  {
    id: 'building-futures',
    cat: 'housing',
    icon: '🏠',
    iconClass: 'icon-housing',
    title: 'Building Futures',
    sub: 'Housing',
    desc: 'Family-focused housing and shelter services.',
    location: '1840 Fairway Dr, San Leandro, CA 94577',
    phone: '(510) 357-0205',
    email: 'info@bfwc.org',
    website: 'https://bfwc.org/',
    applyUrl: 'https://bfwc.org/',
    detail: 'Helps families and survivors of violence access emergency shelter, housing advocacy, and support services.',
    tags: ['free', 'immediate-help', 'ages-under-18']
  },
  {
    id: 'pge-reach',
    cat: 'money',
    icon: '💰',
    iconClass: 'icon-money',
    title: 'PG&E REACH Program',
    sub: 'Financial Aid',
    desc: 'Emergency utility-bill help for qualifying households.',
    location: 'PG&E East Bay Service Area',
    phone: '(800) 743-5000',
    email: 'care@pge.com',
    website: 'https://www.pge.com',
    applyUrl: 'https://www.pge.com/en/account/billing-and-assistance/financial-assistance/reach.html',
    detail: 'One-time utility grant assistance for households behind on electricity or gas payments.',
    tags: ['apply-online', 'immediate-help']
  },
  {
    id: 'liheap',
    cat: 'money',
    icon: '💰',
    iconClass: 'icon-money',
    title: 'LIHEAP Energy Assistance',
    sub: 'Financial Aid',
    desc: 'Energy support to reduce heating and cooling costs.',
    location: '1900 Embarcadero, Oakland, CA 94606',
    phone: '(510) 981-6640',
    email: 'liheap@spectrumcs.org',
    website: 'https://www.csd.ca.gov/Pages/LIHEAPProgram.aspx',
    applyUrl: 'https://www.csd.ca.gov/Pages/FindServicesInYourArea.aspx',
    detail: 'Federal assistance program that helps eligible households pay utility costs and avoid shutoffs.',
    tags: ['free', 'apply-online']
  },
  {
    id: 'vita',
    cat: 'money',
    icon: '💰',
    iconClass: 'icon-money',
    title: 'VITA Free Tax Preparation',
    sub: 'Financial Aid',
    desc: 'No-cost tax prep to claim credits and refunds.',
    location: '675 Hegenberger Rd, Oakland, CA 94621',
    phone: '(800) 906-9887',
    email: 'vita@irs.gov',
    website: 'https://www.irs.gov/individuals/free-tax-return-preparation-for-qualifying-taxpayers',
    applyUrl: 'https://irs.treasury.gov/freetaxprep/',
    detail: 'IRS-certified volunteers prepare returns for qualifying households and help maximize tax credits.',
    tags: ['free', 'apply-online']
  },
  {
    id: 'head-start',
    cat: 'kids',
    icon: '👧',
    iconClass: 'icon-kids',
    title: 'Early Head Start Program',
    sub: 'Kids & Family',
    desc: 'Early childhood education and family services.',
    location: '6955 Foothill Blvd, Oakland, CA 94605',
    phone: '(510) 271-9141',
    email: 'headstart@c5alameda.org',
    website: 'https://www.ymcaeastbay.org/early-care?gad_source=1&gad_campaignid=23262874253&gbraid=0AAAAADeaGbn-sOTSGzpH3VBJzZ38vmBAd&gclid=CjwKCAiA-__MBhAKEiwASBmsBHnO9XONVSkx9KpWEyPlcsSQMfDUN1Z2JAaK0MXA2iqL9fRw6Z_b4BoCJQkQAvD_BwE',
    applyUrl: 'https://www.ymcaeastbay.org/early-care?gad_source=1&gad_campaignid=23262874253&gbraid=0AAAAADeaGbn-sOTSGzpH3VBJzZ38vmBAd&gclid=CjwKCAiA-__MBhAKEiwASBmsBHnO9XONVSkx9KpWEyPlcsSQMfDUN1Z2JAaK0MXA2iqL9fRw6Z_b4BoCJQkQAvD_BwE',
    detail: 'Offers free preschool, developmental screenings, and family support for eligible households with young children.',
    tags: ['free', 'ages-under-18', 'apply-online']
  },
  {
    id: 'oakland-summer-meals',
    cat: 'kids',
    icon: '👧',
    iconClass: 'icon-kids',
    title: "Oakland's Summer Food Service Program",
    sub: 'Kids & Family',
    desc: 'Free meal sites for children during school breaks.',
    location: '1000 Broadway, Oakland, CA 94607',
    phone: '(510) 879-8344',
    email: 'nutritionservices@ousd.org',
    website: 'https://www.oaklandca.gov/Community/Food-Services/Summer-Food-Program',
    applyUrl: 'https://www.oaklandca.gov/Community/Food-Services/Summer-Food-Program',
    detail: 'Provides breakfast and lunch access for youth at community meal sites when school is out.',
    tags: ['free', 'ages-under-18', 'immediate-help']
  },
  {
    id: 'bay-legal',
    cat: 'legal',
    icon: '⚖️',
    iconClass: 'icon-legal',
    title: 'Bay Area Legal Aid',
    sub: 'Legal Aid',
    desc: 'Free legal support for housing, benefits, and family safety.',
    location: '1735 Telegraph Ave, Oakland, CA 94612',
    phone: '(800) 551-5554',
    email: 'contact@baylegal.org',
    website: 'https://baylegal.org',
    applyUrl: 'https://baylegal.org/get-help/',
    detail: 'Provides civil legal help to low-income residents, including eviction defense and public benefits support.',
    tags: ['free', 'immediate-help']
  },
  {
    id: 'workforce',
    cat: 'jobs',
    icon: '💼',
    iconClass: 'icon-jobs',
    title: 'Alameda County Workforce Development',
    sub: 'Jobs',
    desc: 'Job training, resume help, and placement support.',
    location: '6955 Foothill Blvd, Oakland, CA 94605',
    phone: '(510) 568-3500',
    email: 'info@acwdb.org',
    website: 'https://acwdb.org',
    applyUrl: 'https://acwdb.org/job-seekers/',
    detail: 'Connects job seekers to career coaching, training pathways, and local employer hiring opportunities.',
    tags: ['free', 'apply-online']
  }
];

const tagDisplay = {
  free: 'Free',
  'no-id-required': 'No ID Required',
  'apply-online': 'Public Assistance Program',
  'immediate-help': 'Immediate Help',
  'ages-under-18': 'Ages Under 18'
};

let currentCategory = 'all';
const activePrefs = new Set();

function filteredResources() {
  return resources.filter(resource => {
    const categoryMatches = currentCategory === 'all' || resource.cat === currentCategory;
    if (!categoryMatches) {
      return false;
    }
    if (activePrefs.size === 0) {
      return true;
    }
    return [...activePrefs].every(tag => resource.tags.includes(tag));
  });
}

function renderTag(resource, tagKey) {
  const classes = ['rc-tag'];
  return `<span class="${classes.join(' ')}">${tagDisplay[tagKey]}</span>`;
}

function renderResources() {
  const grid = document.getElementById('resourceGrid');
  if (!grid) {
    return;
  }

  const filtered = filteredResources();
  if (filtered.length === 0) {
    grid.innerHTML = '<div class="resource-empty">No resources match those preferences. Try clearing one filter.</div>';
    return;
  }

  grid.innerHTML = filtered.map(r => `
    <article class="resource-card" data-cat="${r.cat}" role="link" tabindex="0" onclick="openResourceDetail('${r.id}')" onkeydown="openResourceDetailKey(event, '${r.id}')">
      <div class="rc-top">
        <div class="rc-icon ${r.iconClass}">${r.icon}</div>
        <div class="rc-title-area">
          <h3>${r.title}</h3>
          <div class="rc-category">${r.sub}</div>
        </div>
      </div>
      <div class="rc-desc">${r.desc}</div>
      <div class="rc-tags">${r.tags.map(t => renderTag(r, t)).join('')}</div>
    </article>
  `).join('');
}

function filterResources(cat, btn) {
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  if (btn) {
    btn.classList.add('active');
  }
  currentCategory = cat;
  renderResources();
}

function openResourceDetail(resourceId) {
  window.location.href = `resource-detail.html?id=${resourceId}`;
}

function openResourceDetailKey(event, resourceId) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openResourceDetail(resourceId);
  }
}

function togglePreferencesPanel() {
  const panel = document.getElementById('prefsPanel');
  if (!panel) {
    return;
  }
  panel.hidden = !panel.hidden;
}

function togglePreference(key, btn) {
  if (activePrefs.has(key)) {
    activePrefs.delete(key);
    if (btn) {
      btn.classList.remove('active');
    }
  } else {
    activePrefs.add(key);
    if (btn) {
      btn.classList.add('active');
    }
  }
  renderResources();
}

function clearPreferences() {
  activePrefs.clear();
  document.querySelectorAll('.pref-chip').forEach(chip => chip.classList.remove('active'));
  renderResources();
}

function buildDetailParagraph(resource) {
  const themes = resource.tags.map(tag => tagDisplay[tag]).join(', ');
  return `${resource.detail} This resource supports East Bay residents with direct services, eligibility guidance, and referral support when needed. Typical help areas include ${themes}.`;
}

function initResourceDetail() {
  const title = document.getElementById('detailName');
  if (!title) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const resource = resources.find(item => item.id === id);

  if (!resource) {
    title.textContent = 'Resource not found';
    document.getElementById('detailDescription').textContent = 'Please return to the directory and select a valid resource.';
    return;
  }

  document.title = `RootED — ${resource.title}`;
  title.textContent = resource.title;
  document.getElementById('detailCategory').textContent = resource.sub;
  document.getElementById('detailDescription').textContent = buildDetailParagraph(resource);
  document.getElementById('detailLocation').textContent = resource.location;
  document.getElementById('detailPhone').textContent = resource.phone;
  document.getElementById('detailPhone').setAttribute('href', resource.phone === '211' ? 'tel:211' : `tel:${resource.phone.replace(/[^0-9]/g, '')}`);
  document.getElementById('detailEmail').textContent = resource.email;
  document.getElementById('detailEmail').setAttribute('href', `mailto:${resource.email}`);
  document.getElementById('detailApply').setAttribute('href', resource.applyUrl);
  document.getElementById('detailTagList').innerHTML = resource.tags.map(tag => renderTag(resource, tag)).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderResources();
  initResourceDetail();
  initSuggestForm();
  updateScreenerSubmitState();
});

// Apply tabs
function switchApply(id, btn) {
  const content = document.getElementById('apply-' + id);
  if (!content) {
    return;
  }

  document.querySelectorAll('.apply-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.apply-content').forEach(c => c.classList.remove('active'));
  if (btn) {
    btn.classList.add('active');
  }
  content.classList.add('active');
}

// FAQ
function toggleFaq(el) {
  const item = el.closest('.faq-item');
  if (item) {
    item.classList.toggle('open');
  }
}

function initSuggestForm() {
  const form = document.getElementById('suggestForm');
  const msg = document.getElementById('suggestMsg');
  if (!form || !msg) {
    return;
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const name = data.get('resourceName')?.toString().trim();
    const city = data.get('city')?.toString().trim();
    const details = data.get('details')?.toString().trim();

    if (!name || !city || !details) {
      msg.textContent = 'Please fill in the required fields before submitting.';
      msg.classList.add('visible');
      return;
    }

    const subject = encodeURIComponent('RootED Resource Suggestion');
    const body = encodeURIComponent(
      [
        `Resource name: ${name}`,
        `Category: ${data.get('category') || ''}`,
        `City/area: ${city}`,
        `Website/phone: ${data.get('contact') || ''}`,
        `Languages: ${data.get('language') || ''}`,
        '',
        'Notes:',
        details
      ].join('\n')
    );

    window.location.href = `mailto:hello@rooted-eastbay.org?subject=${subject}&body=${body}`;
    msg.textContent = 'Thanks. Your email draft is ready to send.';
    msg.classList.add('visible');
    form.reset();
  });
}
