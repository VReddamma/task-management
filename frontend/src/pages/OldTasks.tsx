import { useMemo, useState } from 'react';
import { tasksData } from '../features/tasks/taskData';
import TaskFormModal from '../features/tasks/TaskFormModal';
import type { TaskFormData } from '../features/tasks/taskSchema';
import TaskDetailsModal from '../features/tasks/TaskDetailsModal';
import type { Task } from '../types/task';
import DeleteTaskModal from '../features/tasks/DeleteTaskModal';

const Tasks = () => {
  const [tasks, setTasks] = useState(tasksData);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const [sortBy, setSortBy] = useState('title');
  const [page, setPage] = useState(1);
  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  // De;ete modals
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);

  const limit = 5;

  // Filtering and searching
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus = status === 'All' || task.status === status;

      const matchesPriority = priority === 'All' || task.priority === priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, search, status, priority]);

  // Sorting
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'due_date') {
      return a.due_date.localeCompare(b.due_date);
    }

    return a.title.localeCompare(b.title);
  });

  // Pagination
  const totalPages = Math.ceil(sortedTasks.length / limit);

  const startIndex = (page - 1) * limit;

  const paginatedTasks = sortedTasks.slice(startIndex, startIndex + limit);

  const getStatusColor = (value: string) => {
    switch (value) {
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700';
      case 'In Review':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getPriorityColor = (value: string) => {
    switch (value) {
      case 'High':
        return 'text-red-600';
      case 'Medium':
        return 'text-orange-500';
      default:
        return 'text-green-600';
    }
  };

  // modal
  const handleCreateTask = (data: TaskFormData) => {
    console.log('New Task:', data);

    setIsModalOpen(false);
  };

  // Edit
  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  // VIew
  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsModalOpen(true);
  };

  // Update
  const handleUpdateTask = (data: TaskFormData) => {
    console.log('Updated Task:', data);

    setIsEditModalOpen(false);
    setSelectedTask(null);
  };

  // delete
  const handleDeleteClick = (task: Task) => {
    setDeleteTask(task);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTask) return;

    setTasks((prev) => prev.filter((task) => task.id !== deleteTask.id));

    setDeleteTask(null);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">All Tasks</h1>
          <p className="text-gray-500 mt-1">
            Manage and track all your team tasks.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 cursor-pointer"
        >
          + Create Task
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-purple-300"
          />

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="border border-gray-200 rounded-lg px-4 py-2"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="In Review">In Review</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value);
              setPage(1);
            }}
            className="border border-gray-200 rounded-lg px-4 py-2"
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2"
          >
            <option value="title">Sort by Title</option>
            <option value="due_date">Sort by Due Date</option>
          </select>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="p-4">Task</th>
                <th className="p-4">Assignee</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedTasks.map((task) => (
                <tr key={task.id} className="border-t border-gray-100 text-sm">
                  <td className="p-4 font-medium text-gray-800">
                    {task.title}
                  </td>

                  <td className="p-4 text-gray-600">{task.assignee}</td>

                  <td
                    className={`p-4 font-medium ${getPriorityColor(task.priority)}`}
                  >
                    {task.priority}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
                    >
                      {task.status}
                    </span>
                  </td>

                  <td className="p-4 text-gray-600">{task.due_date}</td>
                  <td className="p-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleViewTask(task as Task)}
                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        View
                      </button>

                      <button
                        onClick={() => handleEditTask(task as Task)}
                        className="text-purple-600 hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(task as Task)}
                        className="text-red-600 hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {paginatedTasks.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-gray-500">
                    No tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Showing {filteredTasks.length === 0 ? 0 : startIndex + 1} to{' '}
            {Math.min(startIndex + limit, sortedTasks.length)} of{' '}
            {sortedTasks.length} tasks
          </p>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-3 py-2 border rounded-lg disabled:opacity-40"
            >
              Previous
            </button>

            <span className="px-3 py-2 text-sm">
              {page} / {Math.max(totalPages, 1)}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-3 py-2 border rounded-lg disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {/* create form */}
      {isModalOpen && (
        <TaskFormModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateTask}
        />
      )}
      {/* edit form */}
      {isEditModalOpen && selectedTask && (
        <TaskFormModal
          initialData={{
            title: selectedTask.title,
            description: selectedTask.description,
            assignee_id: selectedTask.assignee_id,
            priority: selectedTask.priority,
            status: selectedTask.status,
            due_date: selectedTask.due_date,
          }}
          isEdit
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTask(null);
          }}
          onSubmit={handleUpdateTask}
        />
      )}

      {isDetailsModalOpen && selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedTask(null);
          }}
        />
      )}
      {/* Delete modal */}
      {isDeleteModalOpen && deleteTask && (
        <DeleteTaskModal
          taskTitle={deleteTask.title}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeleteTask(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default Tasks;
