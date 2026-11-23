// App.js
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import TodoItem from "./components/TodoItem";
import { addTodo, fetchTodos, deleteTodo } from "./services/todoService";


function confirmAction(message, onConfirm) {
  if (Platform.OS === "web") {
    if (window.confirm(message)) onConfirm();
  } else {
    Alert.alert("Please confirm", message, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: onConfirm },
    ]);
  }
}

export default function App() {
  // ---------- State ----------
  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await fetchTodos();
      setTodos(data);
    } catch (error) {
      Alert.alert("Error", "Could not load todos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleAdd = async () => {
    if (text.trim() === "") return;
    try {
      await addTodo(text.trim());
      setText("");
      await loadTodos();
    } catch (error) {
      Alert.alert("Error", "Could not save todo: " + error.message);
    }
  };

  // ---------- Delete (Lab 11: YOU complete this) ----------

  // TODO 3: Delete a todo.
  //   a) Call deleteTodo(id) and await it.
  //   b) Then call loadTodos() to refresh the list.
  //
  // TODO 6 (do this last): Replace loadTodos() with a faster update that
  //   removes the todo from state without reading Firestore again:
  //     setTodos((current) => current.filter((todo) => todo.id !== id));
  const handleDelete = async (id) => {
    try {
      // TODO 3a: YOUR CODE HERE
     
    // TODO 3a
    await deleteTodo(id);

    // TODO 3b
    setTodos((current) => current.filter((todo) => todo.id !== id));
  } catch (error) {
    Alert.alert("Error", "Could not delete todo: " + error.message);
  }
};

  // TODO 5: Ask before deleting.
  //   Write confirmDelete(item) that calls the provided helper:
  //     confirmAction(`Delete "${item.title}"?`, () => handleDelete(item.id));
  //   Then, in the FlatList below, change onDelete so it calls
  //   confirmDelete(item) instead of handleDelete(item.id).
  const confirmDelete = (item) => {
    // TODO 5: YOUR CODE HERE
  confirmAction(`Delete "${item.title}"?`, () => handleDelete(item.id));
};

  // ---------- Screen ----------
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>My Todos</Text>

      {/* Input row */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="What needs to be done?"
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity style={styles.button} onPress={handleAdd}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4f46e5" />
      ) : (
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TodoItem
              title={item.title}
              completed={item.completed}
                onDelete={() => confirmDelete(item)}

              // TODO 4: Pass the delete function to the row:
              //   onDelete={() => handleDelete(item.id)}
              // (In TODO 5 you will change this to confirmDelete(item).)
            />
          )}
          ListEmptyComponent={<Text style={styles.empty}>No todos yet</Text>}
        />
      )}
    </SafeAreaView>
  );
}

// ---------- Styles (provided) ----------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f4f8", padding: 16, paddingTop: 48 },
  header: { fontSize: 28, fontWeight: "bold", marginBottom: 16, color: "#1a1a2e" },
  inputRow: { flexDirection: "row", marginBottom: 16 },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 8,
  },
  button: {
    backgroundColor: "#4f46e5",
    borderRadius: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  empty: { textAlign: "center", color: "#888", marginTop: 40, fontSize: 16 },
});
