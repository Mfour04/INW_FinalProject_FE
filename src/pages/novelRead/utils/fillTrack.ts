export const fillTrack = (value: number, min: number, max: number) => {
  const pct = ((value - min) / (max - min)) * 100;
  return {
    background:
      `linear-gradient(90deg,#ff512f 0%,#ff9966 100%) 0 / ${pct}% 100% no-repeat, ` +
      `linear-gradient(90deg,rgba(255,255,255,0.18),rgba(255,255,255,0.18)) 0 / 100% 100% no-repeat`,
  } as React.CSSProperties;
};
