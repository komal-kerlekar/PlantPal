exports.isWateringDue = (lastWateredAt, wateringFrequency) => {
  if (!lastWateredAt || !wateringFrequency) return false;

  const now = new Date();
  const lastWatered = new Date(lastWateredAt);

  const diffTime = now - lastWatered;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  return diffDays >= wateringFrequency;
};
