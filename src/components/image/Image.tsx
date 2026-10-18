import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { AppDispatch, RootState } from "../../feature/store";
import { profilePhotoUploadApi, setFile } from "../../feature/reducers/userSlice";
import { NotificationService } from "../../services/notificationServices";

interface IImageProps {
  image: boolean;
  setImage: (image: boolean) => void;
}

const VIEW = 280; // Größe des Ausschnitts in px
const OUT = 512; // Größe des fertigen Bilds in px

// Profilbild zuschneiden (ziehen + zoomen) und hochladen
export const Image = ({ image, setImage }: IImageProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { file } = useSelector((state: RootState) => state.users);
  const [busy, setBusy] = useState(false);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement | null>(null);
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null);

  const url = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => {
    setNatural(null);
    setZoom(1);
    setPos({ x: 0, y: 0 });
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  const base = natural ? VIEW / Math.min(natural.w, natural.h) : 1; // Bild füllt den Ausschnitt
  const scale = base * zoom;
  const dw = natural ? natural.w * scale : 0;
  const dh = natural ? natural.h * scale : 0;

  const clamp = (x: number, y: number, s = scale) => {
    if (!natural) return { x: 0, y: 0 };
    const mx = Math.max(0, (natural.w * s - VIEW) / 2);
    const my = Math.max(0, (natural.h * s - VIEW) / 2);
    return { x: Math.min(mx, Math.max(-mx, x)), y: Math.min(my, Math.max(-my, y)) };
  };

  const changeZoom = (z: number) => {
    const nz = Math.min(4, Math.max(1, z));
    const ns = base * nz;
    setZoom(nz);
    setPos((p) => clamp(p.x, p.y, ns));
  };

  const onDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { px: e.clientX, py: e.clientY, x: pos.x, y: pos.y };
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    setPos(clamp(drag.current.x + e.clientX - drag.current.px, drag.current.y + e.clientY - drag.current.py));
  };
  const onUp = () => {
    drag.current = null;
  };

  const close = () => {
    if (busy) return;
    dispatch(setFile(null));
    setImage(false);
  };

  const upload = async () => {
    const el = imgRef.current;
    if (!file || !natural || !el) return NotificationService.error(t("profile.imgNoFile"));
    setBusy(true);
    try {
      // sichtbaren Ausschnitt in Bildkoordinaten berechnen und in ein Quadrat zeichnen
      const sw = VIEW / scale;
      const sx = natural.w / 2 - (VIEW / 2 + pos.x) / scale;
      const sy = natural.h / 2 - (VIEW / 2 + pos.y) / scale;
      const canvas = document.createElement("canvas");
      canvas.width = OUT;
      canvas.height = OUT;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("canvas");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, OUT, OUT);
      ctx.drawImage(el, sx, sy, sw, sw, 0, 0, OUT, OUT);
      const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.92));
      if (!blob) throw new Error("blob");
      const cropped = new File([blob], "profile.jpg", { type: "image/jpeg" });
      await dispatch(profilePhotoUploadApi(cropped)).unwrap();
      NotificationService.success(t("profile.imgDone"));
      dispatch(setFile(null));
      setImage(false);
    } catch (error: any) {
      NotificationService.error(error?.message || t("profile.imgFail"));
    } finally {
      setBusy(false);
    }
  };

  if (!image) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" role="dialog" aria-modal="true" aria-label={t("profile.imgTitle")} onClick={close}>
      <div className="w-full max-w-sm flex flex-col gap-5 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6" onClick={(e) => e.stopPropagation()}>
        <div className="section-head !mb-0">
          <h3>{t("profile.imgTitle")}</h3>
          <button type="button" className="text-sm muted hover:text-PRIMARY_ORANGE" onClick={close} disabled={busy}>
            {t("profile.close")}
          </button>
        </div>
        <p className="muted text-sm">{t("profile.imgHint")}</p>

        <div className="flex justify-center">
          <div
            className="relative overflow-hidden bg-black touch-none select-none cursor-grab active:cursor-grabbing"
            style={{ width: VIEW, height: VIEW, maxWidth: "100%" }}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onWheel={(e) => changeZoom(zoom - e.deltaY * 0.002)}
          >
            {url && (
              <img
                ref={imgRef}
                src={url}
                alt=""
                draggable={false}
                onLoad={(e) => setNatural({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
                className="absolute max-w-none pointer-events-none"
                style={{
                  width: natural ? dw : "auto",
                  height: natural ? dh : "auto",
                  left: VIEW / 2 + pos.x - dw / 2,
                  top: VIEW / 2 + pos.y - dh / 2,
                  visibility: natural ? "visible" : "hidden",
                }}
              />
            )}
            {/* Kreis zeigt den späteren Profilbild-Ausschnitt */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ boxShadow: "0 0 0 999px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.6)" }}
            />
          </div>
        </div>

        <label className="flex items-center gap-3 text-sm">
          <span className="muted">{t("profile.imgZoom")}</span>
          <input
            type="range"
            min={1}
            max={4}
            step={0.01}
            value={zoom}
            onChange={(e) => changeZoom(Number(e.target.value))}
            className="flex-1 accent-[#f2b01e]"
          />
        </label>

        <div className="flex gap-3 justify-end">
          <button type="button" className="btn" onClick={close} disabled={busy}>{t("profile.cancel")}</button>
          <button type="button" className="btn btn-primary" onClick={upload} disabled={busy || !natural}>
            {busy ? t("profile.imgUploading") : t("profile.imgUpload")}
          </button>
        </div>
      </div>
    </div>
  );
};
