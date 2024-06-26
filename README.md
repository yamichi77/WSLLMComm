# WSLLMComm

## 概要

LLM で生成したものを WebSocket 経由で React で受け取るアプリケーションになります。
![generateImage](https://github.com/yamichi77/WSLLMComm/assets/136456737/0f500a1f-f52c-48ff-879d-bc5b58603f22)

## 使用方法

### 想定環境

- Docker がインストール済み
- RTX20 以上の VRAM が 8GB 以上の GPU を搭載済み

### 起動方法

1. 次のコマンドで Docker を起動します。  
   `docker compose up -d`
2. docker 起動後、下記 url にアクセスします。  
   `http://localhost:5173/`
3. 下記チャット記入欄より送りたい文字を入力し、送信します。（初回は時間がかかります。）
   1. 左側のプルダウンでレスポンスの方法を変えることができます。
      1. REST：RESTfulAPI のように生成物が一括で帰ってくる方式。
      2. WebSocket：生成した細かい単位ごとに生成物が帰ってくる方式。
4. 生成物が送られてくると画面上に回答が表示されます。

## 使用技術

| ライブラリ   | バージョン  |
| ------------ | ----------- |
| Python       | 3.11        |
| Pytorch      | 2.0.1+cu117 |
| transformers | 4.41.1      |
| FastAPI      | 0.111.0     |
| uvicorn      | 0.30.0      |
| React        | 18.2.0      |
| TypeScript   | 5.2.2       |
| Vite         | 5.2.0       |
| MUI          | 5.15.19     |
| axios        | 1.7.2       |

## 各種リンク

| URL      | Port | 説明                                                      |
| -------- | ---- | --------------------------------------------------------- |
| /?input= | 8000 | REST のレスポンスになります。input にテキストを入れます。 |
| /docs    | 8000 | FastAPI の Swagger ページになります。                     |
| /ws      | 8000 | WebSocket の URL になります。                             |
| /        | 5173 | フロントエンドページの画面になります。                    |
