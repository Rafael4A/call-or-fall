import {
  Button,
  Container,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { startGameRequest } from "../../api";
import { useRoomContext } from "../../contexts";

export function WaitingRoom() {
  const { t } = useTranslation();

  const { updateConnection, room } = useRoomContext();

  useEffect(updateConnection, [updateConnection]);

  const handleStartGameSuccess = () => {
    console.log("Game started successfully");
  };

  const startGameMutation = useMutation({
    mutationFn: startGameRequest,
    onSuccess: handleStartGameSuccess,
  });

  const handleStartGame = () => {
    startGameMutation.mutate({
      roomId: room.data!.id,
      userId: room.data!.player.id,
    });
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4 }}>
        <Typography
          component="h1"
          variant="h4"
          textAlign="center"
          fontWeight="400"
          sx={{ mb: 2 }}
        >
          {t("room-code")}: {room.data!.id}
        </Typography>

        <Typography
          textAlign="center"
          component="h2"
          variant="h5"
          sx={{ mb: 2 }}
        >
          {t("waiting-for-players")}
        </Typography>

        <Stack direction="column" spacing={2} sx={{ mb: 4 }}>
          {room.isLoading ? (
            <LinearProgress />
          ) : (
            room.data?.opponents.map((player) => (
              <Typography key={player.username} textAlign="center">
                {player.username}
                {player.isBot ? " 🤖" : ""}
              </Typography>
            ))
          )}
        </Stack>

        {room?.data?.isHost && room.data?.opponents?.length > 0 && (
          <Button variant="contained" onClick={handleStartGame}>
            {t("start-game")}
          </Button>
        )}
      </Paper>
    </Container>
  );
}
