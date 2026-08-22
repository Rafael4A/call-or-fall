import type { TFunction } from "i18next";
import type { SnackAlertParams } from "../contexts";

export const shareRoom = async (
  id: string,
  openAlert: (alertParams: SnackAlertParams) => void,
  t: TFunction,
) => {
  const shareData: ShareData = {
    title: t("title"),
    text: t("share-room-text"),
    url: `${window.location.origin}?roomId=${id}`,
  };

  try {
    if (navigator?.canShare?.(shareData)) {
      await navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(`${window.location.origin}?roomId=${id}`);
      openAlert({
        content: "Link copied to clipboard!",
        severity: "success",
      });
    }
  } catch (_error) {
    openAlert({
      content: "Failed to share room",
      severity: "error",
    });
  }
};
