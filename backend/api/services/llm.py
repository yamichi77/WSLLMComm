import asyncio
import json
from threading import Thread

import torch
from fastapi import WebSocket
from transformers import (AutoModelForCausalLM, AutoTokenizer,
                          TextIteratorStreamer)


class LlmService:
    def __init__(self):
        self.tokenizer = None
        self.model = None

    def get_inference_result(self, str: str):
        yield "<|LOAD|>"
        if self.model is None:
            self.set_llm()
        yield "<|PARAM|>"
        chat = [
            {"role": "user", "content": str},
        ]
        prompt = self.tokenizer.apply_chat_template(
            chat, tokenize=False, add_generation_prompt=True
        )
        token_ids = self.tokenizer.encode(
            prompt, add_special_tokens=False, return_tensors="pt"
        )
        streamer = TextIteratorStreamer(
            self.tokenizer, skip_prompt=True, skip_special_tokens=False
        )
        generation_kwargs = dict(
            input_ids=token_ids.to(self.model.device),
            do_sample=True,
            temperature=0.6,
            max_new_tokens=256,
            streamer=streamer,
        )
        with torch.no_grad():
            thread = Thread(target=self.model.generate, kwargs=generation_kwargs)
            thread.start()
        yield from streamer

    def set_llm(self):
        self.model = AutoModelForCausalLM.from_pretrained(
            "microsoft/Phi-3-mini-128k-instruct",
            device_map="cuda",
            torch_dtype="auto",
            trust_remote_code=True,
            load_in_4bit=True,
        )
        self.tokenizer = AutoTokenizer.from_pretrained(
            "microsoft/Phi-3-mini-128k-instruct"
        )

    def get_inference_result_as_rest(self, input: str) -> str:
        streamer = self.get_inference_result(input)
        output = ""
        for text in streamer:
            if text == "<|LOAD|>" or text == "<|PARAM|>":
                continue
            output += text
        return output

    async def get_inference_result_as_ws(self, input: str, ws: WebSocket) -> None:
        streamer = self.get_inference_result(input)
        for text in streamer:
            if text == "<|LOAD|>":
                type = "LOAD"
                msg = "モデルをロード中です。"
            elif text == "<|PARAM|>":
                type = "PARAM"
                msg = "パラメータを設定中です。"
            else:
                type = "TEXT"
                msg = text.split("\n")
            if len(msg) <= 1 and msg[0] == "":
                continue
            contents = json.dumps({"type": type, "msg": msg}, ensure_ascii=False)
            await ws.send_text(contents)
            await asyncio.sleep(0)
        await ws.send_text(json.dumps({"type": "END", "msg": ""}, ensure_ascii=False))

    async def get_inference_result_as_sse(self, input: str):
        streamer = self.get_inference_result(input)
        for text in streamer:
            if text == "<|LOAD|>":
                type = "LOAD"
                msg = "モデルをロード中です。"
            elif text == "<|PARAM|>":
                type = "PARAM"
                msg = "パラメータを設定中です。"
            else:
                type = "TEXT"
                msg = text.split("\n")
            if len(msg) <= 1 and msg[0] == "":
                continue
            contents = json.dumps({"type": type, "msg": msg}, ensure_ascii=False)
            yield f"data: {contents}\n\n"
            await asyncio.sleep(0)
        yield f"data: {json.dumps({'type': 'END', 'msg': ''}, ensure_ascii=False)}\n\n"
