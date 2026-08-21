import { Routes } from '@angular/router';
import { TodoDemoPage } from './todo-demo/todo-demo-page';

export const routes: Routes = [
  { path: '', redirectTo: '/todo-demo', pathMatch: 'full' },
  { path: 'todo-demo', component: TodoDemoPage },
  { path: '**', redirectTo: '/todo-demo' },
];
