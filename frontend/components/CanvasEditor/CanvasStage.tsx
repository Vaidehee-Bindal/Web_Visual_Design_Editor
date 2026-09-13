"use client";
import { useEffect, useRef, useState } from "react";
import {
  Stage,
  Layer,
  Group,
  Rect,
  Circle,
  Text,
  Line,
  Transformer,
} from "react-konva";
import type Konva from "konva";
import type { CanvasElement } from "../../services/api";

type Point = { x: number; y: number };
type Bounds = { left: number; top: number; right: number; bottom: number };
type Props = {
  width: number;
  height: number;
  zoom?: number;
  elements: CanvasElement[];
  selectedIds: string[];
  editingId?: string | null;
  onSelect: (id: string | null, additive?: boolean) => void;
  onSelectMany: (ids: string[], additive?: boolean) => void;
  onTextEdit: (id: string) => void;
  onChange: (id: string, patch: Partial<CanvasElement>) => void;
  stageRef: React.MutableRefObject<Konva.Stage | null>;
};

function elementBounds(element: CanvasElement): Bounds {
  const angle = ((element.rotation || 0) * Math.PI) / 180;
  const rotate = (x: number, y: number) => ({
    x: element.x + x * Math.cos(angle) - y * Math.sin(angle),
    y: element.y + x * Math.sin(angle) + y * Math.cos(angle),
  });
  if (element.type === "circle") {
    const radius = element.radius || 0;
    return {
      left: element.x - radius,
      top: element.y - radius,
      right: element.x + radius,
      bottom: element.y + radius,
    };
  }
  const points =
    element.type === "line" || element.type === "curve"
      ? (element.points || [0, 0, 0, 0]).reduce<{ x: number; y: number }[]>(
          (out, value, index, values) =>
            index % 2 ? out : [...out, rotate(value, values[index + 1] || 0)],
          [],
        )
      : [
          rotate(0, 0),
          rotate(element.width || 0, 0),
          rotate(element.width || 0, element.height || 0),
          rotate(0, element.height || 0),
        ];
  return {
    left: Math.min(...points.map((point) => point.x)),
    top: Math.min(...points.map((point) => point.y)),
    right: Math.max(...points.map((point) => point.x)),
    bottom: Math.max(...points.map((point) => point.y)),
  };
}
function overlaps(a: Bounds, b: Bounds) {
  return (
    a.left <= b.right &&
    a.right >= b.left &&
    a.top <= b.bottom &&
    a.bottom >= b.top
  );
}
function contained(a: Bounds, b: Bounds) {
  return (
    a.left >= b.left &&
    a.right <= b.right &&
    a.top >= b.top &&
    a.bottom <= b.bottom
  );
}

function FocusHandles({
  element,
  onChange,
}: {
  element?: CanvasElement;
  onChange: Props["onChange"];
}) {
  if (!element) return <Group />;
  const points = element.points || [];
  const style =
    element.lineStyle || (element.type === "curve" ? "curved" : "straight");
  if (style === "straight" || points.length < 4) return <Group />;
  return (
    <Group>
      {Array.from({ length: points.length / 2 }, (_, index) => {
        const pointIndex = index * 2;
        const isControl =
          style === "curved" && index > 0 && index < points.length / 2 - 1;
        return (
          <Circle
            key={`${element.id}-focus-${index}`}
            x={element.x + points[pointIndex]}
            y={element.y + points[pointIndex + 1]}
            radius={isControl ? 7 : 6}
            fill={isControl ? "#7852dd" : "#fff"}
            stroke={isControl ? "#7852dd" : "#b8b3c0"}
            strokeWidth={2}
            draggable
            hitStrokeWidth={10}
            onDragEnd={(event) => {
              const next = [...points];
              next[pointIndex] = event.target.x() - element.x;
              next[pointIndex + 1] = event.target.y() - element.y;
              onChange(element.id, { points: next });
            }}
          />
        );
      })}
    </Group>
  );
}

export default function CanvasStage({
  width,
  height,
  zoom = 1,
  elements,
  selectedIds,
  editingId,
  onSelect,
  onSelectMany,
  onTextEdit,
  onChange,
  stageRef,
}: Props) {
  const transformerRef = useRef<Konva.Transformer>(null);
  const nodeRefs = useRef<Record<string, Konva.Node>>({});
  const marqueeStart = useRef<Point | null>(null);
  const [marquee, setMarquee] = useState<Bounds | null>(null);
  useEffect(() => {
    const nodes = selectedIds.map((id) => nodeRefs.current[id]).filter(Boolean);
    transformerRef.current?.nodes(nodes);
    transformerRef.current?.getLayer()?.batchDraw();
  }, [selectedIds, elements]);
  const commitTransform = (el: CanvasElement, node: Konva.Node) => {
    const sx = node.scaleX(),
      sy = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);
    if (el.type === "circle")
      onChange(el.id, {
        x: node.x(),
        y: node.y(),
        radius: Math.max(8, (el.radius || 50) * sx),
        rotation: node.rotation(),
      });
    else if (el.type === "line" || el.type === "curve")
      onChange(el.id, {
        x: node.x(),
        y: node.y(),
        rotation: node.rotation(),
        points: (el.points || []).map((p, i) => p * (i % 2 ? sy : sx)),
      });
    else
      onChange(el.id, {
        x: node.x(),
        y: node.y(),
        width: Math.max(20, (el.width || 100) * sx),
        height: Math.max(20, (el.height || 80) * sy),
        rotation: node.rotation(),
      });
  };
  const stagePoint = (stage: Konva.Stage): Point => {
    const point = stage.getPointerPosition() || { x: 0, y: 0 };
    const transform = stage.getAbsoluteTransform().copy();
    transform.invert();
    return transform.point(point);
  };
  const beginMarquee = (event: Konva.KonvaEventObject<MouseEvent>) => {
    if (event.target !== event.target.getStage()) return;
    const point = stagePoint(event.target.getStage() as Konva.Stage);
    marqueeStart.current = point;
    setMarquee({
      left: point.x,
      top: point.y,
      right: point.x,
      bottom: point.y,
    });
  };
  const updateMarquee = (event: Konva.KonvaEventObject<MouseEvent>) => {
    if (!marqueeStart.current) return;
    const point = stagePoint(event.target.getStage() as Konva.Stage);
    const start = marqueeStart.current;
    setMarquee({
      left: Math.min(start.x, point.x),
      top: Math.min(start.y, point.y),
      right: Math.max(start.x, point.x),
      bottom: Math.max(start.y, point.y),
    });
  };
  const finishMarquee = (event: Konva.KonvaEventObject<MouseEvent>) => {
    if (!marqueeStart.current) return;
    const point = stagePoint(event.target.getStage() as Konva.Stage);
    const start = marqueeStart.current;
    const distance = Math.hypot(point.x - start.x, point.y - start.y);
    if (distance < 4) {
      onSelect(null, event.evt.shiftKey);
      marqueeStart.current = null;
      setMarquee(null);
      return;
    }
    const box = {
      left: Math.min(start.x, point.x),
      top: Math.min(start.y, point.y),
      right: Math.max(start.x, point.x),
      bottom: Math.max(start.y, point.y),
    };
    const leftToRight = point.x >= start.x;
    onSelectMany(
      elements
        .filter((element) =>
          leftToRight
            ? contained(elementBounds(element), box)
            : overlaps(elementBounds(element), box),
        )
        .map((element) => element.id),
      event.evt.shiftKey,
    );
    marqueeStart.current = null;
    setMarquee(null);
  };
  const selectedLine =
    selectedIds.length === 1
      ? elements.find(
          (element) =>
            element.id === selectedIds[0] &&
            (element.type === "line" || element.type === "curve"),
        )
      : undefined;
  const marqueeVisible = Boolean(marquee);
  return (
    <Stage
      ref={stageRef}
      width={width * zoom}
      height={height * zoom}
      scaleX={zoom}
      scaleY={zoom}
      onMouseDown={beginMarquee}
      onMouseMove={updateMarquee}
      onMouseUp={finishMarquee}
    >
      <Layer>
        {elements.map((el) => {
          const common = {
            key: el.id,
            id: el.id,
            x: el.x,
            y: el.y,
            rotation: el.rotation,
            opacity: el.opacity ?? 1,
            visible: el.id !== editingId,
            draggable: true,
            ref: (node: Konva.Node | null) => {
              if (node) nodeRefs.current[el.id] = node;
            },
            onClick: (event: Konva.KonvaEventObject<MouseEvent>) =>
              onSelect(el.id, event.evt.shiftKey),
            onTap: () => onSelect(el.id),
            onDblClick: () => {
              onSelect(el.id);
              if (el.type === "text") onTextEdit(el.id);
            },
            onDblTap: () => {
              onSelect(el.id);
              if (el.type === "text") onTextEdit(el.id);
            },
            onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) =>
              onChange(el.id, { x: e.target.x(), y: e.target.y() }),
            onTransformEnd: (e: Konva.KonvaEventObject<Event>) =>
              commitTransform(el, e.target),
          };
          if (el.type === "rectangle")
            return (
              <Rect
                {...common}
                width={el.width}
                height={el.height}
                fill={el.fill}
                stroke={el.strokeEnabled === false ? undefined : el.stroke}
                strokeWidth={el.strokeWidth || 2}
                cornerRadius={12}
              />
            );
          if (el.type === "circle")
            return (
              <Circle
                {...common}
                radius={el.radius}
                fill={el.fill}
                stroke={el.strokeEnabled === false ? undefined : el.stroke}
                strokeWidth={el.strokeWidth || 2}
              />
            );
          if (el.type === "line" || el.type === "curve") {
            const style =
              el.lineStyle || (el.type === "curve" ? "curved" : "straight");
            return (
              <Line
                {...common}
                points={el.points}
                bezier={style === "curved"}
                stroke={el.stroke || el.fill}
                strokeWidth={el.strokeWidth || 4}
                lineCap="round"
                lineJoin="round"
              />
            );
          }
          return (
            <Text
              {...common}
              text={el.text}
              fontSize={el.fontSize}
              fontFamily={el.fontFamily || "Arial"}
              fontStyle={el.fontStyle || "normal"}
              textDecoration={el.textDecoration || "none"}
              align={el.align || "left"}
              fill={el.fill}
              stroke={el.strokeEnabled === false ? undefined : el.stroke}
              strokeWidth={el.strokeWidth || 0}
              padding={4}
              width={el.width}
            />
          );
        })}
        <FocusHandles element={selectedLine} onChange={onChange} />
        <Rect
          visible={marqueeVisible}
          x={marquee?.left ?? 0}
          y={marquee?.top ?? 0}
          width={marquee ? marquee.right - marquee.left : 0}
          height={marquee ? marquee.bottom - marquee.top : 0}
          fill="#7852dd18"
          stroke="#7852dd"
          dash={[6, 4]}
          listening={false}
        />
        <Transformer
          ref={transformerRef}
          rotateEnabled
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ]}
          borderStroke="#8b5cf6"
          anchorStroke="#8b5cf6"
          anchorFill="#fff"
          anchorSize={8}
        />
      </Layer>
    </Stage>
  );
}
