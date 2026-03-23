# Recipe Sorter Frontend

Recipe Sorter is a macro-first recipe library for meal prep. The frontend lets a user upload recipe PDF collections, watch parsing progress, and then filter/sort recipe cards across one collection, several collections, or the entire library.

This repo contains the React + TypeScript + Vite client for the `v2.0.0-beta.1` release.

## What Changed In V2 Beta
- Multi-collection library view instead of a single active PDF view
- Persistent recipe cards across uploads
- Collection scope selection: all collections, one collection, or multiple collections
- Macro-first filters tuned for meal prep discovery
- Parse progress panel for the currently tracked upload
- Clear-library action for resetting local library state
- Collection-aware recipe cards that show source collection

See `/Users/travispeck/Documents/coding_projects/recipe-sorter/recipe-sorter-front/RELEASE_NOTES.md` for the beta release notes.

## Tech Stack
- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS v4

## Local Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a local env file:
   ```bash
   cp .env.example .env
   ```
   If `.env.example` does not exist yet in your local clone, create `.env` with:
   ```bash
   VITE_BACK_END_API_URL=http://127.0.0.1:8000
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Open the app in the browser (typically [http://localhost:5173](http://localhost:5173)).

## Environment Variables
- `VITE_BACK_END_API_URL`
  - Base URL for the FastAPI backend
  - Local default: `http://127.0.0.1:8000`
- `VITE_SUPPORT_URL`
  - Optional shared support page for subtle in-app developer tipping
  - The app appends `source=recipe-sorter` and `entry=hero-support`
  - If omitted, the support affordance is hidden entirely

## Available Scripts
- `npm run dev` — start the local Vite development server
- `npm run build` — build a production bundle
- `npm run preview` — preview the built app locally
- `npm run lint` — run ESLint

## Product Behavior
### Core flow
1. Upload a PDF recipe collection
2. Watch parse progress for the active upload
3. Browse recipe cards as the library updates
4. Filter by the macros that matter for the current meal prep goal
5. Narrow results by collection scope if needed

### Library model
The frontend now treats uploads as a growing recipe library.
- Uploading a second collection adds to the library instead of replacing the first
- The default home view shows all uploaded collections
- Users can narrow source scope using the collection selector
- Recipe cards show which collection they came from
- An optional hero-level `Support development` link can point to a shared support page if `VITE_SUPPORT_URL` is configured

### Filtering model
The current macro guardrails are:
- Protein minimum
- Calories maximum
- Fat maximum
- Fiber minimum
- Prep time maximum
- Cooking method
- Show incomplete data

Quick presets:
- High Protein
- Lower Calorie
- Quick Prep

## Project Structure
- `/Users/travispeck/Documents/coding_projects/recipe-sorter/recipe-sorter-front/src/App.tsx`
  - Top-level routes
- `/Users/travispeck/Documents/coding_projects/recipe-sorter/recipe-sorter-front/src/Views/Home.tsx`
  - Main library screen, upload flow, polling, and selection state
- `/Users/travispeck/Documents/coding_projects/recipe-sorter/recipe-sorter-front/src/Components/UploadPanel.tsx`
  - Upload CTA and library snapshot card
- `/Users/travispeck/Documents/coding_projects/recipe-sorter/recipe-sorter-front/src/Components/ProgressPanel.tsx`
  - Parse progress surface for the tracked upload
- `/Users/travispeck/Documents/coding_projects/recipe-sorter/recipe-sorter-front/src/Components/FilterRail.tsx`
  - Macro-first filters
- `/Users/travispeck/Documents/coding_projects/recipe-sorter/recipe-sorter-front/src/Components/CollectionScopePanel.tsx`
  - Multi-collection scope selector
- `/Users/travispeck/Documents/coding_projects/recipe-sorter/recipe-sorter-front/src/Components/ResultsToolbar.tsx`
  - Presets, sort controls, result counts
- `/Users/travispeck/Documents/coding_projects/recipe-sorter/recipe-sorter-front/src/Components/RecipeGrid.tsx`
  - Results grid
- `/Users/travispeck/Documents/coding_projects/recipe-sorter/recipe-sorter-front/src/Components/RecipeCard.tsx`
  - Individual recipe card UI
- `/Users/travispeck/Documents/coding_projects/recipe-sorter/recipe-sorter-front/src/lib/recipe-sorter.ts`
  - Shared filtering, sorting, and preset logic
- `/Users/travispeck/Documents/coding_projects/recipe-sorter/recipe-sorter-front/src/types/recipe-sorter.ts`
  - Shared app types

## Backend Contract
The frontend expects the backend to provide:
- `POST /collections`
- `GET /collections`
- `GET /collections/{collectionId}`
- `GET /recipes`
- `GET /recipes?collectionIds=id1,id2`
- `GET /collections/{collectionId}/recipes`
- `DELETE /collections`

See the backend repo for API details:
- `/Users/travispeck/Documents/coding_projects/recipe-sorter/recipe-sorter-back/README.md`

## Known Beta Limitations
- The parse progress panel is centered on the currently tracked upload, not every collection in the library at once
- Ingredient display is intentionally not part of the main UI yet because quantity extraction is not trustworthy enough
- Some PDFs still depend on OCR or LLM fallback and may return partial cards
- Multi-select collection scope is supported, but the primary UX is still optimized for quick macro filtering rather than deep collection management

## Validation
The current beta has been validated locally with:
```bash
npm run build
```

## Versioning
This repo is currently tagged:
- `v2.0.0-beta.1`
