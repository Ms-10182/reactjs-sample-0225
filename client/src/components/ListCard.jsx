import { useState } from 'react';
import './ListCard.css';

function ListCard({ list, onDelete, onUpdateTasks }) {
  const [tasks, setTasks] = useState(list.tasks || []);
  const [loading, setLoading] = useState(false);

  const addTask = async () => {
    const content = prompt('Enter task:');
    if (content && content.trim()) {
      try {
        setLoading(true);
        const response = await fetch('https://reactjs-sample-0225-production.up.railway.app/api/v1/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ 
            content: content.trim(),
            listId: list._id 
          }),
        });

        const data = await response.json();
        if (data.success) {
          const newTasks = [...tasks, data.data];
          setTasks(newTasks);
          onUpdateTasks(list._id, newTasks);
        } else {
          alert('Failed to create task: ' + data.message);
        }
      } catch (error) {
        console.error('Error creating task:', error);
        alert('Failed to create task');
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleTask = async (taskId) => {
    try {
      const response = await fetch(`https://reactjs-sample-0225-production.up.railway.app/api/v1/tasks/${taskId}/toggle`, {
        method: 'PATCH',
        credentials: 'include',
      });

      const data = await response.json();
      if (data.success) {
        const updatedTasks = tasks.map(task =>
          task._id === taskId ? data.data : task
        );
        setTasks(updatedTasks);
        onUpdateTasks(list._id, updatedTasks);
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await fetch(`https://reactjs-sample-0225-production.up.railway.app/api/v1/tasks/${taskId}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        const data = await response.json();
        if (data.success) {
          const updatedTasks = tasks.filter(task => task._id !== taskId);
          setTasks(updatedTasks);
          onUpdateTasks(list._id, updatedTasks);
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  return (
    <div className="list-card">
      <div className="list-header">
        <h3>{list.title}</h3>
        <button onClick={() => onDelete(list._id)} className="delete-list-btn">×</button>
      </div>
      
      <div className="tasks">
        {tasks.map(task => (
          <div key={task._id} className={`task ${task.isCompleted ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={task.isCompleted}
              onChange={() => toggleTask(task._id)}
            />
            <span>{task.content}</span>
            <button onClick={() => deleteTask(task._id)} className="delete-task-btn">×</button>
          </div>
        ))}
        {tasks.length === 0 && (
          <p className="no-tasks">No tasks yet. Add one below!</p>
        )}
      </div>
      
      <button 
        className="add-task-btn" 
        onClick={addTask}
        disabled={loading}
      >
        {loading ? '...' : '+'}
      </button>
    </div>
  );
}

export default ListCard;
