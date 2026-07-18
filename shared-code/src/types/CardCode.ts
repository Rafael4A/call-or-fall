type CardCodeValue =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "0"
  | "Q"
  | "J"
  | "K";
export type CardCodeSuit = "S" | "C" | "D" | "H";
export type CardCode = `${CardCodeValue}${CardCodeSuit}` | "HIDDEN";
