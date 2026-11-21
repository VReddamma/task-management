import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CommonModal from '../../components/common/CommonModal';
import { taskSchema, type TaskFormData } from '../../schemas/taskSchema';
import { useEffect, useState } from 'react';
import { getAllUsers, type User } from '../../services/userService';

interface TaskFormModalProps {
  isFormModalOpen: boolean;
  setIsFormModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEdit?: boolean;
  onSubmit: (data: TaskFormData) => void;
  initialData?: TaskFormData;
}

const TaskFormModal = ({
  isFormModalOpen,
  setIsFormModalOpen,
  isEdit,
  onSubmit,
  initialData,
}: TaskFormModalProps) => {
  const [users, setUsers] = useState<User[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      assignee_id: '',
      priority: 'Medium',
      status: 'Pending',
      due_date: '',
    },
  });
  useEffect(() => {
    if (isFormModalOpen && users.length > 0) {
      reset(
        initialData ?? {
          title: '',
          description: '',
          assignee_id: '',
          priority: 'Medium',
          status: 'Pending',
          due_date: '',
        },
      );
    }
  }, [isFormModalOpen, users, initialData, reset]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <CommonModal
        isOpen={isFormModalOpen}
        title={isEdit ? 'Edit Task' : 'Create Task'}
        onClose={() => setIsFormModalOpen(false)}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Task Title *
            </label>
            <input
              {...register('title')}
              placeholder="Enter task title"
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-300"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              placeholder="Enter task description"
              rows={3}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-300"
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          {/* Assignee */}
          <div>
            <label className="block text-sm font-medium mb-1">Assignee *</label>
            <select
              {...register('assignee_id')}
              className="w-full border rounded-lg px-3 py-2"
            >
              {/* <option value="">Select Assignee</option> */}

              {users?.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          {errors.assignee_id && (
            <p className="text-red-500 text-sm mt-1">
              {errors.assignee_id.message}
            </p>
          )}
          {/* Priority */}
          <div>
            <label className="block text-sm font-medium mb-1">Priority *</label>
            <select
              {...register('priority')}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          {errors.priority && (
            <p className="text-red-500 text-sm mt-1">
              {errors.priority.message}
            </p>
          )}
          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Status *</label>
            <select
              {...register('status')}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="In Review">In Review</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          {errors.status && (
            <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
          )}
          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium mb-1">Due Date *</label>
            <input
              type="date"
              {...register('due_date')}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          {errors.due_date && (
            <p className="text-red-500 text-sm mt-1">
              {errors.due_date.message}
            </p>
          )}
          {/* Button */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="px-5 py-2 border rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-purple-600 text-white rounded-lg cursor-pointer"
            >
              {isSubmitting ? 'Saving..' : isEdit ? 'Edit Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </CommonModal>
    </div>
  );
};
export default TaskFormModal;
