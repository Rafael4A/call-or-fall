import { Box } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HIDDEN_CARD, type CardCode } from "shared-code";
import { getCardName } from "../../utils";
import { ContainerStyles, ImageStyles } from "./CardImageStyles";

interface CardImageProps {
  cardCode: CardCode;
  highlight?: boolean;
}

export function CardImage({ cardCode, highlight }: CardImageProps) {
  const { t } = useTranslation();
  const [useDefault, setUseDefault] = useState(true);

  const fallbackImage = "/resources/cards/default_webp/card-back.webp";

  const cardImageUrl = `/resources/cards/default_webp/${cardCode}.webp`;

  const isHidden = useDefault || cardCode === HIDDEN_CARD;

  return (
    <Box sx={ContainerStyles(highlight)}>
      <img
        src={isHidden ? fallbackImage : cardImageUrl}
        onLoad={() => setUseDefault(false)}
        alt={getCardName(cardCode, t)}
        draggable={false}
        style={ImageStyles()}
      />
    </Box>
  );
}
