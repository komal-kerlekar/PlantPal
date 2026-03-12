exports.recommendPlant = async (req, res) => {
  const { experience, time, pets, light } = req.body;

  const plants = [
    {
      name: "Snake Plant",
      difficulty: "beginner",
      maintenance: "low",
      petSafe: false,
      light: "low"
    },
    {
      name: "Spider Plant",
      difficulty: "beginner",
      maintenance: "low",
      petSafe: true,
      light: "bright"
    },
    {
      name: "Peace Lily",
      difficulty: "intermediate",
      maintenance: "moderate",
      petSafe: false,
      light: "low"
    },
    {
      name: "Areca Palm",
      difficulty: "intermediate",
      maintenance: "moderate",
      petSafe: true,
      light: "bright"
    },
    {
      name: "Succulent",
      difficulty: "beginner",
      maintenance: "low",
      petSafe: false,
      light: "direct"
    }
  ];

  const scoredPlants = plants.map((plant) => {
    let score = 0;

    if (plant.difficulty === experience) score += 2;
    if (plant.maintenance === time) score += 2;
    if (plant.petSafe.toString() === pets) score += 2;
    if (plant.light === light) score += 2;

    return { ...plant, score };
  });

  // Sort by highest score
  const sorted = scoredPlants.sort((a, b) => b.score - a.score);

  // Return top 2 matches
  res.json({
    recommendations: sorted.slice(0, 2)
  });
};
