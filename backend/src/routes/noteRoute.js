import express from "express"
import { createNote, deleteNote, getNotes, updateNote } from "../controller/noteController.js"
import { noteValidateSchema, validateNote } from "../validators/noteValidate.js"
import { hasToken } from "../middleware/hasToken.js"


const noteRoute = express.Router()

noteRoute.post("/create", hasToken ,validateNote(noteValidateSchema), createNote)
noteRoute.get("/get", hasToken , getNotes)
noteRoute.delete("/delete/:id", hasToken, deleteNote)
noteRoute.put("/update/:id", hasToken, updateNote)


export default noteRoute