import { useEffect, useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ChevronDown,
  ChevronRight,
  Circle,
  Palette,
  SendToBack,
  Slash,
  Square,
  Trash2,
  Type,
  Waves,
} from "lucide-react";
import type { CanvasElement } from "../../services/api";
import Dropdown from "../Dropdown/Dropdown";
type Props = {
  element?: CanvasElement;
  elements: CanvasElement[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onChange: (patch: Partial<CanvasElement>) => void;
  onDelete: () => void;
  onForward: () => void;
  onBackward: () => void;
};
const fonts = [
  "Arial",
  "Inter",
  "DM Sans",
  "Georgia",
  "Playfair Display",
  "Times New Roman",
  "Courier New",
  "Comic Sans MS",
].map((value) => ({ value, label: value }));
const clamp = (n: number, min: number, max: number) =>
  Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : min;
const parts = (v: string) => {
  const s = v.replace(/^#/, "");
  return /^[0-9a-f]{6}$/i.test(s)
    ? [
        parseInt(s.slice(0, 2), 16),
        parseInt(s.slice(2, 4), 16),
        parseInt(s.slice(4), 16),
      ]
    : null;
};
const makeHex = (v: number[]) =>
  "#" +
  v
    .map((n) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0"))
    .join("");
const layerIcon = (type: CanvasElement["type"]) => {
  if (type === "text") return Type;
  if (type === "circle") return Circle;
  if (type === "line") return Slash;
  if (type === "curve") return Waves;
  return Square;
};
const displayElementType = (type: CanvasElement["type"]) =>
  type.charAt(0).toUpperCase() + type.slice(1);
function NumberField({
  label,
  value,
  onChange,
  min = -1000000,
  max = 1000000,
}: {
  label: string;
  value?: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}) {
  const [draft, setDraft] = useState(String(value ?? 0));
  useEffect(() => {
    if (document.activeElement?.getAttribute("data-number") !== label)
      setDraft(String(value ?? 0));
  }, [value, label]);
  return (
    <label className="field">
      <span>{label}</span>
      <input
        data-number={label}
        type="number"
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          const n = Number(e.target.value);
          if (e.target.value.trim() && Number.isFinite(n))
            onChange(clamp(n, min, max));
        }}
        onBlur={() => {
          const n = Number(draft);
          setDraft(
            String(Number.isFinite(n) ? clamp(n, min, max) : (value ?? 0)),
          );
        }}
      />
    </label>
  );
}
function ColorControl({
  color,
  onChange,
}: {
  color: string;
  onChange: (v: string) => void;
}) {
  const [draft, setDraft] = useState(color || "#000000");
  const p = parts(color) || [0, 0, 0];
  const [rgb, setRgb] = useState(p.map(String));
  useEffect(() => {
    setDraft(color || "#000000");
    const n = parts(color);
    if (n) setRgb(n.map(String));
  }, [color]);
  const setHex = (v: string) => {
    setDraft(v);
    const n = parts(v);
    if (n) {
      setRgb(n.map(String));
      onChange(makeHex(n));
    }
  };
  const setPart = (i: number, v: string) => {
    const n = [...rgb];
    n[i] = v;
    setRgb(n);
    if (n.every(Boolean) && n.every((x) => Number.isFinite(Number(x))))
      onChange(makeHex(n.map(Number)));
  };
  return (
    <div className="color-control">
      <div className="color-control-body">
        <div className="color-input-line">
          <label className="color-wheel-large">
            <input
              type="color"
              value={parts(color) ? color : "#000000"}
              onChange={(e) => onChange(e.target.value)}
            />
          </label>
          <div className="color-values">
            <label>
              <small>HEX</small>
              <input
                className="hex-input"
                value={draft}
                onChange={(e) => setHex(e.target.value)}
                onBlur={() => {
                  if (!parts(draft)) setDraft(color || "#000000");
                }}
              />
            </label>
            <div>
              <small>RGB</small>
              <div className="rgb-fields">
                {rgb.map((v, i) => (
                  <input
                    key={i}
                    value={v}
                    onChange={(e) => setPart(i, e.target.value)}
                    onBlur={() => {
                      const n = clamp(Number(rgb[i]) || 0, 0, 255);
                      const next = [...rgb];
                      next[i] = String(n);
                      setRgb(next);
                      onChange(makeHex(next.map(Number)));
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      className={on ? "toggle on" : "toggle"}
      onClick={onClick}
    >
      <i />
    </button>
  );
}
export default function PropertiesPanel({
  element,
  elements,
  selectedId,
  onSelect,
  onChange,
  onDelete,
}: Props) {
  const [tab, setTab] = useState<"properties" | "layers">("properties");
  const [open, setOpen] = useState(false);
  const text = element?.type === "text";
  const line = element?.type === "line" || element?.type === "curve";
  useEffect(() => {
    setTab("properties");
    setOpen(!text);
  }, [selectedId, text]);
  if (tab === "layers")
    return (
      <aside className="properties">
        <div className="panel-tabs">
          <button onClick={() => setTab("properties")}>Properties</button>
          <button className="active">Layers</button>
        </div>
        <div className="layers-list">
          {[...elements].reverse().map((layer) => (
            <button
              key={layer.id}
              className={
                layer.id === selectedId ? "layer-row active" : "layer-row"
              }
              onClick={() => {
                onSelect(layer.id);
                setTab("properties");
              }}
            >
              <span className="layer-symbol">
                {(() => {
                  const Icon = layerIcon(layer.type);
                  return <Icon size={16} strokeWidth={1.8} />;
                })()}
              </span>
              <span>
                {layer.type}
                {layer.type === "text" ? " — " + (layer.text || "") : ""}
              </span>
            </button>
          ))}
        </div>
      </aside>
    );
  if (!element)
    return (
      <aside className="properties">
        <div className="panel-tabs">
          <button className="active">Properties</button>
          <button onClick={() => setTab("layers")}>Layers</button>
        </div>
        <div className="empty-properties">
          <div className="empty-art"><Palette size={32} strokeWidth={1.5} /></div>
          <h3>Select an element</h3>
          <p>Choose a shape on the canvas to edit its properties.</p>
        </div>
      </aside>
    );
  const bold = (element.fontStyle || "").includes("bold"),
    italic = (element.fontStyle || "").includes("italic"),
    dec = element.textDecoration || "none";
  const style = (k: "bold" | "italic") => {
    const b = k === "bold" ? !bold : bold,
      i = k === "italic" ? !italic : italic;
    onChange({
      fontStyle: b ? (i ? "bold italic" : "bold") : i ? "italic" : "normal",
    });
  };
  const decoration = (k: "underline" | "line-through") => {
    const has = dec.includes(k),
      other = k === "underline" ? "line-through" : "underline";
    onChange({
      textDecoration: has
        ? dec.includes(other)
          ? other
          : "none"
        : dec.includes(other)
          ? "underline line-through"
          : k,
    });
  };
  return (
    <aside className="properties">
      <div className="panel-tabs">
        <button className="active">Properties</button>
        <button onClick={() => setTab("layers")}>Layers</button>
      </div>
      <div className="panel-heading">
        <h2>{text ? "Text" : displayElementType(element.type)}</h2>
        <button className="delete-button" onClick={onDelete}>
          <Trash2 size={18} strokeWidth={1.8} />
        </button>
      </div>
      {text && (
        <div className="property-section">
          <div className="section-label">Content</div>
          <textarea
            value={element.text || ""}
            onChange={(e) => onChange({ text: e.target.value })}
          />
          <label className="field select-field">
            <span>Font</span>
            <Dropdown
              value={element.fontFamily || "Arial"}
              options={fonts}
              onChange={(fontFamily) => onChange({ fontFamily })}
              ariaLabel="Font family"
            />
          </label>
          <div className="size-control">
            <NumberField
              label="Size"
              value={element.fontSize || 32}
              min={8}
              max={200}
              onChange={(fontSize) => onChange({ fontSize })}
            />
            <input
              type="range"
              min="8"
              max="200"
              value={clamp(element.fontSize || 32, 8, 200)}
              onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
            />
          </div>
          <div className="section-label">Style</div>
          <div className="format-row">
            <button
              className={bold ? "format-button active" : "format-button"}
              onClick={() => style("bold")}
            >
              <b>B</b>
            </button>
            <button
              className={italic ? "format-button active" : "format-button"}
              onClick={() => style("italic")}
            >
              <i>I</i>
            </button>
            <button
              className={
                dec.includes("underline")
                  ? "format-button active"
                  : "format-button"
              }
              onClick={() => decoration("underline")}
            >
              <u>U</u>
            </button>
            <button
              className={
                dec.includes("line-through")
                  ? "format-button active"
                  : "format-button"
              }
              onClick={() => decoration("line-through")}
            >
              <s>S</s>
            </button>
          </div>
          <div className="section-label">Text Align</div>
          <div className="format-row">
            {(["left", "center", "right"] as const).map((a) => (
              <button
                key={a}
                className={
                  (element.align || "left") === a
                    ? "format-button active"
                    : "format-button"
                }
                onClick={() => onChange({ align: a })}
              >
                {a === "left" ? <AlignLeft size={16} strokeWidth={1.8} /> : a === "center" ? <AlignCenter size={16} strokeWidth={1.8} /> : <AlignRight size={16} strokeWidth={1.8} />}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="property-section">
        <button className="accordion-row" onClick={() => setOpen(!open)}>
          Transform <span>{open ? <ChevronDown size={16} strokeWidth={1.8} /> : <ChevronRight size={16} strokeWidth={1.8} />}</span>
        </button>
        {open && (
          <>
            <div className="field-grid">
              <NumberField
                label="X"
                value={element.x}
                onChange={(x) => onChange({ x })}
              />
              <NumberField
                label="Y"
                value={element.y}
                onChange={(y) => onChange({ y })}
              />
            </div>
            {(text || element.type === "rectangle") && (
              <div className="field-grid">
                <NumberField
                  label="Width"
                  value={element.width}
                  min={20}
                  max={100000}
                  onChange={(width) => onChange({ width })}
                />
                <NumberField
                  label="Height"
                  value={element.height}
                  min={20}
                  max={100000}
                  onChange={(height) => onChange({ height })}
                />
              </div>
            )}
            {element.type === "circle" && (
              <NumberField
                label="Radius"
                value={element.radius}
                min={8}
                max={100000}
                onChange={(radius) => onChange({ radius })}
              />
            )}
            <NumberField
              label="Rotation"
              value={element.rotation}
              onChange={(rotation) =>
                onChange({ rotation: ((rotation % 360) + 360) % 360 })
              }
            />
          </>
        )}
      </div>
      <div className="property-section">
        <div className="section-label">
          {text ? "Text Color" : line ? "Stroke" : "Fill"}
        </div>
        <ColorControl
          color={text ? element.fill : line ? element.stroke || "#1d1b24" : element.fill}
          onChange={(value) => onChange(line ? { stroke: value } : { fill: value })}
        />
        {!text && (
          <>
            {!line && (
              <>
                <div className="section-label">Stroke Color</div>
                <ColorControl
                  color={element.stroke || "#1d1b24"}
                  onChange={(stroke) => onChange({ stroke })}
                />
              </>
            )}
            <div className="stroke-row">
              <span>Stroke</span>
              <Toggle
                on={element.strokeEnabled !== false}
                onClick={() =>
                  onChange({ strokeEnabled: element.strokeEnabled === false })
                }
              />
              <NumberField
                label="Width"
                value={element.strokeWidth ?? (line ? 4 : 2)}
                min={0}
                max={100}
                onChange={(strokeWidth) => onChange({ strokeWidth })}
              />
            </div>
          </>
        )}
        <label className="field range-field">
          <span>Opacity</span>
          <input
            type="range"
            min="0"
            max="1"
            step=".01"
            value={element.opacity ?? 1}
            onChange={(e) =>
              onChange({ opacity: clamp(Number(e.target.value), 0, 1) })
            }
          />
          <output>{Math.round((element.opacity ?? 1) * 100)}%</output>
        </label>
      </div>
    </aside>
  );
}
