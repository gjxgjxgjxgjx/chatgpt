import React, { useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space, Typography, Menu } from "antd";

const items = [
  {
    key: "normal",
    label: "正常",
    url: "/normal",
  },
  {
    key: "child",
    label: "儿童",
    url: "/child",
  },
  {
    key: "unlimited",
    label: "无限制",
    url: "/unlimited",
  },
  {
    key: "test-case",
    label: "测试用例",
    url: "/test-case",
  },
];

const ModeSelector = (props) => {
  const [selectedItem, setSelectedItem] = useState(
    items.find((item) => item.key === props.label)
  );

  const handleMenuClick = (e) => {
    const clickedItem = items.find((item) => item.key === e.key);
    setSelectedItem(clickedItem);
    window.location.href = clickedItem.url;
  };

  const menu = (
    <Menu onClick={handleMenuClick} selectedKeys={[selectedItem.key]}>
      {items.map((item) => (
        <Menu.Item key={item.key}>{item.label}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown 
    
    overlay={menu}>
      <Typography.Link>
        <Space>
          {selectedItem.label}
          <DownOutlined />
        </Space>
      </Typography.Link>
    </Dropdown>
  );
};

export default ModeSelector;
