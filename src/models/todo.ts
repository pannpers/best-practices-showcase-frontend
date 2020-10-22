export class Todo {
  constructor(public title: string, public done = false) {}

  toObject() {
    return { title: this.title, done: this.done }
  }
}

export class TodoList {
  constructor(public id: string, public todos: Todo[]) {}
}
