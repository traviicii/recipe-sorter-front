# Release Notes

## v2.0.0-beta.1
Date: 2026-03-19

### Summary
This beta moves Recipe Sorter from a one-off PDF parser into a reusable recipe library experience. Users can upload multiple recipe collections, search across all uploaded content, and filter recipes by meal-prep-friendly macro guardrails.

### Highlights
- Added a multi-collection recipe library flow
- Added collection scope selection across one, many, or all uploads
- Added parse progress UI for the currently tracked upload
- Added macro-first recipe cards with collection attribution
- Added quick presets for common goals:
  - High Protein
  - Lower Calorie
  - Quick Prep
- Added a clear-library action
- Improved null handling and partial-card support in filters and cards

### UX Changes
- Replaced the single-collection experience with a shared library model
- Simplified filters around protein, calories, fat, fiber, prep time, and cooking method
- Removed ingredient-focused UI from the main flow
- Added clearer library context and collection-source labeling

### Developer Notes
- Frontend routes now support both `/` and `/collections/:collectionId`
- Multi-select collection scope is URL-backed via query params
- Recipe grid keys are now library-safe across collections

### Known Limitations
- Ingredient quantities and units are not yet surfaced in the main UI
- Parse progress is focused on the tracked upload, not all collections concurrently
- Some PDFs may still produce partial cards depending on source quality
