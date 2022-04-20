import { app } from './app';
import './style.css';
import { registerPixiInspector } from './utils/devtools';

registerPixiInspector();

const root = document.querySelector<HTMLDivElement>('#root');

root?.appendChild(app.view);
