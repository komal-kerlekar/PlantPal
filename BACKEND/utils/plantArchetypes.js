const plantArchetypes = {
  succulent: {
    wateringFrequency: 7,
    sunlight: "bright",
    soil: "dry"
  },

  herb: {
    wateringFrequency: 2,
    sunlight: "medium",
    soil: "moist"
  },

  foliage: {
    wateringFrequency: 4,
    sunlight: "indirect",
    soil: "normal"
  },

  flowering: {
    wateringFrequency: 3,
    sunlight: "bright",
    soil: "moist"
  },

  lowLight: {
    wateringFrequency: 6,
    sunlight: "low",
    soil: "normal"
  },

  tropical: {
    wateringFrequency: 2,
    sunlight: "indirect",
    soil: "moist"
  }
};

const plantNameToArchetype = {
  // Succulents
  "snake plant": "succulent",
  "aloe vera": "succulent",
  "jade plant": "succulent",

  // Herbs
  "basil": "herb",
  "mint": "herb",
  "coriander": "herb",

  // Foliage plants
  "money plant": "foliage",
  "philodendron": "foliage",
  "rubber plant": "foliage",

  // Flowering plants
  "rose": "flowering",
  "peace lily": "flowering",
  "orchid": "flowering",

  // Low light plants
  "zz plant": "lowLight",
  "cast iron plant": "lowLight",
  "chinese evergreen": "lowLight",

  // Tropical plants
  "areca palm": "tropical",
  "monstera": "tropical",
  "banana plant": "tropical"
};

module.exports = { plantArchetypes, plantNameToArchetype };
