import { User } from './../models/user'
import { autoinject } from 'aurelia-framework'
import { Todo, TodoList } from './../models/todo'
import { getLogger } from 'aurelia-logging'
import { FirebaseApp } from './firebase/firebase'
import 'firebase/firestore'

type Collections = 'users' | 'todos'

@autoinject
export class StoreService {
  private readonly logger = getLogger(StoreService.name)

  private store: firebase.firestore.Firestore

  constructor(private firebaseApp: FirebaseApp) {
    this.store = this.firebaseApp.app.firestore()
  }

  async listTodoLists(uid: string): Promise<TodoList[]> {
    const query = await this.getTodoRef(uid).get()
    const todoLists: TodoList[] = []

    query.forEach(snapshot => {
      const d = snapshot.data()

      todoLists.push(
        new TodoList(
          snapshot.id,
          d.todos.map(t => new Todo(t.title, t.done)),
        ),
      )
    })
    return todoLists
  }

  async addTodoList(uid: string, todos: Todo[]): Promise<void> {
    this.getTodoRef(uid).add({
      todos: todos.map(todo => todo.toObject()),
    })
  }

  async getUser(uid: string): Promise<User> {
    const docRef = await this.getCollectionRef('users').doc(uid).get()

    const d = docRef.data()
    return new User(uid, d.name, d.photoUrl, d.permissions)
  }

  async listUsers(): Promise<User[]> {
    const query = await this.getCollectionRef('users').get()
    const users: User[] = []

    query.forEach(snapshot => {
      const d = snapshot.data()
      users.push(new User(snapshot.id, d.name, d.photoUrl, d.permissions))
    })

    return users
  }

  private getTodoRef(uid: string): firebase.firestore.CollectionReference {
    return this.getCollectionRef('users').doc(uid).collection('todos')
  }

  private getCollectionRef(col: Collections): firebase.firestore.CollectionReference {
    return this.store.collection(col)
  }
}
