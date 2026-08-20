import { Button, Container, Paper, Stack, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import type { CreateRoomResponse } from "shared-code";
import { createRoomRequest, joinRoomRequest } from "../../api";
import { STORAGE_KEYS, VIEWS } from "../../constants";
import { useSnackAlert } from "../../contexts";
import { RoomIdInput, UsernameInput } from "./components";
import { MenuButtonStyles } from "./HomeStyles";

interface HomeProps {
  setView: Dispatch<SetStateAction<(typeof VIEWS)[keyof typeof VIEWS]>>;
}

export function Home({ setView }: HomeProps) {
  const { t } = useTranslation();
  const { openAlert } = useSnackAlert();

  const handleNewRoomSuccess = (response: CreateRoomResponse) => {
    sessionStorage.setItem(STORAGE_KEYS.ROOM_ID, response.roomId);
    sessionStorage.setItem(STORAGE_KEYS.PLAYER_ID, response.playerId);
    setView(VIEWS.WAITING_ROOM);
  };

  const createRoomMutation = useMutation({
    mutationFn: createRoomRequest,
    onSuccess: handleNewRoomSuccess,
  });

  const joinRoomMutation = useMutation({
    mutationFn: joinRoomRequest,
    onSuccess: handleNewRoomSuccess,
  });

  const handleNoUsername = () => {
    const hasUsername = localStorage.getItem(STORAGE_KEYS.USERNAME);
    if (!hasUsername)
      openAlert({
        content: t("please-set-username-first"),
        severity: "error",
      });
    return hasUsername;
  };

  const handleNoRoomId = () => {
    const hasRoomId = sessionStorage.getItem(STORAGE_KEYS.ROOM_ID);
    if (!hasRoomId)
      openAlert({
        content: t("please-enter-room-code-first"),
        severity: "error",
      });
    return hasRoomId;
  };

  const handleJoinOnlineGame = () => {
    if (!handleNoUsername()) return;
    if (!handleNoRoomId()) return;

    joinRoomMutation.mutate({
      username: localStorage.getItem(STORAGE_KEYS.USERNAME)!,
      roomId: sessionStorage.getItem(STORAGE_KEYS.ROOM_ID)!,
    });
  };

  const handleCreateOnlineGame = () => {
    if (!handleNoUsername()) return;
    createRoomMutation.mutate({
      username: localStorage.getItem(STORAGE_KEYS.USERNAME)!,
    });
  };

  const isAnythingLoading = createRoomMutation.isPending;

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 64px)",
        py: 4,
      }}
    >
      <Paper elevation={4} sx={{ p: { xs: 3, sm: 5 }, width: "100%" }}>
        <Stack spacing={3} alignItems="center">
          <Stack spacing={1} alignItems="center">
            <Typography
              component="h1"
              variant="h1"
              textAlign="center"
              sx={(theme) => ({
                color: theme.palette.primary.main,
                fontSize: { xs: "2.25rem", sm: "3rem" },
                letterSpacing: "-0.02em",
              })}
            >
              {t("title")}
            </Typography>
            <Typography
              textAlign="center"
              variant="body1"
              sx={(theme) => ({
                color: theme.palette.text.secondary,
                maxWidth: 400,
              })}
            >
              {t(
                "game-description",
                "A thrilling card game of bluff and prediction",
              )}
            </Typography>
          </Stack>

          <Stack spacing={2} sx={{ width: "100%" }}>
            <UsernameInput />
            <RoomIdInput />
          </Stack>

          <Stack spacing={2} sx={{ width: "100%" }}>
            <Button
              fullWidth
              size="large"
              variant="contained"
              disabled={isAnythingLoading}
              onClick={handleJoinOnlineGame}
              sx={(theme) =>
                MenuButtonStyles(theme.palette.background.joinRoomButton)
              }
            >
              {t("join-online-game")}
            </Button>
            <Button
              fullWidth
              size="large"
              variant="contained"
              disabled={isAnythingLoading}
              onClick={handleCreateOnlineGame}
              sx={(theme) =>
                MenuButtonStyles(theme.palette.background.createRoomButton)
              }
            >
              {t("create-online-game")}
            </Button>
          </Stack>

          <Stack spacing={1.5} sx={{ width: "100%" }}>
            <Button
              fullWidth
              size="large"
              variant="contained"
              disabled={isAnythingLoading}
              sx={(theme) =>
                MenuButtonStyles(theme.palette.background.playOfflineButton)
              }
            >
              {t("play-offline-game")}
            </Button>
            <Button
              fullWidth
              size="large"
              variant="contained"
              disabled={isAnythingLoading}
              sx={(theme) =>
                MenuButtonStyles(theme.palette.background.tutorialButton)
              }
            >
              {t("tutorial")}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
