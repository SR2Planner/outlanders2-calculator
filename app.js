  let state = JSON.parse(localStorage.getItem('outlanders2-state')) || {
    plan: {},
    built: {},
    currentResources: {},  // Gathered/stockpiled
    providedByLevel: {}    // NEW: Passive production, persists on "try again"
  };
  
  
  function saveState() { localStorage.setItem('outlanders2-state', JSON.stringify(state)); }
  function defaultState() {
    return { 
      plan: {}, 
      built: {}, 
      currentResources: {},
      providedByLevel: {}   // NEW
    };
  }

  function formatCost(cost) {
    if (!cost) return '0';
    return Object.entries(cost)
      .filter(([_, amt]) => amt > 0)
      .map(([rId, amt]) => `${amt} ${RESOURCES.find(r => r.id === rId)?.name || rId}`)
      .join(', ') || '0';
  }
  
  
  
  function getUsedResources() {
    const used = new Set();
    Object.keys(state.plan).forEach(bId => {
      const b = BUILDINGS.find(bb => bb.id === bId);
      if (b) Object.keys(b.cost).forEach(rId => used.add(rId));
    });
    return Array.from(used).map(id => RESOURCES.find(r => r.id === id)).filter(Boolean);
  }
  
  function render() {
    const container = document.getElementById('buildings-container');
    const usedRes = getUsedResources();
    
    let html = '';
    
    if (usedRes.length === 0) {
      html = '<p>No buildings in plan. Add one to see costs and totals.</p>';
    } else {
      // Buildings table
      html += '<table><thead><tr><th rowspan="2">Building</th><th rowspan="2">Cost for 1</th><th rowspan="2">Planned</th><th rowspan="2">Built</th>';
      usedRes.forEach(r => { html += `<th rowspan="2">${r.name}</th>`; });
      html += '<th rowspan="2">Remove</th></tr></thead><tbody>';
      
      Object.keys(state.plan).forEach(bId => {
        const b = BUILDINGS.find(bb => bb.id === bId);
        if (!b || !b.cost) return;
        const planned = state.plan[bId] || 0;
        const built = state.built[bId] || 0;
        
        // SAFE formatCost - only existing costs
        const costStr = Object.entries(b.cost)
          .filter(([_, amt]) => amt > 0)
          .map(([rid, amt]) => `${amt} ${RESOURCES.find(rr => rr.id === rid)?.name || rid}`)
          .join(', ') || '0';
        
        html += `<tr>
          <td>${b.name}</td>
          <td class="text-right">${costStr}</td>
          <td><input type="number" min="0" value="${planned}" onchange="updatePlan('${bId}',this.value)"></td>
          <td><input type="number" min="0" value="${built}" onchange="updateBuilt('${bId}',this.value)"></td>`;
        
        usedRes.forEach(r => {
          const costPer = b.cost[r.id] || 0;
          const rowRemaining = costPer * (planned - built);
          html += `<td class="text-right">${rowRemaining}</td>`;
        });
        html += `<td><button class="remove" onclick="removeBuilding('${bId}')">×</button></td></tr>`;
      });
      html += '</tbody></table><div style="margin-top:20px;"></div>';
      
      // Totals table
      html += '<table class="totals-table"><thead><tr><th>Resource</th><th>Total Needed</th><th>Provided by level</th><th>You Have</th><th>Used for Buildings</th><th>Remaining</th></tr></thead><tbody>';
      usedRes.forEach(r => {
        let totalNeeded = 0, builtCredit = 0;
        Object.keys(state.plan).forEach(bId => {
          const b = BUILDINGS.find(bb => bb.id === bId);
          if (b?.cost) totalNeeded += (b.cost[r.id] || 0) * (state.plan[bId] || 0);
        });
        Object.keys(state.built).forEach(bId => {
          const b = BUILDINGS.find(bb => bb.id === bId);
          if (b?.cost) builtCredit += (b.cost[r.id] || 0) * (state.built[bId] || 0);
        });
        const provided = state.providedByLevel?.[r.id] || 0;
        const youHave = state.currentResources?.[r.id] || 0;
        const remaining = totalNeeded - provided - youHave - builtCredit;
        const cls = remaining <= 0 ? 'positive' : 'negative';
        html += `<tr class="total-row">
          <td>${r.name}</td>
          <td class="text-right">${totalNeeded}</td>
          <td><input type="number" min="0" value="${provided}" onchange="updateProvided('${r.id}',this.value)"></td>
          <td><input type="number" min="0" value="${youHave}" onchange="updateResource('${r.id}',this.value)"></td>
          <td class="text-right">${builtCredit}</td>
          <td class="text-right ${cls}">${remaining}</td>
        </tr>`;
      });
      html += '</tbody></table>';
    }
    
    container.innerHTML = html;
  }
  

  function updateProvided(rId, val) {
    // Initialize if missing
    if (!state.providedByLevel) state.providedByLevel = {};
    state.providedByLevel[rId] = parseInt(val) || 0;
    saveState();
    render();
  }
  
  
  
  function updatePlan(bId, val) {
    state.plan[bId] = parseInt(val) || 0;
    if (state.plan[bId] === 0) delete state.plan[bId];
    saveState();
    render();
  }
  
  function updateBuilt(bId, val) {
    state.built[bId] = parseInt(val) || 0;
    saveState();
    render();
  }
  
  function updateResource(rId, val) {
    // Initialize if missing
    if (!state.currentResources) state.currentResources = {};
    state.currentResources[rId] = parseInt(val) || 0;
    saveState();
    render();
  }
  
  function removeBuilding(bId) {
    delete state.plan[bId];
    delete state.built[bId];
    saveState();
    render();
  }
  
  function addBuildingToPlan(bId) {
    if (!state.plan[bId]) state.plan[bId] = 1;
    saveState();
    render();
    document.getElementById('add-building-dialog').close();
  }

  document.getElementById('reset-try').onclick = () => {
    // Preserve plan and providedByLevel
    const preservedPlan = { ...state.plan };
    const preservedProvided = { ...state.providedByLevel };
    
    // Reset built and currentResources only
    state.built = {};
    state.currentResources = {};
    
    state.plan = preservedPlan;
    state.providedByLevel = preservedProvided;
    
    saveState();
    render();
  };
  
  
  document.getElementById('reset-all').onclick = () => {
    state = defaultState();  // Clears everything including providedByLevel
    saveState();
    render();
  };
  
  
  document.getElementById('add-building').onclick = () => {
    const dialog = document.getElementById('add-building-dialog');
    const list = document.getElementById('building-list');
    list.innerHTML = '';
    const search = document.getElementById('search-buildings');
    
    function showBuildings(filter = '') {
      list.innerHTML = '';
      BUILDINGS.filter(b => !state.plan[b.id] && b.name.toLowerCase().includes(filter.toLowerCase()))
        .forEach(b => {
          const btn = document.createElement('button');
          btn.textContent = `${b.name} (${formatCost(b.cost)})`;
          btn.onclick = () => addBuildingToPlan(b.id);
          list.appendChild(btn);
        });
    }
    
    search.oninput = (e) => showBuildings(e.target.value);
    showBuildings();
    dialog.showModal();
  };
  
  
  render();
  