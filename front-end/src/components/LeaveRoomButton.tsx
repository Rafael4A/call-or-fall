import { Button } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { leaveRoomRequest } from "../api";
import { useRoomContext } from "../contexts";

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
      color="secondary"
      onClick={() =>
        leaveRoomMutation.mutate({
          roomId: room.data?.id ?? "",
          userId: room.data?.player.id ?? "",
        })
      }
      disabled={!room.data || leaveRoomMutation.isPending}
    >
      {t("leave-room")}
    </Button>
  );
}
