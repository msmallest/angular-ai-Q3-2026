import { Component, computed, signal } from '@angular/core';

type TodoItem = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: number;
};

const seedTodos: TodoItem[] = [
  { id: 1, title: 'Plan sprint goals', completed: false, createdAt: Date.now() - 60000 },
  { id: 2, title: 'Review pull request', completed: true, createdAt: Date.now() - 120000 },
  { id: 3, title: 'Ship demo to stakeholders', completed: false, createdAt: Date.now() - 180000 },
];

@Component({
  selector: 'app-todo-demo-page',
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

        <form class="todo-form" (submit)="handleSubmit($event)">
          <label class="sr-only" for="todo-input">Todo item</label>
          <input
            id="todo-input"
            type="text"
            [value]="draft()"
            (input)="setDraft($any($event.target).value)"
            [placeholder]="editingId() === null ? 'Add a task...' : 'Update this task...'"
            autocomplete="off"
            aria-label="Todo item"
          />

          <button type="submit" class="primary-button">
            {{ editingId() === null ? 'Add task' : 'Save changes' }}
          </button>

          @if (editingId() !== null) {
            <button type="button" class="secondary-button" (click)="cancelEdit()">Cancel</button>
          }
        </form>

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
  readonly draft = signal('');
  readonly editingId = signal<number | null>(null);

  readonly remainingCount = computed(() => this.todos().filter((todo) => !todo.completed).length);
  readonly completedCount = computed(() => this.todos().filter((todo) => todo.completed).length);

  setDraft(value: string): void {
    this.draft.set(value);
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    this.addOrUpdateTodo();
  }

  addOrUpdateTodo(): void {
    const trimmed = this.draft().trim();

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

    this.draft.set('');
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
    this.draft.set(todo.title);
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.draft.set('');
  }

  deleteTodo(id: number): void {
    this.todos.update((items) => items.filter((item) => item.id !== id));

    if (this.editingId() === id) {
      this.cancelEdit();
    }
  }
}
