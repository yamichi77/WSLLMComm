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
  const [responseTextTmp, setResponseTextTmp] = useState<string>("");
  const [isAddingText, setIsAddingText] = useState(false);
  const [isTextEnd, setIsTextEnd] = useState(false);
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
      const contents = JSON.parse(event.data);
      switch (contents.type) {
        case "END":
          setLlmList((llmTextList) => [
            ...llmTextList,
            { speaker: "bot", text: responseTextRef.current },
          ]);
          responseTextRef.current = "";
          setResponseText("");
          setIsSendButtonDisabled(false);
          setIsTextEnd(true);
          break;
        case "TEXT":
          if (responseTextRef.current == "") setResponseText("");
          responseTextRef.current += contents.msg;
          setResponseTextTmp((prev) => prev + contents.msg);
          break;
        case "LOAD":
        case "PARAM":
          setResponseText(contents.msg);
          break;
      }
    };
    setWs(ws);
    return () => {
      ws.close();
    };
  }, [getWs]);
  useEffect(() => {
    const addTextOneByOne = async (text: string) => {
      if (isAddingText) return;
      setResponseTextTmp("");
      setIsAddingText(true);
      for (const char of text) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        setResponseText((prev) => prev + char);
      }
      setIsAddingText(false);
      if (isTextEnd) {
        setIsTextEnd(false);
        setResponseText("");
      }
    };

    addTextOneByOne(responseTextTmp);
  }, [responseTextTmp, isAddingText, isTextEnd]);
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
