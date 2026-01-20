let state = JSON.parse(localStorage.getItem("outlanders2-state")) || {
  plan: {},
  built: {},
  currentResources: {},
  providedByLevel: {},
  challenges: {},
};

function saveState() {
  localStorage.setItem("outlanders2-state", JSON.stringify(state));
}

function defaultState() {
  return {
    plan: {},
    built: {},
    currentResources: {},
    providedByLevel: {},
    challenges: {},
  };
}
