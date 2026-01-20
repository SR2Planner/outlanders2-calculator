function render() {
  const container = document.getElementById("buildings-container");
  const usedRes = getUsedResources();
  let html = "";

  // Buildings Table
  html += "<h3>Buildings</h3>";
  if (Object.keys(state.plan).length === 0) {
    html += "<p>No buildings planned.</p>";
  } else {
    html += "<table><thead><tr><th>Building</th><th>Cost for 1</th><th>Planned</th><th>Built</th>";
    usedRes.forEach(function (r) {
      html += `<th>${r.name}</th>`;
    });
    html += "<th>Remove</th></tr></thead><tbody>";

    Object.keys(state.plan).forEach(function (buildingId) {
      const b = BUILDINGS.find(function (bb) {
        return bb.id === buildingId;
      });
      if (!b || !b.cost) return;
      const planned = state.plan[buildingId] || 0;
      const built = state.built[buildingId] || 0;
      const costStr = formatCost(b.cost);

      html += `<tr><td>${b.name}</td><td>${costStr}</td><td><input type="number" min="0" value="${planned}" onchange="window.updatePlan('${buildingId}',this.value)"></td><td><input type="number" min="0" value="${built}" onchange="window.updateBuilt('${buildingId}',this.value)"></td>`;

      usedRes.forEach(function (r) {
        const costPer = b.cost[r.id] || 0;
        const remaining = costPer * (planned - built);
        html += `<td class="text-right">${remaining}</td>`;
      });
      html += `<td><button class="remove" onclick="window.removeBuilding('${buildingId}')">×</button></td></tr>`;
    });
    html += "</tbody></table>";
  }

  // Challenge Resources Table
  html += "<h3>Challenge Resources</h3>";
  if (Object.keys(state.challenges || {}).length === 0) {
    html += "<p>No challenges planned.</p>";
  } else {
    html +=
      "<table><thead><tr><th>Resource</th><th>Cost per Batch</th><th>Target</th><th>Done</th>";
    usedRes.forEach(function (r) {
      html += `<th>${r.name}</th>`;
    });
    html += "<th>Remove</th></tr></thead><tbody>";

    Object.keys(state.challenges || {}).forEach(function (challengeId) {
      const def = RESOURCES.find(function (r) {
        return r.id === challengeId;
      });
      if (!def) return;
      const ch = state.challenges[challengeId];
      const target = ch.target;
      const done = ch.done;
      const costStr = formatCost(def.cost);

      html += `<tr class="challenge-row"><td>${def.name}</td><td>${costStr}</td><td><input type="number" min="0" value="${target}" onchange="window.updateChallengeTarget('${challengeId}',this.value)"></td><td><input type="number" min="0" value="${done}" onchange="window.updateChallengeDone('${challengeId}',this.value)" max="${target}"></td>`;

      usedRes.forEach(function (r) {
        const remainingOutput = target - done;
        const batchesNeeded = Math.ceil(remainingOutput / (def.yield || 1));
        const demand = (def.cost[r.id] || 0) * batchesNeeded;
        html += `<td class="text-right">${demand}</td>`;
      });
      html += `<td><button class="remove" onclick="window.removeChallenge('${challengeId}')">×</button></td></tr>`;
    });
    html += "</tbody></table>";
  }

  // Totals Table
  if (usedRes.length > 0) {
    html +=
      '<h3>Totals</h3><table class="totals-table"><thead><tr><th>Resource</th><th>Total Needed</th><th>Provided by Level</th><th>You Have</th><th>Built Credit</th><th>Remaining</th></tr></thead><tbody>';
    usedRes.forEach(function (r) {
      let totalNeeded = 0,
        builtCredit = 0;

      // Direct building costs
      Object.keys(state.plan).forEach(function (bId) {
        const b = BUILDINGS.find(function (bb) {
          return bb.id === bId;
        });
        if (b?.cost) totalNeeded += (b.cost[r.id] || 0) * (state.plan[bId] || 0);
      });
      Object.keys(state.built).forEach(function (bId) {
        const b = BUILDINGS.find(function (bb) {
          return bb.id === bId;
        });
        if (b?.cost) builtCredit += (b.cost[r.id] || 0) * (state.built[bId] || 0);
      });

      // Challenges (unchanged)
      Object.keys(state.challenges || {}).forEach(function (chId) {
        const def = RESOURCES.find(function (rr) {
          return rr.id === chId;
        });
        if (!def || !state.challenges[chId]) return;
        const ch = state.challenges[chId];
        const remainingOutput = ch.target - ch.done;
        const batchesNeeded = Math.ceil(remainingOutput / (def.yield || 1));
        totalNeeded += batchesNeeded * (def.cost?.[r.id] || 0);
      });

      const provided = state.providedByLevel?.[r.id] || 0;
      const youHave = state.currentResources?.[r.id] || 0;
      const remaining = totalNeeded - provided - youHave - builtCredit;
      const cls = remaining <= 0 ? "positive" : "negative";
      html += `<tr><td>${r.name}</td><td class="text-right">${totalNeeded}</td><td><input type="number" min="0" value="${provided}" onchange="window.updateProvided('${r.id}',this.value)"></td><td><input type="number" min="0" value="${youHave}" onchange="window.updateResource('${r.id}',this.value)"></td><td class="text-right">${builtCredit}</td><td class="text-right ${cls}">${remaining}</td></tr>`;
    });
    html += "</tbody></table>";
  }

  container.innerHTML = html;
}
