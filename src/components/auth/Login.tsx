import { useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useFormik } from "formik";
import { IoEyeSharp } from "react-icons/io5";
import { RiEyeCloseFill } from "react-icons/ri";
import {
  loginUserApi,
  setIsLoginFormOpen,
  setUserInfo,
} from "../../feature/reducers/userSlice";
import { NotificationService } from "../../services/notificationServices";
import { AppDispatch } from "../../feature/store";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const formSchema = Yup.object({
    email: Yup.string()
      .required(t("auth.emailRequired"))
      .email(t("auth.emailInvalid")),
    password: Yup.string()
      .required(t("auth.passwordRequired"))
      .min(6, t("auth.passwordMin")),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: formSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await dispatch(loginUserApi(values)).unwrap();
        NotificationService.success(response.message);
        dispatch(setUserInfo(response.userInfo));
        localStorage.setItem("userId", response.userInfo.userId);
        localStorage.setItem("exp", response.userInfo.exp);
        navigate("/home", { replace: true });
      } catch (error: any) {
        NotificationService.error(error?.message ?? String(error));
      } finally {
        setLoading(false);
      }
    },
  });

  const firstError =
    (formik.touched.email && formik.errors.email) ||
    (formik.touched.password && formik.errors.password) ||
    "";

  return (
    <form className="flex flex-col gap-5" onSubmit={formik.handleSubmit} noValidate>
      <div className="flex flex-col gap-1.5">
        <label className="field-label" htmlFor="login-email">{t("auth.email")}</label>
        <input
          id="login-email"
          className="field"
          type="email"
          name="email"
          autoComplete="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="field-label" htmlFor="login-password">{t("auth.password")}</label>
        <div className="relative">
          <input
            id="login-password"
            className="field pr-12"
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="current-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xl muted hover:text-PRIMARY_ORANGE"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
          >
            {showPassword ? <IoEyeSharp /> : <RiEyeCloseFill />}
          </button>
        </div>
      </div>

      {firstError && (
        <p role="alert" className="text-SECONDARY_RED text-sm">{String(firstError)}</p>
      )}

      <button type="submit" disabled={loading} className="btn btn-primary !py-3 w-full text-center disabled:opacity-60">
        {t("auth.login")}
      </button>

      <NavLink to="/forget-password" className="text-sm muted hover:text-PRIMARY_ORANGE self-start">
        {t("auth.forgot")}
      </NavLink>

      <div className="border-t border-[var(--line)] pt-5 flex flex-wrap items-center gap-3">
        <span className="muted">{t("authPage.noAccount")}</span>
        <button
          type="button"
          className="underline underline-offset-4 hover:text-PRIMARY_ORANGE"
          onClick={() => dispatch(setIsLoginFormOpen(false))}
        >
          {t("auth.register")}
        </button>
      </div>
    </form>
  );
};

export default Login;
