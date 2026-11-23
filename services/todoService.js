// services/todoService.js
// All Firestore code for todos lives in this file.
// addTodo and fetchTodos are finished (from Labs 09 and 10).
// In this lab you complete deleteTodo (TODO 1).

import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

// Reference to the "todos" collection in Firestore
const todosCollection = collection(db, "todos");

export async function addTodo(title) {
  await addDoc(todosCollection, {
    title: title,
    completed: false,
    createdAt: serverTimestamp(),
  });
}

export async function fetchTodos() {
  const snapshot = await getDocs(todosCollection);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ---------- Lab 11: Delete (YOU complete this) ----------

/**
 * TODO 1: Delete one todo
 *
 * Steps:
 *   1. Build a reference to the single document:
 *        const todoRef = doc(db, "todos", id);
 *   2. Delete it with deleteDoc and await the result:
 *        await deleteDoc(todoRef);
 *
 * Note: "doc" (the function above) points to ONE document,
 *       while "collection" points to the whole group of documents.
 */
export async function deleteTodo(id) {
  const todoRef = doc(db, "todos", id);
  await deleteDoc(todoRef);
}