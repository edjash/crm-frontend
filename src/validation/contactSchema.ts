import { object, string } from 'yup';
import './locale.ts';

const contactSchema = object({
    firstname:
        string()
            .max(255)
            .required(),
});


export default contactSchema;