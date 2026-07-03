# Fallow Code Quality Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use compose:subagent (recommended) or compose:execute to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove unused files, suppress false positives for used-but-not-imported exports, and extract duplicated code between hero and wow-moment components.

**Architecture:** Delete 3 dead hook files, add fallow-ignore comments to 5 exports that are legitimately used via `extend()` or as public API types, and extract a shared `updateParticleMaterial` helper to deduplicate 47 lines across ParticleField.tsx and MorphingPointCloud.tsx.

**Tech Stack:** TypeScript, React, Three.js, GSAP

---

## File Structure

| Action | File | Purpose |
|--------|------|---------|
| Delete | `src/hooks/useGsapScrollTrigger.ts` | Unused hook |
| Delete | `src/hooks/useScrollProgress.ts` | Unused hook |
| Delete | `src/hooks/useSectionScrollProgress.ts` | Unused hook |
| Modify | `src/shaders/morphCloud.ts:5` | Add fallow-ignore for `MorphCloudMaterial` |
| Modify | `src/shaders/particleField.ts:5` | Add fallow-ignore for `ParticleFieldMaterial` |
| Modify | `src/components/ui/Button.tsx:32` | Add fallow-ignore for `ButtonProps` |
| Modify | `src/components/ui/SectionHeader.tsx:33` | Add fallow-ignore for `SectionHeaderProps` |
| Modify | `src/components/ui/Tag.tsx:28` | Add fallow-ignore for `TagProps` |
| Create | `src/lib/updateParticleMaterial.ts` | Shared material update + rotation helper |
| Modify | `src/components/hero/ParticleField.tsx:87-96` | Use shared helper |
| Modify | `src/components/wow-moment/MorphingPointCloud.tsx:139-148` | Use shared helper |

---

### Task 1: Delete Unused Hook Files

**Covers:** Dead code removal (unused files)

**Files:**
- Delete: `src/hooks/useGsapScrollTrigger.ts`
- Delete: `src/hooks/useScrollProgress.ts`
- Delete: `src/hooks/useSectionScrollProgress.ts`

- [ ] **Step 1: Verify files are truly unused**

Run: `grep -r "useGsapScrollTrigger\|useScrollProgress\|useSectionScrollProgress" src/`
Expected: No results (files not imported anywhere)

- [ ] **Step 2: Delete the three unused hook files**

```bash
rm src/hooks/useGsapScrollTrigger.ts src/hooks/useScrollProgress.ts src/hooks/useSectionScrollProgress.ts
```

- [ ] **Step 3: Commit**

```bash
git add -u src/hooks/
git commit -m "chore: remove unused scroll hook files detected by fallow"
```

---

### Task 2: Suppress False Positive Export Warnings

**Covers:** Dead code suppression (exports used via extend() or as public API)

**Files:**
- Modify: `src/shaders/morphCloud.ts:5`
- Modify: `src/shaders/particleField.ts:5`
- Modify: `src/components/ui/Button.tsx:32`
- Modify: `src/components/ui/SectionHeader.tsx:33`
- Modify: `src/components/ui/Tag.tsx:28`

- [ ] **Step 1: Add fallow-ignore to shader materials**

These exports are used via `extend()` (side-effect import), not via named imports. fallow can't trace this.

`src/shaders/morphCloud.ts` line 5:
```typescript
// fallow-ignore-next-line unused-exports
export const MorphCloudMaterial = shaderMaterial(
```

`src/shaders/particleField.ts` line 5:
```typescript
// fallow-ignore-next-line unused-exports
export const ParticleFieldMaterial = shaderMaterial(
```

- [ ] **Step 2: Add fallow-ignore to UI type exports**

These are public API types intentionally exported for consumers. Keep them for type safety.

`src/components/ui/Button.tsx` line 32:
```typescript
// fallow-ignore-next-line unused-types
export type { ButtonProps };
```

`src/components/ui/SectionHeader.tsx` line 33:
```typescript
// fallow-ignore-next-line unused-types
export type { SectionHeaderProps };
```

`src/components/ui/Tag.tsx` line 28:
```typescript
// fallow-ignore-next-line unused-types
export type { TagProps };
```

- [ ] **Step 3: Verify fallow ignores are accepted**

Run: `npx fallow`
Expected: No warnings for the 5 suppressed exports

- [ ] **Step 4: Commit**

```bash
git add src/shaders/morphCloud.ts src/shaders/particleField.ts src/components/ui/Button.tsx src/components/ui/SectionHeader.tsx src/components/ui/Tag.tsx
git commit -m "chore: suppress fallow false positives for extend() exports and public API types"
```

---

### Task 3: Extract Shared Particle Material Update Helper

**Covers:** Duplication removal (dup:d1b96336 - 47 lines)

**Files:**
- Create: `src/lib/updateParticleMaterial.ts`
- Modify: `src/components/hero/ParticleField.tsx:87-96`
- Modify: `src/components/wow-moment/MorphingPointCloud.tsx:139-148`

- [ ] **Step 1: Create the shared helper**

The duplicated code updates material uniforms (uDpr, uTime, uMouse) and applies rotation. Extract to a reusable function.

`src/lib/updateParticleMaterial.ts`:
```typescript
import type { State } from "@react-three/fiber";
import type { RefObject } from "react";

interface ParticleMaterial {
  uDpr: number;
  uTime: number;
  uMouse: { set(x: number, y: number): void };
}

interface UpdateOptions {
  materialRef: RefObject<ParticleMaterial | null>;
  pointsRef: RefObject<{ rotation: { y: number; x: number } } | null>;
  state: State;
  t: number;
  pointerX: number;
  pointerY: number;
  rotationSpeedY?: number;
  rotationSpeedX?: number;
  pointerInfluenceY?: number;
  pointerInfluenceX?: number;
}

export function updateParticleMaterial({
  materialRef,
  pointsRef,
  state,
  t,
  pointerX,
  pointerY,
  rotationSpeedY = 0.04,
  rotationSpeedX = 0,
  pointerInfluenceY = 0.12,
  pointerInfluenceX = 0.06,
}: UpdateOptions) {
  if (materialRef.current) {
    materialRef.current.uDpr = Math.min(state.gl.getPixelRatio(), 2);
    materialRef.current.uTime = t;
    materialRef.current.uMouse.set(pointerX, pointerY);
  }

  if (pointsRef.current) {
    pointsRef.current.rotation.y = t * rotationSpeedY + pointerX * pointerInfluenceY;
    pointsRef.current.rotation.x = pointerY * pointerInfluenceX;
  }
}
```

- [ ] **Step 2: Update ParticleField.tsx to use the helper**

Replace lines 87-96 in `src/components/hero/ParticleField.tsx`:
```typescript
    if (materialRef.current) {
      materialRef.current.uDpr = Math.min(state.gl.getPixelRatio(), 2);
      materialRef.current.uTime = t;
      materialRef.current.uMouse.set(pointer.current.x, pointer.current.y);
    }

    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.04 + pointer.current.x * 0.12;
      pointsRef.current.rotation.x = pointer.current.y * 0.06;
    }
```

With:
```typescript
    updateParticleMaterial({
      materialRef,
      pointsRef,
      state,
      t,
      pointerX: pointer.current.x,
      pointerY: pointer.current.y,
    });
```

Add import at top of file:
```typescript
import { updateParticleMaterial } from "@/lib/updateParticleMaterial";
```

- [ ] **Step 3: Update MorphingPointCloud.tsx to use the helper**

Replace lines 139-148 in `src/components/wow-moment/MorphingPointCloud.tsx`:
```typescript
    if (materialRef.current) {
      materialRef.current.uDpr = Math.min(state.gl.getPixelRatio(), 2);
      materialRef.current.uTime = t;
      materialRef.current.uMouse.set(pointer.current.x, pointer.current.y);
    }

    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.12 + pointer.current.x * 0.3;
      pointsRef.current.rotation.x = pointer.current.y * 0.15;
    }
```

With:
```typescript
    updateParticleMaterial({
      materialRef,
      pointsRef,
      state,
      t,
      pointerX: pointer.current.x,
      pointerY: pointer.current.y,
      rotationSpeedY: 0.12,
      pointerInfluenceY: 0.3,
      pointerInfluenceX: 0.15,
    });
```

Add import at top of file:
```typescript
import { updateParticleMaterial } from "@/lib/updateParticleMaterial";
```

- [ ] **Step 4: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 5: Run fallow to verify duplication reduction**

Run: `npx fallow`
Expected: dup:d1b96336 (47 lines) should be eliminated

- [ ] **Step 6: Commit**

```bash
git add src/lib/updateParticleMaterial.ts src/components/hero/ParticleField.tsx src/components/wow-moment/MorphingPointCloud.tsx
git commit -m "refactor: extract shared particle material update helper to deduplicate 47 lines"
```

---

### Task 4: Final Verification

**Covers:** All tasks

- [ ] **Step 1: Run full fallow check**

Run: `npx fallow`
Expected: Dead files reduced from 3 to 0, unused exports/types suppressed, dup:d1b96336 eliminated

- [ ] **Step 2: Run TypeScript build check**

Run: `npx tsc --noEmit && npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 3: Run linter**

Run: `npm run lint`
Expected: No new lint errors
