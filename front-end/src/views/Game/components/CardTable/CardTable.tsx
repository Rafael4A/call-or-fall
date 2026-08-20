import { LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { getBestTableCard } from "shared-code";
import { CardImage } from "../../../../components";
import { useRoomContext } from "../../../../contexts";
import { ContainerStyles } from "./TableStyles";

export function CardTable() {
  const { t } = useTranslation();
  const { room } = useRoomContext();

  const tableCards = room.data?.table ?? [];

  const shouldHighlightCard = room.data?.options.showWinningCard;

  const highestCard = getBestTableCard(room.data?.table ?? []);

  return (
    <Paper elevation={3} sx={ContainerStyles()}>
      {room.isLoading ? (
        <LinearProgress
          sx={(theme) => ({
            width: "60%",
            borderRadius: 2,
            backgroundColor: theme.palette.progressBar.dark,
            "& .MuiLinearProgress-bar": {
              backgroundColor: theme.palette.progressBar.main,
            },
          })}
        />
      ) : tableCards.length === 0 ? (
        <Typography
          variant="body1"
          sx={(theme) => ({
            color: theme.palette.table.light,
            fontStyle: "italic",
          })}
        >
          {t("no-cards-on-table")}
        </Typography>
      ) : (
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
          sx={{ gap: 2 }}
        >
          {tableCards.map((tableCard) => (
            <Stack key={tableCard.owner} spacing={0.5} alignItems="center">
              <CardImage
                cardCode={tableCard.card}
                highlight={
                  shouldHighlightCard && tableCard.card === highestCard?.card
                }
              />
              <Typography
                variant="caption"
                sx={(theme) => ({
                  color: theme.palette.table.main,
                  fontWeight: 500,
                  fontSize: "0.85rem",
                })}
              >
                {tableCard.owner}
              </Typography>
            </Stack>
          ))}
        </Stack>
      )}
    </Paper>
  );
}
