import {
  Button,
  Container,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { INITIAL_ROOM_OPTIONS, type RoomOptions } from "shared-code";
import { startGameRequest } from "../../api";
import { LeaveRoomButton } from "../../components";
import { useRoomContext } from "../../contexts";
import { RoomOptionsModal } from "./components";
import { ContainerStyles, SubtitleStyles } from "./WaitingRoomStyles";

export function WaitingRoom() {
  const { t } = useTranslation();

  const { room } = useRoomContext();

  const opponents = room.data?.opponents ?? [];
  const playerCount = room.data ? 1 + opponents.length : 0;

  const [showRoomOptionsModal, setShowRoomOptionsModal] = useState(false);
  const [roomOptionsToBeSet, setRoomOptionsToBeSet] =
    useState<RoomOptions>(INITIAL_ROOM_OPTIONS);

  const startGameMutation = useMutation({
    mutationFn: startGameRequest,
  });

  const handleStartGame = () => {
    startGameMutation.mutate({
      roomId: room.data?.id ?? "",
      userId: room.data?.player.id ?? "",
      roomOptions: roomOptionsToBeSet,
    });
  };

  return (
    <Container maxWidth="sm" sx={ContainerStyles()}>
      <Stack spacing={3} sx={{ width: "100%" }}>
        <Stack
          spacing={3}
          sx={{ width: "100%" }}
          direction="row"
          justifyContent="space-between"
        >
          <LeaveRoomButton />
          {room?.data?.isHost && (
            <Button
              variant="contained"
              onClick={() => setShowRoomOptionsModal(true)}
            >
              {t("room-options-button")}
            </Button>
          )}
        </Stack>

        <Paper elevation={4} sx={{ p: { xs: 3, sm: 4 }, width: "100%" }}>
          <Stack spacing={3}>
            <Stack spacing={1} alignItems="center">
              <Typography
                variant="h4"
                textAlign="center"
                sx={(theme) => ({
                  color: theme.palette.primary.main,
                })}
              >
                {t("waiting-for-players")}
              </Typography>
              <Paper elevation={2} sx={{ px: 3, py: 1.5 }}>
                <Typography
                  variant="h3"
                  sx={(theme) => ({
                    color: theme.palette.primary.main,
                    letterSpacing: "0.25rem",
                    fontWeight: 700,
                  })}
                >
                  {room.data?.id}
                </Typography>
              </Paper>
            </Stack>

            <Stack spacing={1.5}>
              <Typography
                variant="subtitle2"
                textAlign="center"
                sx={SubtitleStyles()}
              >
                {t("players-label")} ({playerCount})
              </Typography>

              {room.isLoading ? (
                <LinearProgress
                  sx={(theme) => ({
                    borderRadius: 2,
                    backgroundColor: theme.palette.progressBar.dark,
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: theme.palette.progressBar.main,
                    },
                  })}
                />
              ) : (
                <Stack spacing={1}>
                  {room.data?.player && (
                    <Paper elevation={1} sx={{ px: 2.5, py: 1.5 }}>
                      <Typography
                        sx={(theme) => ({
                          color: theme.palette.text.primary,
                          fontWeight: 600,
                        })}
                      >
                        {room.data.player.username}
                      </Typography>
                    </Paper>
                  )}
                  {opponents.map((player) => (
                    <Paper
                      key={player.username}
                      elevation={1}
                      sx={{ px: 2.5, py: 1.5 }}
                    >
                      <Typography
                        sx={(theme) => ({
                          color: theme.palette.text.primary,
                          fontWeight: 500,
                        })}
                      >
                        {player.username}
                      </Typography>
                      {player.isBot && (
                        <Typography
                          sx={(theme) => ({
                            color: theme.palette.text.secondary,
                            fontSize: "0.875rem",
                          })}
                        >
                          {t("bot-label")}
                        </Typography>
                      )}
                    </Paper>
                  ))}
                </Stack>
              )}
            </Stack>

            {room?.data?.isHost && room.data?.opponents?.length > 0 && (
              <Button
                fullWidth
                size="large"
                variant="contained"
                onClick={handleStartGame}
                disabled={startGameMutation.isPending}
                sx={(theme) => ({
                  py: 1.5,
                  fontSize: "1rem",
                  background: theme.palette.background.startGameButton,
                  boxShadow: 3,
                })}
              >
                {t("start-game")}
              </Button>
            )}
          </Stack>
        </Paper>
      </Stack>
      <RoomOptionsModal
        roomOptions={roomOptionsToBeSet}
        setRoomOptions={setRoomOptionsToBeSet}
        isVisible={showRoomOptionsModal}
        onCloseClick={() => setShowRoomOptionsModal(false)}
      />
    </Container>
  );
}
