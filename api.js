(() => {
  const defaults = {
    state: ['Bihar', 'Gujarat', 'Karnataka', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Rajasthan', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal'],
    district: ['Ahmedabad', 'Aurangabad', 'Bengaluru', 'Bhopal', 'Bhubaneswar', 'Chennai', 'Coimbatore', 'Cuttack', 'Gaya', 'Ghaziabad', 'Gwalior', 'Howrah', 'Hubballi', 'Indore', 'Jabalpur', 'Jaipur', 'Jodhpur', 'Kanpur', 'Kolkata', 'Kota', 'Lucknow', 'Madurai', 'Meerut', 'Muzaffarpur', 'Mysuru', 'Nagpur', 'Nashik', 'Noida', 'Patna', 'Pune', 'Rajkot', 'Rourkela', 'Siliguri', 'Surat', 'Thane', 'Udaipur', 'Vadodara', 'Varanasi'],
    project_type: ['Airport Expansion', 'Dam/Reservoir', 'Industrial Corridor', 'Irrigation Canal', 'National Highway', 'Power Transmission Line', 'Railway Line', 'SEZ Development', 'State Highway', 'Urban Metro'],
    compensation_status: ['Fully Disbursed', 'Not Disbursed', 'Partially Disbursed'],
    approval_stage: ['Award Declared', 'Notification (Sec 11)', 'Possession Complete', 'Possession Initiated', 'Rehabilitation Ongoing', 'SIA Completed'],
    legal_dispute_status: ['Ongoing - High Court', 'Ongoing - Lower Court', 'Ongoing - Supreme Court', 'Resolved Against', 'Resolved in Favor'],
    possession_status: ['Fully Complete', 'Not Started', 'Partially Complete'],
    inter_department_coordination_issues: ['High', 'Low', 'Medium'],
  };

  const config = window.ZAMEEN_CONFIG || {};
  const configuredBase = localStorage.getItem('zv_api_base_url') || config.API_BASE_URL || 'http://127.0.0.1:8000';
  let options = { ...defaults };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || 0));
  const daysFromMonths = (value, minimum = 0) => Math.max(minimum, Math.round((Number(value) || 0) * 30));
  const normalize = (value, allowed, fallback) => {
    const text = String(value || '').trim();
    const exact = allowed.find((item) => item.toLowerCase() === text.toLowerCase());
    return exact || fallback || allowed[0];
  };
  const endpoint = (path) => `${String(configuredBase).replace(/\/$/, '')}${path}`;

  function buildPayload(data) {
    const projectAgeDays = daysFromMonths(data.project_age_months, 0);
    return {
      state: normalize(data.state, options.state, 'Maharashtra'),
      district: normalize(data.district, options.district, 'Pune'),
      project_type: normalize(data.project_type, options.project_type, 'National Highway'),
      land_area_hectares: Math.max(0, Number(data.land_area_hectares) || 0),
      affected_families: Math.max(0, Math.round(Number(data.affected_families) || 0)),
      compensation_status: normalize(data.compensation_status, options.compensation_status, 'Partially Disbursed'),
      compensation_disbursed_pct: clamp(data.compensation_disbursed_pct, 0, 100),
      approval_stage: normalize(data.approval_stage, options.approval_stage, 'SIA Completed'),
      days_since_notification: Math.max(0, Math.round(Number(data.days_since_notification) || projectAgeDays)),
      legal_disputes_count: Math.max(0, Math.round(Number(data.legal_disputes_count) || 0)),
      legal_dispute_status: normalize(data.legal_dispute_status, options.legal_dispute_status, 'Ongoing - Lower Court'),
      possession_status: normalize(data.possession_status, options.possession_status, 'Not Started'),
      rehabilitation_progress_pct: clamp(data.rehabilitation_progress_pct, 0, 100),
      stakeholder_responsiveness_score: clamp(data.stakeholder_responsiveness_score ?? 6.5, 0, 10),
      historical_district_delay_rate: clamp(data.historical_district_delay_rate ?? 0.35, 0, 1),
      inter_department_coordination_issues: normalize(data.inter_department_coordination_issues, options.inter_department_coordination_issues, 'Medium'),
      planned_duration_days: Math.max(1, Math.round(Number(data.planned_duration_days) || daysFromMonths(data.planned_duration_months, 30))),
      project_age_days: projectAgeDays,
    };
  }

  function fallbackPrediction(payload, error = null) {
    let score = 25;
    score += payload.affected_families >= 150 ? 22 : payload.affected_families >= 75 ? 12 : 4;
    score += payload.legal_disputes_count * 7;
    score += payload.compensation_disbursed_pct < 35 ? 14 : payload.compensation_disbursed_pct < 70 ? 7 : 0;
    score += payload.historical_district_delay_rate * 20;
    score += payload.inter_department_coordination_issues === 'High' ? 12 : payload.inter_department_coordination_issues === 'Medium' ? 5 : 0;
    score = Math.round(clamp(score, 8, 96));
    const riskCategory = score >= 70 ? 'High' : score >= 42 ? 'Medium' : 'Low';
    const delayProbability = Number(clamp(score / 100, 0.05, 0.96).toFixed(4));
    return { risk_category: riskCategory, delay_probability: delayProbability, risk_probabilities: { Low: riskCategory === 'Low' ? 0.7 : 0.1, Medium: riskCategory === 'Medium' ? 0.65 : 0.2, High: riskCategory === 'High' ? 0.7 : 0.1 }, source: 'fallback', error: error ? String(error.message || error) : null };
  }

  async function predict(payload) {
    try {
      const response = await fetch(endpoint('/api/predict'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error(`Prediction API returned ${response.status}`);
      return { ...(await response.json()), source: 'ml' };
    } catch (error) {
      return fallbackPrediction(payload, error);
    }
  }

  async function loadFeatures() {
    try {
      const response = await fetch(endpoint('/api/features'));
      if (!response.ok) return options;
      const data = await response.json();
      data.features?.forEach((feature) => {
        if (feature.type === 'categorical' && Array.isArray(feature.options) && feature.options.length) options[feature.name] = feature.options;
      });
    } catch (error) {
      /* The built-in contract defaults keep the form usable when the API is offline. */
    }
    return options;
  }

  function riskScore(prediction) {
    const probabilities = prediction.risk_probabilities || {};
    const low = Number(probabilities.Low ?? probabilities.LOW ?? 0);
    const medium = Number(probabilities.Medium ?? probabilities.MEDIUM ?? 0);
    const high = Number(probabilities.High ?? probabilities.HIGH ?? 0);
    const weighted = low || medium || high ? (low * 25) + (medium * 55) + (high * 85) : Number(prediction.delay_probability || 0) * 100;
    return Math.round(clamp(weighted, 0, 100));
  }

  window.ZameenApi = { defaults, get options() { return options; }, endpoint: configuredBase, buildPayload, fallbackPrediction, predict, loadFeatures, riskScore };
  loadFeatures();
})();
