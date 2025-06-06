import { useState } from 'react';
import './TodoList.css';

function TodoList({ list, onDelete, onUpdate }) {
  const [todos, setTodos] = useState(list.todos);

  const addTodo = () => {
    const text = prompt('Enter todo:');
    if (text) {
      const newTodo = {
        id: Date.now(),
        text,
        completed: false
      };
      const updatedTodos = [...todos, newTodo];
      setTodos(updatedTodos);
      onUpdate(list.id, updatedTodos);
    }
  };

  const toggleTodo = (todoId) => {
    const updatedTodos = todos.map(todo =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    onUpdate(list.id, updatedTodos);
  };

  const deleteTodo = (todoId) => {
    const updatedTodos = todos.filter(todo => todo.id !== todoId);
    setTodos(updatedTodos);
    onUpdate(list.id, updatedTodos);
  };

  return (
    <div className="todo-list">
      <div className="list-header">
        <h3>{list.title}</h3>
        <button onClick={() => onDelete(list.id)}>×</button>
      </div>
      
      <div className="todos">
        {todos.map(todo => (
          <div key={todo.id} className={`todo ${todo.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)}>×</button>
          </div>
        ))}
      </div>
      
      <button className="add-todo-btn" onClick={addTodo}>+</button>
    </div>
  );
}

export default TodoList;
