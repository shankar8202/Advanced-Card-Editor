import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CanvasElement, EditorState, Point, ElementType } from "@/types/editor";

const initialState: EditorState = {
  elements: [
    {
      id: "background",
      type: "background",
      x: 0,
      y: 0,
      width: 600,
      height: 350,
      zIndex: 0,
      backgroundColor: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
    },
    {
      id: "title",
      type: "text",
      x: 50,
      y: 40,
      width: 300,
      height: 60,
      zIndex: 1,
      text: "ACME Corporation",
      fontSize: 24,
      fontFamily: "Inter",
      fontWeight: "bold",
      color: "#374151",
      textAlign: "left",
    },
    {
      id: "logo",
      type: "image",
      x: 520,
      y: 50,
      width: 80,
      height: 80,
      zIndex: 2,
      imageUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80",
    },
    {
      id: "contact",
      type: "text",
      x: 50,
      y: 180,
      width: 280,
      height: 120,
      zIndex: 3,
      text: "John Smith\nSenior Design Director\n\njohn.smith@acme.com\n+1 (555) 123-4567\nwww.acme-corp.com",
      fontSize: 14,
      fontFamily: "Inter",
      color: "#374151",
      textAlign: "left",
    },
    {
      id: "line",
      type: "rectangle",
      x: 400,
      y: 120,
      width: 100,
      height: 3,
      zIndex: 4,
      backgroundColor: "#0066ff",
    },
  ],
  selectedElementId: "title",
  selectedTool: "select",
  zoomLevel: 100,
  history: [],
  historyIndex: -1,
  showIconLibrary: false,
};

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    selectElement: (state, action: PayloadAction<string | null>) => {
      state.selectedElementId = action.payload;
    },
    selectTool: (state, action: PayloadAction<string>) => {
      state.selectedTool = action.payload;
    },
    updateElement: (state, action: PayloadAction<{ id: string; updates: Partial<CanvasElement> }>) => {
      const { id, updates } = action.payload;
      const element = state.elements.find((el) => el.id === id);
      if (element) {
        Object.assign(element, updates);
      }
    },
    moveElement: (state, action: PayloadAction<{ id: string; x: number; y: number }>) => {
      const { id, x, y } = action.payload;
      const element = state.elements.find((el) => el.id === id);
      if (element) {
        element.x = x;
        element.y = y;
      }
    },
    resizeElement: (state, action: PayloadAction<{ id: string; width: number; height: number }>) => {
      const { id, width, height } = action.payload;
      const element = state.elements.find((el) => el.id === id);
      if (element) {
        element.width = width;
        element.height = height;
      }
    },
    deleteElement: (state, action: PayloadAction<string>) => {
      state.elements = state.elements.filter((el) => el.id !== action.payload);
      if (state.selectedElementId === action.payload) {
        state.selectedElementId = null;
      }
    },
    addElement: (state, action: PayloadAction<CanvasElement>) => {
      const maxZIndex = Math.max(...state.elements.map((el) => el.zIndex));
      action.payload.zIndex = maxZIndex + 1;
      state.elements.push(action.payload);
    },
    reorderElement: (state, action: PayloadAction<{ id: string; direction: "forward" | "backward" }>) => {
      const { id, direction } = action.payload;
      const element = state.elements.find((el) => el.id === id);
      if (element) {
        if (direction === "forward") {
          element.zIndex += 1;
        } else {
          element.zIndex = Math.max(0, element.zIndex - 1);
        }
      }
    },
    setZoomLevel: (state, action: PayloadAction<number>) => {
      state.zoomLevel = Math.max(25, Math.min(400, action.payload));
    },
    toggleIconLibrary: (state, action: PayloadAction<boolean>) => {
      state.showIconLibrary = action.payload;
    },
    saveState: (state) => {
      const currentState = {
        elements: [...state.elements],
        selectedElementId: state.selectedElementId,
      };
      state.history = state.history.slice(0, state.historyIndex + 1);
      state.history.push(currentState);
      state.historyIndex += 1;
      
      // Limit history to 20 items
      if (state.history.length > 20) {
        state.history.shift();
        state.historyIndex -= 1;
      }
    },
    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex -= 1;
        const previousState = state.history[state.historyIndex];
        state.elements = previousState.elements;
        state.selectedElementId = previousState.selectedElementId;
      }
    },
    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex += 1;
        const nextState = state.history[state.historyIndex];
        state.elements = nextState.elements;
        state.selectedElementId = nextState.selectedElementId;
      }
    },
  },
});

export const {
  selectElement,
  selectTool,
  updateElement,
  moveElement,
  resizeElement,
  deleteElement,
  addElement,
  reorderElement,
  setZoomLevel,
  toggleIconLibrary,
  saveState,
  undo,
  redo,
} = editorSlice.actions;

export default editorSlice.reducer;
