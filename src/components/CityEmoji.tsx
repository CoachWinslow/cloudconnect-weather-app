interface CityEmojiProps {
  emoji: string;
  name: string;
  className?: string;
  size?: number;
}

export function isImageEmoji(emoji: string): boolean {
  return emoji.startsWith("/assets/") || emoji.startsWith("http");
}

export default function CityEmoji({ emoji, name, className = "", size = 28 }: CityEmojiProps) {
  if (isImageEmoji(emoji)) {
    return (
      <img
        src={emoji}
        alt={name}
        className={className}
        style={{ width: size, height: size, objectFit: "contain" }}
      />
    );
  }
  return <span className={className}>{emoji}</span>;
}
