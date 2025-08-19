import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { CanvasElement, EditorState } from "@/types/editor"

const initialElements: CanvasElement[] = [
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
    text: "Hello i-Pangram Digital Services LLP",
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
    imageUrl: "https://static.wixstatic.com/media/050e90_458e0e1517b24f82b9775d724e684fe9~mv2.png/v1/fill/w_150,h_95,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/WhatsApp_Image_2024-11-30_at_4_28_34_PM-removebg-preview.png",
  },
  {
    id: "contact",
    type: "text",
    x: 50,
    y: 180,
    width: 280,
    height: 120,
    zIndex: 3,
    text: "John Smith\nSenior Design Director\n\njohn.smith@acme.com\n+1 (555) 123-4567\nwww.i-Pangram Digital Services LLP.com",
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
]

// Deep clone utility function
const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}

const initialState: EditorState = {
  elements: initialElements,
  selectedElementId: "title",
  selectedTool: "select",
  zoomLevel: 100,
  history: [{
    elements: deepClone(initialElements),
    selectedElementId: "title",
  }],
  historyIndex: 0,
  showIconLibrary: false,
}

// Optimized history management
const saveToHistory = (state: EditorState) => {
  const newHistoryEntry = {
    elements: deepClone(state.elements),
    selectedElementId: state.selectedElementId,
  }

  // Remove future history if not at the end
  if (state.historyIndex < state.history.length - 1) {
    state.history = state.history.slice(0, state.historyIndex + 1)
  }
  
  state.history.push(newHistoryEntry)
  state.historyIndex += 1

  // Keep only last 20 entries
  if (state.history.length > 20) {
    state.history.shift()
    state.historyIndex -= 1
  }
}

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    selectElement: (state, action: PayloadAction<string | null>) => {
      state.selectedElementId = action.payload
    },
    
    selectTool: (state, action: PayloadAction<string>) => {
      state.selectedTool = action.payload
    },
    
    updateElement: (state, action: PayloadAction<{ id: string; updates: Partial<CanvasElement> }>) => {
      const { id, updates } = action.payload
      const element = state.elements.find(el => el.id === id)
      if (element) {
        Object.assign(element, updates)
        saveToHistory(state)
      }
    },
    
    // Realtime updates without history
    updateElementRealtime: (state, action: PayloadAction<{ id: string; updates: Partial<CanvasElement> }>) => {
      const { id, updates } = action.payload
      const element = state.elements.find(el => el.id === id)
      if (element) {
        Object.assign(element, updates)
      }
    },
    
    moveElement: (state, action: PayloadAction<{ id: string; x: number; y: number }>) => {
      const { id, x, y } = action.payload
      const element = state.elements.find(el => el.id === id)
      if (element) {
        element.x = x
        element.y = y
        saveToHistory(state)
      }
    },
    
    moveElementRealtime: (state, action: PayloadAction<{ id: string; x: number; y: number }>) => {
      const { id, x, y } = action.payload
      const element = state.elements.find(el => el.id === id)
      if (element) {
        element.x = x
        element.y = y
      }
    },
    
    resizeElement: (state, action: PayloadAction<{ id: string; width: number; height: number }>) => {
      const { id, width, height } = action.payload
      const element = state.elements.find(el => el.id === id)
      if (element) {
        element.width = width
        element.height = height
        saveToHistory(state)
      }
    },
    
    resizeElementRealtime: (state, action: PayloadAction<{ id: string; width: number; height: number }>) => {
      const { id, width, height } = action.payload
      const element = state.elements.find(el => el.id === id)
      if (element) {
        element.width = width
        element.height = height
      }
    },
    
    deleteElement: (state, action: PayloadAction<string>) => {
      state.elements = state.elements.filter(el => el.id !== action.payload)
      if (state.selectedElementId === action.payload) {
        state.selectedElementId = null
      }
      saveToHistory(state)
    },
    
    addElement: (state, action: PayloadAction<CanvasElement>) => {
      const maxZIndex = Math.max(...state.elements.map(el => el.zIndex), 0)
      action.payload.zIndex = maxZIndex + 1
      state.elements.push(action.payload)
      saveToHistory(state)
    },
    
    reorderElement: (state, action: PayloadAction<{ id: string; direction: "forward" | "backward" }>) => {
      const { id, direction } = action.payload
      const element = state.elements.find(el => el.id === id)
      if (element) {
        element.zIndex = direction === "forward" 
          ? element.zIndex + 1 
          : Math.max(0, element.zIndex - 1)
        saveToHistory(state)
      }
    },
    
    setZoomLevel: (state, action: PayloadAction<number>) => {
      state.zoomLevel = Math.max(25, Math.min(400, action.payload))
    },
    
    toggleIconLibrary: (state, action: PayloadAction<boolean>) => {
      state.showIconLibrary = action.payload
    },
    
    saveState: (state) => {
      saveToHistory(state)
    },
    
    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex -= 1
        const previousState = state.history[state.historyIndex]
        state.elements = deepClone(previousState.elements)
        state.selectedElementId = previousState.selectedElementId
      }
    },
    
    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex += 1
        const nextState = state.history[state.historyIndex]
        state.elements = deepClone(nextState.elements)
        state.selectedElementId = nextState.selectedElementId
      }
    },
  },
})

export const {
  selectElement,
  selectTool,
  updateElement,
  updateElementRealtime,
  moveElement,
  moveElementRealtime,
  resizeElement,
  resizeElementRealtime,
  deleteElement,
  addElement,
  reorderElement,
  setZoomLevel,
  toggleIconLibrary,
  saveState,
  undo,
  redo,
} = editorSlice.actions

export default editorSlice.reducer