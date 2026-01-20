// State updaters (global for inline handlers)
window.updateProvided = (rId, val) => {
  if (!state.providedByLevel) state.providedByLevel = {};
  state.providedByLevel[rId] = parseInt(val) || 0;
  saveState();
  render();
};

window.updatePlan = (bId, val) => {
  state.plan[bId] = parseInt(val) || 0;
  if (state.plan[bId] === 0) delete state.plan[bId];
  saveState();
  render();
};

window.updateBuilt = (bId, val) => {
  state.built[bId] = parseInt(val) || 0;
  saveState();
  render();
};

window.updateResource = (rId, val) => {
  if (!state.currentResources) state.currentResources = {};
  state.currentResources[rId] = parseInt(val) || 0;
  saveState();
  render();
};

window.removeBuilding = (bId) => {
  delete state.plan[bId];
  delete state.built[bId];
  saveState();
  render();
};

window.addChallengeResource = (rId, targetQty = 1) => {
  if (!state.challenges) state.challenges = {};
  state.challenges[rId] = { target: parseInt(targetQty) || 1, doneCount: 0, donePercent: 0 };
  saveState();
  render();
  document.getElementById("add-resource-dialog").close();
};

window.updateChallengeTarget = (rId, val) => {
  if (state.challenges?.[rId]) {
    state.challenges[rId].target = parseInt(val) || 0;
    if (state.challenges[rId].target === 0) delete state.challenges[rId];
    saveState();
    render();
  }
};

window.updateChallengeDoneCount = (challengeId, val) => {
    if (state.challenges?.[challengeId]) {
      const target = state.challenges[challengeId].target || 0;
      state.challenges[challengeId].doneCount = Math.min(parseInt(val) || 0, target);
      // Auto-update percent
      const percent = target > 0 ? Math.round((state.challenges[challengeId].doneCount / target) * 100) : 0;
      state.challenges[challengeId].donePercent = percent;
      saveState();
      render();
    }
  };
  
  window.updateChallengeDonePercent = (challengeId, val) => {
    if (state.challenges?.[challengeId]) {
      const target = state.challenges[challengeId].target || 0;
      const percent = Math.min(Math.max(parseInt(val) || 0, 0), 100);
      state.challenges[challengeId].donePercent = percent;
      // Auto-update count
      state.challenges[challengeId].doneCount = Math.round((percent / 100) * target);
      saveState();
      render();
    }
  };
  

window.updateChallengeDone = (rId, val) => {
  if (state.challenges?.[rId]) {
    state.challenges[rId].done = Math.min(parseInt(val) || 0, state.challenges[rId].target);
    saveState();
    render();
  }
};

window.removeChallenge = (rId) => {
  delete state.challenges[rId];
  saveState();
  render();
};

window.addBuildingToPlan = function (bId) {
  console.log("Adding building:", bId); // DEBUG
  const plannedQty = (state.plan[bId] || 0) + 1;
  state.plan[bId] = plannedQty;

  // AUTO-TRIGGER UPSTREAM CHALLENGES
  const b = BUILDINGS.find(function (bb) {
    return bb.id === bId;
  });
  console.log("Building def:", b); // DEBUG
  if (b && b.cost) {
    Object.keys(b.cost).forEach(function (reqId) {
      const reqQty = b.cost[reqId] * plannedQty;
      console.log("Needs", reqQty, reqId); // DEBUG
      const def = RESOURCES.find(function (r) {
        return r.id === reqId;
      });
      if (def && def.yield) {
        // ONLY producibles (yield exists)
        console.log("Auto challenge for", reqId); // DEBUG
        if (!state.challenges[reqId]) {
          state.challenges[reqId] = { target: 0, done: 0 };
        }
        state.challenges[reqId].target = Math.max(state.challenges[reqId].target, reqQty);
        console.log("Set challenge", reqId, "target:", state.challenges[reqId].target);
      }
    });
  }

  saveState();
  render();
  document.getElementById("add-building-dialog").close();
};

// DOM event handlers
document.getElementById("reset-try").onclick = () => {
  const preservedPlan = { ...state.plan };
  const preservedProvided = { ...state.providedByLevel };
  state.built = {};
  state.currentResources = {};
  state.plan = preservedPlan;
  state.providedByLevel = preservedProvided;
  saveState();
  render();
};

document.getElementById("reset-all").onclick = () => {
  state = defaultState();
  saveState();
  render();
};

document.getElementById("add-building").onclick = () => {
  const dialog = document.getElementById("add-building-dialog");
  const list = document.getElementById("building-list");
  const search = document.getElementById("search-buildings");

  function showBuildings(filter = "") {
    list.innerHTML = "";
    BUILDINGS.filter(
      (b) => !state.plan[b.id] && b.name.toLowerCase().includes(filter.toLowerCase())
    ).forEach((b) => {
      const btn = document.createElement("button");
      btn.textContent = `${b.name} (${formatCost(b.cost)})`;
      btn.onclick = () => window.addBuildingToPlan(b.id);
      list.appendChild(btn);
    });
  }

  search.oninput = (e) => showBuildings(e.target.value);
  showBuildings();
  dialog.showModal();
};

document.getElementById("add-resource").onclick = () => {
  const dialog = document.getElementById("add-resource-dialog");
  const list = document.getElementById("resource-list");
  const search = document.getElementById("search-resources");

  function showResources(filter = "") {
    list.innerHTML = "";
    RESOURCES.filter(
      (r) => !state.challenges?.[r.id] && r.name.toLowerCase().includes(filter.toLowerCase())
    ).forEach((r) => {
      const btn = document.createElement("button");
      btn.textContent = `${r.name} (${formatCost(r.cost)})`;
      btn.onclick = () => window.addChallengeResource(r.id, 1);
      list.appendChild(btn);
    });
  }

  search.oninput = (e) => showResources(e.target.value);
  showResources();
  dialog.showModal();
};

// Init
render();
