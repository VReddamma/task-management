import CommonModal from '../../components/common/CommonModal';

interface TaskDeleteModalProps {
  taskTitle: string;
  onClose: () => void;
  onConfirm: () => void;
}
const TaskDeleteModal = ({
  taskTitle,
  onClose,
  onConfirm,
}: TaskDeleteModalProps) => {
  return (
    <div>
      <CommonModal isOpen={true} onClose={onClose} title="Delete Task">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Delete Task?</h2>

          <p className="text-gray-600 mt-3">
            Are you sure you want to delete
            <span className="font-semibold"> {taskTitle}</span>
          </p>

          <p className="text-sm text-red-500 mt-2">
            This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3 mt-6">
            <button onClick={onClose} className="px-4 py-2 border rounded-lg">
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </CommonModal>
    </div>
  );
};
export default TaskDeleteModal;
