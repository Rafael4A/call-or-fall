import { Button } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { GAME_STATE } from "shared-code";
import { sendPredictionRequest } from "../../../api/sendPredictionRequest";
import { useRoomContext } from "../../../contexts";

export function Prediction() {
  const { room, updateConnection } = useRoomContext();

  const sendPredictionMutation = useMutation({
    mutationFn: sendPredictionRequest,
    onSuccess: () => updateConnection(),
  });

  if (room.data?.gameState !== GAME_STATE.Predicting) return null;
  const shouldDisableAll =
    room.data?.currentPlayerName !== room.data?.player.username;

  const max = room?.data?.player.cards.length ?? -1;

  const isOnlyOneMissing =
    room?.data?.opponents.every((o) => o.prediction != undefined) ?? false;

  console.log(room?.data?.opponents);

  const prohibited = isOnlyOneMissing
    ? max -
      room?.data?.opponents.reduce((acc, o) => acc + (o.prediction ?? 0), 0)
    : -1;

  console.log(isOnlyOneMissing, max, prohibited);

  const handleClick = (prediction: number) => {
    sendPredictionMutation.mutate({
      roomId: room.data?.id as string,
      userId: room.data?.player.id as string,
      prediction,
    });
  };

  return (
    <div>
      <h2>Prediction</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {Array.from({ length: max + 1 }, (_, i) => i).map((i) => (
          <Button
            variant="contained"
            key={i}
            disabled={
              shouldDisableAll ||
              i === prohibited ||
              sendPredictionMutation.isPending
            }
            onClick={() => handleClick(i)}
          >
            {i}
          </Button>
        ))}
      </div>
    </div>
  );
}
