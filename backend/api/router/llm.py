from api.services.llm import LlmService
from fastapi import APIRouter, HTTPException, WebSocket

router = APIRouter()


@router.on_event("startup")
async def startup_event():
    global service
    service = LlmService()


@router.get("/")
async def read_root(input: str):
    global service
    if service is not None:
        return {"speaker": "bot", "text": service.get_inference_result_as_rest(input)}
    else:
        raise HTTPException(status_code=500, detail="Service not available")


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        print("WebSocket Data: ", data)
        await service.get_inference_result_as_ws(data, websocket)
        print("WebSocket Success!")
