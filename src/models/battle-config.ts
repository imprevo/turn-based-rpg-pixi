export class TeamConfig {
  constructor(public name: string, public unitCount: number) {}
}

export class BattleConfig {
  constructor(public team1: TeamConfig, public team2: TeamConfig) {}
}
