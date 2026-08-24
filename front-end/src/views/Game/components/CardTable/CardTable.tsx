import { LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { getBestTableCard } from "shared-code";
import { CardImage } from "../../../../components";
import { useRoomContext } from "../../../../contexts";
import { ContainerStyles } from "./TableStyles";

export function CardTable() {
  const { t } = useTranslation();
  const { room, isLoading } = useRoomContext();

  const tableCards = room?.table ?? [];

  const shouldHighlightCard = room?.options.showWinningCard;

  const highestCard = getBestTableCard(room?.table ?? []);

  return (
    <Paper elevation={3} sx={ContainerStyles()}>
      {isLoading ? (
        <LinearProgress sx={{ width: "60%" }} />
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
