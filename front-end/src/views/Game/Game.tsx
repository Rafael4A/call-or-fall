import { Button, Container, Paper, Stack } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { GAME_STATE, type GameState } from "shared-code";
import { LeaveRoomButton } from "../../components";
import { useRoomContext } from "../../contexts";
import { CardTable, PlayerHand, Prediction, ResultsModal } from "./components";

import { PrimaryContainerStyles, ShowScoreButtonStyles } from "./GameStyles";
import { TurnIndicator } from "./components/TurnIndicator";

export function Game() {
  const { t } = useTranslation();

  const { room } = useRoomContext();

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
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "calc(100vh - 64px)",
        py: 2,
      }}
    >
      <Stack spacing={2} sx={{ height: "100%" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <LeaveRoomButton />
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setShowScoreModal(true)}
            sx={ShowScoreButtonStyles()}
          >
            {t("show-score")}
          </Button>
        </Stack>

        <Paper elevation={4} sx={PrimaryContainerStyles()}>
          <Stack
            spacing={2}
            sx={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <TurnIndicator />

            <CardTable />

            <Prediction />

            <PlayerHand />
          </Stack>
        </Paper>
      </Stack>

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
