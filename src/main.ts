import { app } from './app';
import { Battle } from './entities/battle';
import { registerPixiInspector } from './utils/devtools';
import './style.css';

registerPixiInspector();

const root = document.querySelector<HTMLDivElement>('#root');

root?.appendChild(app.view);

const battle = new Battle();

battle.init();
