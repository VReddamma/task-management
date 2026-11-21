const Navbar = () => {
  return (
    <nav className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h1 className="text-xl font-bold text-blue-600">TaskFlow</h1>

      <div className="flex items-center gap-5">
        <button className="text-gray-600">🔔</button>

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
            👤
          </div>
          <span className="font-medium text-gray-700">Admin</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
