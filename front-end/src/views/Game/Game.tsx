import {
  Box,
  Button,
  Container,
  LinearProgress,
  Modal,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useId } from "react";
import { useTranslation } from "react-i18next";
import { GAME_STATE, type CardCode, type GameState } from "shared-code";
import { playCardRequest } from "../../api";
import { useRoomContext } from "../../contexts";
import { Prediction } from "./components";

export function Game() {
  const baseId = useId();
  const { t } = useTranslation();

  const { updateConnection, room } = useRoomContext();

  useEffect(updateConnection, [updateConnection]);

  const isCurrentPlayer =
    room.data?.currentPlayerName === room.data?.player.username;

  const handlePlayCardSuccess = () => {
    console.log("Card played successfully");
  };

  const playCardMutation = useMutation({
    mutationFn: playCardRequest,
    onSuccess: handlePlayCardSuccess,
  });

  const handlePlayCard = (card: CardCode) => {
    playCardMutation.mutate({
      roomId: room.data?.id ?? "",
      userId: room.data?.player.id ?? "",
      card,
    });
  };

  const showScoreModal = (
    [GAME_STATE.TurnOver, GAME_STATE.GameOver, GAME_STATE.RoundOver] as (
      | GameState
      | undefined
    )[]
  ).includes(room.data?.gameState);

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
              {room.data?.table.map((tableCard, index) => (
                <Typography key={index} textAlign="center">
                  {tableCard.card} - {tableCard.owner}
                </Typography>
              ))}

              <Prediction />

              <hr />

              {room.data?.player.cards.map((card) => (
                // TODO - THINK OF A BETTER KEY SINCE CARDS CAN BE DUPLICATES WHEN MULTIPLE DECKS ARE USED
                <Button
                  variant="contained"
                  key={card}
                  onClick={() => handlePlayCard(card)}
                  disabled={
                    !isCurrentPlayer ||
                    playCardMutation.isPending ||
                    room.data?.gameState !== GAME_STATE.Playing
                  }
                >
                  {card}
                </Button>
              ))}
            </>
          )}
        </Stack>
      </Paper>
      <Modal
        open={showScoreModal}
        aria-labelledby={`${baseId}-modal-title`}
        aria-describedby={`${baseId}-modal-description`}
      >
        <Box>
          <h2 id={`${baseId}-modal-title`}>My Title</h2>
          <p id={`${baseId}-modal-description`}>My Description</p>
        </Box>
      </Modal>
    </Container>
  );
}
