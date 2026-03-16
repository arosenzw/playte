import NameEntryScreen from "@/components/ui/NameEntryScreen";

export default function HostNamePage() {
  return <NameEntryScreen storageKey="host_name" nextRoute="/create/restaurant" />;
}
