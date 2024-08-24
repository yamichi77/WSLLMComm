import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { LlmTextDto } from "../../types/LlmTextDto";

const drawerWidth = 240;

type Props = {
  onChangeLlmText: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeSendType: (e: SelectChangeEvent) => void;
  onClickSendLlmText: () => void;
  isSendButtonDisabled: boolean;
  selectSendType: string;
  llmText: string;
  responseText: string;
  llmTextList: LlmTextDto[];
};

export const IndexPagePresenter = ({
  onChangeLlmText,
  onChangeSendType,
  onClickSendLlmText,
  isSendButtonDisabled,
  selectSendType,
  llmText,
  responseText,
  llmTextList,
}: Props) => {
  const condition = (
    <Box
      width={drawerWidth}
      marginRight={3}
      p={1}
      height={"100%"}
      sx={{ overflowY: "auto", overflowX: "hidden" }}
    >
      <Select value={selectSendType} onChange={onChangeSendType}>
        <MenuItem value={"REST"}>REST</MenuItem>
        <MenuItem value={"WS"}>WebSocket</MenuItem>
        <MenuItem value={"SSE"}>SSE</MenuItem>
      </Select>
    </Box>
  );
  const ChatFrame = ({ isUser, text }: { isUser: boolean; text: string }) => (
    <Box
      alignContent={"center"}
      display={"flex"}
      alignItems={"top"}
      flexDirection={isUser ? "row-reverse" : "row"}
    >
      <Box
        sx={{
          backgroundColor: isUser ? "lightgreen" : "lightblue",
          "&::after": {
            content: '""',
            border: "15px solid transparent",
            borderTopColor: isUser ? "lightgreen" : "lightblue",
            position: "absolute",
            left: isUser ? "" : "-15px",
            right: isUser ? "-15px" : "",
            top: "10px",
          },
        }}
        position={"relative"}
        textAlign={"left"}
        borderRadius={"12px"}
        padding={"10px 20px"}
        margin={"10px 20px"}
      >
        {!isUser && !text && <CircularProgress color="secondary" />}

        {text}
      </Box>
    </Box>
  );
  return (
    <Box display={"flex"} height={"100%"}>
      <Box>{condition}</Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        height={"100%"}
        width={`calc(100% - ${drawerWidth}px)`}
        border={"0.1rem solid lightgray"}
        borderRadius={3}
        overflow={"hidden"}
      >
        <Box
          flexGrow={1}
          display={"flex"}
          padding={2}
          flexDirection={"column"}
          sx={{ overflowY: "auto", overflowX: "hidden" }}
        >
          {llmTextList.map((llmText) => (
            <ChatFrame
              isUser={llmText.speaker === "user"}
              text={llmText.text}
            />
          ))}
          {isSendButtonDisabled && (
            <ChatFrame isUser={false} text={responseText} />
          )}
        </Box>
        <Box
          borderTop={"1px solid lightgray"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          padding={"5px 10px"}
        >
          <Box
            border={"1px solid lightgray"}
            borderRadius={12}
            width={"100%"}
            padding={"0 30px"}
          >
            <TextField
              variant="standard"
              sx={{ width: "100%", marginBottom: "6px" }}
              multiline
              value={llmText}
              onChange={onChangeLlmText}
            ></TextField>
          </Box>
          <Button disabled={isSendButtonDisabled} onClick={onClickSendLlmText}>
            <SendIcon />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
