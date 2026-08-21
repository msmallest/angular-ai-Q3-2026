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
  standalone: true,
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
                  <button type="button" class="secondary-button" (click)="beginEdit(todo.id)">Edit</button>
                  <button type="button" class="danger-button" (click)="deleteTodo(todo.id)">Delete</button>
                </div>
              </li>
            }
          </ul>
        }
      </section>
    </main>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(135deg, #f4f7fb 0%, #eef3ff 100%);
      font-family: 'Segoe UI', sans-serif;
      color: #1f2937;
    }

    .todo-demo-page {
      display: grid;
      place-items: center;
      padding: 2rem 1rem;
    }

    .todo-panel {
      width: min(100%, 48rem);
      background: #ffffff;
      border: 1px solid #dfe7f5;
      border-radius: 1.25rem;
      box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
      padding: 2rem;
    }

    .todo-header {
      display: flex;
      justify-content: space-between;
      align-items: end;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .eyebrow {
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.72rem;
      font-weight: 700;
      color: #4f46e5;
    }

    h1 {
      margin: 0.3rem 0 0;
      font-size: clamp(2rem, 3vw, 2.5rem);
    }

    .summary {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.25rem;
      color: #475569;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .todo-form {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    input[type='text'] {
      flex: 1 1 16rem;
      min-width: 0;
      padding: 0.9rem 1rem;
      border-radius: 0.85rem;
      border: 1px solid #cbd5e1;
      font-size: 1rem;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    input[type='text']:focus {
      outline: none;
      border-color: #4f46e5;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
    }

    button {
      border: none;
      border-radius: 0.85rem;
      padding: 0.8rem 1.1rem;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.15s ease, opacity 0.15s ease;
    }

    button:hover {
      transform: translateY(-1px);
    }

    .primary-button {
      background: #4f46e5;
      color: #ffffff;
    }

    .secondary-button {
      background: #e2e8f0;
      color: #0f172a;
    }

    .danger-button {
      background: #fee2e2;
      color: #b91c1c;
    }

    .empty-state {
      margin: 0;
      padding: 1rem 0.25rem;
      color: #64748b;
      font-size: 1rem;
    }

    .todo-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 0.75rem;
    }

    .todo-item {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: center;
      padding: 1rem 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.9rem;
      background: #f8fafc;
    }

    .todo-item.completed {
      background: #f0fdf4;
      border-color: #bbf7d0;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1rem;
      cursor: pointer;
      flex: 1;
      min-width: 0;
    }

    .checkbox-label input {
      width: 1.1rem;
      height: 1.1rem;
      accent-color: #10b981;
    }

    .todo-item.completed .checkbox-label span {
      text-decoration: line-through;
      color: #64748b;
    }

    .todo-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      border: 0;
      white-space: nowrap;
    }

    @media (max-width: 640px) {
      .todo-panel {
        padding: 1.25rem;
      }

      .todo-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .summary {
        align-items: flex-start;
      }

      .todo-item {
        flex-direction: column;
        align-items: stretch;
      }

      .todo-actions {
        width: 100%;
      }

      .todo-actions button {
        flex: 1;
      }
    }
  `,
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
        items.map((item) =>
          item.id === currentEditId ? { ...item, title: trimmed } : item,
        ),
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
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
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
