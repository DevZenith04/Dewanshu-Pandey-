const { initialNationalStats, initialParcels, initialProjects } = window.ZameenData;

const demoAccountIds = ['state-admin', 'district-officer', 'reviewer'];
const navItems = [
  { id: 'dashboard', label: 'Overview', hint: 'National pulse', icon: 'space_dashboard' },
  { id: 'projects', label: 'Project desk', hint: 'Active acquisition', icon: 'folder_open' },
  { id: 'analysis', label: 'Risk studio', hint: 'Model signals', icon: 'monitoring' },
  { id: 'registry', label: 'Parcel registry', hint: 'Cadastral records', icon: 'location_on' },
  { id: 'archive', label: 'Archive', hint: 'Closed cases', icon: 'menu_book' },
];

const savedTheme = localStorage.getItem('zv_theme');
const initialTheme = savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

const state = {
  activeTab: 'dashboard',
  projects: initialProjects.map((project) => ({ ...project })),
  selectedProject: initialProjects[0],
  parcels: initialParcels.map((parcel) => ({ ...parcel })),
  stats: { ...initialNationalStats },
  mobileNavOpen: false,
  newEntryOpen: false,
  reportOpen: false,
  theme: initialTheme,
  registryQuery: '',
  registryStatus: 'All status',
  backendStatus: 'checking',
  currentUser: window.ZameenApi?.user?.() || { name: 'Signing in…', role: 'Demo account', id: 'pending' },
  accuracy: { resolved_cases: 0, cases: [] },
};

const app = document.querySelector('#app');
const icon = (name, className = '') => `<span class="material-symbols-outlined ${className}">${name}</span>`;
const riskTone = (level) => {
  if (level === 'CRITICAL') return { label: 'Critical', className: 'risk-critical', dot: 'bg-[#c45f4b]' };
  if (level === 'HIGH' || level === 'MED-HIGH') return { label: 'High', className: 'risk-high', dot: 'bg-[#d18a42]' };
  if (level === 'MEDIUM') return { label: 'Medium', className: 'risk-medium', dot: 'bg-[#568b87]' };
  return { label: 'Low', className: 'risk-low', dot: 'bg-[#5f9b7d]' };
};
const riskPill = (level) => { const tone = riskTone(level); return `<span class="risk-pill ${tone.className}"><span class="risk-dot ${tone.dot}"></span>${tone.label}</span>`; };
const signalBar = (label, value, tone = 'coral') => `<div class="signal-row"><div class="signal-head"><span>${label}</span><strong>${value}%</strong></div><div class="signal-track"><div class="signal-fill ${tone} signal-width-${value}"></div></div></div>`;
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));

function filteredProjects() {
  const query = String(state.projectQuery || '').trim().toLowerCase();
  const filter = state.projectFilter || 'All risk';
  return state.projects.filter((project) => {
    const haystack = `${project.title} ${project.id} ${project.district} ${project.state} ${project.phase} ${project.landType}`.toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    const matchesRisk = filter === 'All risk' || riskTone(project.riskLevel).label === filter;
    return matchesQuery && matchesRisk;
  });
}

function filteredParcels() {
  const query = String(state.registryQuery || '').trim().toLowerCase();
  const status = state.registryStatus || 'All status';
  return state.parcels.filter((parcel) => {
    const haystack = `${parcel.id} ${parcel.owner} ${parcel.cadastralRef} ${parcel.geoCoords} ${parcel.status}`.toLowerCase();
    return (!query || haystack.includes(query)) && (status === 'All status' || parcel.status === status);
  });
}

function registryToolbar(scope = 'project') {
  if (scope === 'parcel') {
    const statuses = ['All status', ...new Set(state.parcels.map((parcel) => parcel.status))];
    return `<div class="registry-toolbar"><div class="search-box">${icon('search')}<input data-parcel-search value="${esc(state.registryQuery || '')}" placeholder="Search parcel, owner or cadastral ref" /></div><div class="filter-tabs status-tabs">${statuses.map((item) => `<button class="${(state.registryStatus || 'All status') === item ? 'active' : ''}" data-registry-status="${esc(item)}">${esc(item)}</button>`).join('')}</div></div>`;
  }
  return `<div class="registry-toolbar compact"><div class="search-box">${icon('search')}<input data-risk-search value="${esc(state.projectQuery || '')}" placeholder="Search project, district or ID" /></div><div class="filter-tabs">${['All risk', 'Critical', 'High', 'Medium', 'Low'].map((item) => `<button class="${(state.projectFilter || 'All risk') === item ? 'active' : ''}" data-filter="${item}">${item}</button>`).join('')}</div></div>`;
}

function projectRow(project, selected = false) {
  return `<button class="project-row ${selected ? 'selected' : ''}" data-project-id="${esc(project.id)}"><div class="row-main"><div class="row-code">${esc(project.id)}</div><div class="row-title">${esc(project.title)}</div><div class="row-meta">${icon('location_on')} ${esc(project.district)}, ${esc(project.state)} <span class="meta-sep">•</span> ${esc(project.hectares)} ha</div></div><div class="row-stage">${esc(project.phase)}</div><div class="row-score"><span>${esc(project.riskScore)}</span><small>/100</small></div>${riskPill(project.riskLevel)}${icon('chevron_right', 'row-chevron')}</button>`;
}

function metric(label, value, detail, symbol, accent = 'coral') {
  return `<div class="metric-card accent-${accent}"><div class="metric-icon">${icon(symbol)}</div><div class="metric-label">${label}</div><div class="metric-value">${value}</div><div class="metric-detail">${detail}</div></div>`;
}

function miniMap() {
  const points = [{ x: 72, y: 24 }, { x: 43, y: 35 }, { x: 57, y: 42 }, { x: 73, y: 57 }, { x: 34, y: 63 }, { x: 66, y: 77 }];
  return `<div class="map-panel"><div class="map-grid"></div><div class="map-outline map-outline-one"></div><div class="map-outline map-outline-two"></div><div class="map-outline map-outline-three"></div><div class="map-river"></div>${state.projects.slice(0, 6).map((project, index) => `<button class="map-pin map-point-${index} ${riskTone(project.riskLevel).className}" data-project-id="${esc(project.id)}" title="${esc(project.title)}"><span></span><em>${esc(project.riskScore)}</em></button>`).join('')}<div class="map-legend"><span><i class="legend-dot critical"></i> Critical</span><span><i class="legend-dot high"></i> Elevated</span><span><i class="legend-dot stable"></i> Stable</span></div><div class="map-caption"><span class="eyebrow">Spatial view</span><strong>6 live risk signals</strong><small>Indicative locations · sync 08:45 IST</small></div></div>`;
}

function signalStrip() {
  return `<section class="signal-strip" aria-label="Morning brief"><div class="signal-strip-intro"><span class="eyebrow">Morning brief · 08:45 IST</span><strong>Three signals changed overnight.</strong><span>Read the movement before the meeting.</span></div><div class="signal-summary coral"><span class="signal-index">01</span><div><span>Compensation</span><strong>4 files crossed 70%</strong></div>${icon('north_east')}</div><div class="signal-summary ochre"><span class="signal-index">02</span><div><span>Dispute load</span><strong>2 new stays filed</strong></div>${icon('north_east')}</div><div class="signal-summary teal"><span class="signal-index">03</span><div><span>Title clarity</span><strong>18 stable projects</strong></div>${icon('south_east')}</div></section>`;
}

function analyticsCharts() {
  return `<section class="charts-grid" aria-label="Interactive analytics"><div class="panel chart-panel"><div class="panel-heading"><div><span class="eyebrow">Portfolio mix</span><h2>Risk bands</h2></div><span class="chart-hint">Hover to inspect</span></div><div class="chart-wrap chart-doughnut"><canvas id="risk-mix-chart" aria-label="Risk band distribution" role="img"></canvas></div></div><div class="panel chart-panel"><div class="panel-heading"><div><span class="eyebrow">Workflow pressure</span><h2>Exposure by stage</h2></div><span class="chart-hint">Tracked projects</span></div><div class="chart-wrap"><canvas id="stage-exposure-chart" aria-label="Project exposure by acquisition stage" role="img"></canvas></div></div><div class="panel chart-panel"><div class="panel-heading"><div><span class="eyebrow">Regional pulse</span><h2>Projects by state</h2></div><span class="chart-hint">Hover to compare</span></div><div class="chart-wrap chart-tall"><canvas id="state-exposure-chart" aria-label="Tracked projects by state" role="img"></canvas></div></div><div class="panel chart-panel"><div class="panel-heading"><div><span class="eyebrow">Delay watch</span><h2>Highest likelihood files</h2></div><span class="chart-hint">Top seven files</span></div><div class="chart-wrap chart-tall"><canvas id="delay-exposure-chart" aria-label="Delay likelihood by project" role="img"></canvas></div></div></section>`;
}

const assessmentDisabled = () => state.currentUser?.id === 'pending' ? ' disabled aria-disabled="true"' : '';
const liveRegistryDate = () => new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' }).format(new Date()).toUpperCase();

function overview() {
  const critical = state.projects.filter((project) => project.riskScore >= 80).sort((a, b) => b.riskScore - a.riskScore);
  return `<div class="page-stack"><section class="hero-row"><div><div class="eyebrow">${liveRegistryDate()} <span class="live-dot"></span> live registry</div><h1>Know what will<br><em>stall next.</em></h1><p class="hero-copy">A decision surface for land acquisition teams. Read the signal, find the bottleneck, move the file.</p></div><div class="hero-actions"><button class="button secondary" data-action="report">${icon('description')} Export brief</button><button class="button primary" data-action="new-project"${assessmentDisabled()}>${icon('note_add')} New assessment</button></div></section><section class="metrics-grid">${metric('Active projects', state.stats.totalProjectsActive.toLocaleString(), '+38 this quarter', 'folder_open')}${metric('Critical exposure', state.stats.criticalRiskZones, 'Needs review today', 'warning', 'coral')}${metric('Land under survey', '84.6k ha', 'Across 17 states', 'public', 'teal')}${metric('Interventions due', '21', '7 overdue by 14+ days', 'target', 'ochre')}</section>${signalStrip()}${analyticsCharts()}<section class="dashboard-grid"><div class="panel map-card"><div class="panel-heading"><div><span class="eyebrow">Geographic pulse</span><h2>Where attention is gathering</h2></div><button class="icon-button" data-nav="analysis">${icon('more_horiz')}</button></div>${miniMap()}</div><div class="panel priority-card"><div class="panel-heading"><div><span class="eyebrow">Priority queue</span><h2>Decisions due now</h2></div><button class="text-button" data-nav="projects">View all ${icon('chevron_right')}</button></div><div class="priority-list">${critical.slice(0, 3).map((project) => `<button class="priority-item" data-project-id="${esc(project.id)}"><div class="priority-score">${project.riskScore}<small>risk</small></div><div><strong>${esc(project.title)}</strong><span>${esc(project.district)} · ${esc(project.phase)}</span></div>${icon('chevron_right')}</button>`).join('')}</div><div class="panel-foot">${icon('notifications')} 3 new signals since last sync <button data-nav="analysis">Open risk studio</button></div></div></section><section class="dashboard-grid lower-grid"><div class="panel table-card"><div class="panel-heading"><div><span class="eyebrow">Most exposed files</span><h2>Projects to watch</h2></div><button class="text-button" data-nav="projects">Project desk ${icon('chevron_right')}</button></div><div class="project-table">${state.projects.slice(0, 5).map((project) => projectRow(project)).join('')}</div></div><div class="panel trend-card"><div class="panel-heading"><div><span class="eyebrow">Model readout</span><h2>Stage bottlenecks</h2></div>${icon('monitoring', 'muted-icon')}</div><div class="trend-summary"><strong>Compensation</strong><span>is the slowest-moving stage this month</span>${icon('north_east')}</div>${signalBar('Compensation', 72, 'coral')}${signalBar('Dispute resolution', 61, 'ochre')}${signalBar('Rehabilitation & R&R', 48, 'teal')}${signalBar('Approval', 26, 'teal')}<div class="sparkline"><span>Apr 01</span><div class="spark-bars">${[36, 44, 42, 58, 49, 67, 62, 78, 73, 85, 82, 92].map((height) => `<i class="spark-h-${height}"></i>`).join('')}</div><span>May 27</span></div><div class="trend-foot">${icon('verified')} Confidence is strongest on early-stage files</div></div></section></div>`;
}

function projectDesk() {
  const query = state.projectQuery || '';
  const filter = state.projectFilter || 'All risk';
  const filtered = filteredProjects();
  return `<div class="page-stack"><section class="page-heading"><div><div class="eyebrow">ACTIVE REGISTER · ${state.projects.length} tracked files</div><h1>Project desk</h1><p>One queue for every acquisition that needs a human decision.</p></div><button class="button primary" data-action="new-project"${assessmentDisabled()}>${icon('note_add')} New assessment</button></section><div class="workspace-grid"><div class="panel project-panel"><div class="toolbar"><div class="search-box">${icon('search')}<input data-project-search value="${esc(query)}" placeholder="Search project, district or ID" /></div><div class="filter-tabs">${['All risk', 'Critical', 'High', 'Medium', 'Low'].map((item) => `<button class="${filter === item ? 'active' : ''}" data-filter="${item}">${item}</button>`).join('')}</div><button class="icon-button">${icon('filter_alt')}</button></div><div class="table-head"><span>Project</span><span>Current stage</span><span>Score</span><span>Signal</span><span></span></div><div class="project-table" data-project-list>${filtered.map((project) => projectRow(project, state.selectedProject.id === project.id)).join('')}${filtered.length === 0 ? '<div class="empty-state">' + icon('search') + '<strong>No files match that search</strong><span>Try a project ID, district, or another risk band.</span></div>' : ''}</div></div>${projectSnapshot()}</div></div>`;
}

function projectSnapshot() {
  const project = state.selectedProject;
  return `<aside class="panel snapshot"><div class="snapshot-top"><div><span class="eyebrow">Selected file</span><h2>${esc(project.title)}</h2><span class="code-chip">${esc(project.id)}</span></div>${riskPill(project.riskLevel)}</div><div class="score-orbit"><div class="orbit-ring score-ring-${project.riskScore}"><strong>${project.riskScore}</strong><span>risk score</span></div><div class="delay-copy"><span>Likely delay</span><strong>${esc(project.probabilityOfDelay)}</strong><small>${esc(project.delayPredictionText)}</small></div></div><div class="snapshot-facts"><div><span>Current stage</span><strong>${esc(project.phase)}</strong></div><div><span>Land parcel</span><strong>${esc(project.hectares)} hectares</strong></div><div><span>Families affected</span><strong>${esc(project.affectedFamilies)}</strong></div></div><div class="snapshot-section"><div class="section-label">Top drivers <span class="prediction-source ${project.predictionSource === 'Local fallback estimate' ? 'prediction-source-fallback' : 'prediction-source-ml'}">${esc(project.predictionSource || 'Unverified estimate')}</span></div>${project.predictionError ? `<div class="prediction-warning">${icon('warning')} API unavailable — local estimate only</div>` : ''}${(project.shapFactors || []).slice(0, 3).map((factor) => `<div class="driver"><div class="driver-arrow ${factor.vector === 'up' ? 'up' : factor.vector === 'down' ? 'down' : 'importance'}">${icon(factor.vector === 'up' ? 'north_east' : factor.vector === 'down' ? 'south_east' : 'bar_chart')}</div><span>${esc(factor.driver)}</span><strong>${factor.vector === 'importance' ? `${Number(factor.impact).toFixed(1)}%` : `${factor.impact > 0 ? '+' : ''}${Number(factor.impact).toFixed(1)}`}</strong></div>`).join('')}</div>${project.assessmentId && state.currentUser?.permissions?.includes('record_outcome') ? `<form id="outcome-form" class="outcome-form"><div class="section-label">Close the feedback loop</div><div class="outcome-fields"><label>Actual delay (days)<input name="actual_delay_days" type="number" min="0" value="${esc(project.actualDelayDays ?? '')}" required></label><button class="button secondary" type="submit">Record outcome</button></div><p class="form-note" data-outcome-status>${project.actualDelayDays != null ? `Recorded ${project.actualDelayDays} actual delay days.` : 'Add the real outcome to measure model accuracy.'}</p></form>` : ''}<button class="button full secondary">${icon('description')} Open full project brief</button></aside>`;
}

function predictionAccuracyPanel() {
  const accuracy = state.accuracy || {};
  const resolved = Number(accuracy.resolved_cases || 0);
  const mae = accuracy.mean_absolute_error_days == null ? '—' : `${accuracy.mean_absolute_error_days}d`;
  const within = accuracy.within_30_days_percent == null ? '—' : `${accuracy.within_30_days_percent}%`;
  const latest = (accuracy.cases || [])[0];
  return `<section class="panel accuracy-panel"><div class="panel-heading"><div><span class="eyebrow">Model monitoring</span><h2>Prediction accuracy</h2></div><span class="confidence">${resolved ? `${resolved} resolved case${resolved === 1 ? '' : 's'}` : 'Awaiting outcomes'}</span></div><div class="accuracy-grid"><div><strong>${mae}</strong><span>Mean absolute delay error</span></div><div><strong>${within}</strong><span>Within 30 days</span></div><div><strong>${latest ? esc(latest.project_name) : 'No resolved cases'}</strong><span>${latest ? `Latest actual: ${latest.actual_delay_days}d · predicted: ${latest.predicted_delay_days}d` : 'Record an actual outcome to start monitoring'}</span></div></div></section>`;
}

function riskStudio() {
  const filtered = filteredProjects();
  const average = Math.round(state.projects.reduce((sum, project) => sum + project.riskScore, 0) / state.projects.length);
  return `<div class="page-stack"><section class="page-heading"><div><div class="eyebrow">EXPLAINABLE PREDICTION LAYER</div><h1>Risk studio</h1><p>Turn model output into an operational next step.</p></div><div class="model-status"><span class="live-dot"></span> Model v1.4.2 <small>validated 2 days ago</small></div></section><section class="studio-grid"><div class="panel model-card"><div class="panel-heading"><div><span class="eyebrow">National signal</span><h2>Risk distribution</h2></div>${icon('auto_awesome', 'muted-icon')}</div><div class="big-score"><strong>${average}</strong><span>average risk score</span><div class="score-change">${icon('trending_up')} 8 pts above last month</div></div><div class="distribution"><div class="distribution-bar"><i class="low dist-low"></i><i class="medium dist-medium"></i><i class="high dist-high"></i><i class="critical dist-critical"></i></div><div class="distribution-key"><span><i class="legend-dot stable"></i> Low <b>402</b></span><span><i class="legend-dot medium"></i> Medium <b>350</b></span><span><i class="legend-dot high"></i> High <b>300</b></span><span><i class="legend-dot critical"></i> Critical <b>196</b></span></div></div></div><div class="panel explain-card"><div class="panel-heading"><div><span class="eyebrow">Signal anatomy</span><h2>What moves risk</h2></div><span class="confidence">86% confidence</span></div><div class="factor-stack">${signalBar('Legal / dispute load', 82, 'coral')}${signalBar('Compensation progress', 69, 'coral')}${signalBar('Notification age', 54, 'ochre')}${signalBar('Stakeholder response', 31, 'teal')}${signalBar('R&R readiness', 22, 'teal')}</div><div class="insight-callout">${icon('verified')}<span>Strongest risk reducer: <b>clear title records</b> in early-stage projects.</span></div></div></section>${predictionAccuracyPanel()}${registryToolbar('project')}<section class="panel analysis-table"><div class="panel-heading"><div><span class="eyebrow">Review queue</span><h2>Files with model movement</h2></div><button class="text-button">Download CSV ${icon('chevron_right')}</button></div><div data-project-list>${filtered.map((project) => `<button class="analysis-row" data-project-id="${esc(project.id)}"><div class="analysis-name"><span class="signal-badge ${riskTone(project.riskLevel).className}">${icon('monitoring')}</span><div><strong>${esc(project.title)}</strong><span>${esc(project.id)} · ${esc(project.district)}</span></div></div><div><span class="micro-label">Delay likelihood</span><strong>${esc(project.probabilityOfDelay)}</strong></div><div><span class="micro-label">Top driver</span><strong>${esc(project.shapFactors?.[0]?.driver || 'Title records')}</strong></div>${riskPill(project.riskLevel)}${icon('chevron_right')}</button>`).join('')}</div></section></div>`;
}

function registry() {
  const filtered = filteredParcels();
  return `<div class="page-stack"><section class="page-heading"><div><div class="eyebrow">CADASTRAL RECORDS · ${filtered.length} of ${state.parcels.length} entries</div><h1>Parcel registry</h1><p>Keep the legal ground truth close to the risk signal.</p></div><button class="button primary" data-action="new-project"${assessmentDisabled()}>${icon('note_add')} New assessment</button></section><div class="registry-note">${icon('verified')} <div><strong>Chain of custody intact</strong><span>All records below are synced with the ADM registry ledger.</span></div></div>${registryToolbar('parcel')}<section class="panel registry-table"><div class="table-head"><span>Parcel</span><span>Owner</span><span>Cadastral ref</span><span>Status</span><span></span></div><div data-parcel-list>${filtered.map((parcel) => `<div class="registry-row"><div><strong>${esc(parcel.id)}</strong><small>${esc(parcel.geoCoords)}</small></div><div>${esc(parcel.owner)}</div><div>${esc(parcel.cadastralRef)}</div><span class="status-badge ${String(parcel.status).toLowerCase()}">${esc(parcel.status)}</span>${icon('chevron_right')}</div>`).join('')}</div>${filtered.length === 0 ? `<div class="empty-state">${icon('search')}<strong>No parcels match that search</strong><span>Try an owner, parcel ID, cadastral reference, or status.</span></div>` : ''}</section></div>`;
}

function archive() {
  return `<div class="page-stack"><section class="page-heading"><div><div class="eyebrow">CLOSED CASES · HISTORICAL LEDGER</div><h1>Archive</h1><p>Completed acquisitions, settlements, and possession transfers.</p></div></section><div class="archive-card"><div class="archive-graphic">${icon('menu_book')}</div><div><span class="eyebrow">14,209 records indexed</span><h2>The paper trail, kept alive.</h2><p>Historical cases before 2023 are preserved here for comparison, audits, and the next model refresh.</p><button class="button secondary">${icon('inventory_2')} Browse archive</button></div></div></div>`;
}

function sidebar() {
  return `<aside class="sidebar ${state.mobileNavOpen ? 'open' : ''}"><div class="brand"><div class="brand-mark"><span></span></div><div class="brand-copy"><strong>Zameen</strong><small>Vivaad / intelligence</small></div><button class="close-nav icon-button" data-action="close-nav">${icon('close')}</button></div><div class="nav-label">Workspace</div><nav>${navItems.map((item) => `<button class="nav-item ${state.activeTab === item.id ? 'active' : ''}" data-nav="${item.id}">${icon(item.icon)}<span>${item.label}</span><small>${item.hint}</small>${state.activeTab === item.id ? '<i></i>' : ''}</button>`).join('')}</nav><div class="sidebar-spacer"></div><div class="sidebar-status"><div class="status-mark">${icon('check_circle')}</div><div><strong>Registry synced</strong><span>Today, 08:45 IST</span></div></div><button class="user-card" data-action="cycle-account" title="Switch demo account"><div class="avatar">${esc((state.currentUser?.name || 'User').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase())}</div><div><strong>${esc(state.currentUser?.name || 'Demo account')}</strong><span>${esc(state.currentUser?.role || 'Authenticated user')}</span><span class="demo-badge">Demo mode · sample accounts</span></div>${icon('more_horiz')}</button></aside>`;
}

function shell() {
  const activeLabel = navItems.find((item) => item.id === state.activeTab)?.label || '';
  return `<div class="app-shell">${sidebar()}<div class="main-shell"><header class="topbar"><button class="mobile-menu icon-button" data-action="open-nav">${icon('menu')}</button><div class="crumb"><span>India / Land acquisition</span>${icon('chevron_right')}<strong>${activeLabel}</strong></div><div class="top-actions"><button class="icon-button" aria-label="Search">${icon('search')}</button><button class="notification-button" aria-label="Notifications">${icon('notifications')}<i></i></button><button class="icon-button theme-toggle" aria-label="Toggle color theme" title="Toggle color theme" data-action="toggle-theme">${icon(state.theme === 'dark' ? 'light_mode' : 'dark_mode')}</button><div class="top-date">${icon('calendar_today')} ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div><span class="backend-status backend-${state.backendStatus}" title="FastAPI connectivity"><i></i>${state.backendStatus === 'online' ? 'ML API online' : state.backendStatus === 'offline' ? 'ML API offline' : 'Checking ML API'}</span></div></header><main id="main" class="content" tabindex="-1">${state.activeTab === 'dashboard' ? overview() : state.activeTab === 'projects' ? projectDesk() : state.activeTab === 'analysis' ? riskStudio() : state.activeTab === 'registry' ? registry() : archive()}</main></div>${state.newEntryOpen ? newProjectModal() : ''}${state.reportOpen ? reportModal() : ''}</div>`;
}

function selectOptions(field, selected) {
  const values = window.ZameenApi?.options?.[field] || window.ZameenApi?.defaults?.[field] || [];
  return values.map((value) => `<option value="${esc(value)}" ${value === selected ? 'selected' : ''}>${esc(value)}</option>`).join('');
}

function newProjectModal() {
  return `<div class="vanilla-modal-backdrop open" data-action="close-new-project"><div class="vanilla-modal" role="dialog" aria-modal="true"><div class="vanilla-modal-header"><div><h2>NEW PROJECT SURVEY ENTRY</h2><p>Enter cadastral survey metrics for automated ML risk & delay forecasting.</p></div><button class="icon-button" data-action="close-new-project">${icon('close')}</button></div><form id="new-project-form"><div class="form-grid"><label>State<select name="state" required>${selectOptions('state', 'Maharashtra')}</select></label><label>District<select name="district" required>${selectOptions('district', 'Pune')}</select></label><label>Project Name<input name="title" value="Greenfield Highway Sector 4" required></label><label>Project Type<select name="project_type" required>${selectOptions('project_type', 'National Highway')}</select></label><label>Affected Families<input name="affected_families" type="number" min="0" value="180" required></label><label>Land Area (Hectares)<input name="land_area_hectares" type="number" min="0" step="0.1" value="65.4" required></label><label>Project Age (Months)<input name="project_age_months" type="number" min="0" value="12"></label><label>Planned Duration (Months)<input name="planned_duration_months" type="number" min="1" value="24"></label><label>Compensation Status<select name="compensation_status" required>${selectOptions('compensation_status', 'Partially Disbursed')}</select></label><label>Disbursed %<input name="compensation_disbursed_pct" type="number" min="0" max="100" value="45"></label><label>Rehab Progress %<input name="rehabilitation_progress_pct" type="number" min="0" max="100" value="30"></label><label>Legal Disputes<input name="legal_disputes_count" type="number" min="0" value="3"></label></div><p class="form-note" data-prediction-status>Connecting to the ML prediction service. If unavailable, a local estimate will keep this assessment usable.</p><div class="vanilla-modal-actions"><button type="button" class="button secondary" data-action="close-new-project">Cancel</button><button type="submit" class="button primary">${icon('auto_awesome')} Predict & save</button></div></form></div></div>`;
}

function reportModal() {
  return `<div class="vanilla-modal-backdrop open" data-action="close-report"><div class="vanilla-modal report-modal" role="dialog" aria-modal="true"><div class="vanilla-modal-header"><div><h2>EXECUTIVE REPORT BRIEF</h2><p>National land acquisition overview prepared for review.</p></div><button class="icon-button" data-action="close-report">${icon('close')}</button></div><div class="report-body"><div class="report-seal">${icon('description')}</div><h3>National Land Acquisition Overview</h3><p>Current registry pulse: ${state.stats.totalProjectsActive.toLocaleString()} active projects and ${state.stats.criticalRiskZones} critical exposure zones requiring review.</p><div class="report-list"><span>Highest exposure</span><strong>${esc(state.projects.slice().sort((a, b) => b.riskScore - a.riskScore)[0].title)}</strong><span>Recommended action</span><strong>Open the risk studio and review the compensation queue.</strong></div></div><div class="vanilla-modal-actions"><button class="button secondary" data-action="close-report">Close</button><button class="button primary" data-action="download-report">${icon('download')} Download brief</button></div></div></div>`;
}

let introTimers = [];

function showIntro({ force = false } = {}) {
  if (!force && sessionStorage.getItem('zv_intro_seen') === '1') {
    document.querySelector('#initial-splash')?.remove();
    document.body.classList.remove('intro-running', 'intro-content-reveal');
    return;
  }
  sessionStorage.setItem('zv_intro_seen', '1');
  introTimers.forEach((timer) => clearTimeout(timer));
  introTimers = [];

  const existingOverlay = document.querySelector('#initial-splash');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const overlay = existingOverlay || document.createElement('div');
  overlay.className = `intro-overlay${reducedMotion ? ' intro-reduced' : ''}`;
  overlay.setAttribute('aria-hidden', 'true');
  if (!existingOverlay) {
    overlay.innerHTML = `<svg class="intro-contours" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true"><path d="M-40 210 C 220 100 330 310 620 220 S 1060 80 1480 190"/><path d="M-40 250 C 240 125 360 360 650 260 S 1090 120 1480 230"/><path d="M-40 670 C 260 560 390 820 720 670 S 1120 520 1480 620"/><path d="M-40 710 C 280 590 410 860 760 710 S 1160 560 1480 660"/><ellipse cx="1160" cy="390" rx="210" ry="120"/><ellipse cx="1160" cy="390" rx="280" ry="170"/></svg><div class="intro-boundary"><span></span></div><div class="intro-lockup"><div class="intro-kicker">A field intelligence system</div><div class="intro-wordmark">Zameen Vivaad <em>AI</em></div><div class="intro-tagline">See the dispute before it stalls the land.</div></div>`;
  }
  document.documentElement.classList.remove('skip-initial-splash');
  if (!existingOverlay) document.body.appendChild(overlay);
  document.body.classList.add('intro-running');

  if (reducedMotion) {
    document.body.classList.add('intro-content-reveal');
    overlay.remove();
    document.body.classList.remove('intro-running', 'intro-content-reveal');
    return;
  }

  const introTiming = {
    opening: 120,
    contoursIn: 220,
    line: 520,
    wordmark: 2000,
    tagline: 2450,
    reveal: 4950,
    finish: 5000,
  };
  const finish = () => {
    overlay.remove();
    document.body.classList.remove('intro-running', 'intro-content-reveal');
    introTimers = [];
  };
  introTimers = [
    setTimeout(() => overlay.classList.add('intro-opening'), introTiming.opening),
    setTimeout(() => overlay.classList.add('intro-contours-in'), introTiming.contoursIn),
    setTimeout(() => overlay.classList.add('intro-line'), introTiming.line),
    setTimeout(() => overlay.classList.add('intro-wordmark'), introTiming.wordmark),
    setTimeout(() => overlay.classList.add('intro-tagline'), introTiming.tagline),
    setTimeout(() => {
      document.body.classList.add('intro-content-reveal');
      overlay.classList.add('intro-fadeout');
    }, introTiming.reveal),
    setTimeout(finish, introTiming.finish),
  ];
}

function predictionDrivers(prediction, payload = {}) {
  const features = Array.isArray(prediction?.model_feature_importances) ? prediction.model_feature_importances : [];
  if (features.length) return features.slice(0, 4).map((item) => ({ driver: item.feature, vector: 'importance', impact: Number(item.importance || 0) * 100 }));
  if (prediction?.source === 'fallback') return [
    { driver: 'Affected families input', vector: 'importance', impact: Number(payload.affected_families || 0) },
    { driver: 'Legal dispute count', vector: 'importance', impact: Number(payload.legal_disputes_count || 0) * 5 },
    { driver: 'Compensation progress', vector: 'importance', impact: Math.max(0, 100 - Number(payload.compensation_disbursed_pct || 0)) },
  ];
  return [];
}

async function addProject(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const api = window.ZameenApi;
  const status = form.querySelector('[data-prediction-status]');
  if (!state.currentUser || state.currentUser.id === 'pending') {
    if (status) { status.className = 'form-note prediction-warning prediction-warning-live'; status.textContent = 'Still signing in to the demo account. Please wait a moment and try again.'; }
    return;
  }
  const submit = form.querySelector('button[type="submit"]');
  if (submit) { submit.disabled = true; submit.textContent = 'Predicting…'; }
  if (status) { status.className = 'form-note'; status.textContent = 'Running the land-risk model…'; }

  const payload = api.buildPayload(data);
  const prediction = await api.assess(data.title, payload);
  if (status) { status.className = prediction.source === 'fallback' || prediction.source === 'ml-unpersisted' ? 'form-note prediction-warning prediction-warning-live' : 'form-note prediction-success'; status.textContent = prediction.source === 'fallback' ? 'API unavailable — local estimate only. This result is not from the FastAPI ML model.' : prediction.source === 'ml-unpersisted' ? 'ML prediction received, but the assessment could not be persisted.' : 'FastAPI ML prediction received. Saving the assessment…'; }
  const riskScore = api.riskScore(prediction);
  const riskCategory = String(prediction.risk_category || '').toUpperCase();
  const riskLevel = ['LOW', 'MEDIUM', 'HIGH'].includes(riskCategory) ? riskCategory : riskScore >= 70 ? 'HIGH' : riskScore >= 42 ? 'MEDIUM' : 'LOW';
  const delayProbability = Math.round(Number(prediction.delay_probability || 0) * 100);
  const now = new Date();
  const probabilityBreakdown = Object.entries(prediction.risk_probabilities || {}).map(([label, value]) => ({ label, value: Math.round(Number(value) * 100) }));
  const predictionSource = prediction.source === 'fallback' ? 'Local fallback estimate' : prediction.source === 'ml-unpersisted' ? 'FastAPI ML model (not persisted)' : 'FastAPI ML model';
  const project = { id: `PRJ-${now.getFullYear()}-${Math.floor(100 + Math.random() * 900)}`, title: data.title, district: payload.district, state: payload.state, landType: payload.project_type, acquisitionStage: payload.approval_stage.toUpperCase(), riskScore, riskLevel, hectares: payload.land_area_hectares, affectedFamilies: payload.affected_families, projectAgeMonths: Math.round(payload.project_age_days / 30), plannedDurationMonths: Math.round(payload.planned_duration_days / 30), lat: '20.5937° N', lon: '78.9629° E', surveyorId: 'OP-100-ADM', entryDate: now.toISOString().split('T')[0].replace(/-/g, '.'), lastSync: now.toISOString(), probabilityOfDelay: `${delayProbability}%`, delayPredictionText: `+${Math.max(1, Math.round(payload.planned_duration_days * Number(prediction.delay_probability || 0)))} days delay predicted`, likelihoodPercent: delayProbability, phase: 'Land Acquisition', locationDetails: `${payload.district}, ${payload.state} • ${payload.project_type}`, compensationStatus: payload.compensation_status, compDisbursedPercent: payload.compensation_disbursed_pct, rehabProgressPercent: payload.rehabilitation_progress_pct, approvalStage: payload.approval_stage.toUpperCase(), legalDisputeStatus: payload.legal_dispute_status, legalDisputesCount: payload.legal_disputes_count, possessionStatus: payload.possession_status, daysSinceNotification: payload.days_since_notification, coordinationIssues: payload.inter_department_coordination_issues, historicalDistrictDelayRate: payload.historical_district_delay_rate, stakeholderResponsiveness: payload.stakeholder_responsiveness_score, predictionSource, predictionError: prediction.source === 'fallback' ? prediction.error : null, assessmentId: prediction.id || null, createdBy: state.currentUser?.id || null, actualDelayDays: null, actualCompletedAt: null, shapFactors: predictionDrivers(prediction, payload), directives: [], milestones: [], riskPredictionBreakdown: probabilityBreakdown };
  state.projects.unshift(project); state.selectedProject = project; state.stats.totalProjectsActive += 1; state.parcels.unshift({ id: `PRC-${Date.now().toString().slice(-5)}`, owner: `${payload.district} Land Development Authority`, deedRef: `Ref: ${project.id}`, cadastralRef: `CAD-${Math.floor(100 + Math.random() * 900)}-SEC-1`, geoCoords: `${project.lat} ${project.lon}`, status: 'SURVEYED' }); state.newEntryOpen = false; state.activeTab = 'projects'; render();
}

async function recordOutcome(form) { const status = form.querySelector('[data-outcome-status]'); const project = state.selectedProject; try { if (status) status.textContent = 'Saving actual outcome…'; await window.ZameenApi.updateOutcome(project.assessmentId, new FormData(form).get('actual_delay_days')); project.actualDelayDays = Number(new FormData(form).get('actual_delay_days')); project.actualCompletedAt = new Date().toISOString(); state.accuracy = await window.ZameenApi.loadAccuracy(); render(); } catch (error) { if (status) { status.className = 'form-note prediction-warning-live'; status.textContent = `Could not record outcome: ${error.message}`; } } }

function assessmentToProject(record) {
  const payload = record.project || {};
  const riskScore = window.ZameenApi.riskScore(record);
  const delayProbability = Math.round(Number(record.delay_probability || 0) * 100);
  const riskLevel = String(record.risk_category || 'Medium').toUpperCase();
  const createdAt = record.created_at || new Date().toISOString();
  return { assessmentId: record.id, createdBy: record.created_by || null, actualDelayDays: record.actual_delay_days ?? null, actualCompletedAt: record.actual_completed_at || null, id: `ML-${record.id}`, title: record.project_name || 'Untitled assessment', district: payload.district || 'Unknown district', state: payload.state || 'Unknown state', landType: payload.project_type || 'Infrastructure project', acquisitionStage: String(payload.approval_stage || 'SIA Completed').toUpperCase(), riskScore, riskLevel, hectares: payload.land_area_hectares || 0, affectedFamilies: payload.affected_families || 0, projectAgeMonths: Math.round((payload.project_age_days || 0) / 30), plannedDurationMonths: Math.round((payload.planned_duration_days || 0) / 30), lat: '20.5937° N', lon: '78.9629° E', surveyorId: 'ML-API', entryDate: createdAt.slice(0, 10).replace(/-/g, '.'), lastSync: createdAt, probabilityOfDelay: `${delayProbability}%`, delayPredictionText: `+${Math.max(1, Math.round((payload.planned_duration_days || 365) * Number(record.delay_probability || 0)))} days delay predicted`, likelihoodPercent: delayProbability, phase: 'Land Acquisition', locationDetails: `${payload.district || 'Unknown'}, ${payload.state || 'Unknown'} • ${payload.project_type || 'Infrastructure project'}`, compensationStatus: payload.compensation_status, compDisbursedPercent: payload.compensation_disbursed_pct, rehabProgressPercent: payload.rehabilitation_progress_pct, approvalStage: payload.approval_stage, legalDisputeStatus: payload.legal_dispute_status, legalDisputesCount: payload.legal_disputes_count, possessionStatus: payload.possession_status, daysSinceNotification: payload.days_since_notification, coordinationIssues: payload.inter_department_coordination_issues, historicalDistrictDelayRate: payload.historical_district_delay_rate, stakeholderResponsiveness: payload.stakeholder_responsiveness_score, predictionSource: 'Persisted FastAPI ML assessment', predictionError: null, shapFactors: predictionDrivers(record, payload), directives: [], milestones: [], riskPredictionBreakdown: Object.entries(record.risk_probabilities || {}).map(([label, value]) => ({ label, value: Math.round(Number(value) * 100) })) };
}

function hydrateAssessments() { const api = window.ZameenApi; if (!api?.loadAssessments) return; api.loadAssessments().then((records) => { const remote = records.map(assessmentToProject).filter((project) => !state.projects.some((existing) => existing.id === project.id)); if (remote.length) { state.projects = [...remote, ...state.projects]; state.selectedProject = remote[0]; state.stats.totalProjectsActive += remote.length; render(); } }); }

function setupModalAccessibility() {
  const modal = app.querySelector('.vanilla-modal');
  if (!modal) return;
  const focusables = [...modal.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex=\"-1\"])')];
  modal.setAttribute('tabindex', '-1');
  (focusables[0] || modal).focus();
  modal.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { state.newEntryOpen = false; state.reportOpen = false; render(); return; }
    if (event.key !== 'Tab' || !focusables.length) return;
    const first = focusables[0]; const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
}
function render() { applyTheme(); window.ZameenCharts?.destroyCharts(); app.innerHTML = shell(); bindEvents(); window.ZameenCharts?.renderCharts({ projects: state.projects, theme: state.theme }); const content = app.querySelector('.content'); if (content) { content.classList.remove('view-enter'); requestAnimationFrame(() => content.classList.add('view-enter')); } setupModalAccessibility(); }
function applyTheme() { document.documentElement.dataset.theme = state.theme; }
function bindEvents() {
  app.querySelectorAll('[data-nav]').forEach((element) => element.addEventListener('click', () => { const nextTab = element.dataset.nav; const returningHome = nextTab === 'dashboard'; state.activeTab = nextTab; state.mobileNavOpen = false; render(); if (returningHome) showIntro({ force: true }); }));
  app.querySelectorAll('[data-project-id]').forEach((element) => element.addEventListener('click', () => { state.selectedProject = state.projects.find((project) => project.id === element.dataset.projectId) || state.selectedProject; if (state.activeTab === 'dashboard') state.activeTab = 'projects'; render(); }));
  app.querySelectorAll('[data-action]').forEach((element) => element.addEventListener('click', (event) => { if (element.classList.contains('vanilla-modal-backdrop') && event.target !== element) return; const action = element.dataset.action; if (action === 'open-nav') state.mobileNavOpen = true; if (action === 'close-nav') state.mobileNavOpen = false; if (action === 'new-project' && state.currentUser?.id !== 'pending') state.newEntryOpen = true; if (action === 'close-new-project') state.newEntryOpen = false; if (action === 'report') state.reportOpen = true; if (action === 'close-report') state.reportOpen = false; if (action === 'download-report') window.print(); if (action === 'toggle-theme') { state.theme = state.theme === 'dark' ? 'light' : 'dark'; localStorage.setItem('zv_theme', state.theme); } if (action === 'cycle-account') { const current = localStorage.getItem('zv_demo_account') || 'state-admin'; const next = demoAccountIds[(demoAccountIds.indexOf(current) + 1) % demoAccountIds.length]; window.ZameenApi.login(next).then((user) => { state.currentUser = user; render(); }); return; } render(); }));
  app.querySelectorAll('[data-filter]').forEach((element) => element.addEventListener('click', () => { state.projectFilter = element.dataset.filter; render(); }));
  app.querySelectorAll('[data-registry-status]').forEach((element) => element.addEventListener('click', () => { state.registryStatus = element.dataset.registryStatus; render(); }));
  const search = app.querySelector('[data-project-search], [data-risk-search]'); if (search) search.addEventListener('input', (event) => { state.projectQuery = event.target.value; renderFilteredLists(); });
  const parcelSearch = app.querySelector('[data-parcel-search]'); if (parcelSearch) parcelSearch.addEventListener('input', (event) => { state.registryQuery = event.target.value; renderFilteredLists(); });
  const form = app.querySelector('#new-project-form'); if (form) form.addEventListener('submit', (event) => { event.preventDefault(); if (!form.checkValidity()) { form.classList.remove('form-invalid'); requestAnimationFrame(() => form.classList.add('form-invalid')); form.querySelector(':invalid')?.focus(); return; } addProject(form); });
  const outcomeForm = app.querySelector('#outcome-form'); if (outcomeForm) outcomeForm.addEventListener('submit', (event) => { event.preventDefault(); recordOutcome(outcomeForm); });
}
function renderFilteredLists() {
  const projectList = app.querySelector('[data-project-list]');
  if (projectList && state.activeTab === 'projects') { const filtered = filteredProjects(); projectList.innerHTML = filtered.map((project) => projectRow(project, state.selectedProject.id === project.id)).join('') || '<div class=\"empty-state\">' + icon('search') + '<strong>No files match that search</strong><span>Try a project ID, district, or another risk band.</span></div>'; }
  if (projectList && state.activeTab === 'analysis') { const filtered = filteredProjects(); projectList.innerHTML = filtered.map((project) => `<button class=\"analysis-row\" data-project-id=\"${esc(project.id)}\"><div class=\"analysis-name\"><span class=\"signal-badge ${riskTone(project.riskLevel).className}\">${icon('monitoring')}</span><div><strong>${esc(project.title)}</strong><span>${esc(project.id)} · ${esc(project.district)}</span></div></div><div><span class=\"micro-label\">Delay likelihood</span><strong>${esc(project.probabilityOfDelay)}</strong></div><div><span class=\"micro-label\">Top driver</span><strong>${esc(project.shapFactors?.[0]?.driver || 'Title records')}</strong></div>${riskPill(project.riskLevel)}${icon('chevron_right')}</button>`).join(''); }
  const parcelList = app.querySelector('[data-parcel-list]');
  if (parcelList && state.activeTab === 'registry') { const filtered = filteredParcels(); parcelList.innerHTML = filtered.map((parcel) => `<div class=\"registry-row\"><div><strong>${esc(parcel.id)}</strong><small>${esc(parcel.geoCoords)}</small></div><div>${esc(parcel.owner)}</div><div>${esc(parcel.cadastralRef)}</div><span class=\"status-badge ${String(parcel.status).toLowerCase()}\">${esc(parcel.status)}</span>${icon('chevron_right')}</div>`).join(''); }
  app.querySelectorAll('[data-project-id]').forEach((element) => element.addEventListener('click', () => { state.selectedProject = state.projects.find((project) => project.id === element.dataset.projectId) || state.selectedProject; render(); }));
}

document.addEventListener('pointermove', (event) => { const button = event.target.closest('.button'); if (!button) return; const rect = button.getBoundingClientRect(); button.style.setProperty('--mx', `${event.clientX - rect.left}px`); button.style.setProperty('--my', `${event.clientY - rect.top}px`); });
render();
showIntro();
window.ZameenApi?.login?.().then((user) => { state.currentUser = user; return Promise.all([window.ZameenApi.loadAssessments(), window.ZameenApi.loadAccuracy()]); }).then(([records, accuracy]) => { const remote = records.map(assessmentToProject).filter((project) => !state.projects.some((existing) => existing.id === project.id)); if (remote.length) { state.projects = [...remote, ...state.projects]; state.selectedProject = remote[0]; state.stats.totalProjectsActive += remote.length; } state.accuracy = accuracy; render(); }).catch(() => { state.currentUser = { name: 'Offline demo', role: 'Local fallback mode', id: 'offline' }; render(); });
window.ZameenApi?.healthCheck?.().then((result) => { state.backendStatus = result.ok ? 'online' : 'offline'; render(); });
window.addEventListener('load', () => { render(); });
