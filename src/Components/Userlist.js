// src/pages/UserList.js
import React, { useState, useEffect } from "react";
import "./UserList.css"; // CSS for styling

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true; // ✅ Prevent state updates after unmount
    fetchUsers(page, isMounted);

    return () => {
      isMounted = false; // Cleanup function
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
              <h3>{user.first_name} {user.last_name}</h3>
              <p>{user.email}</p>
              <button className="delete-btn" onClick={() => handleDelete(user.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
        <span>Page {page}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
};

export default UserList;
