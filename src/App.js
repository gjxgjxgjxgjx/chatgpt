import { useState, useEffect } from "react";
import "./styles.css";
import ChatBox from "./components/common/ChatBox";
import Sidebar from "./components/common/Sidebar";
import { BrowserRouter, Route, Link, Routes, Navigate } from "react-router-dom";
import SecretKeyManager from "./components/common/SecretKeyManager";

export default function App() {
  const [useStream, setUseStream] = useState(
    localStorage.getItem("useStream") === "true"
  );

  useEffect(() => {
    localStorage.setItem("useStream", useStream.toString());
  }, [useStream]);

  const handleUseStreamChange = (event) => {
    setUseStream(event.target.checked);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Sidebar
          useStream={useStream}
          handleUseStreamChange={handleUseStreamChange}
        />
        <Routes>
          <Route index element={<Navigate to="/normal" />} />

          <Route path="/normal" element={<ChatBox chatType={"normal"} />} />
          <Route path="/child" element={<ChatBox chatType={"child"} />} />
          <Route
            path="/unlimited"
            element={<ChatBox chatType={"unlimited"} />}
          />
          <Route
            path="/test-case"
            element={<ChatBox chatType={"test-case"} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
