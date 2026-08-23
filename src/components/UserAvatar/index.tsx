import { Avatar } from "@mui/material";

const PALETTE = [
  "#4F46E5",
  "#0E9488",
  "#F59E0B",
  "#F43F5E",
  "#8B5CF6",
  "#0EA5A5",
];

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const getColor = (seed: string) => {
  const index = seed
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return PALETTE[index % PALETTE.length];
};

interface UserAvatarProps {
  name: string;
  src?: string;
  size?: number;
}

const UserAvatar = ({ name, src, size = 36 }: UserAvatarProps) => {
  const safeName = name || "?";
  return (
    <Avatar
      src={src}
      alt={safeName}
      sx={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        fontWeight: 600,
        bgcolor: getColor(safeName),
        flexShrink: 0,
      }}
    >
      {getInitials(safeName)}
    </Avatar>
  );
};

export default UserAvatar;
