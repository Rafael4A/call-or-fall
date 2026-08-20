import { Button, Stack, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { GAME_STATE, type CardCode } from "shared-code";
import { playCardRequest } from "../../../../api";
import { CardImage } from "../../../../components";
import { useRoomContext } from "../../../../contexts";
import { CardButtonStyles } from "./PlayerHandStyles";

export function PlayerHand() {
  const { t } = useTranslation();

  const { room } = useRoomContext();

  const isCurrentPlayer =
    room.data?.currentPlayerName === room.data?.player.username;
  const playerCards = room.data?.player.cards ?? [];

  const playCardMutation = useMutation({
    mutationFn: playCardRequest,
  });

  const handlePlayCard = (card: CardCode) => {
    playCardMutation.mutate({
      roomId: room.data?.id ?? "",
      userId: room.data?.player.id ?? "",
      card,
    });
  };

  return (
    <Stack spacing={1}>
      <Typography
        variant="subtitle2"
        textAlign="center"
        sx={(theme) => ({
          color: theme.palette.text.secondary,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          fontSize: "0.75rem",
        })}
      >
        {t("your-hand", "Your Hand")} ({playerCards.length})
      </Typography>
      <Stack
        direction="row"
        spacing={1.5}
        justifyContent="center"
        flexWrap="wrap"
      >
        {playerCards.map((card) => (
          <Button
            key={card}
            variant="contained"
            onClick={() => handlePlayCard(card)}
            disabled={
              !isCurrentPlayer ||
              playCardMutation.isPending ||
              room.data?.gameState !== GAME_STATE.Playing
            }
            sx={CardButtonStyles()}
          >
            <CardImage cardCode={card} />
          </Button>
        ))}
      </Stack>
    </Stack>
  );
}
