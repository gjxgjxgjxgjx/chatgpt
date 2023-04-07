import Comment from "./Comment";
import InputBox from "./InputBox";
import style from "./ChatBox.module.css";

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

  async function send_message(inputValue, systemComment) {
    const message = createMessage(inputValue, comments, props.chatType);
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

      // 使用函数式更新来保证获取到最新的 comments 状态值
      setComments((prevComments) => {
        const updatedComments = [...prevComments];
        const index = updatedComments.findIndex(
          (comment) => comment.id === systemComment.id
        );
        console.debug(prevComments);
        updatedComments[index].text = content;

        return updatedComments;
      });

      console.debug(content);
    } catch (error) {
      console.error(error);
    }
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
      text: "稍等一下，我正在努力打字哦！",
      author: {
        name: "小星星",
        avatarUrl: "https://placekitten.com/g/64/64",
      },
    };
    newComments.push(comment);
    setComments([...newComments]);
    newComments.push(systemComment);
    setTimeout(() => {
      setComments(newComments);
    }, 300);

    send_message(inputValue, systemComment);
  }

  return (
    <>
      <div className={style.container}>
        <div className={style.topBar}>
          <button onClick={() => window.history.back()}>返回</button>
        </div>x 
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
