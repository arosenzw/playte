import NameEntryScreen from "@/components/ui/NameEntryScreen";

export default function PlayerNamePage() {
  return <NameEntryScreen storageKey="player_name" nextRoute="/join/code" />;
}
