import noteSchema from "../models/noteSchema.js";

export const createNote = async (req, res) => {
  try {
    const { title, description } = req.body;
    const createdNote = await noteSchema.create({
      title: title,
      description: description,
      userId: req.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Note created successfully!",
      createdNote,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

export const getNotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;
    // const totalNotes = await noteSchema.countDocuments({ userId: req.userId });

    const filter = {
      userId: req.userId,  
      ...(search && {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } }
        ]
      })
    };
    const totalNotes = await noteSchema.countDocuments(filter);
    const notes = await noteSchema.find(filter)
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      notes,
      currentPage: page,
      totalPages: Math.ceil(totalNotes / limit),
      totalNotes,
    });
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id.trim() === " ") {
      return res.status(401).json({
        success: false,
        message: "Note's id not found!",
      });
    }
    const deletedData = await noteSchema.findOneAndDelete({
      userId: req.userId,
      _id: id,
    });
    if (!deletedData) {
      return res.status(404).json({
        success: false,
        message: "Note not found for delete!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Note deleted successfully!",
      deletedData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!id || id.trim() === " ") {
      return res.status(401).json({
        success: false,
        message: "Note's id not found!",
      });
    }
    const updatedNote = await noteSchema.findOneAndUpdate(
      {
        _id: id,
        userId: req.userId,
      },
      {
        title: title,
        description: description,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedNote) {
      return res.status(401).json({
        success: false,
        message: "No Note found for update!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note has been updated successfully!",
      updatedNote,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
