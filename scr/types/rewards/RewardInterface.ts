interface Rewards {
  playerRewarded: string;
  credits: number;
  exp: number;
}

interface WonItem {
    originPlayer: string
    itemName: string
}

export interface RewardInterface{
    rewards: Rewards
    wonItem: WonItem[]
}

