import { useState } from "react";
import { Link } from "react-router-dom";
import SecretKeyManager from "./SecretKeyManager";
const Sidebar = ({ useStream, handleUseStreamChange }) => {
  return (
    <div>
      {
        <>
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
      }
    </div>
  );
};

export default Sidebar;
