const fs = require("fs");

exports.identifyPlant = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // Read file as buffer
    const fileBuffer = fs.readFileSync(req.file.path);

    // Create native FormData
    const formData = new FormData();
    formData.append(
      "images",
      new Blob([fileBuffer]),
      req.file.originalname
    );

    formData.append("organs", "leaf");

    const response = await fetch(
      `https://my-api.plantnet.org/v2/identify/all?api-key=${process.env.PLANTNET_API_KEY}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    console.log("PlantNet Status:", response.status);
    console.log("PlantNet Data:", data);

    // Delete uploaded file
    fs.unlinkSync(req.file.path);

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    if (!data.results || data.results.length === 0) {
      return res.json({ message: "No plant identified" });
    }

  const topResults = data.results.slice(0, 3).map((item) => ({
  commonName: item.species.commonNames?.[0] || "Unknown plant",
  scientificName: item.species.scientificNameWithoutAuthor,
  score: (item.score * 100).toFixed(2),
}));


    res.json({ suggestions: topResults });

  } catch (error) {
    console.error("Identify Error:", error);
    res.status(500).json({ message: "Plant identification failed" });
  }
};
