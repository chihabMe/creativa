# Nested Sub-Options for Frames - Complete Implementation Guide

## Overview

This feature allows each frame (Encadrement) to have its own set of sub-options with names and prices. Sub-options are nested within frames, creating a hierarchical structure.

## Structure

```
Product
├── Sizes (Tailles)
│   └── Each size has: name + price
└── Frames (Encadrement)
    └── Each frame has: name + price + subOptions[]
        └── Each subOption has: name + price
```

## Example

```typescript
{
  name: "ISLAMIQUE NUANCE DE MARRON",
  price: 3900,
  sizes: [
    { size: "1M×50CM", price: 3900 },
    { size: "1.5M×70CM", price: 5400 }
  ],
  frames: [
    {
      frame: "SANS",
      price: 0,
      subOptions: [] // No sub-options for SANS
    },
    {
      frame: "NOIR",
      price: 500,
      subOptions: [
        { name: "Verre Standard", price: 1000 },
        { name: "Verre Anti-Reflet", price: 2000 },
        { name: "Acrylique", price: 1500 }
      ]
    },
    {
      frame: "BLANC",
      price: 500,
      subOptions: [
        { name: "Mat", price: 300 },
        { name: "Brillant", price: 500 }
      ]
    },
    {
      frame: "GOLD",
      price: 800,
      subOptions: [
        { name: "Standard", price: 0 },
        { name: "Premium", price: 1200 }
      ]
    }
  ]
}
```

## Database Schema

### Products Table

```typescript
frames: json("frames")
  .$type<
    {
      frame: string;
      price: number;
      subOptions?: { name: string; price: number }[];
    }[]
  >()
  .default([]);
```

### Order Items Table

```typescript
{
  size: text("size"),          // Selected size name
  frame: text("frame"),         // Selected frame name
  subOption: text("sub_option") // Selected sub-option name (if any)
}
```

## Price Calculation

```typescript
Final Price = Base Price + Size Price + Frame Price + Frame Sub-Option Price
```

### Example Calculation:

- Base Price: 3900 DA
- Selected Size: 1.5M×70CM → 5400 DA (replaces base price)
- Selected Frame: NOIR → +500 DA
- Selected Sub-Option: Verre Anti-Reflet → +2000 DA

**Total = 5400 + 500 + 2000 = 7900 DA**

## User Interface

### Product Page Flow:

1. **Select Size (Tailles)**

   ```
   [1M×50CM]  [1.5M×70CM]  [2M×90CM]
   ```

2. **Select Frame (Encadrement)**

   ```
   [SANS]  [NOIR]  [BLANC]  [GOLD]
   ```

3. **Select Sub-Option (if available)**

   - Only shows if the selected frame has sub-options
   - Heading shows: "Options pour NOIR" (or whichever frame is selected)

   ```
   [Verre Standard]  [Verre Anti-Reflet]  [Acrylique]
   ```

4. **Price Updates Automatically**
   - Price recalculates when any option changes
   - Sub-options reset when frame changes

## Adding Products

### Method 1: Direct Database Insert

```typescript
await db.insert(products).values({
  name: "My Product",
  slug: "my-product",
  price: 3900,
  sizes: [
    { size: "1M×50CM", price: 3900 },
    { size: "1.5M×70CM", price: 5400 },
  ],
  frames: [
    {
      frame: "SANS",
      price: 0,
    },
    {
      frame: "NOIR",
      price: 500,
      subOptions: [
        { name: "Verre Standard", price: 1000 },
        { name: "Verre Anti-Reflet", price: 2000 },
      ],
    },
  ],
});
```

### Method 2: Admin Panel (JSON)

```json
{
  "frames": [
    {
      "frame": "SANS",
      "price": 0
    },
    {
      "frame": "NOIR",
      "price": 500,
      "subOptions": [
        { "name": "Verre Standard", "price": 1000 },
        { "name": "Verre Anti-Reflet", "price": 2000 }
      ]
    }
  ]
}
```

## Common Use Cases

### 1. Glass/Protection Options

```typescript
{
  frame: "NOIR",
  price: 500,
  subOptions: [
    { name: "Sans Protection", price: 0 },
    { name: "Verre Standard", price: 1000 },
    { name: "Verre Anti-Reflet", price: 2000 },
    { name: "Verre Museum", price: 3500 }
  ]
}
```

### 2. Material/Finish Options

```typescript
{
  frame: "BLANC",
  price: 500,
  subOptions: [
    { name: "Mat", price: 300 },
    { name: "Brillant", price: 500 },
    { name: "Satin", price: 400 }
  ]
}
```

### 3. Quality Tiers

```typescript
{
  frame: "GOLD",
  price: 800,
  subOptions: [
    { name: "Standard", price: 0 },
    { name: "Premium", price: 1200 },
    { name: "Deluxe", price: 2500 }
  ]
}
```

### 4. No Sub-Options

```typescript
{
  frame: "SANS",
  price: 0
  // No subOptions property = no extra options shown
}
```

## Cart & Checkout

### Cart Item Structure

```typescript
{
  id: "product-123",
  name: "ISLAMIQUE NUANCE DE MARRON",
  size: "1.5M×70CM",
  frame: "NOIR",
  frameSubOption: "Verre Anti-Reflet",  // Optional
  price: 7900,
  quantity: 1
}
```

### Display in Cart

```
ISLAMIQUE NUANCE DE MARRON
1.5M×70CM / NOIR / Verre Anti-Reflet
7900 DA x 1
```

## Testing Checklist

- [ ] Create product with frames that have sub-options
- [ ] Create product with frames that have NO sub-options
- [ ] Select different frames and verify sub-options change
- [ ] Verify price updates correctly
- [ ] Add to cart with sub-option selected
- [ ] Add to cart without sub-option (frame has no sub-options)
- [ ] Check cart displays correctly
- [ ] Complete checkout
- [ ] Verify order details show sub-option
- [ ] Test admin panel product creation/editing

## Migration Notes

- Old `subOptions` field at product level has been removed
- Sub-options are now nested within each frame
- Existing data may need manual migration
- `frameSubOption` replaces `subOption` in cart/orders

## Files Modified

1. `/src/lib/db/schema.ts` - Updated frames type
2. `/src/lib/types.ts` - Updated Product and CartItem interfaces
3. `/src/components/product-details-page.tsx` - Added nested sub-option display
4. `/src/contexts/cart-context.tsx` - Updated to use frameSubOption
5. `/src/components/cart.tsx` - Updated display
6. `/src/components/order-details.tsx` - Updated display
7. `/src/lib/actions/order-actions.ts` - Updated order creation

## Admin Panel Integration

For the admin panel, the frames field should accept JSON in this format:

```json
[
  {
    "frame": "SANS",
    "price": 0
  },
  {
    "frame": "NOIR",
    "price": 500,
    "subOptions": [
      { "name": "Verre Standard", "price": 1000 },
      { "name": "Verre Anti-Reflet", "price": 2000 }
    ]
  }
]
```

You may want to create a custom UI builder for easier frame/sub-option management in the admin panel.
