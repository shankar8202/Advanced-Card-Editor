export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  
  // Text properties
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  color?: string;
  textAlign?: "left" | "center" | "right";
  lineHeight?: number;
  
  // Shape properties
  backgroundColor?: string;
  
  // Image properties
  imageUrl?: string;
}

export type ElementType = "text" | "image" | "rectangle" | "circle" | "background";

export interface Point {
  x: number;
  y: number;
}

export interface EditorState {
  elements: CanvasElement[];
  selectedElementId: string | null;
  selectedTool: string;
  zoomLevel: number;
  history: Array<{
    elements: CanvasElement[];
    selectedElementId: string | null;
  }>;
  historyIndex: number;
  showIconLibrary: boolean;
}
