// src/pages/.../components/PostImages.tsx
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Fullscreen } from "lucide-react";

type Props = {
  images: string[];
  rowHeight?: number;
  maxWidth?: number;
};

export const PostImages: React.FC<Props> = ({ images, rowHeight = 180, maxWidth = 900 }) => {
  const [viewer, setViewer] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });
  const openAt = (i: number) => setViewer({ open: true, index: i });
  const close = () => setViewer({ open: false, index: 0 });

  const total = images.length;
  if (!total) return null;

  const containerClass = "mx-auto w-full";
  const ring = "ring-1 ring-white/10";
  const thumbClass = "relative overflow-hidden rounded-2xl " + ring + " bg-black/10";
  const imgClass = "absolute inset-0 w-full h-full object-cover";

  const Tile = ({
    src,
    alt,
    onClick,
    className,
    overlay,
  }: {
    src: string;
    alt: string;
    onClick: () => void;
    className?: string;
    overlay?: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`group ${thumbClass} ${className ?? ""}`}
      aria-label="Xem ảnh"
      type="button"
    >
      <img src={src} alt={alt} className={imgClass} draggable={false} />
      {overlay}
    </button>
  );

  // hiển thị tối đa 3 ảnh
  const visible = images.slice(0, 3);
  const extra = total - 3;

  return (
    <>
      <div className={containerClass} style={{ maxWidth }}>
        <div className="grid grid-cols-3 gap-2" style={{ gridAutoRows: `${rowHeight}px` }}>
          {visible.map((src, i) => {
            if (i === 2 && extra > 0) {
              return (
                <Tile
                  key={i}
                  src={src}
                  alt={`attachment-${i}`}
                  onClick={() => openAt(i)}
                  overlay={
                    <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                      <span className="px-3 py-1 rounded-lg text-white/95 text-xl font-semibold bg-white/10 ring-1 ring-white/20">
                        +{extra}
                      </span>
                    </div>
                  }
                />
              );
            }
            return <Tile key={i} src={src} alt={`attachment-${i}`} onClick={() => openAt(i)} />;
          })}
        </div>
      </div>
      <LightboxPortal
        images={images}
        open={viewer.open}
        index={viewer.index}
        onClose={close}
        onChangeIndex={(i) => setViewer((v) => ({ ...v, index: i }))}
      />
    </>
  );
};

/* ============== LIGHTBOX (Portal to body) ============== */
type LightboxProps = {
  images: string[];
  open: boolean;
  index: number;
  onClose: () => void;
  onChangeIndex: (i: number) => void;
};

const LightboxPortal: React.FC<LightboxProps> = (props) => {
  if (!props.open) return null;
  return ReactDOM.createPortal(<Lightbox {...props} />, document.body);
};

const Lightbox: React.FC<LightboxProps> = ({ images, open, index, onClose, onChangeIndex }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onChangeIndex((index + 1) % images.length);
      if (e.key === "ArrowLeft") onChangeIndex((index - 1 + images.length) % images.length);
    };
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = original;
    };
  }, [open, index, images.length, onChangeIndex, onClose]);

  if (!open) return null;

  const prev = () => onChangeIndex((index - 1 + images.length) % images.length);
  const next = () => onChangeIndex((index + 1) % images.length);

  const ctrlBase =
    "pointer-events-auto grid place-items-center rounded-full ring-1 ring-white/20 shadow-[0_6px_24px_rgba(0,0,0,0.35)] backdrop-blur-sm transition bg-black/60 hover:bg-black/70 active:bg-black/80";
  const ctrlSize = "h-9 w-9 md:h-10 md:w-10";
  const iconClass = "text-white";
  const stopMouse = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.985, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.985, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="relative max-w-[94vw] max-h-[88vh] bg-transparent"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative flex items-center justify-center bg-black rounded-2xl overflow-hidden ring-1 ring-white/10">
            <img
              src={images[index]}
              alt={`image-${index}`}
              className="pointer-events-none w-auto h-auto max-w-[94vw] max-h-[75vh] object-contain"
              draggable={false}
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onMouseDown={stopMouse}
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className={`${ctrlBase} ${ctrlSize} absolute top-1/2 -translate-y-1/2 -left-12 md:-left-14`}
              >
                <ChevronLeft size={18} className={iconClass} />
              </button>

              <button
                type="button"
                onMouseDown={stopMouse}
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className={`${ctrlBase} ${ctrlSize} absolute top-1/2 -translate-y-1/2 -right-12 md:-right-14`}
              >
                <ChevronRight size={18} className={iconClass} />
              </button>
            </>
          )}

          <button
            type="button"
            onMouseDown={stopMouse}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className={`${ctrlBase} ${ctrlSize} absolute -top-10 -right-10 md:-top-12 md:-right-12`}
          >
            <X size={18} className={iconClass} />
          </button>

          <div className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs md:text-sm font-medium text-white/90 bg-black/60 ring-1 ring-white/20 shadow-[0_6px_24px_rgba(0,0,0,0.35)]">
            {index + 1} / {images.length}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};