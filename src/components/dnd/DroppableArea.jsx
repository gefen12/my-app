import { useDroppable } from "@dnd-kit/core";

export default function DroppableArea({ id, children }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`drop-slot ${isOver ? "drag-over" : ""}`}
    >
      {children}
    </div>
  );
}