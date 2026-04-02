import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createNote, updateNote } from "../features/notes/notesSlice";
import toast from "react-hot-toast";

const NoteModal = ({ isOpen, note, onClose }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.notes);

  // Image state
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(note?.image || "");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (note) {
      reset({
        title: note.title,
        description: note.description,
      });
      setPreview(note.image || "");
      setImage(null);
    } else {
      reset({
        title: "",
        description: "",
      });
      setPreview("");
      setImage(null);
    }
  }, [note, isOpen, reset]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);

      if (image) {
        formData.append("image", image);
      }

      let result;

      if (note) {
        // update
        result = await dispatch(updateNote({ id: note._id, formData }));
        if (updateNote.fulfilled.match(result)) {
          toast.success("Note updated!");
          onClose();
        } else {
          toast.error(result.payload || "Failed to update note");
        }
      } else {
        // create
        result = await dispatch(createNote(formData));
        if (createNote.fulfilled.match(result)) {
          toast.success("Note created!");
          onClose();
        } else {
          toast.error(result.payload || "Failed to create blog");
        }
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {note ? "Edit Blog" : "Create Blog"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register("title", { required: "Title is required" })}
              placeholder="Blog title..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              placeholder="Write your blog..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-3 mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Blog's Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-600 dark:text-gray-200
          file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-600
          hover:file:bg-blue-100"
            />

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-40 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
              />
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100 rounded-xl font-semibold hover:bg-white dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : note ? "Update Blog" : "Create Blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
