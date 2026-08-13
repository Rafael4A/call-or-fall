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
import { GAME_STATE, type CardCode, type GameState } from "shared-code";
import { playCardRequest } from "../../api";
import { CardImage, LeaveRoomButton } from "../../components";
import { useRoomContext } from "../../contexts";
import { Prediction } from "./components";
import { ResultsModal } from "./components/ResultsModal";

export function Game() {
  const { t } = useTranslation();

  const { room } = useRoomContext();

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

  const currentGameState = room.data?.gameState;
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [lastSeenGameState, setLastSeenGameState] = useState(currentGameState);

  const showScoreModalGameState = (
    [GAME_STATE.TurnOver, GAME_STATE.GameOver, GAME_STATE.RoundOver] as (
      | GameState
      | undefined
    )[]
  ).includes(currentGameState);

  if (currentGameState !== lastSeenGameState) {
    setLastSeenGameState(currentGameState);
    setShowScoreModal(showScoreModalGameState);
  }

  return (
    <Container maxWidth="md">
      <LeaveRoomButton />
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
        <Button onClick={() => setShowScoreModal(true)}>
          {t("show-score")}
        </Button>
        <Stack direction="column" spacing={2} sx={{ mb: 4 }}>
          {room.isLoading ? (
            <LinearProgress />
          ) : (
            <>
              {room.data?.table.map((tableCard) => (
                <div key={tableCard.owner}>
                  <CardImage cardCode={tableCard.card} />- {tableCard.owner}
                </div>
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
                  <CardImage cardCode={card} />
                </Button>
              ))}
            </>
          )}
        </Stack>
      </Paper>
      <ResultsModal
        isVisible={showScoreModal}
        room={room.data}
        onCloseClick={() => {
          setShowScoreModal(false);
        }}
      />
    </Container>
  );
}
