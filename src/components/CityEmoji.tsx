interface CityEmojiProps {
  emoji: string;
  name: string;
  className?: string;
  size?: number;
}

export function isImageEmoji(emoji: string): boolean {
  return emoji.startsWith("/") || emoji.startsWith("http");
}

export default function CityEmoji({ emoji, name, className = "", size = 28 }: CityEmojiProps) {
  if (isImageEmoji(emoji)) {
    // If className provides sizing (w-/h-), skip inline size so callers can be responsive.
    const hasSizing = /\b[wh]-/.test(className);
    return (
      <img
        src={emoji}
        alt={name}
        className={className}
        style={hasSizing ? { objectFit: "contain" } : { width: size, height: size, objectFit: "contain" }}
      />
    );
  }
  return <span className={className}>{emoji}</span>;
}
