import { Component, computed, signal } from '@angular/core';
import { FormField, FormRoot, form, required, submit } from '@angular/forms/signals';

type TodoItem = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: number;
};

type TodoDraft = {
  title: string;
};

const seedTodos: TodoItem[] = [
  { id: 1, title: 'Plan sprint goals', completed: false, createdAt: Date.now() - 60000 },
  { id: 2, title: 'Review pull request', completed: true, createdAt: Date.now() - 120000 },
  { id: 3, title: 'Ship demo to stakeholders', completed: false, createdAt: Date.now() - 180000 },
];

@Component({
  selector: 'app-todo-demo-page',
  imports: [FormField, FormRoot],
  template: `
    <main class="todo-demo-page">
      <section class="todo-panel" aria-labelledby="todo-demo-title">
        <header class="todo-header">
          <div>
            <p class="eyebrow">Checklist</p>
            <h1 id="todo-demo-title">Todo Demo</h1>
          </div>
          <div class="summary" aria-live="polite">
            <span>{{ remainingCount() }} remaining</span>
            <span>{{ completedCount() }} done</span>
          </div>
        </header>

        <form class="todo-form" [formRoot]="todoForm">
          <label class="sr-only" for="todo-input">Todo item</label>
          <input
            id="todo-input"
            type="text"
            [formField]="todoForm.title"
            [placeholder]="editingId() === null ? 'Add a task...' : 'Update this task...'"
            autocomplete="off"
            aria-label="Todo item"
          />

          <button type="submit" class="primary-button" [disabled]="todoForm().invalid()">
            {{ editingId() === null ? 'Add task' : 'Save changes' }}
          </button>

          @if (editingId() !== null) {
            <button type="button" class="secondary-button" (click)="cancelEdit()">Cancel</button>
          }
        </form>

        @if (todoForm.title().touched() && todoForm.title().errors().length > 0) {
          <p class="field-error" aria-live="polite">{{ todoForm.title().errors()[0].message }}</p>
        }

        @if (todos().length === 0) {
          <p class="empty-state">No tasks yet. Add one to get started.</p>
        } @else {
          <ul class="todo-list" aria-label="Todo list">
            @for (todo of todos(); track todo.id) {
              <li class="todo-item" [class.completed]="todo.completed">
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    [checked]="todo.completed"
                    (change)="toggleTodo(todo.id)"
                    [attr.aria-label]="'Mark ' + todo.title + ' as complete'"
                  />
                  <span>{{ todo.title }}</span>
                </label>

                <div class="todo-actions">
                  <button type="button" class="secondary-button" (click)="beginEdit(todo.id)">
                    Edit
                  </button>
                  <button type="button" class="danger-button" (click)="deleteTodo(todo.id)">
                    Delete
                  </button>
                </div>
              </li>
            }
          </ul>
        }
      </section>
    </main>
  `,
  styleUrl: './todo-demo-page.css',
})
export class TodoDemoPage {
  readonly todos = signal<TodoItem[]>(seedTodos);
  readonly draftModel = signal<TodoDraft>({ title: '' });
  readonly todoForm = form(
    this.draftModel,
    (schema) => {
      required(schema.title, { message: 'Task title is required' });
    },
    {
      submission: {
        action: async () => {
          await this.handleSubmit();
        },
      },
    },
  );
  readonly editingId = signal<number | null>(null);

  readonly remainingCount = computed<number>(
    () => this.todos().filter((todo) => !todo.completed).length,
  );
  readonly completedCount = computed<number>(
    () => this.todos().filter((todo) => todo.completed).length,
  );

  private async handleSubmit() {
    const trimmed = this.todoForm.title().value().trim();

    if (!trimmed) {
      return;
    }

    const currentEditId = this.editingId();

    if (currentEditId !== null) {
      this.todos.update((items) =>
        items.map((item) => (item.id === currentEditId ? { ...item, title: trimmed } : item)),
      );
      this.editingId.set(null);
    } else {
      const nextTodo: TodoItem = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        title: trimmed,
        completed: false,
        createdAt: Date.now(),
      };

      this.todos.update((items) => [nextTodo, ...items]);
    }

    this.draftModel.update((model) => ({
      title: '',
    }));

    this.todoForm().reset();
  }

  toggleTodo(id: number): void {
    this.todos.update((items) =>
      items.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)),
    );
  }

  beginEdit(id: number): void {
    const todo = this.todos().find((item) => item.id === id);

    if (!todo) {
      return;
    }

    this.editingId.set(id);
    this.draftModel.update((draft) => ({ title: todo.title }));
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.draftModel.update((draft) => ({ title: '' }));
  }

  deleteTodo(id: number): void {
    this.todos.update((items) => items.filter((item) => item.id !== id));

    if (this.editingId() === id) {
      this.cancelEdit();
    }
  }
}
