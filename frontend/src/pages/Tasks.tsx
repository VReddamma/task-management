import { useCallback, useEffect, useState } from 'react';
import type { Task } from '../types/task';
import {
  createTask,
  deleteTask,
  getAllTasks,
  updateTask,
  type TaskQueryParams,
} from '../services/taskService';
import { getAllUsers, type User } from '../services/userService';
import TaskDetailModal from '../features/tasks/TaskDetailModal';
import TaskFormModal from '../features/tasks/TaskFormModal';
import type { TaskFormData } from '../schemas/taskSchema';
import TaskDeleteModal from '../features/tasks/TaskDeleteModal';

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Users
  const [user, setUser] = useState<User[]>([]);

  // Search and filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 5;

  // modals
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // fetchTasks
  const fetchTasks = useCallback(async () => {
    try {
      const params: TaskQueryParams = {
        search: search.trim() || undefined,
        status: status || undefined,
        priority: priority || undefined,
        page,
        limit,
      };

      const response = await getAllTasks(params);

      setTasks(response.items);
      setTotal(response.total);
      setTotalPages(response.total_pages);
      setError('');
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setError('Unable to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, status, priority, page]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setUser(response);
      } catch (error) {
        console.error(error);
        setError('Something went wrong');
      }
    };
    fetchUsers();
  }, []);

  const statusStyles: Record<string, string> = {
    Completed: 'bg-green-100 text-green-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    Overdue: 'bg-red-100 text-red-700',
  };

  const priorityStyles: Record<string, string> = {
    High: 'text-red-600',
    Medium: 'text-yellow-600',
    Low: 'text-green-600',
  };

  // Create Modal
  const handleOpenCreate = () => {
    setEditingTask(null);
    setIsFormModalOpen(true);
  };
  const handleCreateTask = async (data: TaskFormData) => {
    try {
      setError('');
      await createTask(data);
      setIsFormModalOpen(false);
      // Update/refresh in tasks table
      if (page != 1) {
        setPage(1);
      } else {
        await fetchTasks();
      }
    } catch (error) {
      console.log(error);
      setError('Something went wrong');
    }
  };

  // Edit Modal
  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormModalOpen(true);
  };

  const handleUpdateTask = async (data: TaskFormData) => {
    if (!editingTask) return;
    try {
      setError('');
      await updateTask(editingTask.id, data);
      setIsFormModalOpen(false);
      setEditingTask(null);
      await fetchTasks();
    } catch (err) {
      console.error('Failed to update task:', err);
      setError('Unable to update task. Please try again.');
    }
  };

  // prepare edit form data
  const getInitialFormData = (task: Task): TaskFormData => {
    console.log('Task assignee ID:', task.assignee_id);
    return {
      title: task.title,
      description: task.description ?? '',
      assignee_id: task.assignee_id,
      priority: task.priority,
      status: task.status,
      due_date: task.due_date,
    };
  };

  // Delete
  const handleDeleteTask = async () => {
    if (!deletingTask) return;
    try {
      setError('');
      await deleteTask(deletingTask.id);
      setDeletingTask(null);
      // pagination
      if (tasks?.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      } else {
        await fetchTasks();
      }
    } catch (error) {
      console.error(error);
      setError('Unable to delete task. Please try again.');
    }
  };

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Something Error Occurred</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-gray-800">Tasks</h2>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
          onClick={handleOpenCreate}
        >
          + Add Task
        </button>
      </div>
      {/* search and filters */}
      <div className="grid grid-cols-1 gap-3 rounded-xl bg-white p-4 shadow-sm md:grid-cols-3">
        {/* search */}
        <input
          type="text"
          name="search"
          value={search}
          placeholder="Search..."
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
        {/* status */}
        <select
          name="status"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="In Review">In Review</option>
          <option value="Completed">Completed</option>
        </select>

        {/* priority */}
        <select
          name="priority"
          value={priority}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          onChange={(event) => {
            setPriority(event.target.value);
            setPage(1);
          }}
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Task</th>
                <th className="px-6 py-4">Assignee</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {tasks?.map((task) => (
                <tr
                  key={task.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {task.title}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {task.assignee_id}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`font-medium ${priorityStyles[task.priority]}`}
                    >
                      {task.priority}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[task.status]}`}
                    >
                      {task.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-600">{task.due_date}</td>

                  <td className="px-6 py-4">
                    <button
                      className="text-green-600 hover:text-green-800 font-medium cursor-pointer mr-2"
                      onClick={() => {
                        setSelectedTask(task);
                        setIsDetailModalOpen(true);
                      }}
                    >
                      View
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer mr-2"
                      onClick={() => handleOpenEdit(task)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 font-medium cursor-pointer"
                      onClick={() => setDeletingTask(task)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t p-4">
            <p className="text-sm text-gray-500">
              Page {page} of {Math.max(totalPages, 1)}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((current) => current - 1)}
                className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
              >
                Previous
              </button>

              <button
                type="button"
                disabled={page >= totalPages || loading || totalPages === 0}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      {isDetailModalOpen && selectedTask && (
        <TaskDetailModal
          isDetailModalOpen={isDetailModalOpen}
          setIsDetailModalOpen={setIsDetailModalOpen}
          selectedTask={selectedTask}
        />
      )}
      {isFormModalOpen && (
        <TaskFormModal
          isFormModalOpen={isFormModalOpen}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          setIsFormModalOpen={setIsFormModalOpen}
          isEdit={!!editingTask}
          initialData={
            editingTask ? getInitialFormData(editingTask) : undefined
          }
        />
      )}
      {deletingTask && (
        <TaskDeleteModal
          taskTitle={deletingTask.title}
          onConfirm={handleDeleteTask}
          onClose={() => setDeletingTask(null)}
        />
      )}
    </div>
  );
};

export default Tasks;
