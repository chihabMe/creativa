# Product Additions Feature

## Overview

This document describes the new nested customization options feature that allows adding supplementary options to both sizes and frames (e.g., "Glass Protection +200 DA" for a specific frame).

## Changes Made

### 1. Database Schema (`src/lib/db/schema.ts`)

- **Products table**: Updated `sizes` and `frames` JSON fields to support additions:

  ```typescript
  sizes: json("sizes").$type<
    {
      size: string;
      price: number;
      additions?: { name: string; price: number }[];
    }[]
  >();

  frames: json("frames").$type<
    {
      frame: string;
      price: number;
      additions?: { name: string; price: number }[];
    }[]
  >();
  ```

- **Order Items table**: Added columns to store selected additions:
  ```typescript
  sizeAdditions: json("size_additions").$type<
    { name: string; price: number }[]
  >();
  frameAdditions: json("frame_additions").$type<
    { name: string; price: number }[]
  >();
  ```

### 2. TypeScript Types (`src/lib/types.ts`)

- Updated `Product` interface to include additions in sizes and frames
- Updated `CartItem` interface to include `sizeAdditions` and `frameAdditions`

### 3. Cart Context (`src/contexts/cart-context.tsx`)

- Updated `CartItem` type to include additions
- Modified cart comparison logic to include additions when checking for duplicate items

### 4. Admin Panel - Edit Product (`src/app/(adminLayout)/admin/products/_components/edit-product.tsx`)

- Added state management for additions in both sizes and frames
- Added handler functions:
  - `handleAddSizeAddition()`
  - `handleSizeAdditionChange()`
  - `handleRemoveSizeAddition()`
  - `handleAddFrameAddition()`
  - `handleFrameAdditionChange()`
  - `handleRemoveFrameAddition()`
- Updated UI to show nested addition inputs with:
  - "Ajouter option" buttons for each size/frame
  - Input fields for addition name and price
  - Remove buttons for each addition

### 5. Admin Panel - New Product (`src/app/(adminLayout)/admin/products/_components/new-product-form.tsx`)

- Same changes as Edit Product form
- Updated form submission to include additions data

### 6. Frontend Product Page (`src/components/product-details-page.tsx`)

- Added state for selected additions:
  - `selectedSizeAdditions`
  - `selectedFrameAdditions`
- Updated price calculation to include additions:
  ```typescript
  finalPrice =
    basePrice +
    sizePrice +
    framePrice +
    sizeAdditionsPrice +
    frameAdditionsPrice;
  ```
- Added UI with checkboxes to select additions for the chosen size/frame
- Reset additions when size/frame changes
- Pass additions to cart when adding items

### 7. Order Actions (`src/lib/actions/order-actions.ts`)

- Updated `createOrderSchema` to accept additions
- Modified order item insertion to store additions

## Usage

### Admin Side

1. Go to Admin → Products → Edit/New Product
2. Add sizes or frames as usual
3. For each size/frame, click "Ajouter option" to add supplementary options
4. Enter option name (e.g., "Protection verre") and price (e.g., 200)
5. Multiple options can be added per size/frame

### Customer Side

1. Customer selects a size (e.g., "1M×50CM")
2. If that size has additions, checkboxes appear below showing:
   - "Protection verre (+200 DA)"
   - "Finition premium (+300 DA)"
3. Customer can select multiple additions
4. Same for frames - select a frame, then choose from its additions
5. Final price updates automatically to include all selections

## Price Calculation Example

```
Base Product Price:        3900 DA
Selected Size (1M×50CM):   +500 DA
  ├─ Protection verre:     +200 DA
  └─ Finition premium:     +300 DA
Selected Frame (Noir):     +400 DA
  └─ Anti-reflet:          +150 DA
──────────────────────────────────
Total:                     5450 DA
```

## Database Migration

- Migration file: `drizzle/0001_regular_nekra.sql`
- Applied to database: ✅
- Adds `size_additions` and `frame_additions` JSON columns to `order_items` table

## Benefits

1. **Flexible pricing**: Add unlimited custom options per variant
2. **Better UX**: Clear display of what's included in the price
3. **Order tracking**: Full details of customer selections stored in orders
4. **No code changes needed**: Admin can add/remove options via UI

## Notes

- Additions are optional - products work fine without them
- Additions are specific to each size/frame variant
- Changing size/frame resets selected additions (prevents invalid selections)
- Cart tracks exact configuration including additions
- Order history preserves exact pricing and options at purchase time
