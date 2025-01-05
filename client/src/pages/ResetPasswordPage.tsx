import { Navigate, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { Error } from "../components/Error";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../store/hooks";
import { attemptResetPassword } from "../store/thunks/authThunks";

type ResetPasswordFormValues = {
  password: string;
};

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { token } = useParams<{ token: string }>();

  const initialValues: ResetPasswordFormValues = {
    password: "",
  };

  const validationSchema = Yup.object({
    password: Yup.string().min(5).max(255).required("Required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema),
  });

  if (!token) {
    return <Navigate to='/home' replace />;
  }

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      await dispatch(
        attemptResetPassword({
          password: values.password,
          token: token || "",
        })
      ).unwrap();

      // Navigate to the login page after successful password reset
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Reset Password failed:", err);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              {...register("password")}
              id="password"
              type="password"
              placeholder="Password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.password && <Error>{errors.password.message}</Error>}
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
