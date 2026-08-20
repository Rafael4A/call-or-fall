import { Box, Modal, Paper, Stack, Typography } from "@mui/material";
import { useId } from "react";
import { useTranslation } from "react-i18next";
import { GAME_STATE, type PlayerOpponentDTO, type RoomDTO } from "shared-code";
import {
  ContainerStyles,
  ItemPaperStyles,
  SubtitleStyles,
} from "./ResultsModalStyles";

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
  const { t } = useTranslation();
  const baseId = useId();

  if (!room) return null;

  const allPlayers = [room.player, ...room.opponents] as PlayerOpponentDTO[];

  return (
    <Modal
      open={isVisible}
      aria-labelledby={`${baseId}-modal-title`}
      aria-describedby={`${baseId}-modal-description`}
      onClose={onCloseClick}
    >
      <Box sx={ContainerStyles()}>
        <Paper elevation={8} sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Stack spacing={3}>
            <Stack spacing={0.5} alignItems="center">
              <Typography
                id={`${baseId}-modal-title`}
                variant="h4"
                sx={(theme) => ({
                  color: theme.palette.primary.main,
                  fontWeight: 700,
                })}
              >
                {t("results-modal-title")}
              </Typography>
              <Typography
                id={`${baseId}-modal-description`}
                variant="body2"
                sx={(theme) => ({
                  color: theme.palette.text.secondary,
                })}
              >
                {allPlayers.length} {t("player-label", { count: allPlayers.length })}
              </Typography>
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2" sx={SubtitleStyles()}>
                {t("overall-score")}
              </Typography>
              <Stack spacing={1}>
                {allPlayers
                  .slice()
                  .sort((a, b) => a.score - b.score)
                  .map((player) => {
                    const isThemselves =
                      player.username === room?.player.username;
                    return (
                      <Paper
                        key={player.username}
                        elevation={isThemselves ? 2 : 1}
                        sx={ItemPaperStyles()}
                      >
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
                          <Typography
                            sx={(theme) => ({
                              color: theme.palette.text.primary,
                              fontWeight: isThemselves ? 700 : 500,
                            })}
                          >
                            {player.username}
                          </Typography>
                        </Stack>
                        <Stack alignItems="flex-end">
                          <Typography
                            variant="h5"
                            sx={(theme) => ({
                              color: isThemselves
                                ? theme.palette.primary.main
                                : theme.palette.text.primary,
                              fontWeight: 700,
                            })}
                          >
                            {player.score}
                          </Typography>
                          {isThemselves && (
                            <Typography
                              variant="caption"
                              sx={(theme) => ({
                                color: theme.palette.secondary.main,
                                fontWeight: 600,
                              })}
                            >
                              {t("you-label")}
                            </Typography>
                          )}
                        </Stack>
                      </Paper>
                    );
                  })}
              </Stack>
            </Stack>

            {room.gameState !== GAME_STATE.Predicting && (
              <Stack spacing={1.5}>
                <Typography variant="subtitle2" sx={SubtitleStyles()}>
                  {t("current-round")}
                </Typography>
                <Stack spacing={1}>
                  {allPlayers.map((player) => {
                    const isThemselves =
                      player.username === room?.player.username;
                    if (player.prediction == null) return null;
                    return (
                      <Stack
                        key={player.username}
                        spacing={0.75}
                        sx={(theme) => ({
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          pb: 0.25,
                        })}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography
                            sx={(theme) => ({
                              color: theme.palette.text.primary,
                              fontWeight: isThemselves ? 600 : 400,
                            })}
                          >
                            {player.username}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={(theme) => ({
                              color: isThemselves
                                ? theme.palette.primary.main
                                : theme.palette.text.secondary,
                              fontWeight: isThemselves ? 700 : 400,
                            })}
                          >
                            {player.prediction === 0
                              ? t("on-track-with-prediction")
                              : player.prediction > 0
                                ? t("still-needs-wins", { count: player.prediction })
                                : t("wins-over-prediction", { count: Math.abs(player.prediction) })}
                          </Typography>
                        </Stack>
                      </Stack>
                    );
                  })}
                </Stack>
              </Stack>
            )}
          </Stack>
        </Paper>
      </Box>
    </Modal>
  );
}
