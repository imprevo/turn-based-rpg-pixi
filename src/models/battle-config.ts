export class TeamConfig {
  constructor(
    public name: string,
    public unitCount: number,
    public controlled: boolean
  ) {}
}

export class BattleConfig {
  constructor(public team1: TeamConfig, public team2: TeamConfig) {}
}
