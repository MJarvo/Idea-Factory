"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [ideas, setIdeas] = useState([]);
  const [text, setText] = useState("");

  // Load saved ideas
  useEffect(() => {
    const stored = localStorage.getItem("ideaFactory");
    if (stored) setIdeas(JSON.parse(stored));
  }, []);

  // Save ideas
  useEffect(() => {
    localStorage.setItem("ideaFactory", JSON.stringify(ideas));
  }, [ideas]);

  const addIdea = () => {
    if (!text.trim()) return;
    const newIdea = {
      id: Date.now(),
      text,
      created: new Date().toLocaleString(),
    };
    setIdeas([newIdea, ...ideas]);
    setText("");
  };

  const deleteIdea = (id) => {
    setIdeas(ideas.filter((i) => i.id !== id));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>💡 Idea Factory</h1>

      <textarea
        style={styles.textarea}
        placeholder="Drop your idea here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button style={styles.button} onClick={addIdea}>
        Add Idea
      </button>

      <div style={styles.list}>
        {ideas.map((idea) => (
          <div key={idea.id} style={styles.card}>
            <p style={styles.cardText}>{idea.text}</p>
            <p style={styles.date}>{idea.created}</p>
            <button style={styles.delete} onClick={() => deleteIdea(idea.id)}>
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "sans-serif",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "20px",
  },
  textarea: {
    width: "100%",
    height: "90px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    outline: "none",
  },
  button: {
    marginTop: "12px",
    padding: "12px",
    width: "100%",
    borderRadius: "8px",
    border: "none",
    background: "black",
    color: "white",
    fontSize: "18px",
    cursor: "pointer",
  },
  list: {
    marginTop: "25px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  card: {
    padding: "16px",
    borderRadius: "8px",
    background: "#f6f6f6",
    position: "relative",
  },
  cardText: {
    fontSize: "16px",
    marginBottom: "8px",
  },
  date: {
    fontSize: "12px",
    color: "#777",
  },
  delete: {
    position: "absolute",
    right: "12px",
    top: "12px",
    background: "transparent",
    fontSize: "20px",
    border: "none",
    cursor: "pointer",
    color: "#999",
  },
};
