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
  // Challenges: handle base resources vs composite resources differently
  Object.keys(state.challenges || {}).forEach((rId) => {
    const def = RESOURCES.find((r) => r.id === rId);
    if (def && def.cost && Object.keys(def.cost).length > 0) {
      // Composite resource with production costs - add input resources to totals
      Object.keys(def.cost).forEach((upId) => used.add(upId));
    } else {
      // Base resource (no cost) - add the resource itself to totals
      used.add(rId);
    }
  });
  return Array.from(used)
    .map(
      (id) =>
        RESOURCES.find((r) => r.id === id) || { id, name: id.charAt(0).toUpperCase() + id.slice(1) }
    )
    .filter(Boolean);
}
