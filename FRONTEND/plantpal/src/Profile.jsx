import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const [plants, setPlants] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const username = storedUser?.username || "Plant Parent";
  const email = storedUser?.email || "";

  useEffect(() => {
    if (storedUser?.bio) {
      setBio(storedUser.bio);
    }
  }, []);

  useEffect(() => {
    const fetchPlants = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/plants`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (response.ok) setPlants(data);
    };

    if (token) fetchPlants();
  }, [token]);

  const totalPlants = plants.length;
  const healthyPlants = plants.filter(p => !p.needsWatering).length;
  const needsCare = plants.filter(p => p.needsWatering).length;

  const handleSave = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ bio }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      localStorage.setItem("user", JSON.stringify({
        ...storedUser,
        bio: data.bio
      }));

      setIsEditing(false);

    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };

  return (
    <div className="profile-container">

      <div className="card profile-card">

        <div className="profile-header">
          <div className="avatar">
            {username.charAt(0).toUpperCase()}
          </div>
          <h3>{username}</h3>
          <p className="email">{email}</p>
        </div>

        <div className="profile-body">

          {isEditing ? (
            <>
              <textarea
                className="form-control"
                rows="3"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell the world about your plant journey 🌿"
              />
              <button
                className="btn btn-success mt-3 w-100"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </>
          ) : (
            <p className="profile-bio">
              {bio || "No bio added yet 🌱"}
            </p>
          )}

          {!isEditing && (
            <button
              className="btn btn-outline-success w-100 mt-3"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          )}

          <div className="stats-section">
            <h6>Plant Overview 🌿</h6>
            <div className="stats-grid">
              <div className="stat-box">
                <span>{totalPlants}</span>
                <small>Total</small>
              </div>
              <div className="stat-box healthy">
                <span>{healthyPlants}</span>
                <small>Healthy</small>
              </div>
              <div className="stat-box warning">
                <span>{needsCare}</span>
                <small>Needs Care</small>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Back Button at Bottom */}
      <button
        className="btn btn-success back-btn"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>

    </div>
  );
}