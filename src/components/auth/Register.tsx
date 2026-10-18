import { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useFormik } from "formik";
import { IoEyeSharp } from "react-icons/io5";
import { RiEyeCloseFill } from "react-icons/ri";
import { NotificationService } from "../../services/notificationServices";
import { registerUserApi, setIsLoginFormOpen } from "../../feature/reducers/userSlice";
import { AppDispatch } from "../../feature/store";

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Buchstaben aller Sprachen inkl. Umlaute, Bindestrich und Leerzeichen
  const namePattern = /^[\p{L}][\p{L} '-]*$/u;

  const formSchema = Yup.object({
    firstName: Yup.string()
      .trim()
      .required(t("auth.firstNameRequired"))
      .matches(namePattern, t("auth.firstNameLetters")),
    lastName: Yup.string()
      .trim()
      .required(t("auth.lastNameRequired"))
      .matches(namePattern, t("auth.lastNameLetters")),
    email: Yup.string().required(t("auth.emailRequired")).email(t("auth.emailInvalid")),
    password: Yup.string().required(t("auth.passwordRequired")).min(6, t("auth.passwordMin")),
    confirmPassword: Yup.string()
      .required(t("auth.confirmRequired"))
      .oneOf([Yup.ref("password")], t("auth.passwordsMatch")),
    gender: Yup.string().oneOf(["male", "female", "diverse"]),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "male",
    },
    validationSchema: formSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await dispatch(registerUserApi(values)).unwrap();
        NotificationService.success(response.message);
        dispatch(setIsLoginFormOpen(true));
      } catch (error: any) {
        NotificationService.error(error?.message ?? String(error));
      } finally {
        setLoading(false);
      }
    },
  });

  const err = (name: keyof typeof formik.values) =>
    formik.touched[name] && formik.errors[name] ? String(formik.errors[name]) : "";

  const textField = (name: "firstName" | "lastName" | "email", label: string, type = "text", auto = "") => (
    <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
      <label className="field-label" htmlFor={`reg-${name}`}>{label}</label>
      <input
        id={`reg-${name}`}
        className={`field ${err(name) ? "!border-SECONDARY_RED" : ""}`}
        type={type}
        name={name}
        autoComplete={auto}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {err(name) && <p role="alert" className="text-SECONDARY_RED text-sm">{err(name)}</p>}
    </div>
  );

  const passwordField = (name: "password" | "confirmPassword", label: string, auto: string) => (
    <div className="flex flex-col gap-1.5">
      <label className="field-label" htmlFor={`reg-${name}`}>{label}</label>
      <div className="relative">
        <input
          id={`reg-${name}`}
          className={`field pr-12 ${err(name) ? "!border-SECONDARY_RED" : ""}`}
          type={showPassword ? "text" : "password"}
          name={name}
          autoComplete={auto}
          value={formik.values[name]}
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
      {err(name) && <p role="alert" className="text-SECONDARY_RED text-sm">{err(name)}</p>}
    </div>
  );

  return (
    <form className="flex flex-col gap-5" onSubmit={formik.handleSubmit} noValidate>
      <div className="flex flex-wrap gap-4">
        {textField("firstName", t("auth.firstName"), "text", "given-name")}
        {textField("lastName", t("auth.lastName"), "text", "family-name")}
      </div>
      {textField("email", t("auth.email"), "email", "email")}
      {passwordField("password", t("auth.password"), "new-password")}
      {passwordField("confirmPassword", t("auth.confirmPassword"), "new-password")}

      <fieldset className="flex flex-wrap gap-x-6 gap-y-2">
        <legend className="field-label mb-2">{t("auth.gender")}</legend>
        {(["male", "female", "diverse"] as const).map((g) => (
          <label key={g} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="gender"
              value={g}
              className="w-5 h-5 accent-[#3fc5dc]"
              onChange={formik.handleChange}
              checked={formik.values.gender === g}
            />
            {t(`auth.${g}`)}
          </label>
        ))}
      </fieldset>

      <button type="submit" disabled={loading} className="btn btn-primary !py-3 w-full text-center disabled:opacity-60">
        {t("auth.register")}
      </button>

      <div className="border-t border-[var(--line)] pt-5 flex flex-wrap items-center gap-3">
        <span className="muted">{t("authPage.haveAccount")}</span>
        <button
          type="button"
          className="underline underline-offset-4 hover:text-PRIMARY_ORANGE"
          onClick={() => dispatch(setIsLoginFormOpen(true))}
        >
          {t("auth.login")}
        </button>
      </div>
    </form>
  );
};

export default Register;
