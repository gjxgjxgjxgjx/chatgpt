import "./styles.css";
import ChatBox from "./components/common/ChatBox";
import Sidebar from "./components/common/Sidebar";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import SecretKeyManager from "./components/common/SecretKeyManager";

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/normal" replace />} />
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
