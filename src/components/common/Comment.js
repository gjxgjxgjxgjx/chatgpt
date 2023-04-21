import styles from "./Comment.module.css";
import ReactMarkdown from "react-markdown";

import RemarkMath from "remark-math";
import RemarkBreaks from "remark-breaks";
import RehypeKatex from "rehype-katex";
import RemarkGfm from "remark-gfm";
import RehypeHighlight from "rehype-highlight";

import { useRef } from "react";

function formatDate(date) {
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const minutesFormatted = minutes < 10 ? "0" + minutes : minutes;
  const amPm = hours < 12 ? "上午" : "下午";

  if (isToday) {
    return `${amPm} ${hours % 12}:${minutesFormatted}`;
  } else {
    return `${date.getFullYear()}/${
      date.getMonth() + 1
    }/${date.getDate()} ${amPm} ${hours % 12}:${minutesFormatted}`;
  }
}

export function PreCode(props) {
  const ref = useRef(HTMLPreElement);

  return (
    <pre ref={ref}>
      <button
        className={styles.copyBottn}
        onClick={() => {
          if (ref.current) {
            let code = ref.current.innerText;
            copyToClipboard(code);
          }
        }}
      ></button>
      {props.children}
    </pre>
  );
}

async function copyToClipboard(text) {
  // 使用 navigator.clipboard.writeText，如果可用
  if (
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === "function"
  ) {
    try {
      await navigator.clipboard.writeText(text);
      console.log("Text copied to clipboard");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  } else {
    // 降级到 document.execCommand('copy')，如果 navigator.clipboard 不可用
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed"; // 避免在页面上滚动
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      const successful = document.execCommand("copy");
      if (successful) {
        console.log("Text copied to clipboard");
      } else {
        console.error("Failed to copy text");
      }
    } catch (err) {
      console.error("Failed to copy text: ", err);
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

function Comment({ comment }) {
  return (
    <>
      <div className={comment.isMe ? styles.CommentRevese : styles.Comment}>
        <img
          className={styles.Avatar}
          src={comment.author.avatarUrl}
          alt={comment.author.name}
        />
        <div>
          <div className={comment.isMe ? styles.nameReverse : styles.name}>
            {comment.isMe ? null : comment.author.name}
          </div>
          <div className={comment.isMe ? styles.dateReverse : styles.date}>
            {formatDate(comment.date)}
          </div>

          <div>
            <ReactMarkdown
              remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
              rehypePlugins={[
                RehypeKatex,
                [
                  RehypeHighlight,
                  {
                    detect: false,
                    ignoreMissing: true,
                  },
                ],
              ]}
              components={{
                pre: PreCode,
              }}
              linkTarget={"_blank"}
            >
              {comment.text}
            </ReactMarkdown>
            {/* <ReactMarkdown
              children={comment.text}
              remarkPlugins={[RemarkGfm]}
            /> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Comment;
