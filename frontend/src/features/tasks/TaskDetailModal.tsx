import CommonModal from '../../components/common/CommonModal';
import type { Task } from '../../types/task';

interface TaskDetailModalProps {
  isDetailModalOpen: boolean;
  setIsDetailModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTask: Task | null;
}

const TaskDetailModal = ({
  isDetailModalOpen,
  setIsDetailModalOpen,
  selectedTask,
}: TaskDetailModalProps) => {
  return (
    <div>
      <CommonModal
        isOpen={isDetailModalOpen}
        title="Task Details"
        onClose={() => setIsDetailModalOpen(false)}
      >
        {selectedTask && (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Task Title</label>
              <p className="font-medium">{selectedTask.title}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Status</label>
              <p>{selectedTask.status}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Priority</label>
              <p>{selectedTask.priority}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Due Date</label>
              <p>{selectedTask.due_date}</p>
            </div>
          </div>
        )}
      </CommonModal>
    </div>
  );
};
export default TaskDetailModal;
