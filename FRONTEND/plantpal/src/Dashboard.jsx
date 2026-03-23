import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {

  const [plants, setPlants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [plantName, setPlantName] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const fetchPlants = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/plants`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setPlants(data);
      } else {
        setPlants([]);
      }

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  const handleAddPlant = async () => {
    try {
      const token = localStorage.getItem("token");

      let base64Image = null;

      //  Convert image to base64 
      if (image) {
        base64Image = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(image);
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/plants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: plantName,
          location,
          image: base64Image,
        }),
      });

      if (res.ok) {
        setPlantName("");
        setLocation("");
        setImage(null);
        setShowModal(false);
        fetchPlants();
      }

    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePlant = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(
        `${import.meta.env.VITE_API_URL}/api/plants/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchPlants();

    } catch (err) {
      console.log(err);
    }
  };

  const handleWaterPlant = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/plants/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lastWateredAt: new Date() }),
      });

      fetchPlants();
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdatePlant = async () => {
    try {
      const token = localStorage.getItem("token");

      await fetch(
        `${import.meta.env.VITE_API_URL}/api/plants/${editingPlant._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editingPlant.name,
            location: editingPlant.location,
            wateringFrequency: editingPlant.wateringFrequency,
          }),
        }
      );

      setShowEditModal(false);
      setEditingPlant(null);
      fetchPlants();

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="dashboard-wrapper">

      {/* ✅ Dynamic Greeting ONLY (No Logout Button Here) */}
      <h5 className="dashboard-header mb-2">
        My Garden 🌿
      </h5>

      {/* ✅ Logout Confirmation Modal (Triggered from Hamburger) */}
      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h6>Are you sure you want to logout?</h6>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowLogoutModal(false)}
              >
                No
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={handleLogout}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD PLANT MODAL ================= */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Plant 🌱</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={plantName}
                    onChange={(e) => setPlantName(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <select
                    className="form-select"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Indoor">Indoor</option>
                    <option value="Outdoor">Outdoor</option>
                  </select>
                </div>

                <div className="mb-3">
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleAddPlant}
                >
                  Add Plant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= PLANT CARDS ================= */}
      <div className="row g-3">
        {plants.map((plant) => {

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          let status = "green";

          if (plant.care && plant.care.length > 0) {
            for (let task of plant.care) {
              const dueDate = new Date(task.nextDueDate);
              dueDate.setHours(0, 0, 0, 0);

              if (dueDate < today && !task.isCompleted) {
                status = "red";
                break;
              }

              if (dueDate.getTime() === today.getTime() && !task.isCompleted) {
                status = "yellow";
              }
            }
          }

          return (
            <div className="col-6" key={plant._id}>
              <div className="card position-relative shadow-sm">

                <div className="dropdown position-absolute top-0 end-0 m-2">
                  <button
                    className="btn btn-light btn-sm"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    ⋮
                  </button>

                  <ul className="dropdown-menu">
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => {
                          setEditingPlant(plant);
                          setShowEditModal(true);
                        }}
                      >
                        Edit
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={() => handleDeletePlant(plant._id)}
                      >
                        Delete
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() =>
                          navigate("/growthlog", {
                            state: { plantId: plant._id }
                          })
                        }
                      >
                        Log
                      </button>
                    </li>
                  </ul>
                </div>

                <img
                  src={`${import.meta.env.VITE_API_URL}/${plant.image}`}
                  alt={plant.name}
                  className="card-img-top"
                  style={{ height: "150px", objectFit: "cover" }}
                />

                <div className="card-body p-2 d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">{plant.name}</h6>
                    <small className="text-muted d-block">
                      📍 {plant.location || "Unknown"}
                    </small>
                  </div>

                  <div>
                    {status === "green" && (
                      <i className="bi bi-check-circle-fill text-success fs-4"></i>
                    )}
                    {status === "yellow" && (
                      <i className="bi bi-exclamation-triangle-fill text-warning fs-4"></i>
                    )}
                    {status === "red" && (
                      <i className="bi bi-x-circle-fill text-danger fs-4"></i>
                    )}
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      <button
        className="add-plant-btn"
        onClick={() => setShowModal(true)}
      >
        <i className="bi bi-plus-lg"></i>
      </button>

      {showEditModal && editingPlant && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Edit Plant</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nickname</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingPlant.name}
                    onChange={(e) =>
                      setEditingPlant({
                        ...editingPlant,
                        name: e.target.value
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingPlant.location || ""}
                    onChange={(e) =>
                      setEditingPlant({
                        ...editingPlant,
                        location: e.target.value
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Watering Frequency (days)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editingPlant.wateringFrequency}
                    onChange={(e) =>
                      setEditingPlant({
                        ...editingPlant,
                        wateringFrequency: e.target.value
                      })
                    }
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleUpdatePlant}
                >
                  Save Changes
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;