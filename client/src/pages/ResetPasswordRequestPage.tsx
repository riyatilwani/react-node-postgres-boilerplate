import { useState } from "react";
import * as Yup from "yup";
import { Error } from "../components/Error";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../store/hooks";
import { attemptSendResetPasswordLink } from "../store/thunks/authThunks";

type ResetPasswordRequestFormValues = {
  email: string;
};

export default function ResetPasswordRequestPage() {
  const dispatch = useAppDispatch();
  const [isSubmited, setIsSubmitted] = useState(false);

  const initialValues: ResetPasswordRequestFormValues = {
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().min(5).max(255).email().required("Required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordRequestFormValues>({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (values: ResetPasswordRequestFormValues) => {
    try {
      await dispatch(
        attemptSendResetPasswordLink({
          email: values.email,
        })
      ).unwrap();

      setIsSubmitted(true);
      // Optionally navigate or provide additional feedback
      // navigate("/some-route", { replace: true });
    } catch (err) {
      console.error("Failed to send Reset Password Link:", err);
    }
  }

  return isSubmited ? (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md text-center">
        <p className="mb-4">
          A reset link has been sent to your email. <b>You have 12 hours to reset your password.</b>
          It can take up to 15 minutes to receive our email.
        </p>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        <p className="mb-4 text-center">We will send you a reset link to the following email:</p>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              {...register("email")}
              id="email"
              type="email"
              placeholder="Email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.email && <Error>{errors.email.message}</Error>}
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Send Reset Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
