import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { GAME_STATE, type GameState } from "shared-code";
import { useRoomContext } from "../../../contexts";

function getTranslationKey(isCurrentPlayer: boolean, gameState?: GameState) {
  switch (gameState) {
    case GAME_STATE.RoundOver:
      return "round-over";
    case GAME_STATE.GameOver:
      return "game-over";
    case GAME_STATE.TurnOver:
      return "turn-over";
    default:
      return isCurrentPlayer ? "your-turn" : "opponent-turn";
  }
}

export function TurnIndicator() {
  const { t } = useTranslation();

  const { room } = useRoomContext();

  const isCurrentPlayer =
    room?.currentPlayerName === room?.player.username;

  const stateTranslationKey = getTranslationKey(
    isCurrentPlayer,
    room?.gameState,
  );

  return (
    <Stack spacing={1} alignItems="center">
      <Typography
        variant="h5"
        sx={(theme) => ({
          color: isCurrentPlayer
            ? theme.palette.primary.main
            : theme.palette.text.secondary,
          fontWeight: 700,
        })}
      >
        {t(stateTranslationKey)}
      </Typography>
    </Stack>
  );
}
