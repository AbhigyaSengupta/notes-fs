import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createNote, updateNote } from "../features/notes/notesSlice";
import toast from "react-hot-toast";

const NoteModal = ({ isOpen, note, onClose }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.notes);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (note) {
      reset({ title: note.title, description: note.description });
    } else {
      reset({ title: "", description: "" });
    }
  }, [note, isOpen, reset]);

  const onSubmit = async (data) => {
    if (note) {
      const result = await dispatch(updateNote({ id: note._id, ...data }));
      if (updateNote.fulfilled.match(result)) {
        toast.success("Note updated!");
        onClose();
      } else {
        toast.error(result.payload || "Failed to update note");
      }
    } else {
      const result = await dispatch(createNote(data));
      if (createNote.fulfilled.match(result)) {
        toast.success("Note created!");
        onClose();
      } else {
        toast.error(result.payload || "Failed to create note");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {note ? "Edit Note" : "Create Note"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div>
            <input
              {...register("title", { required: "Title is required" })}
              placeholder="Note title..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
            )}
          </div>


          <div>
            <textarea
              {...register("description", { required: "Description is required" })}
              placeholder="Write your note..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
            )}
          </div>


          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : note ? "Update Note" : "Create Note"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default NoteModal;
