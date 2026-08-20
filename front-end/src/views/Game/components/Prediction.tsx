import { Button, Paper, Stack, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { GAME_STATE } from "shared-code";
import { sendPredictionRequest } from "../../../api/sendPredictionRequest";
import { useRoomContext } from "../../../contexts";

export function Prediction() {
  const { t } = useTranslation();

  const { room } = useRoomContext();

  const sendPredictionMutation = useMutation({
    mutationFn: sendPredictionRequest,
  });

  if (room.data?.gameState !== GAME_STATE.Predicting) return null;
  const isOpponentTurn =
    room.data?.currentPlayerName !== room.data?.player.username;

  const max = room?.data?.player.cards.length ?? -1;

  const isOnlyOneMissing =
    room?.data?.opponents.every((o) => o.prediction != undefined) ?? false;

  const prohibited = isOnlyOneMissing
    ? max -
      room?.data?.opponents.reduce((acc, o) => acc + (o.prediction ?? 0), 0)
    : -1;

  const handleClick = (prediction: number) => {
    sendPredictionMutation.mutate({
      roomId: room.data?.id as string,
      userId: room.data?.player.id as string,
      prediction,
    });
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 2.5,
      }}
    >
      <Stack spacing={2}>
        <Typography
          variant="subtitle2"
          textAlign="center"
          sx={(theme) => ({
            color: theme.palette.text.secondary,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05rem",
            fontSize: "0.8rem",
          })}
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
      </Stack>
    </Paper>
  );
}
