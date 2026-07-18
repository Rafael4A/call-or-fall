interface StartGameRequestParams {
  roomId: string;
  userId: string;
}

export async function startGameRequest({
  roomId,
  userId,
}: StartGameRequestParams) {
  return fetch(`/api/room/${roomId}/start?userId=${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((data) => {
        throw new Error(data.error || "Failed to start game");
      });
    }
    return res.ok;
  });
}
