import { BattleService } from '../battle';
import { wait } from '../../utils/promise';
import { TeamController } from '../team-controller';
import { DecisionMaker } from './desision-maker';

const TURN_DELAY = 500;

export class AIController {
  battle: BattleService;
  teamCtrl: TeamController;
  decisionMaker: DecisionMaker;

  constructor(battle: BattleService, teamCtrl: TeamController) {
    this.teamCtrl = teamCtrl;
    this.battle = battle;
    this.decisionMaker = new DecisionMaker(this.teamCtrl);

    this.checkTurn();
    this.addListeners();
  }

  addListeners() {
    this.battle.on('readyForAction', () => {
      this.checkTurn();
    });
  }

  async doTurn() {
    await wait(TURN_DELAY);
    const actionCreator = this.decisionMaker.chooseNextAction();

    if (actionCreator) {
      this.teamCtrl.applyAction(actionCreator);
    } else {
      this.skipTurn();
    }
  }

  checkTurn() {
    if (this.teamCtrl.checkIsTurnAvailable()) {
      this.doTurn();
    }
  }

  skipTurn() {
    this.teamCtrl.skipTurn();
  }
}
