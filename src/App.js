import { useState, useEffect } from "react";
import "./styles.css";
import ChatBox from "./components/common/ChatBox";
import { BrowserRouter, Route, Link, Routes } from "react-router-dom";
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
          <Routes>
            <Route path="/normal" element={<ChatBox chatType={"normal"} />} />
            <Route path="/child" element={<ChatBox chatType={"child"} />} />
            <Route
                path="/unlimited"
                element={<ChatBox chatType={"unlimited"} />}
            />
          </Routes>
          <Link to="/normal">正常 </Link>
          <div>
            <br />
          </div>
          <Link to="/child">儿童 </Link>
          <div>
            <br />
          </div>
          <Link to="/unlimited">无限制 </Link>
          <div>
            <br />
          </div>
          <label>
            使用流式传输
            <input
                type="checkbox"
                checked={useStream}
                onChange={handleUseStreamChange}
            />
          </label>
          <SecretKeyManager />
        </BrowserRouter>
      </div>
  );
}
