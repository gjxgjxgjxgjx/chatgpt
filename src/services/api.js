import { getAuthorizationHeader } from "../components/common/SecretKeyManager";

function decodeHtml(html) {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

async function sendMessage(message, onmessage, onfinish) {
  const apiUrl = "https://api.openai.com/v1/chat/completions";
  const headers = {
    "Content-Type": "application/json",
    Authorization: getAuthorizationHeader(),
  };
  console.log(message);
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        stream: true,
        model: "gpt-3.5-turbo",
        messages: message,
      }),
    });

    // const responseBody = await response.json();
    console.log("唉");
    // if ("error" in responseBody) {
    //   console.log(`可能没有提供正确的secretkey: ${responseBody.error.message}`);
    //   return;
    // }
    if (!response.ok) {
      console.log(`网络错误: ${response.statusText}`);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let chunk = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      chunk += decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");
      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i];

        if (line === "data: [DONE]") {
          onfinish();
          return;
        }

        // 修改了这里，尝试解析整行数据
        const jsonLine = line.replace("data: ", "");
        try {
          const parsedData = JSON.parse(jsonLine);
          if (
            parsedData.choices &&
            parsedData.choices[0] &&
            parsedData.choices[0].delta &&
            parsedData.choices[0].delta.content
          ) {
            let content = parsedData.choices[0].delta.content;
            // content = decodeHtml(content);
            console.log(content);
            onmessage(content);
          }
        } catch (error) {
          console.log(`解析JSON数据时出错: ${error}`);
        }
      }
      chunk = lines[lines.length - 1];
    }
  } catch (error) {
    console.log(`出现未知错误: ${error}`);
  }
}

export default sendMessage;
