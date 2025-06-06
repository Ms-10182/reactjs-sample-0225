import React from 'react';

const TodoItem = ({ todo, onDelete, onEdit }) => {
    return (
        <div className="todo-item">
            <span>{todo.text}</span>
            <button onClick={() => onEdit(todo.id)}>Edit</button>
            <button onClick={() => onDelete(todo.id)}>Delete</button>
        </div>
    );
};

export default TodoItem;