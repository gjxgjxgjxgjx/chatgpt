import { useState } from "react";
import { Link } from "react-router-dom";
import SecretKeyManager from "./SecretKeyManager";
const Sidebar = ({ useStream, handleUseStreamChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <button onClick={toggleSidebar} className="sidebar-toggle">
        {sidebarOpen ? "关闭" : "展开"}
      </button>
      {sidebarOpen && (
        <>
          <nav>
            <ul>
              <li>
                <Link to="/normal">正常</Link>
              </li>
              <li>
                <Link to="/child">儿童</Link>
              </li>
              <li>
                <Link to="/unlimited">无限制</Link>
              </li>
              <li>
                <Link to="/test-case">测试</Link>
              </li>
            </ul>
          </nav>
          <label>
            使用流式传输
            <input
              type="checkbox"
              checked={useStream}
              onChange={handleUseStreamChange}
            />
          </label>
          <SecretKeyManager />
        </>
      )}
    </div>
  );
};

export default Sidebar;
