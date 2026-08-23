import { Button, Container, Paper, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GAME_STATE, type GameState } from "shared-code";
import { LeaveRoomButton } from "../../components";
import { useRoomContext } from "../../contexts";
import {
  CardTable,
  PlayerHand,
  Prediction,
  ResultsModal,
  TurnIndicator,
} from "./components";

import { PrimaryContainerStyles, ShowScoreButtonStyles } from "./GameStyles";

export function Game() {
  const { t } = useTranslation();

  const { room } = useRoomContext();

  const currentGameState = room?.gameState;
  const [showScoreModal, setShowScoreModal] = useState(false);

  useEffect(() => {
    const showScoreModalGameState = (
      [GAME_STATE.TrickOver, GAME_STATE.GameOver, GAME_STATE.RoundOver] as (
        | GameState
        | undefined
      )[]
    ).includes(currentGameState);

    if (showScoreModalGameState) {
      const timer = setTimeout(() => {
        setShowScoreModal(true);
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      setShowScoreModal(false);
    }
  }, [currentGameState]);

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
        room={room} //TODO CORRIGIR
        onCloseClick={() => {
          setShowScoreModal(false);
        }}
      />
    </Container>
  );
}
