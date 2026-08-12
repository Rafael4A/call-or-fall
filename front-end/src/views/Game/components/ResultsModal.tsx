import { Box, Modal } from "@mui/material";
import { useId } from "react";
import type { PlayerOpponentDTO, RoomDTO } from "shared-code";

interface ResultsModalProps {
  room?: RoomDTO;
  isVisible: boolean;
  onCloseClick: () => void;
}

export function ResultsModal({
  room,
  isVisible,
  onCloseClick,
}: ResultsModalProps) {
  const baseId = useId();
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  if (!room) return null;

  const allPlayers = [room.player, ...room.opponents] as PlayerOpponentDTO[];

  return (
    <Modal
      open={isVisible}
      aria-labelledby={`${baseId}-modal-title`}
      aria-describedby={`${baseId}-modal-description`}
      onClose={onCloseClick}
    >
      <Box sx={style}>
        <h2 id={`${baseId}-modal-title`}>Results:</h2>
        <p id={`${baseId}-modal-description`}>
          {allPlayers.map((player) => (
            <span key={player.username}>
              {/* TODO: Translate */}
              {player.username} - TOTAL SCORE: {player.score} - CURRENT ROUND
              WINS: {player.currentRoundScore} - REMAINING PREDICTION:
              {player.prediction ?? "?"}
            </span>
          ))}
        </p>
      </Box>
    </Modal>
  );
}
