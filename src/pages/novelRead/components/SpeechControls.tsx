import Play from "../../../assets/svg/NovelRead/play-stroke-rounded.svg";
import Pause from "../../../assets/svg/NovelRead/pause-stroke-rounded.svg";
import Stop from "../../../assets/svg/NovelRead/stop-stroke-rounded.svg";

interface Props {
  state: "started" | "paused" | "stopped";
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export function SpeechControls({ state, onStart, onPause, onResume, onStop }: Props) {
  const iconBtn =
    "h-9 w-9 grid place-items-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition";

  if (state === "stopped") {
    return (
      <button onClick={onStart} className={iconBtn} title="Phát">
        <img src={Play} alt="play" className="h-[18px] w-[18px]" />
      </button>
    );
  }
  if (state === "started") {
    return (
      <div className="flex items-center gap-2">
        <button onClick={onPause} className={iconBtn} title="Tạm dừng">
          <img src={Pause} alt="pause" className="h-[18px] w-[18px]" />
        </button>
        <button onClick={onStop} className={iconBtn} title="Dừng">
          <img src={Stop} alt="stop" className="h-[18px] w-[18px]" />
        </button>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2">
      <button onClick={onResume} className={iconBtn} title="Tiếp tục">
        <img src={Play} alt="resume" className="h-[18px] w-[18px]" />
      </button>
      <button onClick={onStop} className={iconBtn} title="Dừng">
        <img src={Stop} alt="stop" className="h-[18px] w-[18px]" />
      </button>
    </div>
  );
}
