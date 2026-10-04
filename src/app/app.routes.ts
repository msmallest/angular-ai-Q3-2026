import { Routes } from '@angular/router';
import { TodoDemoPage } from './todo-demo/todo-demo-page';

export const routes: Routes = [
  { path: '', redirectTo: '/form-field-custom-control', pathMatch: 'full' },
  { path: 'todo-demo', component: TodoDemoPage },
  {
    path: 'form-field-custom-control',
    loadComponent: () =>
      import('./form-field-custom-control/form-field-custom-control-example').then(
        (m) => m.FormFieldCustomControlExample,
      ),
  },
  { path: '**', redirectTo: '/todo-demo' },
];
