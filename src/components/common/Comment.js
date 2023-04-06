import styles from "./Comment.module.css";
import ReactMarkdown from "react-markdown";
import Remarkable from "remarkable";
import remarkGfm from "remark-gfm";

var md = new Remarkable();
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
              children={comment.text}
              remarkPlugins={[remarkGfm]}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Comment;
