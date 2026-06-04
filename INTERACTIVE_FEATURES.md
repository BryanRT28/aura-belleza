# Aura Belleza - Interactive Features Implementation

## 1. Interactive Face Mapping with Hover Effects

### Features:
- **FaceMappingOverlay Component** (`components/aura/face-mapping.tsx`)
- 15 glowing SVG dots strategically placed across facial regions
- **Contextual highlighting** based on tool hover:
  - **Botox / Lifting**: Highlights forehead and brow area (5 dots)
  - **Rinoplastia**: Highlights nose bridge area (2 dots)
  - **Mentoplastia**: Highlights jawline and chin area (3 dots)
  - Other points remain visible at lower opacity (0.4)
  
### Implementation:
- SVG overlay positioned absolutely over the image
- Dots transition color (gold #d4af37) when tool is hovered
- Enhanced glow effect (drop-shadow) on active dots
- Smooth transitions using Tailwind's `transition-all` and inline styles

### Usage:
```typescript
<FaceMappingOverlay isVisible={!!image} hoveredTool={hoveredTool} />
```

---

## 2. AI Insights Panel (Análisis de Simetría IA)

### Features:
- **AIInsightsPanel Component** (`components/aura/ai-insights.tsx`)
- Glassmorphism card with backdrop-blur effect
- Animated progress bars that fill on visibility
- Real-time metrics display:
  - Armonía Facial: 92%
  - Simetría Izquierda/Derecha: 89%
  - Luminosidad de la Piel: Óptima (status badge)

### Animation:
- Slides in from right (desktop) with spring physics
- Progress bars animate from 0% to target value over 1 second
- Staggered delay (0.2s) for visual effect

### Trigger:
- Auto-opens after "Procesar Simulación" completes (3 seconds)
- Smooth fade in/out based on `isVisible` prop

### Usage:
```typescript
<AIInsightsPanel isVisible={showAIInsights} />
```

---

## 3. Theme Switcher (Modo Experiencia / Modo Consulta)

### Features:
- **Toggle button in navbar** with Sun/Moon icons
- Two complete theme modes:
  - **Modo Experiencia** (default): Cream #fdfaf6, rose accent #f4dcd6
  - **Modo Consulta**: Clinical white #ffffff, blue-grey accents #e0e7ff

### Implementation:
- `useTheme()` hook (`hooks/use-theme.ts`) manages DOM class application
- CSS variables switch via `.modo-consulta` class on `<html>`
- Tailwind transitions all color changes smoothly (duration-300)
- State managed in AuraBelleza component and passed to Navbar

### Affected Colors:
- Background: #fdfaf6 → #ffffff
- Card: #ffffff → #f3f4f6
- Secondary: #f4dcd6 → #e0e7ff
- Border: #e0d5cc → #d1d5db
- All other colors (primary gold, foreground) remain consistent

### Usage:
```typescript
const [theme, setTheme] = useState<'experiencia' | 'consulta'>('experiencia');
<Navbar theme={theme} onThemeChange={setTheme} />
```

---

## 4. Micro-interactions & State Management

### Interactive Components:
1. **ToolsSidebar**: 
   - `onMouseEnter` / `onMouseLeave` triggers `onToolHover` callback
   - Button scales on hover (1.02x with Framer Motion)
   - Visual feedback with border color change

2. **ImageViewer**:
   - Accepts `hoveredTool` prop to pass to FaceMappingOverlay
   - Shows processing overlay during simulation
   - Triggers AI insights panel after completion

3. **Navbar**:
   - Theme toggle button with hover state
   - Smooth icon transition
   - Maintains sticky positioning

### State Flow:
```
User hovers tool button
  ↓
onMouseEnter → onToolHover(toolName)
  ↓
AuraBelleza state updates: hoveredTool
  ↓
ImageViewer receives hoveredTool prop
  ↓
FaceMappingOverlay highlights relevant dots
```

---

## 5. Component Files Created/Modified

### New Files:
- `components/aura/ai-insights.tsx` - AI metrics panel
- `components/aura/face-mapping.tsx` - Face mapping overlay
- `hooks/use-theme.ts` - Theme management hook

### Modified Files:
- `components/aura/image-viewer.tsx` - Added face mapping and insights panel
- `components/aura/tools-sidebar.tsx` - Added hover callbacks
- `components/aura/navbar.tsx` - Added theme toggle
- `components/aura/aura-belleza.tsx` - Added state management
- `app/globals.css` - Added clinical theme CSS variables

---

## How It Works in the Browser

1. **Upload image** → Face mapping dots appear on overlay
2. **Hover "Botox"** → Forehead dots light up gold
3. **Hover "Rinoplastia"** → Nose dots light up gold
4. **Hover "Mentoplastia"** → Jawline dots light up gold
5. **Click "Procesar Simulación"** → 
   - Loading spinner appears on button
   - Simulation runs for 3 seconds
   - Image shows processing animation
   - AI Insights panel slides in with animated progress bars
6. **Click sun/moon icon in navbar** → 
   - Theme switches from warm to clinical white
   - All colors transition smoothly over 300ms

---

## Tech Stack
- React Hooks for state management
- Framer Motion for animations
- Tailwind CSS for styling
- SVG for face mapping overlay
- CSS variables for theme switching
