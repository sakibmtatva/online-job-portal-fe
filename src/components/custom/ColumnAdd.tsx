import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface AddColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  handleSubmit: (columnName: string) => void;
  editingColumnId: string;
}

const AddColumnModal: React.FC<AddColumnModalProps> = ({
  isOpen,
  onClose,
  isEdit,
  handleSubmit,
  editingColumnId,
}) => {
  const [columnName, setColumnName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      setColumnName(editingColumnId);
    } else {
      setColumnName("");
    }
  }, [isOpen]);
  if (!isOpen) return null;
  const onSubmit = () => {
    if (!columnName.trim()) {
      setError("Column name is required");
      return;
    }
    setError("");
    handleSubmit(columnName.trim());
  };
  return (
    <div className="fixed inset-0 bg-black/50 transition-opacity flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold mb-4">
            {isEdit ? "Edit Column" : "Add New Column"}
          </h2>
          <X
            onClick={() => {
              onClose(), setError("");
            }}
          />
        </div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Column Name
        </label>
        <input
          type="text"
          value={columnName}
          onChange={(e) => {
            setColumnName(e.target.value), setError("");
          }}
          className={`w-full rounded px-3 py-2 mb-1 focus:outline-none focus:ring-2 ${
            error
              ? "border border-red-500 focus:ring-red-300"
              : "border border-gray-300 focus:ring-blue-500"
          }`}
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="flex justify-between space-x-2 mt-3">
          <button
            onClick={() => {
              onClose(), setError("");
            }}
            className="px-4 py-2  text-[#0A65CC] bg-[#E7F0FA] rounded-xs font-medium hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit()}
            className="px-4 py-2 bg-blue-600 text-white rounded-xs font-medium hover:bg-blue-700"
          >
            {isEdit ? "Edit Column" : "Add Column"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddColumnModal;
