# MAD Week 11 – Deleting Data from Firestore (Todo App)


## 1. Lab Overview


By the end, your Todo app will let a user:

1. Add a todo 
2. See all todos 
3. Delete a todo with a button, after confirming (**new in this lab**)

## 2. Learning Outcomes

By the end of this lab you will be able to:

- Explain how a Firestore document is identified by its **document ID**
- Get a reference to one document with `doc()`
- Delete a document with `deleteDoc()`
- Pass a function from a parent screen to a child component as a **prop**
- Ask the user to confirm before a destructive action
- Update the list on screen without reading everything from Firestore again

## 3. Prerequisites

- A working Week 10 app: you can add todos and see them after a restart
- `firebaseConfig.js` from Week 10 (no changes needed in this lab)
- Firestore rules that allow `write` (the Lab 10 rules already do, and `write` includes delete)
        |

## 4. Project Structure

```
MADWeek11/
├── App.js                
├── firebaseConfig.js       
├── services/
│   └── todoService.js       
├── components/
│   └── TodoItem.js           
├── package.json
└── README.md
```

`addTodo` and `fetchTodos` are already finished in `todoService.js`. Only the delete part is new.

---

## 5. Step-by-Step Instructions

### Part 1: Setup 

1. Copy your finished Week 10 project into a new folder called `MADWeek11`, or continue in the same project.
2. Replace `App.js`, `services/todoService.js`, and `components/TodoItem.js` with the templates from this repo.
3. Make sure you have at least 3 todos in Firestore so you have something to delete.
4. Run the app:

```bash
npx expo start
```

**Checkpoint:** you see your todos in the list. Nothing can be deleted yet.

---

### Part 2: Delete a Document in Firestore

Every Firestore document has a unique **ID**. In week 09 you stored it with each todo:

```js
{ id: doc.id, ...doc.data() }
```

That `id` is how we tell Firestore which todo to delete.

Open `services/todoService.js` and complete **TODO 1**: write `deleteTodo(id)`.

```js
export async function deleteTodo(id) {
  const todoRef = doc(db, "todos", id);
  await deleteDoc(todoRef);
}
```

Add the following line inside loadTodo() defn below fetchTodos().

```js 
await deleteTodo(data[0].id);
```
Two steps:

1. Build a reference to the one document: `doc(db, "todos", id)`
2. Delete it: `await deleteDoc(thatReference)`

```
todos (collection)
 ├── abc123  <- doc(db, "todos", "abc123") points here
 ├── def456
 └── ghi789
```

**Checkpoint:** nothing visible changes in the app yet. That is expected, because no button calls `deleteTodo` yet.

---

### Part 3: Add the Delete Button

You will connect three pieces:

```
TodoItem (button)  -->  App.js (handleDelete)  -->  todoService (deleteTodo)  -->  Firestore
```


1. In `components/TodoItem.js`, complete **TODO 2**: add a Delete button that calls the `onDelete` function it receives as a prop.

```js 
<TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
  <Text style={styles.deleteText}>Delete</Text>
</TouchableOpacity>
```


2. In `App.js`, complete **TODO 3**: write `handleDelete(id)` that deletes the todo and then reloads the list with `loadTodos()`.

```js
const handleDelete = async (id) => {
  try {
    // TODO 3a
    await deleteTodo(id);

    // TODO 3b
    await loadTodos();
  } catch (error) {
    Alert.alert("Error", "Could not delete todo: " + error.message);
  }
};
```

3. In `App.js`, complete **TODO 4**: pass `onDelete` to each `TodoItem` in the `FlatList`.

```js 
<TodoItem
  title={item.title}
  completed={item.completed}
  onDelete={() => handleDelete(item.id)}
/>
```

**Checkpoint:** press Delete on a todo. It disappears from the list, and its document is gone from the Firebase Console.

> At this point there is no "are you sure?" step. One accidental tap deletes a todo. We fix that next.

---

### Part 4: Confirmation and a Faster Update 

**TODO 5: Ask before deleting.**
Use the provided `confirmAction(message, onConfirm)` helper. It shows a dialog with **Cancel** and **Delete**, and only calls `handleDelete` if the user confirms.

1. In `App.js`, write `confirmDelete(item)` so it calls `confirmAction` and passes `() => handleDelete(item.id)` as the confirm action.

```js 
const confirmDelete = (item) => {
  confirmAction(`Delete "${item.title}"?`, () => handleDelete(item.id));
};
```

2. In the `FlatList`, change the `onDelete` you wrote in TODO 4 so it calls `confirmDelete(item)` instead of `handleDelete(item.id)`.

```js
<TodoItem
  title={item.title}
  completed={item.completed}
  onDelete={() => confirmDelete(item)}
/>
```

> **Why a helper?** On the **web**, `Alert.alert` with buttons does nothing. The helper uses `window.confirm` on the web and `Alert.alert` on phones, so it works everywhere. This is also why error alerts may not show in the browser.

**TODO 6: Update the list without reading again.**
Right now `handleDelete` calls `loadTodos()`, which reads every todo from Firestore again and flashes the spinner. Since we already know which todo was deleted, we can just remove it from the list in memory:

```js
setTodos((current) => current.filter((todo) => todo.id !== id));
```

Replace the `loadTodos()` call in `handleDelete` with this line.

``` js
const handleDelete = async (id) => {
  try {
    await deleteTodo(id);

    // TODO 6: remove it from the screen without reading Firestore again
    setTodos((current) => current.filter((todo) => todo.id !== id));
  } catch (error) {
    Alert.alert("Error", "Could not delete todo: " + error.message);
  }
};
```

| Approach | Pros | Cons |
|---|---|---|
| Reload from Firestore | Always matches the database | Slower, flashing spinner |
| Remove from state | Instant | The screen could drift from the database if something else changes it |

**Checkpoint:** tapping Delete shows a confirmation. Cancel keeps the todo, Delete removes it instantly with no spinner.

---

### Part 5: Test and Submit

| Test | Expected result |
|---|---|
| Delete a todo and confirm | It disappears from the list and from Firestore |
| Delete a todo and press Cancel | Nothing changes |
| Restart the app after deleting | The deleted todo does not come back |
| Delete every todo | "No todos yet" is shown |
| Add a new todo after deleting | It appears in the list as before |



## 6. Common Problems

| Problem | Likely cause and fix |
|---|---|
| Pressing Delete does nothing | `onDelete` is not passed in `App.js` (TODO 4), or not used in `TodoItem` (TODO 2) |
| `Missing or insufficient permissions` | Firestore rules must allow `write`; press **Publish** after editing them |
| Deleted todo comes back after restart | `deleteTodo` never ran, or `await` is missing |
| `doc is not a function` / `deleteDoc is not defined` | Add `doc` and `deleteDoc` to the import from `firebase/firestore` |
| Wrong todo is deleted | Check you pass `item.id`, not the index |
| Confirmation never appears on the web | Use the `confirmAction` helper, not `Alert.alert` directly |
| Whole list vanishes | Check TODO 6: the filter must use `!==` |

## 7. Extension Tasks (if you finish early)

- **Mark as completed:** tap a todo to toggle `completed` using `updateDoc(doc(db, "todos", id), { completed: true })`
- **Sort newest first:** use `query(todosCollection, orderBy("createdAt", "desc"))` in `fetchTodos`
- **Clear completed:** add a button that deletes every todo where `completed` is true
 "# MADWeek11" 
