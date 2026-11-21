import { NavLink } from 'react-router-dom';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Tasks', path: '/tasks' },
  { name: 'Users', path: '/users' },
];

const Sidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-5">
      <h2 className="text-xs text-gray-400 mb-5">MAIN MENU</h2>

      <div className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-slate-800'
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
