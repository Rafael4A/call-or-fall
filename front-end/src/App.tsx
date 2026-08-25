import { Box, GlobalStyles, ThemeProvider, useTheme } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { VIEWS } from "./constants";
import {
  RoomProvider,
  SnackAlertProvider,
  SocketProvider,
  useViewContext,
  ViewProvider,
} from "./contexts";
import { theme } from "./theme";
import { Home, WaitingRoom } from "./views";
import { Game } from "./views/Game";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { networkMode: "always" },
    queries: { networkMode: "always" },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <SnackAlertProvider>
          <SocketProvider>
            <Box
              sx={{
                minHeight: "100vh",
                p: 2,
                backgroundColor: (theme) => theme.palette.background.default,
              }}
            >
              <ViewProvider>
                <RoomProvider>
                  <ViewSwitcher />
                </RoomProvider>
              </ViewProvider>
            </Box>
          </SocketProvider>
        </SnackAlertProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function ViewSwitcher() {
  const theme = useTheme();
  const { view } = useViewContext();
  const { t } = useTranslation();
  const renderView = () => {
    switch (view) {
      case VIEWS.HOME:
        return <Home />;
      case VIEWS.WAITING_ROOM:
        return <WaitingRoom />;
      case VIEWS.GAME:
        return <Game />;
      default:
        return <span>{t("unexpected-view-error")}</span>;
    }
  };

  return (
    <>
      <meta name="theme-color" content={theme.palette.background.default} />
      <GlobalStyles
        // iOS 26 stopped supporting the "theme-color" meta tag
        styles={{
          "html, body": {
            backgroundColor: theme.palette.background.default,
          },
        }}
      />
      {renderView()}
    </>
  );
}

export default App;
