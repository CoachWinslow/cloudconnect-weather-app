declare const __BUILD_SHA__: string;
declare const __BUILD_TIME__: string;

export const BUILD_SHA = __BUILD_SHA__;
export const BUILD_TIME = __BUILD_TIME__;

export default function BuildStamp() {
  const time = new Date(BUILD_TIME);
  const formatted = isNaN(time.getTime())
    ? BUILD_TIME
    : time.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

  return (
    <div
      className="fixed bottom-2 right-2 z-50 select-text rounded border border-border/40 bg-background/70 px-2 py-1 font-mono text-[10px] text-muted-foreground backdrop-blur-sm pointer-events-auto"
      title={`Built ${BUILD_TIME}`}
      data-build-sha={BUILD_SHA}
      data-build-time={BUILD_TIME}
    >
      build <span className="text-foreground">{BUILD_SHA}</span> · {formatted}
    </div>
  );
}