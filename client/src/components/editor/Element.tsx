import { CanvasElement } from "@/types/editor";
import { cn } from "@/lib/utils";

interface ElementProps {
  element: CanvasElement;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
}

export function Element({ element, isSelected, onMouseDown }: ElementProps) {
  const baseStyle = {
    position: "absolute" as const,
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
    zIndex: element.zIndex,
  };

  const selectionStyle = isSelected && element.type !== "background" ? {
    border: "2px dashed #0066ff",
    backgroundColor: "rgba(0, 102, 255, 0.1)",
  } : {};

  const renderSelectionHandles = () => {
    if (!isSelected || element.type === "background") return null;

    const handles = [
      { position: "nw-resize", className: "-top-1 -left-1" },
      { position: "n-resize", className: "-top-1 left-1/2 transform -translate-x-1/2" },
      { position: "ne-resize", className: "-top-1 -right-1" },
      { position: "e-resize", className: "top-1/2 -right-1 transform -translate-y-1/2" },
      { position: "se-resize", className: "-bottom-1 -right-1" },
      { position: "s-resize", className: "-bottom-1 left-1/2 transform -translate-x-1/2" },
      { position: "sw-resize", className: "-bottom-1 -left-1" },
      { position: "w-resize", className: "top-1/2 -left-1 transform -translate-y-1/2" },
    ];

    return (
      <>
        {handles.map((handle, index) => (
          <div
            key={index}
            className={cn(
              "absolute w-2 h-2 bg-editor-accent border border-white rounded-sm",
              `cursor-${handle.position}`,
              handle.className
            )}
          />
        ))}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-editor-accent border border-white rounded-full cursor-grab" />
      </>
    );
  };

  const renderContent = () => {
    switch (element.type) {
      case "background":
        return (
          <div
            style={{
              ...baseStyle,
              background: element.backgroundColor,
            }}
            className="w-full h-full"
            data-testid={`element-${element.id}`}
          />
        );

      case "text":
        return (
          <div
            style={{
              ...baseStyle,
              ...selectionStyle,
              fontFamily: element.fontFamily,
              fontSize: element.fontSize,
              fontWeight: element.fontWeight,
              fontStyle: element.fontStyle,
              textDecoration: element.textDecoration,
              color: element.color,
              textAlign: element.textAlign,
              lineHeight: element.lineHeight,
              cursor: "move",
              padding: "8px",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
            onMouseDown={onMouseDown}
            data-testid={`element-${element.id}`}
          >
            {element.text}
            {renderSelectionHandles()}
          </div>
        );

      case "rectangle":
        return (
          <div
            style={{
              ...baseStyle,
              ...selectionStyle,
              backgroundColor: element.backgroundColor,
              cursor: "move",
            }}
            onMouseDown={onMouseDown}
            data-testid={`element-${element.id}`}
          >
            {renderSelectionHandles()}
          </div>
        );

      case "circle":
        return (
          <div
            style={{
              ...baseStyle,
              ...selectionStyle,
              backgroundColor: element.backgroundColor,
              borderRadius: "50%",
              cursor: "move",
            }}
            onMouseDown={onMouseDown}
            data-testid={`element-${element.id}`}
          >
            {renderSelectionHandles()}
          </div>
        );

      case "image":
        return (
          <div
            style={{
              ...baseStyle,
              ...selectionStyle,
              cursor: "move",
            }}
            onMouseDown={onMouseDown}
            data-testid={`element-${element.id}`}
          >
            <img
              src={element.imageUrl}
              alt="Element"
              className="w-full h-full object-cover"
              style={{ borderRadius: "0" }}
            />
            {renderSelectionHandles()}
          </div>
        );

      default:
        return null;
    }
  };

  return renderContent();
}
