import { Play, Pause, Square } from "lucide-react";

interface Props {
  state: "started" | "paused" | "stopped";
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export function SpeechControls({ state, onStart, onPause, onResume, onStop }: Props) {
  const iconBtn = [
    "h-9 w-9 grid place-items-center rounded-full transition",
    "border border-black/10 bg-white hover:bg-gray-200 text-gray-800",
    "dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white",
  ].join(" ");

  if (state === "stopped") {
    return (
      <button onClick={onStart} className={iconBtn} title="Phát">
        <Play size={18} />
      </button>
    );
  }
  if (state === "started") {
    return (
      <div className="flex items-center gap-2">
        <button onClick={onPause} className={iconBtn} title="Tạm dừng">
          <Pause size={18} />
        </button>
        <button onClick={onStop} className={iconBtn} title="Dừng">
          <Square size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={onResume} className={iconBtn} title="Tiếp tục">
        <Play size={18} />
      </button>
      <button onClick={onStop} className={iconBtn} title="Dừng">
        <Square size={18} />
      </button>
    </div>
  );
}
