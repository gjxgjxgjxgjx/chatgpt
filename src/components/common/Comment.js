import styles from "./Comment.module.css";
import ReactMarkdown from "react-markdown";

import RemarkMath from "remark-math";
import RemarkBreaks from "remark-breaks";
import RehypeKatex from "rehype-katex";
import RemarkGfm from "remark-gfm";
import RehypeHighlight from "rehype-highlight";
import { CopyOutlined } from "@ant-design/icons";
CopyOutlined;
import { useRef, useEffect } from "react";

import ClipboardJS from "clipboard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const copyButtonRef = useRef(null);

  useEffect(() => {
    if (copyButtonRef.current) {
      const clipboard = new ClipboardJS(copyButtonRef.current, {
        text: () => ref.current.innerText,
      });

      clipboard.on("success", () => {
        // toast.success("已复制！");
      });

      clipboard.on("error", (e) => {
        toast.error("复制失败！");
      });

      return () => {
        clipboard.destroy();
      };
    }
  }, [ref]);

  return (
    <pre ref={ref}>
      <button ref={copyButtonRef} className={styles.copyBottn}></button>
      {props.children}
    </pre>
  );
}

function Comment({ comment, onCopyClick }) {
  const copyButtonRef = useRef(null);

  useEffect(() => {
    if (copyButtonRef.current) {
      const clipboard = new ClipboardJS(copyButtonRef.current, {
        text: () => comment.text,
      });

      clipboard.on("success", () => {
        // toast.success("已复制！");
      });

      clipboard.on("error", (e) => {
        toast.error("复制失败！");
      });

      return () => {
        clipboard.destroy();
      };
    }
  }, [comment]);
  return (
    <div>
      <ToastContainer
        toastClassName={styles.centeredToastText}
        hideProgressBar
      />
      <button
        className={styles.copyTextBottn}
        ref={copyButtonRef}
        onClick={() => {
          // onCopyClick(comment.texcopyTextBottnt);  //将内容放在输入框
        }}
      >
        复制
        <CopyOutlined />
      </button>
      <button
        className={styles.copyTextBottn}
        // ref={copyButtonRef}
        onClick={() => {
          onCopyClick(comment.text); //将内容放在输入框
        }}
      >
        复制到输入框
        <CopyOutlined />
      </button>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comment;
