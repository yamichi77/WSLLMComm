import { AppBar, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { ReactNode } from "react";

const drawerWidth = 240;

type Props = {
  children: ReactNode;
};

export const LayoutPresenter = ({ children }: Props) => {
  const {
    mixins: { toolbar },
  } = useTheme();

  return (
    <Box sx={{ display: "flex", width: "100vw", height: "100vh" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          ml: `${drawerWidth}px`,
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            LLMテストページ
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${drawerWidth}px)`,
        }}
      >
        <Toolbar />
        <Box
          height={`calc(100dvh - (${toolbar?.minHeight}px + ${48}px + ${8}px))`}
          width="100%"
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
