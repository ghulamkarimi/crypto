import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../feature/store";
import { displayUser, editProfileUserApi, setFile } from "../../../feature/reducers/userSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { NotificationService } from "../../../services/notificationServices";
import { useNavigate } from "react-router";
import { useRef, useState } from "react";
import { Image } from "../../image/Image";

const EditProfileInfo = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    e.target.value = ""; // dieselbe Datei darf erneut gewählt werden
    if (!picked) return;
    if (!picked.type.startsWith("image/")) return NotificationService.error(t("profile.imgBadType"));
    if (picked.size > 8_000_000) return NotificationService.error(t("profile.imgTooBig"));
    dispatch(setFile(picked));
    setImage(true);
  };

  const userId = localStorage.getItem("userId");
  const user = useSelector((state: RootState) => displayUser(state, userId || ""));

  const formSchema = Yup.object({
    firstName: Yup.string().required(t("profile.vFirst")).matches(/^[A-Za-zÄÖÜäöüß]+$/, t("profile.vFirstChars")),
    lastName: Yup.string().required(t("profile.vLast")).matches(/^[A-Za-zÄÖÜäöüß]+$/, t("profile.vLastChars")),
    bio: Yup.string().min(10, t("profile.vBioMin")).required(t("profile.vBio")),
    gender: Yup.string().oneOf(["male", "female", "diverse"]),
  });

  const formik = useFormik({
    initialValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      bio: user?.bio,
      gender: user?.gender,
    },
    onSubmit: async (values) => {
      try {
        const response = await dispatch(editProfileUserApi(values)).unwrap();
        NotificationService.success(response.message);
        setTimeout(() => navigate(`/profile/${userId}`), 1500);
      } catch (error: any) {
        NotificationService.error(error.message);
      }
    },
    validationSchema: formSchema,
  });

  const err = (name: "firstName" | "lastName" | "bio") =>
    formik.touched[name] && formik.errors[name] ? (
      <p className="text-sm text-SECONDARY_RED mt-1">{formik.errors[name] as string}</p>
    ) : null;

  const genders = [
    { value: "male", label: t("profile.male") },
    { value: "female", label: t("profile.female") },
    { value: "diverse", label: t("profile.diverse") },
  ];

  return (
    <section className="flex flex-col gap-8 max-w-2xl">
      <div className="section-head">
        <h2>{t("profile.profileTitle")}</h2>
      </div>

      <div className="flex flex-wrap items-center gap-5">
        <img className="w-24 h-24 rounded-full object-cover" src={user?.profile_photo} alt="" />
        <div className="flex flex-col items-start gap-2">
          <p className="muted text-sm break-all">{t("profile.email")}: {user?.email}</p>
          <button type="button" className="btn" onClick={() => inputRef.current?.click()}>
            {t("profile.changePhoto")}
          </button>
          <input name="file" type="file" hidden ref={inputRef} onChange={handleChange} />
        </div>
      </div>

      <div className={`${image ? "flex" : "hidden"}`}>
        <Image image={image} setImage={setImage} />
      </div>

      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="firstName">{t("profile.firstName")}</label>
            <input id="firstName" name="firstName" type="text" className="field mt-1" value={formik.values.firstName ?? ""} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {err("firstName")}
          </div>
          <div>
            <label className="field-label" htmlFor="lastName">{t("profile.lastName")}</label>
            <input id="lastName" name="lastName" type="text" className="field mt-1" value={formik.values.lastName ?? ""} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {err("lastName")}
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="bio">{t("profile.bio")}</label>
          <textarea id="bio" name="bio" rows={6} className="field mt-1" placeholder={t("profile.bioPlaceholder")} value={formik.values.bio ?? ""} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          {err("bio")}
        </div>

        <fieldset>
          <legend className="field-label">{t("profile.gender")}</legend>
          <div className="flex flex-wrap gap-x-8 gap-y-2 mt-2">
            {genders.map((g) => (
              <label key={g.value} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" className="w-4 h-4 accent-[#f2b01e]" name="gender" value={g.value} checked={formik.values.gender === g.value} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                {g.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <button type="submit" className="btn btn-primary !px-8">{t("profile.save")}</button>
        </div>
      </form>
    </section>
  );
};

export default EditProfileInfo;
