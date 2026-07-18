import { Stack, TextField } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { STORAGE_KEYS } from "../../../constants";

export function RoomIdInput() {
  const { t } = useTranslation();

  const sessionStorageRoomId =
    sessionStorage.getItem(STORAGE_KEYS.ROOM_ID) || "";

  const [roomId, setRoomId] = useState(sessionStorageRoomId);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomId(event.target.value);
    sessionStorage.setItem(STORAGE_KEYS.ROOM_ID, event.target.value);
  };

  return (
    <Stack direction="column" spacing={0.25} sx={{ mb: 4 }}>
      <Stack direction="row" spacing={1} sx={{ mb: 4 }}>
        <TextField
          id="roomId"
          label={t("room-code")}
          name="roomId"
          fullWidth
          value={roomId}
          onChange={handleChange}
        />
      </Stack>
    </Stack>
  );
}
