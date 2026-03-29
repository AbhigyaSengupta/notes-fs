import yup from "yup";

export const noteValidateSchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(3, "Title must be atleast 3 characters")
    .max(15, "Title must be atmost 15 characters")
    .required(),
  description: yup
    .string()
    .trim()
    .min(10, "Title must be atleast 10 characters")
    .required(),
});

export const validateNote = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body);
    next();
  } catch (err) {
    return res.status(400).json({ errors: err.errors });
  }
};
