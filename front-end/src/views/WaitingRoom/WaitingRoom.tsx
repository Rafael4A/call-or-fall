import IosShareIcon from "@mui/icons-material/IosShare";
import PsychologyIcon from "@mui/icons-material/Psychology";
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
import { STORAGE_KEYS } from "../../constants";
import { useRoomContext, useSnackAlert } from "../../contexts";
import {
  addBotToRoom,
  getLocalRoom,
  removeBotFromRoom,
} from "../../local-game-helpers";
import { shareRoom } from "../../utils";
import { RoomOptionsModal } from "./components";
import {
  ContainerStyles,
  LargeButtonStyles,
  ShareRoomButtonStyles,
  SubtitleStyles,
} from "./WaitingRoomStyles";

export function WaitingRoom() {
  const { t } = useTranslation();
  const { openAlert } = useSnackAlert();

  const { room, isLoading } = useRoomContext();

  const isLocalGame = !!sessionStorage.getItem(STORAGE_KEYS.OFFLINE_GAME);

  const opponents = room?.opponents ?? [];
  const playerCount = room ? 1 + opponents.length : 0;

  const [showRoomOptionsModal, setShowRoomOptionsModal] = useState(false);
  const [roomOptionsToBeSet, setRoomOptionsToBeSet] =
    useState<RoomOptions>(INITIAL_ROOM_OPTIONS);

  const startGameMutation = useMutation({
    mutationFn: startGameRequest,
  });

  const handleStartGame = () => {
    startGameMutation.mutate({
      roomId: room?.id ?? "",
      userId: room?.player.id ?? "",
      roomOptions: roomOptionsToBeSet,
    });
  };

  const handleAddBot = () => {
    const _room = getLocalRoom(room?.id ?? "", room?.player.id ?? "");
    addBotToRoom(_room);
  };
  const handleRemoveBot = () => {
    const _room = getLocalRoom(room?.id ?? "", room?.player.id ?? "");
    removeBotFromRoom(_room);
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
          {room?.isHost && (
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

              {!isLocalGame && (
                <Button
                  variant="contained"
                  sx={ShareRoomButtonStyles()}
                  onClick={() => shareRoom(room?.id ?? "", openAlert, t)}
                >
                  {room?.id} <IosShareIcon />
                </Button>
              )}
            </Stack>

            <Stack spacing={1.5}>
              <Typography
                variant="subtitle2"
                textAlign="center"
                sx={SubtitleStyles()}
              >
                {t("players-label")} ({playerCount})
              </Typography>

              {isLoading ? (
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
                  {room?.player && (
                    <Paper elevation={1} sx={{ px: 2.5, py: 1.5 }}>
                      <Typography
                        sx={(theme) => ({
                          color: theme.palette.text.primary,
                          fontWeight: 600,
                        })}
                      >
                        {room?.player.username}
                      </Typography>
                    </Paper>
                  )}
                  {opponents.map((player) => (
                    <Paper
                      key={player.username}
                      elevation={1}
                      sx={{ px: 2.5, py: 1.5 }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography
                          sx={(theme) => ({
                            color: theme.palette.text.primary,
                            fontWeight: 500,
                          })}
                        >
                          {player.username}
                        </Typography>
                        {player.isBot && <PsychologyIcon />}
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              )}
            </Stack>

            {isLocalGame && (
              <Stack direction="row" spacing={2}>
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  onClick={handleRemoveBot}
                  disabled={startGameMutation.isPending}
                  sx={(theme) => LargeButtonStyles(theme.palette.error.main)}
                >
                  {t("remove-bot-button")}
                </Button>
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  onClick={handleAddBot}
                  disabled={startGameMutation.isPending}
                  sx={(theme) => LargeButtonStyles(theme.palette.success.main)}
                >
                  {t("add-bot-button")}
                </Button>
              </Stack>
            )}
            {room?.isHost && room?.opponents?.length > 0 && (
              <Button
                fullWidth
                size="large"
                variant="contained"
                onClick={handleStartGame}
                disabled={startGameMutation.isPending}
                sx={(theme) =>
                  LargeButtonStyles(theme.palette.background.startGameButton)
                }
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
