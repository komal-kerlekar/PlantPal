import React, { useState, useEffect } from "react";
import "./GrowthLog.css";
import { useLocation } from "react-router-dom";

const GrowthLog = () => {
  const [logs, setLogs] = useState([]);
  const [plants, setPlants] = useState([]);
  const [selectedPlantId, setSelectedPlantId] = useState("");
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileKey, setFileKey] = useState(Date.now());
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();

  const token = localStorage.getItem("token");

  //  Fetch Logs (User Specific)
  const fetchLogs = async () => {
    if (!token) {
      setLogs([]);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/logs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setLogs(data);
    } catch (error) {
      console.error("Error fetching logs:", error.message);
      setLogs([]);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [token]);

  // 🔹 Fetch Plants (User Specific)
  useEffect(() => {
    if (!token) {
      setPlants([]);
      return;
    }

    const fetchPlants = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/plants`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        setPlants(data);
      } catch (error) {
        console.error("Error fetching plants:", error.message);
        setPlants([]);
      }
    };

    fetchPlants();
  }, [token]);

  // 🔹 Open modal if coming from dashboard log button
  useEffect(() => {
    if (location.state?.plantId) {
      setSelectedPlantId(location.state.plantId);
      setShowModal(true);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlantId || !note || !photo) return;

    try {
      // 🔹 Convert image to base64
      const base64Photo = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(photo);
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/logs/add-log`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // ✅ important
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            plantId: selectedPlantId,
            note,
            photo: base64Photo, // ✅ base64
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setLogs([data, ...logs]);

      // Reset form
      setSelectedPlantId("");
      setNote("");
      setPhoto(null);
      setPreview(null);
      setFileKey(Date.now());
      setShowModal(false);

    } catch (error) {
      console.error("Error adding log:", error.message);
    }
  };
  const handleDelete = async (logId) => {
    if (!window.confirm("Delete this log?")) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/logs/${logId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      // Update UI instantly
      setLogs(logs.filter((log) => log._id !== logId));

    } catch (error) {
      console.error("Error deleting log:", error.message);
    }
  };

  return (
    <div className="container growth-log-page py-4">

      <h3 className="text-center mb-3">🌿 Growth Journal</h3>

      {/* Logs */}
      <div className="row">
        {logs.length === 0 && (
          <p className="text-center text-muted">
            No growth logs yet 🌱
          </p>
        )}

        {logs.map((log) => (
          <div
            className="col-md-6 col-lg-4 mb-4"
            key={log._id}
          >
            <div className="card growth-card h-100">

              {log.photo && (
                <img
                  src={log.photo}
                  alt="log"
                  className="card-img-top"
                />
              )}

              <div className="card-body">
                <h5 className="card-title">
                  {log.plant?.name || "Unknown Plant"}
                </h5>
                <p className="card-text">{log.note}</p>
              </div>

              <div className="card-footer d-flex justify-content-between align-items-center text-muted">

                <small>
                  {new Date(log.createdAt).toLocaleDateString()}
                </small>

                <i
                  className="bi bi-trash text-danger"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDelete(log._id)}
                ></i>

              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Floating Button */}
      <button
        className="floating-btn"
        onClick={() => setShowModal(true)}
      >
        +
      </button>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h5 className="mb-3">Write New Log 🌱</h5>

            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <select
                  className="form-control"
                  value={selectedPlantId}
                  onChange={(e) =>
                    setSelectedPlantId(e.target.value)
                  }
                >
                  <option value="">Select a plant</option>
                  {plants.map((plant) => (
                    <option
                      key={plant._id}
                      value={plant._id}
                    >
                      {plant.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <input
                  key={fileKey}
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setPhoto(file);
                    setPreview(URL.createObjectURL(file));
                  }}
                />
              </div>

              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="img-preview mb-3"
                />
              )}

              <div className="mb-3">
                <textarea
                  className="form-control"
                  rows="3"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="New leaf today 🌱"
                />
              </div>

              <button className="btn btn-success w-100">
                Add to Growth Log
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary w-100 mt-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default GrowthLog;