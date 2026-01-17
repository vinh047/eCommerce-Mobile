"use client";

import { CreditCard, ChevronRight, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";

// --- Sub-component: Sortable Item ---
function SortableMethodItem({ method, isSelected, onSelect }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: method.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : "auto",
    position: "relative",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative p-4 rounded-lg border transition-all duration-200 flex items-start justify-between
        ${
          isSelected
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md ring-1 ring-blue-500"
            : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-gray-800"
        }
        ${isDragging ? "shadow-lg scale-[1.02]" : ""}
      `}
    >
      <div
        className="flex items-center space-x-3 flex-1 cursor-pointer"
        onClick={() => onSelect(method.id)}
      >
        {/* Logo Placeholder */}
        <div className="w-10 h-10 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 flex-shrink-0">
          {method.logoUrl ? (
            <img
              src={method.logoUrl}
              alt=""
              className="w-8 h-8 object-contain"
            />
          ) : (
            <CreditCard className="w-5 h-5" />
          )}
        </div>
        <div className="min-w-0">
          <h3
            className={`font-semibold text-sm truncate ${
              isSelected
                ? "text-blue-700 dark:text-blue-300"
                : "text-gray-900 dark:text-white"
            }`}
          >
            {method.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5 truncate">
            {method.code}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 pl-2">
        {/* Status Badge */}
        {method.isActive ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 whitespace-nowrap">
            Bật
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 whitespace-nowrap">
            Tắt
          </span>
        )}

        {/* Drag Handle */}
        <button
          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-grab active:cursor-grabbing rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Active Indicator Arrow */}
      {isSelected && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-[1px] pointer-events-none">
          <ChevronRight className="w-5 h-5 text-blue-500" />
        </div>
      )}
    </div>
  );
}

export default function PaymentMethodList({
  methods,
  selectedId,
  onSelect,
  onReorder,
}) {
  const [localMethods, setLocalMethods] = useState(methods);

  useEffect(() => {
    setLocalMethods(methods);
  }, [methods]);

  // --- DND Sensors ---
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setLocalMethods((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);

        // Callback to parent to save order
        if (onReorder) {
          onReorder(newOrder);
        }

        return newOrder;
      });
    }
  };

  return (
    <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-200px)] pr-2">
      {selectedId === "new" && (
        <div className="p-4 rounded-lg border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 mb-3">
          <span className="font-medium text-blue-700 dark:text-blue-300">
            + Đang tạo mới...
          </span>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={localMethods.map((m) => m.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {localMethods.map((method) => (
              <SortableMethodItem
                key={method.id}
                method={method}
                isSelected={selectedId === method.id}
                onSelect={onSelect}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
