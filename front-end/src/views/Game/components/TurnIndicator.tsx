import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRoomContext } from "../../../contexts";

export function TurnIndicator() {
  const { t } = useTranslation();

  const { room } = useRoomContext();

  const isCurrentPlayer =
    room.data?.currentPlayerName === room.data?.player.username;

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
        {isCurrentPlayer ? t("your-turn") : t("opponent-turn")}
      </Typography>
    </Stack>
  );
}
