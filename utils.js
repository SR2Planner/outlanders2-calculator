function formatCost(cost) {
  if (!cost) return "0";
  return (
    Object.entries(cost)
      .filter(([_, amt]) => amt > 0)
      .map(([rId, amt]) => `${amt} ${RESOURCES.find((r) => r.id === rId)?.name || rId}`)
      .join(", ") || "0"
  );
}

function getUsedResources() {
  const used = new Set();
  // Buildings costs
  Object.keys(state.plan).forEach((bId) => {
    const b = BUILDINGS.find((bb) => bb.id === bId);
    if (b) Object.keys(b.cost).forEach((rId) => used.add(rId));
  });
  // Challenges: upstream inputs ONLY (exclude target rId)
  Object.keys(state.challenges || {}).forEach((rId) => {
    const def = RESOURCES.find((r) => r.id === rId);
    if (def) Object.keys(def.cost).forEach((upId) => used.add(upId));
    // NO: used.add(rId);  // Exclude net target from columns
  });
  return Array.from(used)
    .map(
      (id) =>
        RESOURCES.find((r) => r.id === id) || { id, name: id.charAt(0).toUpperCase() + id.slice(1) }
    )
    .filter(Boolean);
}
