/*
 * Zameen Vivaad AI — extended workspace views.
 *
 * These renderers adapt the uploaded standalone screen concepts to the live
 * vanilla SPA. They receive shared helpers and state from app.js instead of
 * owning navigation, API calls, or duplicated theme logic.
 */
(function () {
  'use strict';

  function percentage(value, total) {
    return total ? Math.round((value / total) * 100) : 0;
  }

  function barWidthClass(prefix, value, total, step = 10) {
    const percent = percentage(value, total);
    const bucket = percent < step ? (prefix === 'band' ? 4 : 0) : Math.min(100, Math.max(step, Math.round(percent / step) * step));
    return `${prefix}-width-${bucket}`;
  }

  function riskSummary(projects, riskTone) {
    const summary = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    projects.forEach((project) => { summary[riskTone(project.riskLevel).label] += 1; });
    return summary;
  }

  function analytics({ state, icon, esc, metric, riskTone }) {
    const summary = riskSummary(state.projects, riskTone);
    const average = state.projects.length
      ? Math.round(state.projects.reduce((total, project) => total + Number(project.riskScore || 0), 0) / state.projects.length)
      : 0;
    const accuracy = state.accuracy || {};
    const resolved = Number(accuracy.resolved_cases || 0);
    const regional = Object.entries(state.projects.reduce((groups, project) => {
      const key = project.state || 'Unmapped';
      groups[key] = (groups[key] || 0) + 1;
      return groups;
    }, {})).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const maxRegional = regional[0]?.[1] || 1;
    const stageTotals = state.projects.reduce((groups, project) => {
      const key = project.approvalStage || project.phase || 'Unstaged';
      groups[key] = (groups[key] || 0) + 1;
      return groups;
    }, {});
    const maxStage = Math.max(1, ...Object.values(stageTotals));
    const topProjects = state.projects.slice().sort((a, b) => Number(b.likelihoodPercent || 0) - Number(a.likelihoodPercent || 0)).slice(0, 5);

    return `<div class="page-stack extended-view"><section class="page-heading"><div><div class="eyebrow">PORTFOLIO INTELLIGENCE · ${state.projects.length} tracked files</div><h1>Analytics</h1><p>Compare risk movement, regional pressure, and observed outcomes in one operating view.</p></div><button class="button secondary" data-action="report">${icon('description')} Export brief</button></section><section class="metrics-grid">${metric('Average risk score', `${average}/100`, `${summary.Critical + summary.High} elevated files`, 'monitoring', 'coral')}${metric('Critical files', summary.Critical, `${percentage(summary.Critical, state.projects.length)}% of register`, 'warning', 'coral')}${metric('Resolved outcomes', resolved, resolved ? 'Feedback loop active' : 'Awaiting field outcomes', 'verified', 'teal')}${metric('States represented', regional.length, 'Top operating regions', 'public', 'ochre')}</section><section class="extended-grid"><div class="panel extended-panel"><div class="panel-heading"><div><span class="eyebrow">National delay trend</span><h2>Risk bands in the live register</h2></div><span class="confidence">Model-backed register</span></div><div class="band-bars">${Object.entries(summary).map(([label, value]) => `<div class="band-row"><div><span>${label}</span><strong>${value}</strong></div><div class="band-track"><i class="band-${label.toLowerCase()} ${barWidthClass('band', value, state.projects.length)}"></i></div><small>${percentage(value, state.projects.length)}% of files</small></div>`).join('')}</div></div><div class="panel extended-panel"><div class="panel-heading"><div><span class="eyebrow">State-wise performance</span><h2>Where pressure is gathering</h2></div><span class="chart-hint">Tracked files</span></div><div class="region-bars">${regional.map(([label, value]) => `<div class="region-row"><span>${esc(label)}</span><div class="region-track"><i class="${barWidthClass('region', value, maxRegional, 20)}"></i></div><strong>${value}</strong></div>`).join('') || '<div class="empty-state">No regional data available.</div>'}</div></div></section><section class="extended-grid"><div class="panel extended-panel"><div class="panel-heading"><div><span class="eyebrow">Stage-wise pressure</span><h2>Time spent in acquisition flow</h2></div><span class="chart-hint">Current stage</span></div><div class="stage-bars">${Object.entries(stageTotals).map(([label, value]) => `<div class="stage-row"><span>${esc(label)}</span><div class="stage-track"><i class="${barWidthClass('stage', value, maxStage, 20)}"></i></div><strong>${value}</strong></div>`).join('') || '<div class="empty-state">No stage data available.</div>'}</div></div><div class="panel extended-panel"><div class="panel-heading"><div><span class="eyebrow">Predicted delay watch</span><h2>Highest likelihood files</h2></div><button class="text-button" data-nav="projects">Open project desk ${icon('chevron_right')}</button></div><div class="compact-list">${topProjects.map((project) => `<button class="compact-list-row" data-project-id="${esc(project.id)}"><span class="compact-score ${riskTone(project.riskLevel).className}">${esc(project.probabilityOfDelay)}</span><span><strong>${esc(project.title)}</strong><small>${esc(project.district)} · ${esc(project.phase)}</small></span>${icon('chevron_right')}</button>`).join('') || '<div class="empty-state">No project data available.</div>'}</div></div></section></div>`;
  }

  function geoIntel({ state, icon, esc, riskTone, miniMap }) {
    const hotspots = Object.entries(state.projects.reduce((groups, project) => {
      const key = project.state || 'Unmapped';
      const item = groups[key] || { total: 0, critical: 0, score: 0 };
      item.total += 1;
      item.score += Number(project.riskScore || 0);
      if (Number(project.riskScore || 0) >= 80) item.critical += 1;
      groups[key] = item;
      return groups;
    }, {})).map(([stateName, item]) => ({ stateName, ...item, average: Math.round(item.score / item.total) })).sort((a, b) => b.average - a.average).slice(0, 6);
    return `<div class="page-stack extended-view"><section class="page-heading"><div><div class="eyebrow">SPATIAL REGISTER · INDICATIVE LOCATIONS</div><h1>Geo intelligence</h1><p>See where land-acquisition pressure is clustering before it becomes a corridor-level delay.</p></div><button class="button secondary" data-nav="registry">${icon('location_on')} Open parcel registry</button></section><section class="geo-layout"><div class="panel geo-map-card"><div class="panel-heading"><div><span class="eyebrow">Live geographic pulse</span><h2>Risk concentration map</h2></div><span class="confidence">${state.projects.length} signals</span></div>${miniMap()}</div><div class="panel hotspot-panel"><div class="panel-heading"><div><span class="eyebrow">Hotspot ranking</span><h2>Areas needing attention</h2></div></div><div class="hotspot-list">${hotspots.map((hotspot, index) => `<button class="hotspot-row" data-nav="projects"><span class="hotspot-rank">0${index + 1}</span><span><strong>${esc(hotspot.stateName)}</strong><small>${hotspot.total} tracked files · ${hotspot.critical} critical</small></span><span class="hotspot-score ${riskTone(hotspot.average >= 80 ? 'CRITICAL' : hotspot.average >= 60 ? 'HIGH' : hotspot.average >= 40 ? 'MEDIUM' : 'LOW').className}">${hotspot.average}</span>${icon('chevron_right')}</button>`).join('') || '<div class="empty-state">No hotspot data available.</div>'}</div><div class="geo-legend">${icon('verified')} Indicative locations only · verify against the parcel registry before field action.</div></div></section></div>`;
  }

  function alerts({ state, icon, esc }) {
    const critical = state.projects.slice().sort((a, b) => Number(b.riskScore || 0) - Number(a.riskScore || 0)).slice(0, 5);
    const alertClass = state.alertsRead ? ' alerts-read' : '';
    return `<div class="page-stack extended-view${alertClass}"><section class="page-heading"><div><div class="eyebrow">FIELD NOTIFICATIONS · ${state.alertsRead ? 'ALL REVIEWED' : '3 NEW SIGNALS'}</div><h1>Alerts</h1><p>Operational signals that need a human decision, not another dashboard glance.</p></div><button class="button secondary" data-action="mark-alerts-read">${icon(state.alertsRead ? 'done_all' : 'mark_email_read')} ${state.alertsRead ? 'All alerts read' : 'Mark all read'}</button></section><section class="alerts-layout"><div class="panel alerts-panel"><div class="panel-heading"><div><span class="eyebrow">Priority feed</span><h2>Review queue</h2></div><span class="confidence">${critical.length} active</span></div><div class="alert-list">${critical.map((project, index) => `<button class="alert-row" data-project-id="${esc(project.id)}"><span class="alert-severity ${Number(project.riskScore) >= 80 ? 'critical' : 'high'}">${icon(Number(project.riskScore) >= 80 ? 'priority_high' : 'warning')}</span><span><strong>${esc(project.title)}</strong><small>${index === 0 ? 'Risk score crossed the critical threshold' : `${esc(project.district)} · ${esc(project.phase)}`}</small></span><time>${esc(project.probabilityOfDelay || '—')}</time>${icon('chevron_right')}</button>`).join('') || '<div class="empty-state">No alerts are available.</div>'}</div></div><div class="panel alert-settings"><div class="panel-heading"><div><span class="eyebrow">Notification controls</span><h2>Signal routing</h2></div>${icon('tune', 'muted-icon')}</div><div class="setting-row"><span><strong>Critical risk changes</strong><small>Notify when a project enters the critical band.</small></span><span class="toggle-indicator on" aria-label="Enabled"></span></div><div class="setting-row"><span><strong>Outcome reminders</strong><small>Prompt owners to close the monitoring loop.</small></span><span class="toggle-indicator on" aria-label="Enabled"></span></div><div class="setting-row"><span><strong>Registry sync digest</strong><small>Daily summary at 08:45 IST.</small></span><span class="toggle-indicator on" aria-label="Enabled"></span></div></div></section></div>`;
  }

  function admin({ state, icon, esc }) {
    const auditRows = Array.isArray(state.auditLog) ? state.auditLog : [];
    const permissions = state.currentUser?.permissions || [];
    return `<div class="page-stack extended-view"><section class="page-heading"><div><div class="eyebrow">GOVERNANCE · ROLES · AUDIT</div><h1>Admin &amp; access</h1><p>Make the trust boundary visible: who can assess, review, and close the feedback loop.</p></div><button class="button secondary" data-action="refresh-audit">${icon('refresh')} Refresh audit</button></section><section class="admin-grid"><div class="panel admin-card"><div class="panel-heading"><div><span class="eyebrow">API access</span><h2>Live service boundary</h2></div><span class="backend-status backend-${state.backendStatus}"><i></i>${state.backendStatus === 'online' ? 'Online' : 'Offline'}</span></div><div class="integration-row"><span class="integration-icon">${icon('hub')}</span><span><strong>FastAPI ML service</strong><small>Predictions, persistence, and model monitoring</small></span><span class="integration-state">${state.backendStatus === 'online' ? 'Connected' : 'Fallback ready'}</span></div><div class="integration-row"><span class="integration-icon">${icon('database')}</span><span><strong>SQLite assessment ledger</strong><small>Observed outcomes and audit events</small></span><span class="integration-state">Protected</span></div><div class="admin-note">${icon('verified')} Current session: <strong>${esc(state.currentUser?.name || 'Demo account')}</strong> · ${esc(state.currentUser?.role || 'Unverified')}</div></div><div class="panel admin-card"><div class="panel-heading"><div><span class="eyebrow">Role-based access</span><h2>Current permissions</h2></div>${icon('shield', 'muted-icon')}</div><div class="permission-list">${['assess', 'record_outcome', 'view_audit'].map((permission) => `<div class="permission-row"><span class="permission-dot ${permissions.includes(permission) ? 'granted' : 'restricted'}"></span><span><strong>${permission.replace('_', ' ')}</strong><small>${permissions.includes(permission) ? 'Granted to active demo account' : 'Restricted for this role'}</small></span><span>${permissions.includes(permission) ? 'Granted' : 'Restricted'}</span></div>`).join('')}</div></div></section><section class="panel audit-panel"><div class="panel-heading"><div><span class="eyebrow">Immutable activity trail</span><h2>Audit log</h2></div><span class="confidence">${auditRows.length} recent events</span></div><div class="audit-list">${auditRows.map((entry) => `<div class="audit-row"><span class="audit-icon">${icon('history')}</span><span><strong>${esc(entry.action)}</strong><small>${esc(entry.actor_name)} · ${esc(entry.actor_role)} · ${esc(entry.resource_type)} ${esc(entry.resource_id || '')}</small></span><time>${esc(entry.created_at || '')}</time></div>`).join('') || '<div class="empty-state">No audit events are available for this account yet.</div>'}</div></section></div>`;
  }

  window.ZameenViews = { analytics, geoIntel, alerts, admin };
})();
