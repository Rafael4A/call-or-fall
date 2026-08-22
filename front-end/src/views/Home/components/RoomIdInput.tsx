import KeyIcon from "@mui/icons-material/Key";
import { Stack, TextField, Typography } from "@mui/material";
import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { STORAGE_KEYS } from "../../../constants";
import { InputLabelStyles } from "../../../styles";

export function RoomIdInput() {
  const { t } = useTranslation();
  const componentId = useId();

  const sessionStorageRoomId =
    sessionStorage.getItem(STORAGE_KEYS.ROOM_ID) || "";

  const [roomId, setRoomId] = useState(sessionStorageRoomId);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomId(event.target.value.toUpperCase());
    sessionStorage.setItem(STORAGE_KEYS.ROOM_ID, event.target.value);
  };

  return (
    <Stack spacing={1.5}>
      <Typography
        component="label"
        htmlFor={componentId}
        variant="subtitle2"
        sx={InputLabelStyles()}
      >
        {t("room-code")}
      </Typography>
      <TextField
        id={componentId}
        fullWidth
        value={roomId}
        onChange={handleChange}
        placeholder={t("enter-room-code-placeholder")}
        slotProps={{
          input: {
            startAdornment: (
              <KeyIcon
                sx={(theme) => ({
                  color: theme.palette.text.secondary,
                  mr: 0.5,
                  fontSize: 20,
                })}
              />
            ),
          },
        }}
      />
    </Stack>
  );
}
