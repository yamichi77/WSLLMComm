import { SelectChangeEvent } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Layout } from "../../components/layout/container";
import { useAPI } from "../../hooks/useAPI";
import { useWebSocket } from "../../hooks/useWebSocket";
import { LlmTextDto } from "../../types/LlmTextDto";
import { IndexPagePresenter } from "./presenter";

export const IndexPage = () => {
  const { getLlmPrompt } = useAPI();
  const { getWs } = useWebSocket();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [sendType, setSendType] = useState<string>("WS");
  const [llmText, setLlmText] = useState<string>("");
  const [responseText, setResponseText] = useState<string>("");
  const responseTextRef = useRef<string>("");
  const [llmTextList, setLlmList] = useState<LlmTextDto[]>([]);
  const [isSendButtonDisabled, setIsSendButtonDisabled] =
    useState<boolean>(false);
  const handleSetLlmText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLlmText(e.target.value);
  };
  const handleGetLlmText = async () => {
    setLlmText("");
    setIsSendButtonDisabled(true);
    setLlmList((llmTextList) => [
      ...llmTextList,
      { speaker: "user", text: llmText },
    ]);
    if (sendType === "REST") {
      const reponse = await getLlmPrompt(llmText);
      setLlmList((llmTextList) => [...llmTextList, reponse]);
      setIsSendButtonDisabled(false);
    } else if (ws && ws.readyState === WebSocket.OPEN) {
      ws?.send(llmText);
    }
  };
  const handleSendType = (e: SelectChangeEvent) => {
    setSendType(e.target.value);
  };
  useEffect(() => {
    const ws = getWs();
    ws.onmessage = (event) => {
      const message = event.data;
      if (message === "<|ENDTEXT|>") {
        const text = responseTextRef.current;
        setLlmList((llmTextList) => [
          ...llmTextList,
          { speaker: "bot", text: text },
        ]);
        responseTextRef.current = "";
        setResponseText("");
        setIsSendButtonDisabled(false);
        return;
      }
      responseTextRef.current += message;
      setResponseText(responseTextRef.current);
    };
    setWs(ws);
    return () => {
      ws.close();
    };
  }, [getWs]);
  return (
    <Layout>
      <IndexPagePresenter
        onChangeLlmText={handleSetLlmText}
        onChangeSendType={handleSendType}
        onClickSendLlmText={handleGetLlmText}
        isSendButtonDisabled={isSendButtonDisabled}
        selectSendType={sendType}
        llmText={llmText}
        responseText={responseText}
        llmTextList={llmTextList}
      />
    </Layout>
  );
};
