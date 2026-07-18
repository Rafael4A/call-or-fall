import { Button, Container, Paper, Stack, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import type { CreateRoomResponse } from "shared-code";
import { createRoomRequest, joinRoomRequest } from "../../api";
import { STORAGE_KEYS, VIEWS } from "../../constants";
import { useSnackAlert } from "../../contexts";
import { RoomIdInput, UsernameInput } from "./components";

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
    <Container maxWidth="md">
      <Paper sx={{ p: 4 }}>
        <Typography
          component="h1"
          variant="h1"
          textAlign="center"
          fontWeight="400"
          sx={{ mb: 2 }}
        >
          {t("title")}
        </Typography>

        <Typography textAlign="center" sx={{ mb: 2 }}>
          TODO: Brief description
        </Typography>

        <UsernameInput />
        <RoomIdInput />

        <Stack direction="column" spacing={2} sx={{ mb: 4 }}>
          <Stack direction="column" spacing={1}>
            <Button
              disabled={isAnythingLoading}
              variant="contained"
              onClick={handleJoinOnlineGame}
            >
              {t("join-online-game")}
            </Button>
            <Button
              variant="contained"
              disabled={isAnythingLoading}
              onClick={handleCreateOnlineGame}
            >
              {t("create-online-game")}
            </Button>
          </Stack>

          <Button variant="contained" disabled={isAnythingLoading}>
            {t("play-offline-game")}
          </Button>

          <Button variant="contained" disabled={isAnythingLoading}>
            {t("tutorial")}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
