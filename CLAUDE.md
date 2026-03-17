# Frontend — Trading Bots

React SPA para monitoreo en tiempo real de trading bots.

## Stack

- **UI**: React 19, TypeScript strict
- **Build**: Vite 6
- **Estilos**: Tailwind CSS 4.2 (utility-first, tema oscuro)
- **Charts**: lightweight-charts (TradingView-style candlestick)
- **Layout**: react-grid-layout (dashboard draggable/resizable)
- **Deploy**: Vercel

## Estructura

```
src/
├── App.tsx              # Componente principal, orquestación API
├── main.tsx             # Entry point React
├── config.ts            # API_BASE y WS_BASE desde env vars
├── index.css            # Tailwind imports + grid CSS
├── components/
│   ├── Dashboard.tsx        # Grid layout responsive con localStorage
│   ├── Sidebar.tsx          # Lista de agentes con controles
│   ├── AgentCard.tsx        # Info resumida del agente
│   ├── CandlestickChart.tsx # Charts financieros con indicadores
│   ├── PerformanceMetrics.tsx # Estadísticas de performance
│   ├── TradeLog.tsx         # Historial de trades con filtros
│   ├── SignalLog.tsx        # Historial de signals
│   ├── AddAgentModal.tsx    # Modal para crear agentes
│   ├── RefreshButton.tsx    # Refresh manual + auto-refresh
│   ├── StatusBar.tsx        # Estado de conexión WebSocket
│   └── GridPanel.tsx        # Wrapper para paneles del grid
├── hooks/
│   └── useWebSocket.ts     # WebSocket auto-reconnect + ping 30s
└── types/
    └── react-grid-layout.d.ts
```

## Conexión al Backend

**Config** (`src/config.ts`):
```typescript
API_BASE = import.meta.env.VITE_API_URL || ""
WS_BASE  = import.meta.env.VITE_WS_URL || ""
```

**Dev proxy** (vite.config.ts):
- `/api` → `http://localhost:8000`
- `/ws` → `ws://localhost:8000`

**Endpoints usados**:
- REST: `/api/agents`, `/api/agents/{id}/trades`, `/api/agents/{id}/signals`, `/api/market/{symbol}/candles`
- WebSocket: `/ws/live` (ticks en tiempo real, ping cada 30s)

## Estado

- **Sin state management externo** — solo React hooks (useState, useEffect, useCallback, useRef)
- `App.tsx` mantiene: agents[], selectedAgentId, ticksByAgent, autoRefreshInterval
- localStorage para: layouts del dashboard, estado del sidebar
- WebSocket: 300 ticks por agente en sliding window

## Patrones

- Tema oscuro: grays + green (long), red (short), blue (neutral)
- Dashboard responsive: 4 breakpoints (lg/md/sm/xs) con react-grid-layout
- Drag & drop via `.drag-handle`, resize desde bordes
- Paper mode indicado en header

## Comandos

```bash
# Dev
npm run dev

# Build
npm run build

# Preview build
npm run preview
```

## Variables de Entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `VITE_API_URL` | `""` (current origin) | URL base del backend REST |
| `VITE_WS_URL` | `""` (auto-derived) | URL base del WebSocket |
