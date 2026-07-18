import {
  Button,
  Container,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRoomContext } from "../../contexts";
import { Prediction } from "./components";

export function Game() {
  const { t } = useTranslation();

  const { updateConnection, room } = useRoomContext();

  useEffect(updateConnection, [updateConnection]);

  const isCurrentPlayer =
    room.data?.currentPlayerName === room.data?.player.username;

  const handlePlayCard = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log(event);
    console.log(event.target);
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
          {isCurrentPlayer ? t("your-turn") : t("opponent-turn")}
        </Typography>

        <Stack direction="column" spacing={2} sx={{ mb: 4 }}>
          {room.isLoading ? (
            <LinearProgress />
          ) : (
            <>
              {room.data?.table.map((card, index) => (
                <Typography key={index} textAlign="center">
                  {card}
                </Typography>
              ))}

              <Prediction />

              <hr />

              {room.data?.player.cards.map((card) => (
                // TODO - THINK OF A BETTER KEY SINCE CARDS CAN BE DUPLICATES WHEN MULTIPLE DECKS ARE USED
                <Button variant="contained" key={card} onClick={handlePlayCard}>
                  {card}
                </Button>
              ))}
            </>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}
