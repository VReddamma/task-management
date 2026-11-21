import { useEffect, useState } from 'react';
import { getAllUsers, type User } from '../services/userService';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setError('Unable to load users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Team Members</h1>

      {users.map((user) => (
        <div key={user.id} className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="font-semibold">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>
      ))}
    </div>
  );
};

export default Users;
