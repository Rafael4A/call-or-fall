import { Button } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { leaveRoomRequest } from "../../api";
import { useRoomContext } from "../../contexts";
import { ButtonStyles } from "./LeaveRoomButtonStyles";

export function LeaveRoomButton() {
  const { t } = useTranslation();
  const { room, clearRoomData } = useRoomContext();

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
          roomId: room.data?.id ?? "",
          userId: room.data?.player.id ?? "",
        })
      }
      disabled={!room.data || leaveRoomMutation.isPending}
      sx={ButtonStyles()}
    >
      {t("leave-room")}
    </Button>
  );
}
