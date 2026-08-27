(() => {
  const instances = [];

  function palette(theme) {
    const dark = theme === 'dark';
    return {
      ink: dark ? '#F5F1E6' : '#1E2430',
      muted: dark ? '#B9B3A2' : '#8C8878',
      grid: dark ? 'rgba(255,255,255,.12)' : 'rgba(30,36,48,.1)',
      coral: dark ? '#E2703F' : '#D85A30',
      teal: dark ? '#5DCAA5' : '#2F7A5C',
      ochre: dark ? '#E8B455' : '#B07A1E',
      green: dark ? '#79C9A8' : '#5DCAA5',
      surface: dark ? 'rgba(30,27,20,.72)' : 'rgba(255,255,255,.62)',
      area: dark ? 'rgba(226,112,63,.20)' : 'rgba(216,90,48,.15)',
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
    Chart.defaults.font.family = 'Barlow Condensed, sans-serif';
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
