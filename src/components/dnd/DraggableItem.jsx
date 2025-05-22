import { useDraggable } from "@dnd-kit/core";

export default function DraggableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    touchAction: "none",
    zIndex: 1000,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="word"
    >
      {children}
    </div>
  );
}
