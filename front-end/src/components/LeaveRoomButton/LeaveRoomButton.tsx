import { Button } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { leaveRoomRequest } from "../../api";
import { useRoomContext } from "../../contexts";
import { ButtonStyles } from "./LeaveRoomButtonStyles";

export function LeaveRoomButton() {
  const { t } = useTranslation();
  const { room, clearRoomData, isLoading } = useRoomContext();

  const leaveRoomMutation = useMutation({
    mutationFn: leaveRoomRequest,
    onSuccess: () => {
      clearRoomData();
    },
  });

  return (
    <Button
      variant="contained"
      size="small"
      onClick={() =>
        leaveRoomMutation.mutate({
          roomId: room?.id ?? "",
          userId: room?.player.id ?? "",
        })
      }
      disabled={!room || isLoading || leaveRoomMutation.isPending}
      sx={ButtonStyles()}
    >
      {t("leave-room")}
    </Button>
  );
}
