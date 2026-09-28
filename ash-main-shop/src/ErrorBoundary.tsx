import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

type Props = { children: ReactNode };
type State = { error: Error | null };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Forge Of Ash crashed:", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="grid min-h-screen place-items-center bg-[#0b0b0e] px-6 font-body">
        <div className="w-full max-w-[340px] rounded-3xl bg-[#141417] p-7 text-center shadow-2xl shadow-black/60 ring-1 ring-white/10">
          <div
            className="mx-auto mb-4 h-14 w-14 rounded-2xl"
            style={{
              background: "radial-gradient(circle at 32% 28%, #fde68a, #f59e0b 45%, #92400e 75%, #1c0a00)",
              boxShadow: "0 0 30px rgba(245,158,11,0.5)",
            }}
          />
          <h1 className="font-display text-[19px] font-extrabold text-white">The forge hit a snag</h1>
          <p className="mt-2 text-[12px] font-medium leading-relaxed text-zinc-400">
            Something interrupted the shop while loading. A quick refresh usually re-strikes the fire.
          </p>
          <p className="mt-3 max-h-24 overflow-auto rounded-xl bg-black/40 p-2.5 text-left text-[9.5px] font-medium leading-relaxed text-red-300/80">
            {this.state.error.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full rounded-xl bg-amber-400 py-3 text-[12.5px] font-extrabold text-slate-900 shadow-lg shadow-amber-500/25 transition-colors hover:bg-amber-300"
          >
            Reload the shop
          </button>
        </div>
      </div>
    );
  }
}
