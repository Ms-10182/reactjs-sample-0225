import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ListCard from './ListCard';
import Profile from './Profile';
import './Dashboard.css';

function Dashboard() {
  const { user, logout } = useAuth();
  const [todoLists, setTodoLists] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/v1/lists', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      if (data.success) {
        setTodoLists(data.data);
      }
    } catch (error) {
      console.error('Error fetching lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const addList = async () => {
    const title = prompt('Enter list title:');
    if (title && title.trim()) {
      try {
        const response = await fetch('http://localhost:8080/api/v1/lists', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ title: title.trim() }),
        });

        const data = await response.json();
        if (data.success) {
          setTodoLists([...todoLists, { ...data.data, tasks: [] }]);
        } else {
          alert('Failed to create list: ' + data.message);
        }
      } catch (error) {
        console.error('Error creating list:', error);
        alert('Failed to create list');
      }
    }
  };

  const deleteList = async (listId) => {
    if (window.confirm('Are you sure you want to delete this list?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/lists/${listId}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        const data = await response.json();
        if (data.success) {
          setTodoLists(todoLists.filter(list => list._id !== listId));
        } else {
          alert('Failed to delete list: ' + data.message);
        }
      } catch (error) {
        console.error('Error deleting list:', error);
        alert('Failed to delete list');
      }
    }
  };

  const updateListTasks = (listId, updatedTasks) => {
    setTodoLists(todoLists.map(list => 
      list._id === listId ? { ...list, tasks: updatedTasks } : list
    ));
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Todo Lists</h1>
        <div className="header-buttons">
          <span>Welcome, {user?.username}!</span>
          <button onClick={() => setShowProfile(true)}>Profile</button>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      {loading ? (
        <div className="loading">Loading lists...</div>
      ) : (
        <div className="lists-container">
          {todoLists.map(list => (
            <ListCard
              key={list._id}
              list={list}
              onDelete={deleteList}
              onUpdateTasks={updateListTasks}
            />
          ))}
        </div>
      )}

      <button className="add-list-btn" onClick={addList}>+</button>

      {showProfile && (
        <Profile user={user} onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
}

export default Dashboard;
