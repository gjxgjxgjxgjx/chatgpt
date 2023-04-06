import "./styles.css";
import ChatBox from "./components/common/ChatBox";
import { BrowserRouter, Route, Link, Routes } from "react-router-dom";
import SecretKeyManager from "./components/common/SecretKeyManager";

export default function App() {
  return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/normal" element={<ChatBox chatType={"normal"} />} />
            <Route path="/child" element={<ChatBox chatType={"child"} />} />
            <Route path="/unlimited" element={<ChatBox chatType={"unlimited"} />} />
          </Routes>
          <Link to="/normal">正常 </Link>
          <div>
            {" "}
            <br />
          </div>
          <Link to="/child">儿童 </Link>
          <div>
            {" "}
            <br />
          </div>
          <Link to="/unlimited">无限制 </Link>
          <div>
            {" "}
            <br />
          </div>
          <SecretKeyManager />
        </BrowserRouter>
      </div>
  );
}
