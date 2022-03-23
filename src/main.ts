import { app } from './app';
import './style.css';

const root = document.querySelector<HTMLDivElement>('#root');

root?.appendChild(app.view);
