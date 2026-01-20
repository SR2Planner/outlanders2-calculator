// Resource definitions
// `source` describes how to obtain the resource (shown in Info popup)
const RESOURCES = [
  // Construction
  { id: "sticks", name: "Sticks", source: "Gathered, produced by trees." },
  { id: "logs", name: "Logs", source: "Chopped from trees by Lumberjacks’ Base." },
  { id: "planks", name: "Planks", source: "Produced from logs at a Sawmill (1 log = 1 plank)." },
  {
    id: "stone",
    name: "Stone",
    source: "Produced at Quarry or Stone Mine (6 logs → 4 stone in Stone Mine).",
  },
  { id: "clay", name: "Clay", source: "Produced by Clay Pit." },
  { id: "clay", name: "Clay", source: "Clay Pit building." },
  {
    id: "bricks",
    name: "Bricks",
    source: "Brickyard: 8 clay + 1 stick → 8 bricks.",
    cost: { clay: 8, sticks: 1 },
    yield: 8,
  },

  // Food
  { id: "bread", name: "Bread", category: "food", cost: { flour: 1, sticks: 1 }, yield: 8 },

  // Ingredients
  { id: "flour", name: "Flour", category: "ingredients", cost: { wheat: 1 }, yield: 1 },

  // Lifestyle
  { id: "boots", name: "Boots", category: "lifestyle", cost: { leather: 2, logs: 1 }, yield: 1 },
  { id: "coat", name: "Coat", category: "lifestyle", cost: { leather: 3 }, yield: 1 },
];

// Categories
const CATEGORIES = [
  { id: "construction", name: "Construction", totalBuildings: 12 },
  { id: "food", name: "Food", totalBuildings: 8 },
  { id: "housing", name: "Housing", totalBuildings: 10 },
  { id: "infrastructure", name: "Infrastructure", totalBuildings: 9 },
  { id: "lifestyle", name: "Lifestyle", totalBuildings: 7 },
  { id: "decorations", name: "Decorations", totalBuildings: 4 },
];

const BUILDINGS = [
  // construction
  { id: "lumberjack", name: "Lumberjacks' Base", category: "construction", cost: { sticks: 6 } },
  { id: "clay", name: "Clay Pit", category: "construction", cost: { sticks: 10 } },
  { id: "quarry", name: "Quarry", category: "construction", cost: { logs: 6 } },
  { id: "reedHarvester", name: "Reed Harvester", category: "construction", cost: { sticks: 6 } },
  { id: "sawmill", name: "Sawmill", category: "construction", cost: { logs: 9 } },
  { id: "brickyar", name: "Brickyard", category: "construction", cost: { sticks: 9 } },
  { id: "foresters", name: "Foresters' Hub", category: "construction", cost: { planks: 10 } },
  { id: "firewood", name: "Firewood Yard", category: "construction", cost: { logs: 4 } },
  { id: "mine", name: "Stone Mine", category: "construction", cost: { planks: 18, bricks: 12 } },

  // food
  { id: "forager", name: "Forager's Hut", category: "food", cost: { sticks: 9 } },
  { id: "trapper", name: "Trapper's Hut", category: "food", cost: { sticks: 8, logs: 4 } },
  { id: "farm", name: "Farm", category: "food", cost: { sticks: 4, clay: 10 } },
  { id: "orchard", name: "Orchard", category: "food", cost: { planks: 10 } },
  { id: "kitchen", name: "Open Kitchen", category: "food", cost: { sticks: 6, clay: 8 } },
  { id: "coop", name: "Chicken Coop", category: "food", cost: { planks: 9 } },
  { id: "windmill", name: "Windmill", category: "food", cost: { clay: 15, stone: 5 } },
  { id: "bakery", name: "Bakery", category: "food", cost: { clay: 9, stone: 4 } },
  { id: "cookie", name: "Cookie Shop", category: "food", cost: { planks: 3, bricks: 8 } },
  { id: "greenhouse", name: "Green House", category: "food", cost: { glass: 6, stone: 6 } },
  { id: "cheesery", name: "Cheesery", category: "food", cost: { logs: 10, bricks: 8 } },
  { id: "fondue", name: "Fondue Bar", category: "food", cost: { logs: 10, bricks: 8 } },
  { id: "driedmeat", name: "Dried Meat Shop", category: "food", cost: { logs: 10 } },
  { id: "dock", name: "Fishing Dock", category: "food", cost: { planks: 18 } },
  { id: "nopaleroHut", name: "Nopalero's Hut", category: "food", cost: { logs: 5 } },
  { id: "desertCook", name: "Desert Cookhouse", category: "food", cost: { sticks: 6, clay: 8 } },
  { id: "oasis", name: "Oasis", category: "food", cost: { planks: 10 } },

  // housing
  { id: "basicH", name: "Basic House", category: "housing", cost: { logs: 6 } },
  { id: "plankH", name: "Plank House", category: "housing", cost: { planks: 6 } },
  { id: "brickH", name: "Brick House", category: "housing", cost: { bricks: 12 } },
  { id: "twoH", name: "Two-Story House", category: "housing", cost: { bricks: 8, stone: 8 } },
  { id: "winterH", name: "Winter Cabin", category: "housing", cost: { planks: 3, stone: 3 } },
  { id: "tropicalH", name: "Tropical Shelter", category: "housing", cost: { logs: 4, reeds: 8 } },
  { id: "desertH", name: "Desert Home", category: "housing", cost: { clay: 8 } },

  // infrastructure
  { id: "roadworks", name: "Roadworks Office", category: "infrastructure", cost: { logs: 6 } },
  { id: "bridge", name: "Bridge", category: "infrastructure", cost: { planks: 2, stone: 1 } },
  { id: "warehouse", name: "Warehouse", category: "infrastructure", cost: { logs: 4 } },
  { id: "market", name: "Market", category: "infrastructure", cost: { planks: 4 } },
  {
    id: "outpost",
    name: "Trading Outpost",
    category: "infrastructure",
    cost: { planks: 6, stone: 12 },
  },
  { id: "boots", name: "Bootmakers' Shop", category: "infrastructure", cost: { planks: 12 } },

  // lifestyle
  { id: "playground", name: "Playground", category: "lifestyle", cost: { logs: 9 } },
  { id: "plaza", name: "Community Plaza", category: "lifestyle", cost: { planks: 57 } },
  { id: "zen", name: "Zen Garden", category: "lifestyle", cost: { stone: 6 } },
  { id: "fitness", name: "Fitness Park", category: "lifestyle", cost: { planks: 10, stone: 6 } },
  { id: "bonfire", name: "Bonfire", category: "lifestyle", cost: { logs: 12 } },
  { id: "icepop", name: "Ice Pop Stand", category: "lifestyle", cost: { logs: 9, clay: 6 } },
  { id: "brewery", name: "Brewery", category: "lifestyle", cost: { stone: 4, planks: 15 } },
  { id: "smoothie", name: "Smoothie Stand", category: "lifestyle", cost: { logs: 4, planks: 6 } },
  { id: "paperMill", name: "Paper Mill", category: "lifestyle", cost: { planks: 14 } },
  { id: "press", name: "Press", category: "lifestyle", cost: { bricks: 24 } },
  {
    id: "bookWorkshop",
    name: "Book Workshop",
    category: "lifestyle",
    cost: { stone: 12, planks: 8 },
  },
  {
    id: "canteen",
    name: "Canteen Factory",
    category: "lifestyle",
    cost: { bricks: 16, planks: 6 },
  },
  { id: "swimming", name: "Swimming Pier", category: "lifestyle", cost: { stone: 16, planks: 8 } },
  {
    id: "bottleFactory",
    name: "Bottle Factory",
    category: "lifestyle",
    cost: { bricks: 6, clay: 6 },
  },
  { id: "winery", name: "Winery", category: "lifestyle", cost: { stone: 10, planks: 8 } },
  { id: "tailor", name: "Tailor", category: "lifestyle", cost: { bricks: 12 } },
  { id: "pub", name: "Winter Pub", category: "lifestyle", cost: { logs: 10, stone: 8 } },
  {
    id: "craftshop",
    name: "Pendant Craftshop",
    category: "lifestyle",
    cost: { stone: 4, bricks: 8 },
  },
  { id: "luthierie", name: "Luthierie", category: "lifestyle", cost: { logs: 14 } },
  { id: "well", name: "Well", category: "lifestyle", cost: { logs: 8, stone: 12 } },

  // decorations
  { id: "decorations_a", name: "Calla Lilly Planter", category: "decorations", cost: { stone: 2 } },
];
