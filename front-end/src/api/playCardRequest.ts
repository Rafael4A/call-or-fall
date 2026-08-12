import type { CardCode } from "shared-code";

interface PlayCardRequestParams {
  roomId: string;
  userId: string;
  card: CardCode;
}

export async function playCardRequest({
  card,
  roomId,
  userId,
}: PlayCardRequestParams) {
  return fetch(`/api/room/${roomId}/play-card?userId=${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ card }),
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((data) => {
        throw new Error(data.error || "Failed to play card");
      });
    }
    return res.ok;
  });
}
