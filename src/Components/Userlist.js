// src/pages/UserList.js
import React, { useState, useEffect } from "react";
import "./UserList.css"; 

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({ first_name: "", last_name: "", email: "" });

  useEffect(() => {
    let isMounted = true; 
    fetchUsers(page, isMounted);

    return () => {
      isMounted = false; 
    };
  }, [page]);

  const fetchUsers = async (page, isMounted) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`https://reqres.in/api/users?page=${page}`);
      const data = await response.json();
      if (isMounted) {
        setUsers(data.data);
        setTotalPages(data.total_pages);
      }
    } catch (error) {
      if (isMounted) setError("Failed to fetch users. Try again later.");
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };

  const handleDelete = (id) => {
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);

    if (updatedUsers.length === 0) {
      alert("No more users left on this page!");
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setEditForm({ first_name: user.first_name, last_name: user.last_name, email: user.email });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = (id) => {
    setUsers(users.map(user => (user.id === id ? { ...user, ...editForm } : user)));
    setEditingUserId(null);
  };

  return (
    <div className="user-list-container">
      <h2>User List</h2>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="user-grid">
          {users.map(user => (
            <div key={user.id} className="user-card">
              <img src={user.avatar} alt={user.first_name} />
              
              {editingUserId === user.id ? (
                <>
                  <input
                    type="text"
                    name="first_name"
                    value={editForm.first_name}
                    onChange={handleEditChange}
                  />
                  <input
                    type="text"
                    name="last_name"
                    value={editForm.last_name}
                    onChange={handleEditChange}
                  />
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                  />
                  <div className="user-actions">
                  <button className="save-btn" onClick={() => handleEditSubmit(user.id)}>Save</button>
                  <button className="cancel-btn" onClick={() => setEditingUserId(null)}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <h3>{user.first_name} {user.last_name}</h3>
                  <p>{user.email}</p>
                  <div className="user-actions">
                  <i className="fa fa-edit" onClick={() => handleEdit(user)} title="Edit"></i>
                  <i class="fa fa-trash-o" onClick={() => handleDelete(user.id)} title="Delete"></i>
                  {/* <i class="material-icons" onClick={() => handleDelete(user.id)}></i> */}
                  {/* <button className="edit-btn" onClick={() => handleEdit(user)}>Edit</button> */}
                  {/* <button className="delete-btn" onClick={() => handleDelete(user.id)}>Delete</button> */}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>&larr; Previous</button>
        <span className="span">Page {page}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next &rarr;</button>
      </div>
    </div>
  );
};

export default UserList;
