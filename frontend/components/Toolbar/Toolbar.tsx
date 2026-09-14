import { useEffect, useState } from "react";
import {
  Download,
  Maximize2,
  Minimize2,
  Redo2,
  Undo2,
  UserRound,
  X,
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
  const [signedIn, setSignedIn] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [email, setEmail] = useState("");
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
  const accountInitial = email.trim().charAt(0).toUpperCase() || "U";
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
          {signedIn ? (
            <button
              className="avatar signed-in"
              onClick={() => setSignedIn(false)}
              aria-label={`Sign out ${email}`}
              title={`Signed in as ${email}`}
            >
              {accountInitial}
            </button>
          ) : (
            <button
              className="avatar signed-out"
              onClick={() => setAuthOpen(true)}
              aria-label="Sign in"
              title="Sign in"
            >
              <UserRound size={18} strokeWidth={1.8} aria-hidden="true" />
            </button>
          )}
        </div>
      </header>
      {authOpen && (
        <div className="auth-backdrop" onClick={() => setAuthOpen(false)}>
          <form
            className="auth-card"
            onSubmit={(event) => {
              event.preventDefault();
              if (email.trim()) {
                setSignedIn(true);
                setAuthOpen(false);
              }
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="auth-close"
              onClick={() => setAuthOpen(false)}
            >
              <X size={18} strokeWidth={1.8} />
            </button>
            <span className="eyebrow">SketchStack account</span>
            <h2>Welcome back</h2>
            <p>Sign in to keep your canvases available across sessions.</p>
            <label>
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
              />
            </label>
            <label>
              Password
              <input type="password" required placeholder="••••••••" />
            </label>
            <button className="save-button" type="submit">
              Sign in
            </button>
            <small>
              Authentication UI is ready; connect your auth provider when
              accounts are enabled.
            </small>
          </form>
        </div>
      )}
    </>
  );
}
