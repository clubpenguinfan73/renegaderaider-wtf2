import { useQuery } from "@tanstack/react-query";

export interface DiscordProfile {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  banner: string | null;
  accentColor: number | null;
  badges: string[];
  premiumType: number;
  publicFlags: number;
}

export function useDiscordProfile() {
  return useQuery<DiscordProfile>({
    queryKey: ['/api/discord/profile'],
    refetchInterval: 60000, // Refresh every minute for live updates
    staleTime: 30000, // Consider data stale after 30 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}