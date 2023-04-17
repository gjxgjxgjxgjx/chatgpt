import Comment from "./Comment";
import InputBox from "./InputBox";
import style from "./ChatBox.module.css";

import sendMessage from "../../services/api";
import { useState, useRef, useEffect } from "react";
import { createMessage } from "../../utils/chatUtils";
import { getAuthorizationHeader } from "./SecretKeyManager";

export default function ChatBox(props) {
  const apiUrl = "https://api.openai.com/v1/chat/completions";

  const initComments = {
    id: 1,
    isMe: false,
    date: new Date(),
    text: "嗨！我是小星星，我可以帮你回答各种各样的问题，无论是关于学习、娱乐还是日常生活的问题，都可以向我提问。如果你有任何需要，别犹豫，快来和我聊天吧！",
    author: {
      name: "我",
      avatarUrl: "https://placekitten.com/g/64/64",
    },
  };
  function getStoredComments() {
    // 从本地存储中获取comments
    function parseCommentDates(comments) {
      for (let comment of comments) {
        if (comment.date) {
          comment.date = new Date(comment.date); // 将日期字符串转换为日期对象
        }
      }
      return comments;
    }

    const storedCommentsNodates = JSON.parse(
      localStorage.getItem("comments" + props.chatType)
    );
    // 如果存储的comments不存在，则返回一个空的列表
    if (!storedCommentsNodates) {
      return [initComments];
    }
    const storedComments = parseCommentDates(storedCommentsNodates);

    // 否则返回存储的comments
    return storedComments;
  }

  const historys = getStoredComments();
  const lastComment = historys[historys.length - 1];
  const lastCommentId = lastComment.id;

  // const [comments, setComments] = useState([initComments]);
  const [comments, setComments] = useState(historys);
  const [messageId, setMessageId] = useState(lastCommentId + 1);
  const chatBoxRef = useRef(null);
  const useStream = localStorage.getItem("useStream") === "true";

  useEffect(() => {
    if (chatBoxRef.current) {
      scrollToBottom();
    }
  }, [comments]);

  function scrollToBottom() {
    chatBoxRef.current.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  }

  async function send_message(inputValue, preComments, systemCommentId) {
    const message = createMessage(
      inputValue,
      comments.slice(1),
      props.chatType
    );

    const systemComment = {
      id: systemCommentId,
      isMe: false,
      isSystem: true,
      date: new Date(),
      text: "正在打字中！\n",
      author: {
        name: "小星星",
        avatarUrl: "https://placekitten.com/g/64/64",
      },
    };
    const newComments = preComments.slice();
    newComments.push(systemComment);
    setComments(newComments);

    const index = newComments.findIndex(
      (comment) => comment.id === systemComment.id
    );

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: getAuthorizationHeader(),
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: message,
        }),
      });

      const data = await response.json();
      let content = data.choices[0].message.content;

      const updatedComments = [...newComments];
      updatedComments[index].text = content;
      setComments(updatedComments);

      // 将更新后的comments存储在本地
      localStorage.setItem(
        "comments" + props.chatType,
        JSON.stringify(updatedComments)
      );

      console.debug(content);
    } catch (error) {
      console.error(error);
      let content = "错误，请重试";

      const updatedComments = [...newComments];
      updatedComments[index].text = content;
      setComments(updatedComments);
      // 将更新后的comments存储在本地
      localStorage.setItem(
        "comments" + props.chatType,
        JSON.stringify(updatedComments)
      );
    }
  }

  async function send_message_stream(inputValue, preComments, systemCommentId) {
    const systemComment = {
      id: systemCommentId,
      isMe: false,
      isSystem: true,
      date: new Date(),
      text: "好的！",
      author: {
        name: "小星星",
        avatarUrl: "https://placekitten.com/g/64/64",
      },
    };
    const newComments = preComments.slice();
    newComments.push(systemComment);
    setComments(newComments);

    const index = newComments.findIndex(
      (comment) => comment.id === systemComment.id
    );

    const message = createMessage(
      inputValue,
      comments.slice(1),
      props.chatType
    );

    sendMessage(
      message,
      (content) => {
        console.log("pre" + newComments[index].text);
        console.log(content);

        const updatedComments = [...newComments];
        updatedComments[index].text += content;
        setComments(updatedComments);
      },
      () => {
        console.log("完成，将存储在本地");
        // 将更新后的comments存储在本地
        localStorage.setItem(
          "comments" + props.chatType,
          JSON.stringify(newComments)
        );
      }
    );
  }

  function onSendClicked(inputValue) {
    const id = messageId + 1;
    setMessageId(id);
    const comment = {
      id: id + 10000,
      isMe: true,
      date: new Date(),
      text: inputValue,
      author: {
        name: "我",
        avatarUrl: "https://placekitten.com/g/64/64",
      },
    };
    const newComments = comments.slice();

    newComments.push(comment);
    setComments([...newComments]);

    if (!useStream) {
      send_message(inputValue, newComments, id);
    } else {
      send_message_stream(inputValue, newComments, id);
    }
  }

  return (
    <>
      <div className={style.container}>
        <div className={style.topBar}>
          <button
            style={{
              display: "flex",
              justifyContent: "left",

              whiteSpace: "nowrap",
            }}
            onClick={() => {
              if (window.location.pathname === "/") {
                window.history.back();
              } else {
                window.location.href = "/";
              }
            }}
          >
            返回
          </button>

          <p
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100vw", //设置容器宽度为视口高度，以使水平居中生效
            }}
          >
            当前模式：{props.chatType}
          </p>

          <button
            style={{
              display: "flex",
              justifyContent: "right",
              whiteSpace: "nowrap",
            }}
            onClick={() => {
              localStorage.removeItem("comments" + props.chatType);
              setComments([]);
            }}
          >
            清空消息
          </button>
        </div>
        <div ref={chatBoxRef} className={style.ChatBoxWrapper}>
          <div className={style.ChatBox}>
            {comments.map((comment, index) => {
              const className = comment.isMe
                ? style.myComment
                : style.otherComment;
              return (
                <div key={comment.id + 1} className={className}>
                  <Comment comment={comment} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className={style.inputBoxWrapper}>
        <InputBox onClick={onSendClicked} />
      </div>
    </>
  );
}
