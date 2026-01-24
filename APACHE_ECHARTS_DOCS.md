# Apache ECharts Implementation Documentation

## Overview
This project uses **Apache ECharts** for all data visualization. We have implemented a centralized, "Expert Architecture" to ensure:
1.  **Consistency:** All charts share the same colors, fonts, and interaction behaviors.
2.  **Maintainability:** Changing a theme color in one place updates the entire app.
3.  **Performance:** Efficient rendering using Canvas with optimized re-rendering strategies.
4.  **Reusability:** A single `BaseChart` wrapper component handles all boilerplate logic.

---

## 1. Architecture

### A. Central Configuration (`chartConfig.ts`)
We define a single source of truth for all chart-related styles.
*   **Path:** `src/app/components/charts/chartConfig.ts`
*   **Purpose:** Stores color palettes (primary, success, warning), font settings, and axis styles.
*   **Usage:** Import `CHART_COLORS` anywhere to use standard colors.

### B. The BaseChart Component (`BaseChart.tsx`)
This is the core engine. It wraps the raw ECharts library into a React-friendly component.
*   **Path:** `src/app/components/charts/BaseChart.tsx`
*   **Features:**
    *   **Auto-Resize:** Uses `ResizeObserver` to automatically adjust chart size when the window or container changes.
    *   **Loading State:** Built-in spinner support via the `loading` prop.
    *   **Default Theme:** Applies standard tooltips, grids, and fonts automatically.
    *   **Memory Management:** Automatically disposes of chart instances to prevent memory leaks.

---

## 2. How to Create a New Chart

### Step 1: Create Component
Create a new file (e.g., `MyNewChart.tsx`).

### Step 2: Import Dependencies
```typescript
import React, { useMemo } from 'react';
import { BaseChart } from './charts/BaseChart';
import { CHART_COLORS } from './charts/chartConfig';
import * as echarts from 'echarts';
```

### Step 3: Define Data & Options
Use `useMemo` to prevent unnecessary re-renders.
```typescript
const chartOption = useMemo<echarts.EChartsOption>(() => ({
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed'],
    axisLine: { lineStyle: { color: CHART_COLORS.grid } }
  },
  yAxis: { type: 'value' },
  series: [
    {
      data: [120, 200, 150],
      type: 'line',
      color: CHART_COLORS.primary, // Use standard color
      smooth: true
    }
  ]
}), []);
```

### Step 4: Render
```typescript
return (
  <div className="p-4 bg-white rounded-lg shadow">
    <h3>My Chart</h3>
    <BaseChart options={chartOption} height={350} />
  </div>
);
```

---

## 3. Case Study: User Activity Chart (`UserActivityChart.tsx`)
This chart visualizes weekly user engagement.

*   **Type:** Line Chart (Area style).
*   **Data:** Mock data for "Active Users" vs "New Signups".
*   **Styling:**
    *   **Gradient Fill:** Uses `echarts.graphic.LinearGradient` to create a fading effect under the line.
    *   **Dual Series:** Two lines (Primary Blue for Active, Green for New).
    *   **Tooltip:** Cross-hair cursor enabled for precise reading.

---

## 4. Troubleshooting
*   **Chart not visible?** Ensure the parent container has a valid width. `BaseChart` fills 100% of the parent's width.
*   **Not updating?** Ensure your `options` object is a new reference (e.g., via `useMemo` dependency changes).
