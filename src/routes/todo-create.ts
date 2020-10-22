import { getLogger } from 'aurelia-logging'
import { StoreService } from './../services/store'
import { Todo } from './../models/todo'
import { autoinject } from 'aurelia-framework'

@autoinject
export class TodoCreate {
  private readonly logger = getLogger(TodoCreate.name)

  uid: string
  todos: Todo[] = []

  title: string

  constructor(private store: StoreService) {}

  activate(params) {
    this.uid = params.uid
  }

  addTodo() {
    if (!this.title) {
      return
    }
    this.todos.push(new Todo(this.title))

    this.title = ''
  }

  removeTodo(todo: Todo) {
    const idx = this.todos.indexOf(todo)
    if (idx !== -1) {
      this.todos.splice(idx, 1)
    }
  }

  async save() {
    try {
      await this.store.addTodoList(this.uid, this.todos)
    } catch (err) {
      this.logger.error('failed to save To-Do', err)
    }
  }
}
