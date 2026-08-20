import { Box, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CARDS_CODES } from "shared-code";
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

const queryClient = new QueryClient();

function App() {
  // TODO check if this is needed with the PWA declaration
  useEffect(() => {
    const cardImagesUrls = [
      "/resources/cards/default_webp/card-back.webp",
      ...CARDS_CODES.map(
        (code) => `/resources/cards/default_webp/${code}.webp`,
      ),
    ];

    cardImagesUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

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
  const { setView, view } = useViewContext();
  const { t } = useTranslation();
  const renderView = () => {
    switch (view) {
      case VIEWS.HOME:
        return <Home setView={setView} />;
      case VIEWS.WAITING_ROOM:
        return <WaitingRoom />;
      case VIEWS.GAME:
        return <Game />;
      default:
        return <span>{t("unexpected-view-error")}</span>;
    }
  };

  return <>{renderView()}</>;
}

export default App;
