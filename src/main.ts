import { app } from './app';
import { Battle } from './entities/battle';
import './style.css';

const root = document.querySelector<HTMLDivElement>('#root');

root?.appendChild(app.view);

const battle = new Battle();

battle.init();
