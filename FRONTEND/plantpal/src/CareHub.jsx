import { useState, useEffect } from "react";
import "./CareHub.css";
import GreenAid from "./GreenAid";

const CareHub = () => {
  const [activeTab, setActiveTab] = useState("leaflet");

  return (
    <div className={`carehub-container ${activeTab === "chat" ? "chat-mode" : ""}`}>

      <div className="carehub-header">
        <h3>🌿 Care Hub</h3>
        <p>Plant help, simplified</p>
      </div>

      <div className="carehub-tabs">
        <button
          className={`tab-btn ${activeTab === "leaflet" ? "active" : ""}`}
          onClick={() => setActiveTab("leaflet")}
        >
          📖 Leaflet
        </button>

        <button
          className={`tab-btn ${activeTab === "chat" ? "active" : ""}`}
          onClick={() => setActiveTab("chat")}
        >
          🤖 GreenAid
        </button>
      </div>

      <div className="carehub-content">
        {activeTab === "leaflet" && <LeafletSection />}
        {activeTab === "chat" && <GreenAid />}
      </div>
    </div>
  );
};

const LeafletSection = () => {
  const [view, setView] = useState("modules");
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [article, setArticle] = useState(null);
  const [articles, setArticles] = useState([]);

  // Fetch all articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/articles`);
        const data = await res.json();
        setArticles(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  // Fetch single article
  useEffect(() => {
    if (selectedLesson) {
      const fetchArticle = async () => {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/articles/${selectedLesson.slug}`
          );
          const data = await res.json();
          setArticle(data);
        } catch (error) {
          console.error("Error fetching article:", error);
        }
      };

      fetchArticle();
    }
  }, [selectedLesson]);

  const categoryLabels = {
    basics: "Basics",
    seasonal: "Seasonal Care",
    diseases: "Common Plant Problems",
    uses: "Plants by Purpose",
    eco: "Eco Care",
    myths: "Common Mistakes & Myths"
  };

  const modules = Object.entries(
    articles.reduce((acc, article) => {
      if (!acc[article.category]) {
        acc[article.category] = [];
      }
      acc[article.category].push(article);
      return acc;
    }, {})
  ).map(([category, lessons]) => ({
    id: category,
    title: categoryLabels[category] || category,
    level: "Structured Learning",
    lessons,
  }));

  return (
    <div>

      {/* MODULES */}
      {view === "modules" && (
        <>
          <div className="leaflet-intro mb-4">
            <h5 className="fw-bold">Plant Parenting Foundations</h5>
            <p className="text-muted">
              Structured learning modules to guide you step-by-step.
            </p>
          </div>

          {modules.map((module, index) => (
            <div
              key={`${module.id}-${index}`}
              className="leaflet-module-card mb-3"
              onClick={() => {
                setSelectedModule(module);
                setView("lessons");
              }}
            >
              <h6 className="fw-bold">{module.title}</h6>
              <p className="text-muted small">
                {module.level} • {module.lessons.length} lessons
              </p>
            </div>
          ))}
        </>
      )}

      {/* LESSONS */}
      {view === "lessons" && selectedModule && (
        <>
          <button
            className="btn btn-sm btn-outline-secondary mb-3"
            onClick={() => setView("modules")}
          >
            ← Back
          </button>

          <h5 className="fw-bold mb-3">{selectedModule.title}</h5>

          {selectedModule.lessons.map((lesson) => (
            <div
              key={lesson._id || lesson.slug}
              className="leaflet-lesson-item mb-2"
              onClick={() => {
                setSelectedLesson(lesson);
                setView("article");
              }}
            >
              {lesson.title}
            </div>
          ))}
        </>
      )}

      {/* ARTICLE */}
      {view === "article" && article && (
        <>
          <button
            className="btn btn-sm btn-outline-secondary mb-4"
            onClick={() => {
              setView("lessons");
              setArticle(null);
            }}
          >
            ← Back
          </button>
          <div
            className="article-content"
            style={{ maxWidth: "750px", margin: "0 auto" }}
          >
            <h4 className="fw-bold mb-4">{article.title}</h4>

            {article.content.map((block, index) => {
              const blockKey = `${block.type}-${index}`;

              if (block.type === "paragraph") {
                return (
                  <p
                    key={blockKey}
                    style={{
                      lineHeight: "1.8",
                      fontSize: "15.5px",
                      marginBottom: "16px",
                    }}
                  >
                    {block.text}
                  </p>
                );
              }

              if (block.type === "subtitle") {
                return (
                  <h6
                    key={blockKey}
                    style={{
                      marginTop: "30px",
                      marginBottom: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {block.text}
                  </h6>
                );
              }

              if (block.type === "list") {
                return (
                  <ul
                    key={blockKey}
                    style={{
                      paddingLeft: "20px",
                      marginBottom: "16px",
                    }}
                  >
                    {block.items.map((item, i) => (
                      <li
                        key={`${blockKey}-item-${i}`}
                        style={{
                          marginBottom: "6px",
                          lineHeight: "1.6",
                        }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              }

              if (block.type === "tip") {
                return (
                  <div
                    key={blockKey}
                    className="article-tip"
                    style={{ margin: "15px 0" }}
                  >
                    {block.text}
                  </div>
                );
              }

              return null;
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default CareHub;