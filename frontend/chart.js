(() => {
  const instances = [];

  function palette(theme) {
    const dark = theme === 'dark';
    return {
      ink: dark ? '#F5F6FA' : '#173344',
      muted: dark ? '#B0B2C8' : '#6D7C83',
      grid: dark ? 'rgba(255,255,255,.14)' : 'rgba(23,51,68,.1)',
      coral: dark ? '#7C5CFC' : '#BD685A',
      teal: dark ? '#38E1FF' : '#477E78',
      ochre: dark ? '#7C5CFC' : '#CA8B45',
      green: dark ? '#38E1FF' : '#73AD88',
      surface: dark ? 'rgba(17,18,32,.72)' : 'rgba(255,255,255,.74)',
      area: dark ? 'rgba(124,92,252,.18)' : 'rgba(189,104,90,.15)',
    };
  }

  function destroyCharts() {
    instances.splice(0).forEach((chart) => chart.destroy());
  }

  function countBy(projects, key) {
    return projects.reduce((counts, project) => {
      const value = project[key] || 'Unknown';
      counts[value] = (counts[value] || 0) + 1;
      return counts;
    }, {});
  }

  function baseOptions(paletteValue) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 650, easing: 'easeOutQuart' },
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { labels: { usePointStyle: true, padding: 16, color: paletteValue.muted } },
      },
    };
  }

  function renderCharts({ projects, theme }) {
    if (typeof Chart === 'undefined') return;
    destroyCharts();
    const p = palette(theme);
    Chart.defaults.font.family = 'Inter, sans-serif';
    Chart.defaults.color = p.muted;

    const riskCounts = ['Low', 'Medium', 'High', 'Critical'].map((label) => projects.filter((project) => {
      const level = project.riskLevel;
      return label === 'Critical' ? level === 'CRITICAL' : label === 'High' ? level === 'HIGH' || level === 'MED-HIGH' : label === 'Medium' ? level === 'MEDIUM' : !['CRITICAL', 'HIGH', 'MED-HIGH', 'MEDIUM'].includes(level);
    }).length);
    const stages = [...new Set(projects.map((project) => project.phase))];
    const stageCounts = stages.map((stage) => projects.filter((project) => project.phase === stage).length);
    const stateCounts = countBy(projects, 'state');
    const stateLabels = Object.keys(stateCounts).slice(0, 7);
    const delayProjects = projects.slice().sort((a, b) => (b.likelihoodPercent || 0) - (a.likelihoodPercent || 0)).slice(0, 7);

    const riskCanvas = document.querySelector('#risk-mix-chart');
    if (riskCanvas) instances.push(new Chart(riskCanvas, {
      type: 'doughnut',
      data: { labels: ['Low', 'Medium', 'High', 'Critical'], datasets: [{ data: riskCounts, backgroundColor: [p.green, p.teal, p.ochre, p.coral], borderColor: p.surface, borderWidth: 4, hoverOffset: 10 }] },
      options: { ...baseOptions(p), cutout: '70%', plugins: { ...baseOptions(p).plugins, tooltip: { callbacks: { label: (context) => ` ${context.label}: ${context.raw} projects` } } } },
    }));

    const stageCanvas = document.querySelector('#stage-exposure-chart');
    if (stageCanvas) instances.push(new Chart(stageCanvas, {
      type: 'bar',
      data: { labels: stages, datasets: [{ label: 'Projects', data: stageCounts, borderRadius: 8, borderSkipped: false, backgroundColor: stages.map((_, index) => index % 2 ? p.teal : p.coral), hoverBackgroundColor: p.ochre }] },
      options: { ...baseOptions(p), plugins: { ...baseOptions(p).plugins, legend: { display: false }, tooltip: { callbacks: { label: (context) => ` ${context.raw} tracked projects` } } }, scales: { x: { grid: { display: false }, ticks: { color: p.muted, maxRotation: 0, autoSkip: true } }, y: { beginAtZero: true, ticks: { precision: 0, color: p.muted }, grid: { color: p.grid } } } },
    }));

    const stateCanvas = document.querySelector('#state-exposure-chart');
    if (stateCanvas) instances.push(new Chart(stateCanvas, {
      type: 'bar',
      data: { labels: stateLabels, datasets: [{ label: 'Tracked projects', data: stateLabels.map((label) => stateCounts[label]), backgroundColor: p.teal, borderRadius: 8, borderSkipped: false, hoverBackgroundColor: p.coral }] },
      options: { ...baseOptions(p), indexAxis: 'y', plugins: { ...baseOptions(p).plugins, legend: { display: false }, tooltip: { callbacks: { label: (context) => ` ${context.raw} projects in ${context.label}` } } }, scales: { x: { beginAtZero: true, ticks: { precision: 0, color: p.muted }, grid: { color: p.grid } }, y: { grid: { display: false }, ticks: { color: p.muted } } } },
    }));

    const delayCanvas = document.querySelector('#delay-exposure-chart');
    if (delayCanvas) instances.push(new Chart(delayCanvas, {
      type: 'line',
      data: { labels: delayProjects.map((project) => project.id), datasets: [{ label: 'Delay likelihood', data: delayProjects.map((project) => project.likelihoodPercent || 0), borderColor: p.coral, backgroundColor: p.area, pointBackgroundColor: p.ochre, pointBorderColor: p.surface, pointBorderWidth: 3, pointRadius: 5, tension: .35, fill: true }] },
      options: { ...baseOptions(p), plugins: { ...baseOptions(p).plugins, legend: { display: false }, tooltip: { callbacks: { label: (context) => ` ${context.raw}% delay likelihood` } } }, scales: { x: { grid: { display: false }, ticks: { color: p.muted, maxRotation: 0 } }, y: { min: 0, max: 100, ticks: { color: p.muted, callback: (value) => `${value}%` }, grid: { color: p.grid } } } },
    }));
  }

  window.ZameenCharts = { renderCharts, destroyCharts };
})();
