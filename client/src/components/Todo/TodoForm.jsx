import React, { useState, useContext } from 'react';
import { TodoContext } from '../../context/TodoContext';
import Button from '../UI/Button';

const TodoForm = () => {
    const [task, setTask] = useState('');
    const { addTodo } = useContext(TodoContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (task.trim()) {
            addTodo(task);
            setTask('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="todo-form">
            <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Add a new task"
                required
            />
            <Button type="submit">Add Todo</Button>
        </form>
    );
};

export default TodoForm;