import { Button, Drawer } from "antd";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import { BarsOutlined } from "@ant-design/icons";
const SettingDrower = () => {
  const [open, setOpen] = useState(false);
  const [useStream, setUseStream] = useState(() => {
    const storedValue = localStorage.getItem("useStream");
    if (storedValue === null) {
      localStorage.setItem("useStream", "true");
      return true;
    }
    return storedValue === "true";
  });

  useEffect(() => {
    localStorage.setItem("useStream", useStream.toString());
  }, [useStream]);
  const handleUseStreamChange = (event) => {
    setUseStream(event.target.checked);
  };

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Button type="text" onClick={showDrawer}>
        <BarsOutlined />
      </Button>
      <Drawer
        width="50%"
        title=""
        placement="left"
        onClose={onClose}
        open={open}
      >
        <div>
          <Sidebar
            useStream={useStream}
            handleUseStreamChange={handleUseStreamChange}
          />
        </div>
      </Drawer>
    </>
  );
};
export default SettingDrower;
