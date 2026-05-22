import { useState, useRef, useEffect } from "react";
import "./App.css";

interface Task {
  id: number;
  text: string;
  done: boolean;
}

type Filter = "all" | "active" | "completed";
 

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);

  useEffect(() => {
    if (editingId !== null) editInputRef.current?.focus();
  }, [editingId]);

  useEffect(() => {
  fetch("https://d1isxs8hczjncc.cloudfront.net/tasks")
    .then((res) => res.json())
    .then((data: Task[]) => {
      setTasks(data);

      const maxId = data.length > 0 ? Math.max(...data.map((task) => task.id)) : 0;
      nextId.current = maxId + 1;
    })
    .catch((err) => console.error("Failed to fetch tasks:", err));
}, []);

  const remaining = tasks.filter((t) => !t.done).length;

  const visible = tasks.filter((t) => {
    if (filter === "active") return !t.done;
    if (filter === "completed") return t.done;
    return true;
  });

  const addTask = () => {
    const text = newTask.trim();
    if (!text) return;
    setTasks((prev) => [...prev, { id: nextId.current++, text, done: false }]);
    setNewTask("");
  };

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = () => {
    const text = editText.trim();
    if (text) {
      setTasks((prev) =>
        prev.map((t) => (t.id === editingId ? { ...t, text } : t))
      );
    }
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <div className="header-icon">
          <CheckboxIcon size={16} />
        </div>
        <h1>My tasks</h1>
      </div>
      <p className="subtitle">
        {remaining} task{remaining !== 1 ? "s" : ""} remaining
      </p>

      {/* Input row */}
      <div className="input-row">
        <input
          className="task-input"
          type="text"
          placeholder="What needs to be done?"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button className="add-btn" onClick={addTask}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Add task
        </button>
      </div>

      {/* Filter tabs */}
      <div className="filters">
        {(["all", "active", "completed"] as Filter[]).map((f) => (
          <button
            key={f}
            className={`filter-btn${filter === f ? " active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="task-list">
        {visible.map((task) => (
          <div key={task.id} className="task-item">
            {/* Checkbox */}
            <div
              className={`checkbox${task.done ? " checked" : ""}`}
              role="checkbox"
              aria-checked={task.done}
              tabIndex={0}
              onClick={() => toggleTask(task.id)}
              onKeyDown={(e) => e.key === " " && toggleTask(task.id)}
            >
              {task.done && <CheckIcon />}
            </div>

            {/* Label or edit input */}
            {editingId === task.id ? (
              <input
                ref={editInputRef}
                className="edit-input"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit();
                  if (e.key === "Escape") cancelEdit();
                }}
                onBlur={saveEdit}
              />
            ) : (
              <span
                className={`task-label${task.done ? " done" : ""}`}
                onClick={() => toggleTask(task.id)}
              >
                {task.text}
              </span>
            )}

            {/* Actions */}
            <div className="task-actions">
              {editingId === task.id ? (
                <button className="icon-btn" aria-label="Save task" onClick={saveEdit}>
                  <SaveIcon />
                </button>
              ) : (
                <button className="icon-btn" aria-label="Edit task" onClick={() => startEdit(task)}>
                  <EditIcon />
                </button>
              )}
              <button className="icon-btn" aria-label="Delete task" onClick={() => deleteTask(task.id)}>
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Inline SVG icons ──────────────────────────────────────────────────────────

function CheckboxIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}