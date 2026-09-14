export type ElementType = "rectangle" | "circle" | "text" | "line" | "curve";
export type LineStyle = "straight" | "curved" | "elbow";
export type CanvasElement = {
  id: string;
  type: ElementType;
  lineStyle?: LineStyle;
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  rotation: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  strokeEnabled?: boolean;
  opacity?: number;
  points?: number[];
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontStyle?: "normal" | "bold" | "italic" | "bold italic";
  textDecoration?:
    "none" | "underline" | "line-through" | "underline line-through";
  align?: "left" | "center" | "right";
};
export type CanvasDocument = {
  _id?: string;
  localId: string;
  name: string;
  width: number;
  height: number;
  elements: CanvasElement[];
  updatedAt?: string;
  createdAt?: string;
  deletedAt?: string | null;
};
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.error || "Request failed", response.status);
  }
  return response.status === 204 ? (undefined as T) : response.json();
}
export const api = {
  list: (view: "active" | "trash" = "active") =>
    request<CanvasDocument[]>(`/canvases?view=${view}`),
  get: (id: string) => request<CanvasDocument>(`/canvases/${id}`),
  create: (data: Partial<CanvasDocument>) =>
    request<CanvasDocument>("/canvases", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: CanvasDocument) =>
    request<CanvasDocument>(`/canvases/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  remove: (id: string) =>
    request<CanvasDocument>(`/canvases/${id}`, { method: "DELETE" }),
  restore: (id: string) =>
    request<CanvasDocument>(`/canvases/${id}/restore`, { method: "POST" }),
  permanentlyRemove: (id: string) =>
    request<void>(`/canvases/${id}/permanent`, { method: "DELETE" }),
};
