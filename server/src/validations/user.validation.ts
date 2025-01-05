import Joi from "joi";

interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface EmailInput {
  email: string;
}

interface PasswordInput {
  password: string;
}

interface UserInput {
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
}


export function validateUser(user: UserInput) {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    isAdmin: Joi.boolean().required(),
  });

  return schema.validate(user);
}

export function validateLoginInput(input: LoginInput) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(input);
}

export function validateRegisterInput(input: RegisterInput) {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(5).max(255).required(),
    email: Joi.string().min(5).max(255).required().email(),
  });

  return schema.validate(input);
}

export function validateEmail(input: EmailInput) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
  });

  return schema.validate(input);
}

export function validatePassword(input: PasswordInput) {
  const schema = Joi.object({
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(input);
}
