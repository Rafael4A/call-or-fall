import { Box, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme} defaultMode="light">
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
  const renderView = () => {
    switch (view) {
      case VIEWS.HOME:
        return <Home setView={setView} />;
      case VIEWS.WAITING_ROOM:
        return <WaitingRoom />;
      case VIEWS.GAME:
        return <Game />;
      default:
        return <span>UNEXPECTED ERROR - (UNKNOWN VIEW)</span>;
    }
  };

  return <>{renderView()}</>;
}

export default App;
