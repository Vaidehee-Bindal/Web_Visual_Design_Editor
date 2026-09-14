import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  Download,
  LogOut,
  Maximize2,
  Minimize2,
  Redo2,
  Undo2,
  UserRound,
} from "lucide-react";
import type { ElementType } from "../../services/api";
import Dropdown from "../Dropdown/Dropdown";
type Props = {
  onSave: () => void;
  onExport: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoom: (zoom: number) => void;
  zoom: number;
  canUndo: boolean;
  canRedo: boolean;
  saving: boolean;
  saved: boolean;
  autosave: boolean;
  onToggleAutosave: () => void;
  onAdd?: (type: ElementType) => void;
  onNew?: () => void;
  onFullscreen?: () => void;
};
const zoomOptions = [
  { value: 0.6, label: "60%" },
  { value: 0.8, label: "80%" },
  { value: 1, label: "100%" },
  { value: 1.2, label: "120%" },
];
export default function Toolbar({
  onSave,
  onExport,
  onUndo,
  onRedo,
  onZoom,
  zoom,
  canUndo,
  canRedo,
  saving,
  saved,
  autosave,
  onToggleAutosave,
}: Props) {
  const { data: session } = useSession();
  const [fullscreen, setFullscreen] = useState(false);
  useEffect(() => {
    const sync = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", sync);
    sync();
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen?.();
      else await document.documentElement.requestFullscreen?.();
    } catch {
      setFullscreen(Boolean(document.fullscreenElement));
    }
  };
  const accountInitial = session?.user?.name?.trim().charAt(0).toUpperCase() || "U";
  return (
    <>
      <header className="toolbar">
        <div className="brand">
          <span className="brand-logo" aria-label="SketchStack">
            <img src="/sketchstack_logo.png" alt="SketchStack" />
          </span>
        </div>
        <div className="toolbar-actions">
          <button
            className="icon-button"
            disabled={!canUndo}
            onClick={onUndo}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={18} strokeWidth={1.8} />
          </button>
          <button
            className="icon-button"
            disabled={!canRedo}
            onClick={onRedo}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={18} strokeWidth={1.8} />
          </button>
          <span className="toolbar-divider" aria-hidden="true" />
          <Dropdown
            className="zoom-dropdown"
            value={zoom}
            options={zoomOptions}
            onChange={onZoom}
            ariaLabel="Zoom"
          />
          <span className="toolbar-divider" aria-hidden="true" />
          <button
            className={autosave ? "autosave-toggle on" : "autosave-toggle"}
            onClick={onToggleAutosave}
            title={"AutoSave " + (autosave ? "on" : "off")}
          >
            <span>AutoSave</span>
            <span className="autosave-switch">
              <i />
            </span>
          </button>
          <button
            className="icon-button"
            onClick={() => void toggleFullscreen()}
            title={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {fullscreen ? <Minimize2 size={18} strokeWidth={1.8} /> : <Maximize2 size={18} strokeWidth={1.8} />}
          </button>
          <span className="toolbar-divider" aria-hidden="true" />
          <button className="subtle-button toolbar-export-button" onClick={onExport}>
            <Download
              className="toolbar-button-icon"
              size={17}
              strokeWidth={2}
              aria-hidden="true"
            />
            Export PNG
          </button>
          <span className="toolbar-divider" aria-hidden="true" />
          <button
            className={saved ? "toolbar-save-button saved" : "toolbar-save-button"}
            onClick={onSave}
          >
            {saving ? "Saving…" : saved ? "Saved!" : "Save Canvas"}
          </button>
          {session?.user ? (
            <>
              <span
                className="avatar signed-in"
                aria-label={`Signed in as ${session.user.email || session.user.name || "user"}`}
                title={`Signed in as ${session.user.email || session.user.name || "user"}`}
              >
                {accountInitial}
              </span>
              <button
                className="account-button toolbar-signout-button"
                onClick={() => void signOut({ callbackUrl: "/" })}
                aria-label="Log out"
              >
                <LogOut size={16} strokeWidth={1.8} />
                Log out
              </button>
            </>
          ) : (
            <button
              className="avatar signed-out"
              onClick={() => void signIn("google")}
              aria-label="Sign in"
              title="Sign in"
            >
              <UserRound size={18} strokeWidth={1.8} aria-hidden="true" />
            </button>
          )}
        </div>
      </header>
    </>
  );
}
