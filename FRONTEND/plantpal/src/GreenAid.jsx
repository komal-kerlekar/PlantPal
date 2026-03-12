import { useState, useEffect, useRef } from "react";
import "./CareHub.css";

const GreenAid = () => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [messages, setMessages] = useState([
    { id: Date.now(), type: "bot", text: "👋 Hey! How can I help you today?" }
  ]);

  const chatRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [messages, step]);

  const addMsg = (type, text) => {
    setMessages(prev => [
      ...prev,
      { id: Date.now() + Math.random(), type, text }
    ]);
  };

  const resetConversation = () => {
    setAnswers({});
    setStep(1);
  };

  const handleHelpType = (value) => {
    const readable =
      value === "symptom"
        ? "Something is wrong with my plant"
        : value === "identify"
          ? "Identify my plant"
          : "Suggest me a plant to adopt";

    addMsg("user", readable);

    if (value === "symptom") {
      addMsg("bot", "🌱 What issue are you noticing?");
      setStep(2);
    }

    if (value === "identify") {
      addMsg("bot", "📷 Please upload a clear image of your plant.");
      setStep(4);
    }

    if (value === "recommend") {
      addMsg("bot", "🌿 Are you a beginner or intermediate plant parent?");
      setStep(5);
    }
  };

  const handleSymptom = (issue) => {
    addMsg("user", issue);

    let cause = "";
    let solution = "";

    switch (issue) {
      case "Yellow leaves":
        cause = "💧 Cause: Overwatering or poor drainage.";
        solution = "✅ Solution: Reduce watering and ensure proper drainage.";
        break;
      case "Brown tips":
        cause = "🌬 Cause: Low humidity or inconsistent watering.";
        solution = "✅ Solution: Increase humidity and water consistently.";
        break;
      case "Wilting":
        cause = "🚱 Cause: Underwatering or root stress.";
        solution = "✅ Solution: Check soil moisture and water properly.";
        break;
      default:
        cause = "🔍 Cause: Could be fungal or bacterial issue.";
        solution = "✅ Solution: Remove affected leaves and monitor closely.";
    }

    addMsg("bot", cause);
    addMsg("bot", solution);
    addMsg("bot", "🌱 Need help with something else?");
    resetConversation();
  };

  /* =========================
     IDENTIFY FLOW
  ========================= */

  const handleIdentify = async (file) => {
    if (!file) return;

    addMsg("user", "📷 Image uploaded");
    addMsg("bot", "🔎 Identifying your plant...");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/identify`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Identification failed");
      }

      if (!data.suggestions || data.suggestions.length === 0) {
        addMsg("bot", "❌ I couldn't identify the plant. Try another image.");
        addMsg("bot", "🌱 Need help with something else?");
        resetConversation();
        return;
      }

      const topPlant = data.suggestions[0];

      addMsg(
        "bot",
        `🌿 This looks like ${topPlant.commonName}.
🔬 Scientific Name: ${topPlant.scientificName}
📊 Confidence: ${topPlant.score}%`
      );

      if (data.suggestions.length > 1) {
        addMsg("bot", "Here are a few other possibilities:");
        data.suggestions.slice(1).forEach((plant) => {
          addMsg(
            "bot",
            `• ${plant.commonName} (${plant.score}% confidence)`
          );
        });
      }

      addMsg("bot", "🌱 Need help with something else?");
      resetConversation();

    } catch (error) {
      console.error("Identify error:", error);
      addMsg("bot", "⚠️ Plant identification failed. Please try again.");
      resetConversation();
    }
  };

  /* =========================
     RECOMMEND FLOW
  ========================= */

  const handleExperience = (value) => {
    addMsg("user", value);
    setAnswers(prev => ({ ...prev, experience: value }));
    addMsg("bot", "⏳ How much time can you dedicate?");
    setStep(6);
  };

  const handleTime = (value) => {
    addMsg("user", value === "low" ? "Very little time" : "Moderate time");
    setAnswers(prev => ({ ...prev, time: value }));
    addMsg("bot", "🐶 Do you have pets at home?");
    setStep(7);
  };

  const handlePets = (value) => {
    addMsg("user", value === "true" ? "Yes" : "No");
    setAnswers(prev => ({ ...prev, pets: value }));
    addMsg("bot", "☀️ What lighting do you have?");
    setStep(8);
  };

  const handleLight = (value) => {
    addMsg("user", value);
    addMsg("bot", "🌿 Finding the perfect plant for you...");

    setTimeout(() => {
      let suggestion = "Snake Plant";
      if (answers.experience === "intermediate") {
        suggestion = "Monstera Deliciosa";
      }

      addMsg(
        "bot",
        `✨ I suggest: ${suggestion}! It's a great match for your lifestyle.`
      );

      addMsg("bot", "🌱 Need help with something else?");
      resetConversation();
    }, 800);
  };

  /* =========================
     JSX
  ========================= */

  return (
    <div className="chat-container">
      <div className="chat-window" ref={chatRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}   // ✅ FIXED HERE
            className={msg.type === "bot" ? "bot-msg" : "user-msg"}
          >
            {msg.text}
          </div>
        ))}

        {step === 1 && (
          <div className="bot-msg">
            <select
              className="form-select user-select"
              defaultValue=""
              onChange={(e) => handleHelpType(e.target.value)}
            >
              <option value="" disabled>Select an option</option>
              <option value="symptom">Something is wrong with my plant</option>
              <option value="identify">Identify my plant</option>
              <option value="recommend">Suggest me a plant to adopt</option>
            </select>
          </div>
        )}

        {step === 2 && (
          <div className="bot-msg">
            <select
              className="form-select user-select"
              defaultValue=""
              onChange={(e) => handleSymptom(e.target.value)}
            >
              <option value="" disabled>Select issue</option>
              <option value="Yellow leaves">Yellow leaves</option>
              <option value="Brown tips">Brown tips</option>
              <option value="Wilting">Wilting</option>
            </select>
          </div>
        )}

        {step === 4 && (
          <div className="bot-msg">
            <input
              type="file"
              className="form-control"
              onChange={(e) => handleIdentify(e.target.files[0])}
            />
          </div>
        )}

        {step === 5 && (
          <div className="bot-msg">
            <select
              className="form-select user-select"
              defaultValue=""
              onChange={(e) => handleExperience(e.target.value)}
            >
              <option value="" disabled>Select experience level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
            </select>
          </div>
        )}

        {step === 6 && (
          <div className="bot-msg">
            <select
              className="form-select user-select"
              defaultValue=""
              onChange={(e) => handleTime(e.target.value)}
            >
              <option value="" disabled>Select time dedication</option>
              <option value="low">Very little</option>
              <option value="moderate">Moderate</option>
            </select>
          </div>
        )}

        {step === 7 && (
          <div className="bot-msg">
            <select
              className="form-select user-select"
              defaultValue=""
              onChange={(e) => handlePets(e.target.value)}
            >
              <option value="" disabled>Do you have pets?</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        )}

        {step === 8 && (
          <div className="bot-msg">
            <select
              className="form-select user-select"
              defaultValue=""
              onChange={(e) => handleLight(e.target.value)}
            >
              <option value="" disabled>Select lighting</option>
              <option value="low">Low light</option>
              <option value="bright">Bright indirect</option>
              <option value="direct">Direct sunlight</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default GreenAid;