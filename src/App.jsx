import { useState } from "react";

import DrawPage from "./components/DrawPage/DrawPage";
import RevealPage from "./components/RevealPage/RevealPage";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("draw");

  return (
    <div className="tabContainer">
      <div className="tabs">
        <button
          className={activeTab === "draw" ? "active" : ""}
          onClick={() => setActiveTab("draw")}
        >
          Join the List
        </button>
        <button
          className={activeTab === "reveal" ? "active" : ""}
          onClick={() => setActiveTab("reveal")}
        >
          Find your Match
        </button>
      </div>
      {activeTab === "draw" && <DrawPage />}
      {activeTab === "reveal" && <RevealPage />}
    </div>
  );
}

export default App;
