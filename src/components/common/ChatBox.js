import Comment from "./Comment";
import InputBox from "./InputBox";
import style from "./ChatBox.module.css";

import sendMessage from "../../services/api";
import { useState, useRef, useEffect } from "react";
import { createMessage } from "../../utils/chatUtils";
import { getAuthorizationHeader } from "./SecretKeyManager";

export default function ChatBox(props) {
  const apiUrl = props.unlimited
    ? "https://api.openai.com/v1/chat/completions"
    : "https://api.openai.com/v1/chat/completions";

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
  const [comments, setComments] = useState([initComments]);
  const [messageId, setMessageId] = useState(1);
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

      console.debug(content);
    } catch (error) {
      console.error(error);
      let content = "错误，请重试";

      const updatedComments = [...newComments];
      updatedComments[index].text = content;
      setComments(updatedComments);
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

    sendMessage(message, (content) => {
      console.log("pre" + newComments[index].text);
      console.log(content);

      const updatedComments = [...newComments];
      updatedComments[index].text += content;
      setComments(updatedComments);
    });
  }
  async function send_message_stream1(
    inputValue,
    preComments,
    systemCommentId
  ) {
    const streamApiUrl = "https://flask-gpt-mjdg.vercel.app/chat_stream";
    // const streamApiUrl = "http://127.0.0.1:5000/chat_stream"
    const message = JSON.stringify(
      createMessage(inputValue, comments.slice(1), props.chatType)
    );
    const source = new EventSource(
      streamApiUrl +
        `?message=${encodeURIComponent(message)}&api_key=${encodeURIComponent(
          getAuthorizationHeader()
        )}`,
      {
        withCredentials: false,
        bufferSize: 1024 * 1024,
      }
    );

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

    source.onmessage = function (event) {
      const data = JSON.parse(event.data);
      const content = data.text;

      console.log("pre" + newComments[index].text);
      console.log(content);

      const updatedComments = [...newComments];
      updatedComments[index].text += content;
      setComments(updatedComments);
    };

    source.onerror = function () {
      source.close();
      // let content = "错误，请重试";
      //
      // const updatedComments =[...newComments]
      // updatedComments[index].text = content;
      // setComments(updatedComments)
    };
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

    const systemComment = {
      id: id,
      isMe: false,
      isSystem: true,
      date: new Date(),
      text: "好的！",
      author: {
        name: "小星星",
        avatarUrl: "https://placekitten.com/g/64/64",
      },
    };
    newComments.push(comment);
    setComments([...newComments]);
    // newComments.push(systemComment);
    // setComments(newComments);

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
              width: "100vh", //设置容器宽度为视口高度，以使水平居中生效
            }}
          >
            当前模式：{props.chatType}
          </p>
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
