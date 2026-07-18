import { Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MAX_USERNAME_SIZE } from "shared-code";
import { generateUsername } from "unique-username-generator";
import { STORAGE_KEYS } from "../../../constants";

export function UsernameInput() {
  const { t } = useTranslation();

  const localStorageUsername =
    localStorage.getItem(STORAGE_KEYS.USERNAME) || "";

  const [username, _setUsername] = useState(
    localStorageUsername.substring(0, MAX_USERNAME_SIZE)
  );

  const setUsername = (newUsername: string) => {
    const trimmedUsername = newUsername.substring(0, MAX_USERNAME_SIZE);
    _setUsername(trimmedUsername);
    localStorage.setItem(STORAGE_KEYS.USERNAME, trimmedUsername);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleRandomUsername = () => {
    const newUsername = generateUsername("_", 0, MAX_USERNAME_SIZE);
    setUsername(newUsername);
  };

  return (
    <Stack direction="column" spacing={0.25} sx={{ mb: 2 }}>
      <Stack direction="row" spacing={1} sx={{ mb: 4 }}>
        <TextField
          id="username"
          label={t("username-field")}
          name="username"
          required
          fullWidth
          value={username}
          onChange={handleChange}
        />
      </Stack>
      <Stack direction="row">
        <Button type="button" onClick={handleRandomUsername}>
          {t("random-username")}
        </Button>
      </Stack>
    </Stack>
  );
}
