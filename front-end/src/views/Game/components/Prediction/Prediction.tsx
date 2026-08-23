import { Button, Paper, Stack, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { GAME_STATE } from "shared-code";
import { sendPredictionRequest } from "../../../../api";
import { useRoomContext } from "../../../../contexts";
import { InputLabelStyles } from "../../../../styles";

export function Prediction() {
  const { t } = useTranslation();

  const { room } = useRoomContext();

  const sendPredictionMutation = useMutation({
    mutationFn: sendPredictionRequest,
  });

  if (!room) return null;
  const isOpponentTurn = room?.currentPlayerName !== room?.player.username;

  const max = room?.player.cards.length ?? -1;

  const isOnlyOneMissing =
    room?.opponents.every((o) => o.prediction != undefined) ?? false;

  const prohibited = isOnlyOneMissing
    ? max - room?.opponents.reduce((acc, o) => acc + (o.prediction ?? 0), 0)
    : -1;

  const handleClick = (prediction: number) => {
    sendPredictionMutation.mutate({
      roomId: room?.id as string,
      userId: room?.player.id as string,
      prediction,
    });
  };

  const hasPlayerPrediction = room.player.prediction !== undefined;
  const opponentsWithPredictions = room.opponents.filter(
    (o) => o.prediction !== undefined,
  );

  const playersWithPredictions = hasPlayerPrediction
    ? [room.player, ...opponentsWithPredictions]
    : opponentsWithPredictions;

  return (
    <Paper
      elevation={4}
      sx={{
        p: 2.5,
      }}
    >
      <Stack spacing={2}>
        {room?.gameState === GAME_STATE.Predicting && (
          <>
            <Typography
              variant="subtitle2"
              textAlign="center"
              sx={InputLabelStyles()}
            >
              {isOpponentTurn
                ? t("waiting-for-opponent-to-predict")
                : t("make-your-prediction")}
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              justifyContent="center"
              flexWrap="wrap"
            >
              {Array.from({ length: max + 1 }, (_, i) => i).map((i) => {
                const isProhibited = i === prohibited;
                return (
                  <Button
                    key={i}
                    type="button"
                    onClick={() => handleClick(i)}
                    variant="contained"
                    disabled={
                      isOpponentTurn ||
                      isProhibited ||
                      sendPredictionMutation.isPending
                    }
                  >
                    {i}
                  </Button>
                );
              })}
            </Stack>
          </>
        )}
        {playersWithPredictions?.length > 0 && (
          <Stack spacing={0.5} alignItems="center" sx={{ mt: 1 }}>
            <Typography
              variant="subtitle2"
              textAlign="center"
              sx={InputLabelStyles()}
            >
              {t("players-predictions")}
            </Typography>

            <Stack spacing={0.75} alignItems="center" direction="row">
              {playersWithPredictions.map((o) => (
                <Paper key={o.username} sx={{ p: 1.5 }}>
                  <Typography sx={{ fontSize: "0.9rem", fontWeight: 800 }}>
                    {o.username}: {o.prediction}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}
