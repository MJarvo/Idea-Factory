import { useEffect, useState } from "react";

export default function Home() {
  const [ideas, setIdeas] = useState([]);
  const [viewFilter, setViewFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const [form, setForm] = useState({
    title: "",
    oneLiner: "",
    category: "Energy / Hardware",
    timeHorizon: "This month",
    effort: "Low",
    potential: "Medium",
    status: "Parking lot"
  });

  // Load saved ideas from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("idea-factory-v1");
    if (saved) {
      try {
        setIdeas(JSON.parse(saved));
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  // Save to localStorage whenever ideas change
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("idea-factory-v1", JSON.stringify(ideas));
  }, [ideas]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleAdd(e) {
    e.preventDefault();
    if (!form.title.trim()) return;

    const newIdea = {
      id: Date.now(),
      ...form,
      createdAt: new Date().toISOString()
    };

    setIdeas(prev => [newIdea, ...prev]);

    setForm(prev => ({
      ...prev,
      title: "",
      oneLiner: "",
      timeHorizon: "This month",
      effort: "Low",
      potential: "Medium",
      status: "Parking lot"
    }));
  }

  function quickStatusChange(id, status) {
    setIdeas(prev =>
      prev.map(idea =>
        idea.id === id ? { ...idea, status } : idea
      )
    );
  }

  function deleteIdea(id) {
    if (!window.confirm("Delete this idea?")) return;
    setIdeas(prev => prev.filter(i => i.id !== id));
  }

  const filteredIdeas = ideas
    .filter(idea => {
      if (viewFilter === "all") return true;
      return idea.status === viewFilter;
    })
    .sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === "potential") {
        const rank = { High: 3, Medium: 2, Low: 1 };
        return rank[b.potential] - rank[a.potential];
      }
      if (sortBy === "effort") {
        const rank = { Low: 1, Medium: 2, High: 3 };
        return rank[a.effort] - rank[b.effort]; // lower effort first
      }
      return 0;
    });

  return (
    <div className="page">
      <main className="layout">
        {/* Left side - capture */}
        <section className="panel panel-left">
          <header className="header">
            <div>
              <h1>Idea Factory</h1>
              <p>One tap to dump ideas. No friction, no lost thoughts.</p>
            </div>
            <div className="pill">v1</div>
          </header>

          <form className="idea-form" onSubmit={handleAdd}>
            <label className="field">
              <span className="label">Idea title</span>
              <input
                name="title"
                placeholder="NRG Pod micro farm on Dad&apos;s land"
                value={form.title}
                onChange={handleChange}
              />
            </label>

            <label className="field">
              <span className="label">One line description</span>
              <textarea
                name="oneLiner"
                rows={2}
                placeholder="Containerised solar + second life battery pods for events and construction."
                value={form.oneLiner}
                onChange={handleChange}
              />
            </label>

            <div className="grid-2">
              <label className="field">
                <span className="label">Category</span>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option>Energy / Hardware</option>
                  <option>Software / SaaS</option>
                  <option>Manufacturing / Ops</option>
                  <option>Content / Education</option>
                  <option>Personal / Life systems</option>
                  <option>Other</option>
                </select>
              </label>

              <label className="field">
                <span className="label">Time horizon</span>
                <select
                  name="timeHorizon"
                  value={form.timeHorizon}
                  onChange={handleChange}
                >
                  <option>This week</option>
                  <option>This month</option>
                  <option>This quarter</option>
                  <option>Someday / Maybe</option>
                </select>
              </label>
            </div>

            <div className="grid-3">
              <label className="field">
                <span className="label">Effort</span>
                <select
                  name="effort"
                  value={form.effort}
                  onChange={handleChange}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </label>

              <label className="field">
                <span className="label">Potential</span>
                <select
                  name="potential"
                  value={form.potential}
                  onChange={handleChange}
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </label>

              <label className="field">
                <span className="label">Status</span>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option>Parking lot</option>
                  <option>Next up</option>
                  <option>In motion</option>
                  <option>On ice</option>
                  <option>Done</option>
                </select>
              </label>
            </div>

            <button type="submit" className="primary-button">
              Save idea
            </button>
          </form>
        </section>

        {/* Right side - board */}
        <section className="panel panel-right">
          <div className="toolbar">
            <div className="toolbar-group">
              <span className="toolbar-label">View</span>
              <div className="pill-toggle">
                {["all", "Parking lot", "Next up", "In motion", "On ice"].map(v => (
                  <button
                    key={v}
                    type="button"
                    className={
                      "pill-option" +
                      (viewFilter === v ? " pill-option-active" : "")
                    }
                    onClick={() => setViewFilter(v)}
                  >
                    {v === "all" ? "All" : v}
                  </button>
                ))}
              </div>
            </div>

            <div className="toolbar-group">
              <span className="toolbar-label">Sort</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="recent">Most recent</option>
                <option value="potential">Highest potential</option>
                <option value="effort">Lowest effort</option>
              </select>
            </div>
          </div>

          {filteredIdeas.length === 0 ? (
            <div className="empty">
              <h2>No ideas yet</h2>
              <p>Capture the first one on the left and it will appear here.</p>
            </div>
          ) : (
            <div className="idea-grid">
              {filteredIdeas.map(idea => (
                <article key={idea.id} className="idea-card">
                  <header className="idea-header">
                    <h3>{idea.title}</h3>
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => deleteIdea(idea.id)}
                    >
                      ×
                    </button>
                  </header>
                  {idea.oneLiner && (
                    <p className="one-liner">{idea.oneLiner}</p>
                  )}
                  <div className="pill-row">
                    <span className="pill pill-soft">
                      {idea.category}
                    </span>
                    <span className="pill pill-soft">
                      {idea.timeHorizon}
                    </span>
                  </div>
                  <div className="meta-row">
                    <span className={"tag tag-effort-" + idea.effort.toLowerCase()}>
                      Effort: {idea.effort}
                    </span>
                    <span className={"tag tag-pot-" + idea.potential.toLowerCase()}>
                      Potential: {idea.potential}
                    </span>
                  </div>
                  <footer className="idea-footer">
                    <div className="status-badge">
                      <span className="status-dot" />
                      <span>{idea.status}</span>
                    </div>
                    <div className="quick-actions">
                      <button
                        type="button"
                        onClick={() => quickStatusChange(idea.id, "Next up")}
                      >
                        Next
                      </button>
                      <button
                        type="button"
                        onClick={() => quickStatusChange(idea.id, "In motion")}
                      >
                        Start
                      </button>
                    </div>
                  </footer>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Simple styling without any extra config */}
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }
        html,
        body {
          margin: 0;
          padding: 0;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
            sans-serif;
          background: radial-gradient(circle at top, #0f172a, #020617 55%);
          color: #e5e7eb;
        }
        body {
          min-height: 100vh;
        }
        .page {
          min-height: 100vh;
          padding: 16px;
        }
        .layout {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.4fr);
          gap: 16px;
        }
        @media (max-width: 900px) {
          .layout {
            grid-template-columns: minmax(0, 1fr);
          }
        }
        .panel {
          background: rgba(15, 23, 42, 0.92);
          border-radius: 20px;
          padding: 18px 18px 20px;
          border: 1px solid rgba(148, 163, 184, 0.2);
          box-shadow: 0 24px 80px rgba(15, 23, 42, 0.8);
        }
        .panel-left {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .panel-right {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .header p {
          margin: 4px 0 0;
          font-size: 13px;
          color: #9ca3af;
        }
        .pill {
          padding: 4px 10px;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.4);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #e5e7eb;
          white-space: nowrap;
        }
        .pill-soft {
          background: rgba(15, 23, 42, 0.9);
          border-color: rgba(148, 163, 184, 0.35);
        }
        .idea-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 13px;
        }
        .label {
          color: #cbd5f5;
        }
        input,
        textarea,
        select {
          border-radius: 12px;
          border: 1px solid rgba(148, 163, 184, 0.4);
          padding: 8px 10px;
          background: rgba(15, 23, 42, 0.9);
          color: #e5e7eb;
          font-size: 13px;
          outline: none;
        }
        input::placeholder,
        textarea::placeholder {
          color: #6b7280;
        }
        input:focus,
        textarea:focus,
        select:focus {
          border-color: #38bdf8;
          box-shadow: 0 0 0 1px #38bdf8;
        }
        textarea {
          resize: vertical;
          min-height: 48px;
        }
        .grid-2 {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }
        .grid-3 {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
        }
        @media (max-width: 700px) {
          .grid-2,
          .grid-3 {
            grid-template-columns: minmax(0, 1fr);
          }
        }
        .primary-button {
          margin-top: 4px;
          border-radius: 999px;
          border: none;
          padding: 9px 14px;
          background: linear-gradient(135deg, #22d3ee, #8b5cf6);
          color: #0b1120;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .primary-button:hover {
          filter: brightness(1.05);
          transform: translateY(-1px);
        }
        .toolbar {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }
        .toolbar-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .toolbar-label {
          font-size: 11px;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .pill-toggle {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }
        .pill-option {
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.4);
          background: transparent;
          padding: 4px 9px;
          font-size: 11px;
          color: #e5e7eb;
          cursor: pointer;
        }
        .pill-option-active {
          background: rgba(56, 189, 248, 0.12);
          border-color: #38bdf8;
        }
        .toolbar select {
          min-width: 130px;
        }
        .empty {
          margin-top: 20px;
          text-align: center;
          padding: 32px 16px;
          border-radius: 16px;
          border: 1px dashed rgba(148, 163, 184, 0.5);
          background: radial-gradient(circle at top, rgba(56, 189, 248, 0.12), transparent 55%);
        }
        .empty h2 {
          margin: 0 0 6px;
          font-size: 18px;
        }
        .empty p {
          margin: 0;
          font-size: 13px;
          color: #9ca3af;
        }
        .idea-grid {
          margin-top: 14px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 10px;
        }
        .idea-card {
          border-radius: 16px;
          border: 1px solid rgba(148, 163, 184, 0.4);
          background: linear-gradient(
            145deg,
            rgba(15, 23, 42, 0.98),
            rgba(15, 23, 42, 0.8)
          );
          padding: 10px 10px 11px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .idea-header {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          align-items: flex-start;
        }
        .idea-header h3 {
          margin: 0;
          font-size: 14px;
        }
        .delete-button {
          border: none;
          background: transparent;
          color: #6b7280;
          cursor: pointer;
          font-size: 16px;
          line-height: 1;
        }
        .delete-button:hover {
          color: #f97373;
        }
        .one-liner {
          margin: 0;
          font-size: 12px;
          color: #9ca3af;
        }
        .pill-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 2px;
        }
        .meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 4px;
        }
        .tag {
          font-size: 11px;
          padding: 2px 7px;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.5);
          background: rgba(15, 23, 42, 0.9);
        }
        .tag-effort-low {
          border-color: #4ade80;
          color: #bbf7d0;
        }
        .tag-effort-medium {
          border-color: #eab308;
          color: #fef9c3;
        }
        .tag-effort-high {
          border-color: #f97316;
          color: #fed7aa;
        }
        .tag-pot-high {
          border-color: #22c55e;
          color: #bbf7d0;
        }
        .tag-pot-medium {
          border-color: #38bdf8;
          color: #bae6fd;
        }
        .tag-pot-low {
          border-color: #6b7280;
          color: #d1d5db;
        }
        .idea-footer {
          margin-top: 6px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          padding: 3px 8px;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(148, 163, 184, 0.4);
        }
        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: #22c55e;
        }
        .quick-actions {
          display: flex;
          gap: 4px;
        }
        .quick-actions button {
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.5);
          background: rgba(15, 23, 42, 0.9);
          color: #e5e7eb;
          font-size: 11px;
          padding: 3px 8px;
          cursor: pointer;
        }
        .quick-actions button:hover {
          border-color: #38bdf8;
        }
      `}</style>
    </div>
  );
}
