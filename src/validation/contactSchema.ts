import { object, string, array } from 'yup';
import './locale.ts';

const contactSchema = object({
    title:
        string().required().nullable(),
    firstname:
        string()
            .max(255)
            .required(),
});

export default contactSchema;