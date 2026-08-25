import {
  Box,
  Button,
  LinearProgress,
  Modal,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { ModalBoxStyles } from "../../../styles";

export interface TutorialProps {
  isVisible: boolean;
  onCloseClick: () => void;
}

export function Tutorial({ isVisible, onCloseClick }: TutorialProps) {
  const baseId = useId();

  const { t } = useTranslation();

  const [currentStep, setCurrentStep] = useState(1);

  const MAX_STEPS = 8;

  const handleCloseClick = () => {
    onCloseClick();
    setCurrentStep(1);
  };

  const handleNextClick = () => {
    if (currentStep === MAX_STEPS) {
      handleCloseClick();
      return;
    }
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePreviousClick = () => {
    if (currentStep > 1) setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <Modal
      open={isVisible}
      aria-labelledby={`${baseId}-modal-title`}
      onClose={handleCloseClick}
    >
      <Box sx={ModalBoxStyles()}>
        <Paper elevation={8} sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Stack spacing={3} alignItems="center">
            <Typography variant="h2" textAlign="center">
              {t(`tutorial-text.title.${currentStep}`)}
            </Typography>
            <Typography sx={{ fontSize: "1.25rem", textAlign: "center" }}>
              {t(`tutorial-text.body.${currentStep}`)}
            </Typography>

            <Stack spacing={3} alignItems="center" sx={{ width: "100%" }}>
              <LinearProgress
                variant="determinate"
                value={(currentStep / MAX_STEPS) * 100}
                sx={{ width: "100%" }}
              />
              <Stack spacing={3} alignItems="center" direction="row">
                <Button
                  variant="contained"
                  onClick={handlePreviousClick}
                  disabled={currentStep === 1}
                >
                  {t("previous")}
                </Button>
                <Button variant="contained" onClick={handleNextClick}>
                  {currentStep === MAX_STEPS ? t("close") : t("next")}
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </Modal>
  );
}
