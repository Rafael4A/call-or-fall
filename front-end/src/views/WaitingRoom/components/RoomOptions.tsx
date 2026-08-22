import {
  Box,
  Modal,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useId, type Dispatch, type SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { GAME_LIMITS, safeClamp, type RoomOptions } from "shared-code";
import { InputLabelStyles } from "../../../styles";
import { ContainerStyles } from "./RoomOptionsStyles";

interface ResultsModalProps {
  roomOptions?: RoomOptions;
  setRoomOptions: Dispatch<SetStateAction<RoomOptions>>;
  isVisible: boolean;
  onCloseClick: () => void;
}

export function RoomOptionsModal({
  roomOptions,
  setRoomOptions,
  isVisible,
  onCloseClick,
}: ResultsModalProps) {
  const { t } = useTranslation();
  const baseId = useId();
  const deckCountInputId = `${baseId}-deck-count-input`;
  const scoreLimitInputId = `${baseId}-score-limit-input`;
  const showWinningCardInputId = `${baseId}-show-winning-card-input`;

  const handleDeckCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDeckCount = safeClamp(
      parseInt(e.target.value),
      0,
      GAME_LIMITS.MAX_DECK_COUNT,
    );

    setRoomOptions((prev) => ({ ...prev, deckCount: newDeckCount }));
  };

  const handleScoreLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScoreLimit = safeClamp(
      parseInt(e.target.value),
      0,
      GAME_LIMITS.MAX_SCORE_LIMIT,
    );

    setRoomOptions((prev) => ({ ...prev, scoreLimit: newScoreLimit }));
  };

  const handleShowWinningCardChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newShowWinningCard = e.target.checked;

    setRoomOptions((prev) => ({
      ...prev,
      showWinningCard: newShowWinningCard,
    }));
  };

  return (
    <Modal
      open={isVisible}
      aria-labelledby={`${baseId}-modal-title`}
      onClose={onCloseClick}
    >
      <Box sx={ContainerStyles()}>
        <Paper elevation={8} sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Stack spacing={3} alignItems="center">
            <Stack spacing={0.5} alignItems="center">
              <Typography
                id={`${baseId}-modal-title`}
                variant="h4"
                sx={(theme) => ({
                  color: theme.palette.primary.main,
                  fontWeight: 700,
                })}
              >
                {t("room-options-modal-title")}
              </Typography>
              <Typography
                textAlign="center"
                variant="body1"
                sx={(theme) => ({
                  color: theme.palette.text.secondary,
                  maxWidth: 400,
                })}
              >
                {t("minimum-values-disclaimer")}
              </Typography>
            </Stack>

            <Stack spacing={1}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Typography
                  component="label"
                  htmlFor={deckCountInputId}
                  variant="subtitle2"
                  sx={InputLabelStyles()}
                >
                  {t("deck-count-label")}
                </Typography>
                <TextField
                  id={deckCountInputId}
                  variant="standard"
                  value={roomOptions?.deckCount}
                  onChange={handleDeckCountChange}
                  slotProps={{
                    htmlInput: {
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                      sx: (theme) => ({
                        color: theme.palette.text.secondary,
                        fontWeight: 600,
                      }),
                    },
                  }}
                  sx={{ backgroundColor: "transparent" }}
                />
              </Stack>

              <Stack direction="row" spacing={1.5} alignItems="center">
                <Typography
                  component="label"
                  htmlFor={scoreLimitInputId}
                  variant="subtitle2"
                  sx={InputLabelStyles()}
                >
                  {t("score-limit-label")}
                </Typography>
                <TextField
                  id={scoreLimitInputId}
                  variant="standard"
                  value={roomOptions?.scoreLimit}
                  onChange={handleScoreLimitChange}
                  slotProps={{
                    htmlInput: {
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                      sx: (theme) => ({
                        color: theme.palette.text.secondary,
                        fontWeight: 600,
                      }),
                    },
                  }}
                  sx={{ backgroundColor: "transparent" }}
                />
              </Stack>

              <Stack direction="row" spacing={1.5} alignItems="center">
                <Typography
                  component="label"
                  htmlFor={showWinningCardInputId}
                  variant="subtitle2"
                  sx={InputLabelStyles()}
                >
                  {t("show-winning-card-label")}
                </Typography>
                <Switch
                  id={showWinningCardInputId}
                  checked={roomOptions?.showWinningCard}
                  onChange={handleShowWinningCardChange}
                />
              </Stack>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </Modal>
  );
}
