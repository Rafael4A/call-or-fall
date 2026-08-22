import PersonIcon from "@mui/icons-material/Person";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { MAX_USERNAME_SIZE } from "shared-code";
import { generateUsername } from "unique-username-generator";
import { STORAGE_KEYS } from "../../../constants";
import { InputLabelStyles } from "../../../styles";

export function UsernameInput() {
  const { t } = useTranslation();
  const componentId = useId();

  const localStorageUsername =
    localStorage.getItem(STORAGE_KEYS.USERNAME) || "";

  const [username, _setUsername] = useState(
    localStorageUsername.substring(0, MAX_USERNAME_SIZE),
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
    <Stack spacing={1.5}>
      <Typography
        component="label"
        htmlFor={componentId}
        variant="subtitle2"
        sx={InputLabelStyles()}
      >
        {t("username-field")}
      </Typography>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <TextField
          id={componentId}
          required
          fullWidth
          value={username}
          onChange={handleChange}
          placeholder={t("enter-username-placeholder")}
          slotProps={{
            input: {
              startAdornment: (
                <PersonIcon
                  sx={(theme) => ({
                    color: theme.palette.text.secondary,
                    mr: 0.5,
                    fontSize: 20,
                  })}
                />
              ),
            },
          }}
          sx={{ height: "100%" }}
        />
        <Button
          variant="outlined"
          onClick={handleRandomUsername}
          sx={(theme) => ({
            px: 2,
            borderColor: theme.palette.divider,
            color: theme.palette.text.secondary,
            backgroundColor: theme.palette.background.input,
            "&:hover": {
              borderColor: theme.palette.primary.main,
            },
          })}
        >
          {t("random-username")}
        </Button>
      </Stack>
    </Stack>
  );
}
