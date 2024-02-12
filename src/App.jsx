import { useState, useEffect } from "react";
import { Input, Button, List, Space, DatePicker } from "antd";
import { DeleteOutlined, CheckCircleOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function Home() {
  const [todos, setTodos] = useState(() => {
    const storedTodos =
      typeof window !== "undefined" ? localStorage.getItem("todos") : null;
    return storedTodos ? JSON.parse(storedTodos) : [];
  });
  const [todoInput, setTodoInput] = useState({
    title: "",
    isCompleted: false,
    dueDate: null,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos]);

  const handleAddTodo = () => {
    if (!todoInput?.title || /^\s*$/.test(todoInput?.title)) return;
    const dueDate = todoInput?.dueDate ? dayjs(todoInput?.dueDate) : null;
    const newTodos = [...todos, { ...todoInput, isCompleted: false, dueDate }];
    setTodos(newTodos);
    setTodoInput({});
  };

  const handleDeleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  const handleCompleteTodo = (index) => {
    const newTodos = todos.map((todo, i) => {
      if (i === index) {
        return { ...todo, isCompleted: !todo.isCompleted };
      }
      return todo;
    });
    setTodos(newTodos);
  };

  return (
    <div className="App">
      <h1>Task Manager</h1>
      <h3>Manage your tasks with ease.</h3>
      <Space.Compact>
        <Input
          placeholder="Enter your todo"
          value={todoInput?.title || ""}
          onChange={(e) => {
            setTodoInput({
              ...todoInput,
              title: e.target.value,
            });
          }}
          style={{ marginBottom: "5px" }}
          addonAfter={
            <>
              <DatePicker
                variant="outlined"
                placeholder="Select due date"
                value={todoInput?.dueDate}
                onChange={(date, dateString) => {
                  console.log(date, dateString);
                  setTodoInput({
                    ...todoInput,
                    dueDate: date,
                  });
                }}
                picker="date"
              />
              <Button type="primary" onClick={handleAddTodo}>
                Add Todo
              </Button>
            </>
          }
        />
      </Space.Compact>
      <List
        style={{ marginTop: "20px" }}
        bordered
        dataSource={todos}
        renderItem={(todo, index) => (
          <List.Item
            actions={[
              <Button
                title={
                  todo.isCompleted ? "Mark as incomplete" : "Mark as complete"
                }
                key={`${index}-complete`}
                icon={<CheckCircleOutlined />}
                onClick={() => handleCompleteTodo(index)}
              />,
              <Button
                title="Delete"
                key={`${index}-delete`}
                icon={<DeleteOutlined />}
                danger
                onClick={() => handleDeleteTodo(index)}
              />,
            ]}
          >
            <div
              style={{
                textDecoration: todo.isCompleted ? "line-through" : "none",
              }}
            >
              {todo.title}
            </div>
            <div
              title={todo.dueDate && dayjs(todo.dueDate).format("MMMM D, YYYY")}
            >
              {todo.dueDate ? dayjs(todo.dueDate).fromNow() : "No due date"}
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}
