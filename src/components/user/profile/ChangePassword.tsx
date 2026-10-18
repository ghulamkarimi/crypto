import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../feature/store";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { resetPasswordApi } from "../../../feature/reducers/userSlice";
import { NotificationService } from "../../../services/notificationServices";
import { useNavigate } from "react-router";
import { useState } from "react";

const ChangePassword = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const schema = Yup.object({
    password: Yup.string().min(6, t("profile.pwMin")),
    newPassword: Yup.string().min(6, t("profile.pwMin")),
    confirmPassword: Yup.string().min(6, t("profile.pwMin")),
  });

  const formik = useFormik({
    initialValues: { password: "", newPassword: "", confirmPassword: "" },
    onSubmit: async (values) => {
      try {
        const response = await dispatch(resetPasswordApi(values)).unwrap();
        NotificationService.success(response.message);
        setTimeout(() => navigate(`/profile/${userId}`), 1500);
      } catch (error: any) {
        NotificationService.error(error.message);
      }
    },
    validationSchema: schema,
  });

  const fields = [
    { name: "password", label: t("profile.pwCurrent"), auto: "current-password" },
    { name: "newPassword", label: t("profile.pwNew"), auto: "new-password" },
    { name: "confirmPassword", label: t("profile.pwConfirm"), auto: "new-password" },
  ] as const;

  return (
    <section className="flex flex-col gap-8 max-w-xl">
      <div className="section-head">
        <h2>{t("profile.pwTitle")}</h2>
        <button type="button" className="text-sm muted hover:text-PRIMARY_ORANGE" onClick={() => setShow(!show)}>
          {show ? t("profile.pwHide") : t("profile.pwShow")}
        </button>
      </div>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
        {fields.map((f) => (
          <div key={f.name}>
            <label className="field-label" htmlFor={f.name}>{f.label}</label>
            <input
              id={f.name}
              name={f.name}
              type={show ? "text" : "password"}
              autoComplete={f.auto}
              className="field mt-1"
              value={formik.values[f.name]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched[f.name] && formik.errors[f.name] && (
              <p className="text-sm text-SECONDARY_RED mt-1">{formik.errors[f.name]}</p>
            )}
          </div>
        ))}
        <div className="flex flex-wrap gap-3">
          <button type="submit" className="btn btn-primary !px-8">{t("profile.save")}</button>
          <button type="button" className="btn" onClick={() => navigate(`/profile/${userId}`)}>{t("profile.cancel")}</button>
        </div>
      </form>
    </section>
  );
};

export default ChangePassword;
