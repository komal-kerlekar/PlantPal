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
  "aloe vera": "succulent",
  "jade plant": "succulent",
  "haworthia": "succulent",
  "echeveria": "succulent",
  "kalanchoe": "succulent",
  "zebra plant": "succulent",
  "burro's tail": "succulent",
  "string of pearls": "succulent",
  "gasteria": "succulent",

  // Herbs
  "basil": "herb",
  "mint": "herb",
  "coriander": "herb",
  "curry leaves": "herb",
  "ajwain": "herb",
  "parsley": "herb",
  "oregano": "herb",
  "thyme": "herb",
  "lemongrass": "herb",

  // Foliage plants
  "money plant": "foliage",
  "philodendron": "foliage",
  "rubber plant": "foliage",
  "pothos": "foliage",
  "areca palm": "foliage",
  "dracaena": "foliage",
  "aglaonema": "foliage",
  "dieffenbachia": "foliage",
  "parlor palm": "foliage",
  "calathea": "foliage",
  "croton": "foliage",

  // Flowering plants
  "rose": "flowering",
  "hibiscus": "flowering",
  "jasmine": "flowering",
  "mogra": "flowering",
  "marigold": "flowering",
  "chrysanthemum": "flowering",
  "petunia": "flowering",
  "zinnia": "flowering",
  "vinca": "flowering",
  "periwinkle": "flowering",
  "balsam": "flowering",
  "cosmos": "flowering",
  "bougainvillea": "flowering",
  "sunflower": "flowering",
  "geranium": "flowering",
  "dahlia": "flowering",
  "peace lily": "flowering",
  "anthurium": "flowering",
  "orchid": "flowering",
  "begonia": "flowering",
  "impatiens": "flowering",

  // Low light plants
  "zz plant": "lowLight",
  "cast iron plant": "lowLight",
  "chinese evergreen": "lowLight",
  "snake plant": "lowLight",
  "aglaonema": "lowLight",
  "dracaena": "lowLight",
  "parlor palm": "lowLight",
  "lucky bamboo": "lowLight",


  // Tropical plants
  "areca palm": "tropical",
  "monstera": "tropical",
  "banana plant": "tropical",
  "bird of paradise": "tropical",
  "alocasia": "tropical",
  "fern": "tropical",
  "bamboo palm": "tropical",
};

module.exports = { plantArchetypes, plantNameToArchetype };
