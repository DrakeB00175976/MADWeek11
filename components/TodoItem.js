// components/TodoItem.js
// One row in the todo list.
// This component now receives a third prop: onDelete (a function from App.js).

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function TodoItem({ title, completed, onDelete }) {
  return (
    <View style={styles.row}>
      <Text style={styles.icon}>{completed ? "✅" : "⬜"}</Text>
      <Text style={[styles.title, completed && styles.done]}>{title}</Text>

      {/* TODO 2: Add a Delete button here.
          - Use <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          - Inside it, show <Text style={styles.deleteText}>Delete</Text>
          The styles deleteButton and deleteText are already provided below.
      */}
    </View>
  );
}

// ---------- Styles (provided) ----------
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 14,
    marginBottom: 8,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  icon: { fontSize: 18, marginRight: 10 },
  title: { fontSize: 16, color: "#222", flex: 1 },
  done: { textDecorationLine: "line-through", color: "#999" },
  deleteButton: {
    backgroundColor: "#fee2e2",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 10,
  },
  deleteText: { color: "#b91c1c", fontWeight: "bold" },
});
