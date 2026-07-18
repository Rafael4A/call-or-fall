import {
  Container,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRoomContext } from "../../contexts";

export function Game() {
  const { t } = useTranslation();

  const { updateConnection, room } = useRoomContext();

  useEffect(updateConnection, [updateConnection]);

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
          {room.data?.currentPlayerName === room.data?.player.username
            ? t("your-turn")
            : t("opponent-turn")}
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
      </Paper>
    </Container>
  );
}
