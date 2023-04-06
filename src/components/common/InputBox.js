import React, { useState } from "react";
import styles from "./InputBox.module.css";

export default function InputBox(props) {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleClick = () => {
    if (inputValue.trim() !== "") {
      console.debug("发送聊天内容：", inputValue);
      props.onClick(inputValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.ctrlKey) {
      handleClick();
    } else if (e.key === "Enter" && e.ctrlKey) {
      setInputValue(inputValue + "\n");
    }
  };

  return (
    <div className={styles.InputBox}>
      <textarea
        className={styles.InputBox.textarea}
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="请输入聊天内容"
      />
      <button className={styles.InputBox.button} onClick={handleClick}>
        发送
      </button>
    </div>
  );
}
