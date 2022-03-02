import { object, ref, string } from 'yup';
import './locale.ts';

const registerSchema = object({
    email:
        string()
            .email()
            .max(255)
            .required(),
    password:
        string()
            .min(5)
            .max(255)
            .required(),
    confirmPassword:
        string()
            .max(255)
            .required()
            .oneOf([ref('password'), null], 'Confirm Password doesn\'t match Password')
});


export default registerSchema;