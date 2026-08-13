import { useState } from "react";
import type { CardCode } from "shared-code";

interface CardImageProps {
  cardCode: CardCode;
}

export function CardImage({ cardCode }: CardImageProps) {
  const [useDefault, setUseDefault] = useState(true);

  const fallbackImage = "/resources/cards/default_webp/card-back.webp";

  const cardImageUrl = `/resources/cards/default_webp/${cardCode}.webp`;

  // TODO ALT for card
  return (
    <img
      width={226}
      height={314}
      src={useDefault || cardCode === "HIDDEN" ? fallbackImage : cardImageUrl}
      onLoad={() => setUseDefault(false)}
      alt="TODO: Card image"
      draggable={false}
    />
  );
}
