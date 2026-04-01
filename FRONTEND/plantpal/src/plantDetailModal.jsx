import React from "react";
// 👇 ADD HERE

const calculateCareStats = (lastWateredAt, wateringFrequency) => {
  const today = new Date();
  const lastDate = new Date(lastWateredAt);

  const diffTime = today - lastDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  let status = "";
  let gap = 0;

  if (diffDays === wateringFrequency) {
    status = "Watered on time";
  } else if (diffDays < wateringFrequency) {
    status = `Next watering in ${wateringFrequency - diffDays} day(s)`;
  } else {
    gap = diffDays - wateringFrequency;
    status = `Delayed by ${gap} day(s)`;
  }

  return { diffDays, gap, status };
};

const plantTips = [
  "Rotate your plant every few days so all sides receive equal sunlight.",
  "Wipe dust off leaves regularly to help the plant absorb more light.",
  "Check the underside of leaves for pests like spider mites or aphids.",
  "Use pots with drainage holes to prevent root rot.",
  "Repot your plant when roots start growing out of the drainage holes.",
  "Avoid placing plants near direct AC or heater airflow.",
  "Loosen the topsoil occasionally to improve air circulation.",
  "Use well-draining soil suitable for your specific plant type.",
  "Fertilize during the growing season, but avoid over-fertilizing.",
  "Trim dead or yellow leaves to encourage healthy growth.",
  "Observe leaf color changes—they often indicate plant stress.",
  "Group plants together to maintain humidity levels naturally.",
  "Avoid sudden changes in light conditions to prevent shock.",
  "Use natural pest control like neem oil if needed.",
  "Make sure your pot size matches the plant—too big can retain excess moisture.",
  "Propagate healthy cuttings to grow new plants easily.",
  "Keep an eye on new growth — it’s the best sign your plant is happy.",
  "Ensure your plant gets proper airflow to prevent fungal issues."
];

const getRandomTip = () => {
  const index = Math.floor(Math.random() * plantTips.length);
  return plantTips[index];
};
const PlantDetailModal = ({ log, onClose }) => {
  if (!log) return null;

 const plant = log.plant;

const { diffDays, gap, status } = calculateCareStats(
  plant.lastWateredAt,
  plant.wateringFrequency
);

const streak = plant.streak ?? 0;

const tip = getRandomTip();

  return (
    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content custom-modal">

          <div className="modal-header">
            <h5 className="modal-title">{plant.name}</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">

            <p><strong>💧 Streak:</strong> {streak} 🔥</p>

            <p><strong>📅 Last Watered:</strong> {diffDays} day(s) ago</p>

            <p><strong>⏳ Status:</strong> {status}</p>

            <div className="alert alert-light tip-box">
              <strong>💡 Tip:</strong> {tip}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default PlantDetailModal;