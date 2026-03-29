import { useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { deleteNote } from "../features/notes/notesSlice";
import { toast } from "react-hot-toast";
import DeleteModal from "./DeleteModal";

const NoteCard = ({ note, onEdit }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.notes);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    const result = await dispatch(deleteNote(note._id));
    if (deleteNote.fulfilled.match(result)) {
      toast.success("Note deleted!");
      setShowDeleteModal(false);
    } else {
      toast.error(result.payload || "Delete failed");
    }
  };

  return (
    <>
      <div className="group bg-white hover:bg-gray-50 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-blue-200 p-6 transition-all duration-300 h-64 flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1 pr-4 group-hover:text-blue-600">
            {note.title}
          </h3>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
            <button
              onClick={() => onEdit(note)}
              className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg hover:shadow-md transition-all"
              title="Edit"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={loading}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg hover:shadow-md transition-all disabled:opacity-50"
              title="Delete"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <p className="text-gray-600 flex-1 line-clamp-4 mb-4 leading-relaxed">
          {note.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-4 border-t border-gray-100">
          <span>Created {new Date(note.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        onConfirm={handleDelete}
        onClose={() => setShowDeleteModal(false)}
        isDeleting={loading}
      />
    </>
  );
};

export default NoteCard;
