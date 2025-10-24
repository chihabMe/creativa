# Sub-Options Feature Implementation

## Overview

Added support for product sub-options with names and prices. Sub-options are displayed on the product page and integrated throughout the entire checkout and order flow.

## Changes Made

### 1. Database Schema (`src/lib/db/schema.ts`)

- **Products table**: Added `subOptions` field as JSON array containing objects with `name` and `price` properties

  ```typescript
  subOptions: json("sub_options")
    .$type<{ name: string; price: number }[]>()
    .default([]);
  ```

- **Order Items table**: Added `subOption` field to store the selected sub-option name
  ```typescript
  subOption: text("sub_option");
  ```

### 2. TypeScript Types (`src/lib/types.ts`)

- **Product interface**: Added optional `subOptions` field

  ```typescript
  subOptions?: { name: string; price: number }[]
  ```

- **CartItem interface**: Added optional `subOption` field
  ```typescript
  subOption?: string
  ```

### 3. Product Details Page (`src/components/product-details-page.tsx`)

- Added state management for selected sub-option
- Updated price calculation to include sub-option price
- Added UI section to display and select sub-options with radio buttons
- Updated cart item matching to include sub-option
- Sub-options are displayed with their name and price (+XXX DA or Gratuit)

### 4. Cart Context (`src/contexts/cart-context.tsx`)

- Updated `CartItem` type to include optional `subOption` field
- Modified cart item comparison to include sub-option when checking for duplicates

### 5. Cart Component (`src/components/cart.tsx`)

- Updated cart item keys to include sub-option
- Modified display to show selected sub-option alongside size and frame
- Format: `Size / Frame / Sub-option` (sub-option only shown if selected)

### 6. Order Actions (`src/lib/actions/order-actions.ts`)

- Updated order schema to accept sub-option in items
- Modified order creation to save sub-option to database

### 7. Order Details Page (`src/components/order-details.tsx`)

- Updated display to show sub-option in order item details

### 8. Database Migrations

- **Migration 0001**: Added `sub_options` column to products table
- **Migration 0002**: Added `sub_option` column to order_items table
- Both migrations successfully applied to the database

## Usage

### Adding Sub-Options to a Product

To add sub-options to a product, include them in the product data:

```typescript
{
  name: "Product Name",
  price: 3000,
  subOptions: [
    { name: "Option 1", price: 500 },
    { name: "Option 2", price: 1000 },
    { name: "Option 3 (Free)", price: 0 },
    { name: "Discount Option", price: -200 }
  ]
}
```

### UI Display

- Sub-options are displayed as radio buttons below size and frame selections
- Each option shows the name and price modifier:
  - Positive prices: `+500 DA`
  - Zero price: `Gratuit`
  - Negative prices: `-200 DA`

### Price Calculation

The final product price is calculated as:

```
Final Price = Base Price + Size Price + Frame Price + Sub-Option Price
```

## Testing

- ✅ Database schema updated
- ✅ Migrations applied successfully
- ✅ TypeScript types updated
- ✅ Product page displays sub-options
- ✅ Cart shows selected sub-options
- ✅ Checkout includes sub-options
- ✅ Orders store sub-option information
- ✅ Order details display sub-options

## Next Steps (Optional)

1. Add sub-options to seed data for testing
2. Create admin interface to manage sub-options
3. Add validation to ensure at least one sub-option is selected if available
4. Add inventory tracking per sub-option if needed
