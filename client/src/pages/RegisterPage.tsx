import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Error } from "../components/Error";
import { useAppDispatch } from "../store/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { attemptRegister } from "../store/thunks/authThunks";

type RegisterFormValues = {
  email: string;
  username: string;
  password: string;
};

enum RegisterFormStep {
  Register,
  Resend,
  Reset,
}

export default function RegisterPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [registerStep, setRegisterStep] = useState<RegisterFormStep>(RegisterFormStep.Register);

  const initialValues: RegisterFormValues = {
    email: "",
    username: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().min(5).max(255).email().required("Required"),
    username: Yup.string().min(3).max(50).required("Required"),
    password: Yup.string().min(5).max(255).required("Required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const resultAction = await dispatch(
        attemptRegister({
          newUser: {
            username: values.username,
            email: values.email,
            password: values.password,
          },
        })
      ).unwrap();

      if (resultAction.isAdmin) {
        navigate("/admin", { replace: true });
      } else if (resultAction.email) {
        navigate("/client", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    } catch (err) {
      // Handle error (e.g., display error message)
      console.error("Registration failed:", err);
    }
  };

  // const handleResendEmail = () => {
  //   if (!email) return;

  //   dispatch(attemptResendConfirmation(email, navigate))
  //     .then(() => {
  //       setRegisterStep(RegisterFormStep.Reset);
  //     })
  //     .catch(handleServerError);
  // };

  // const handleResetRegister = () => {
  //   if (!email) return;

  //   dispatch(attemptResetRegister(email, navigate))
  //     .then(() => {
  //       setRegisterStep(RegisterFormStep.Register);
  //     })
  //     .catch(handleServerError);
  // };

  function renderSwitch() {
    switch (registerStep) {
      case RegisterFormStep.Register:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-center">{t("signup")}</h2>
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <input
                    {...register("email")}
                    id="email"
                    type="email"
                    placeholder={t("email")}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {errors.email && <Error>{errors.email.message}</Error>}
                </div>
                <div>
                  <input
                    {...register("username")}
                    id="username"
                    type="text"
                    placeholder={t("username")}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {errors.username && <Error>{errors.username.message}</Error>}
                </div>
                <div>
                  <input
                    {...register("password")}
                    id="password"
                    type="password"
                    placeholder={t("password")}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {errors.password && <Error>{errors.password.message}</Error>}
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {t("signup")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      // case RegisterFormStep.Resend:
      //   return (
      //     <div className="flex flex-col items-center justify-center min-h-screen">
      //       <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
      //         <p>A verification email has been sent.</p>
      //         <p>Check your mailbox: {email}.</p>
      //         <p>You have 12 hours to activate your account. It can take up to 15 minutes to receive our email.</p>
      //         <button
      //           onClick={handleResendEmail}
      //           className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      //         >
      //           Did not receive the email? Click here to send again.
      //         </button>
      //         {serverError && <Error>{serverError}</Error>}
      //       </div>
      //     </div>
      //   );

      // case RegisterFormStep.Reset:
      //   return (
      //     <div className="flex flex-col items-center justify-center min-h-screen">
      //       <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
      //         <p>Still not received an email?</p>
      //         <p>Try to register again. You may have given the wrong email.</p>
      //         <p>If you want to be able to use the same username, reset the registration:</p>
      //         <button
      //           onClick={handleResetRegister}
      //           className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      //         >
      //           Click here to reset the registration
      //         </button>
      //         {serverError && <Error>{serverError}</Error>}
      //       </div>
      //     </div>
      //   );

      default:
        return <Navigate to="/home" replace />;
    }
  }

  return <>{renderSwitch()}</>;
}
