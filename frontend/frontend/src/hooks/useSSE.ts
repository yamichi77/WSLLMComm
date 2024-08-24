import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useCallback } from "react";

export const useSSE = () => {
  const getLlmPromptFromSSE = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (text: string, onMessage: any) => {
      const url = `http://localhost:8000/stream?input=${encodeURIComponent(
        text
      )}`;
      await fetchEventSource(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
        },
        onmessage: (event) => {
          onMessage(JSON.parse(event.data));
        },
        onerror: (error) => {
          console.error("Error in EventSource connection:", error);
          window.alert("An error occurred. Reloading page.");
          window.location.reload();
        },
      });
    },
    []
  );
  return { getLlmPromptFromSSE };
};
