import axios, { AxiosError, AxiosResponse } from "axios";
import { useCallback, useMemo } from "react";
import { LlmTextDto } from "../types/LlmTextDto";

export const useAPI = () => {
  const apiAxios = useMemo(() => {
    const apiAxios = axios.create({
      headers: {
        "Content-type": "Application/json",
        "Access-Control-Allow-Origin": "*",
        Accept: "Application/json",
      },
    });
    apiAxios.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.alert((error.response!.data as any).detail);
        window.location.reload();
        return Promise.reject(error);
      }
    );
    return apiAxios;
  }, []);

  const getLlmPrompt = useCallback(
    async (text: string): Promise<LlmTextDto> => {
      const url = "http://localhost:8000/";
      return apiAxios
        .get(url, {
          params: new URLSearchParams({
            input: text,
          }),
        })
        .then((response) => {
          return response.data;
        });
    },
    [apiAxios]
  );

  return { getLlmPrompt };
};
