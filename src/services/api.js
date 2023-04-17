import { getAuthorizationHeader } from "../components/common/SecretKeyManager";

async function sendMessage(message, onmessage) {
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
          console.log("Chat session ended.");
          return;
        }

        const pattern = /"content":"(.+?)"/;
        const match = line.match(pattern);

        if (match) {
          const content = match[1]
            .replace(/\\n/g, "\n")
            .replace(/\\t/g, "\t")
            .replace(/\\r/g, "\r")
            .replace(/\\b/g, "\b")
            .replace(/\\f/g, "\f")
            .replace(/\\'/g, "'")
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, "\\");
          console.log(content);
          onmessage(content);
        }
      }
      chunk = lines[lines.length - 1];
    }
  } catch (error) {
    console.log(`出现未知错误: ${error}`);
  }
}

export default sendMessage;
