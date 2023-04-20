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
            // code = code.substring(2); // 删除前两个字符，即 "复制" 两字
            copyToClipboard(code);
          }
        }}
      ></button>
      {props.children}
    </pre>
  );
}

async function copyToClipboard(text) {
  try {
    const permissionStatus = await navigator.permissions.query({
      name: "clipboard-write",
    });
    if (
      permissionStatus.state === "granted" ||
      permissionStatus.state === "prompt"
    ) {
      /* 执行复制粘贴操作 */
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        console.log("Text copied to clipboard");
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand("copy");
          console.log("Text copied to clipboard");
        } catch (err) {
          console.error("Failed to copy: ", err);
        }
        document.body.removeChild(textArea);
      }
    } else {
      console.error("Permission to access clipboard denied");
    }
  } catch (err) {
    console.error("Permission query failed: ", err);
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
