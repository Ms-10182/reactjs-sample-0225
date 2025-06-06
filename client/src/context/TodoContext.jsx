import React, { createContext, useState, useContext } from 'react';

const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
    const [todos, setTodos] = useState([]);

    const addTodo = (todo) => {
        const newTodo = {
            id: Date.now(),
            text: todo,
            completed: false
        };
        setTodos((prevTodos) => [...prevTodos, newTodo]);
    };

    const removeTodo = (id) => {
        setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== id));
    };

    const editTodo = (id, updatedTodo) => {
        setTodos((prevTodos) => prevTodos.map(todo => (todo.id === id ? updatedTodo : todo)));
    };

    return (
        <TodoContext.Provider value={{ todos, addTodo, removeTodo, editTodo }}>
            {children}
        </TodoContext.Provider>
    );
};

export const useTodo = () => {
    return useContext(TodoContext);
};

// Export TodoContext as named export
export { TodoContext };