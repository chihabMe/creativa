# Example: Product with Frame Sub-Options

## How It Works

Each **Encadrement (frame)** can now have its own **sub-options**. Here's a complete example:

```json
{
  "name": "ISLAMIQUE NUANCE DE MARRON",
  "price": 3900,
  "slug": "islamique-nuance-de-marron",
  "sizes": [
    { "size": "1M×50CM", "price": 3900 },
    { "size": "1.5M×70CM", "price": 5400 },
    { "size": "2M×90CM", "price": 7800 }
  ],
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
        { "name": "Verre Anti-Reflet", "price": 2000 },
        { "name": "Verre Museum", "price": 3500 }
      ]
    },
    {
      "frame": "BLANC",
      "price": 500,
      "subOptions": [
        { "name": "Mat", "price": 300 },
        { "name": "Brillant", "price": 500 }
      ]
    },
    {
      "frame": "GOLD",
      "price": 800,
      "subOptions": [
        { "name": "Standard", "price": 0 },
        { "name": "Premium", "price": 1200 },
        { "name": "Deluxe", "price": 2500 }
      ]
    }
  ]
}
```

## User Experience

### Step 1: Select Size

```
┌─────────────┬─────────────┬─────────────┐
│  1M×50CM    │  1.5M×70CM  │  2M×90CM    │
└─────────────┴─────────────┴─────────────┘
```

### Step 2: Select Encadrement

```
┌─────────┬─────────┬─────────┬─────────┐
│  SANS   │  NOIR   │  BLANC  │  GOLD   │
└─────────┴─────────┴─────────┴─────────┘
```

### Step 3: Sub-Options Appear (if frame has them)

#### If you select "NOIR":

**Title: "Options pour NOIR"**

```
┌──────────────────┬──────────────────────┬──────────────────┐
│ Verre Standard   │ Verre Anti-Reflet    │ Verre Museum     │
└──────────────────┴──────────────────────┴──────────────────┘
```

#### If you select "BLANC":

**Title: "Options pour BLANC"**

```
┌──────────┬──────────────┐
│   Mat    │   Brillant   │
└──────────┴──────────────┘
```

#### If you select "SANS":

**No sub-options section appears** (SANS has no sub-options)

## Price Calculation Example

**Selected:**

- Size: 1.5M×70CM (5400 DA)
- Frame: NOIR (+500 DA)
- Sub-Option: Verre Anti-Reflet (+2000 DA)

**Total Price = 5400 + 500 + 2000 = 7900 DA**

## Adding to Database

### Using Drizzle ORM:

```typescript
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";

await db.insert(products).values({
  name: "ISLAMIQUE NUANCE DE MARRON",
  slug: "islamique-nuance-de-marron",
  price: 3900,
  stock: 10,
  badge: "new",
  featured: true,
  images: ["/images/products/islamique.jpg"],
  sizes: [
    { size: "1M×50CM", price: 3900 },
    { size: "1.5M×70CM", price: 5400 },
    { size: "2M×90CM", price: 7800 },
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
        { name: "Verre Museum", price: 3500 },
      ],
    },
    {
      frame: "BLANC",
      price: 500,
      subOptions: [
        { name: "Mat", price: 300 },
        { name: "Brillant", price: 500 },
      ],
    },
    {
      frame: "GOLD",
      price: 800,
      subOptions: [
        { name: "Standard", price: 0 },
        { name: "Premium", price: 1200 },
        { name: "Deluxe", price: 2500 },
      ],
    },
  ],
});
```

## Features

✅ **Dynamic Sub-Options**: Sub-options change when you select a different frame
✅ **Automatic Reset**: When you change frames, the first sub-option is auto-selected
✅ **Optional**: Frames can have sub-options or not (like SANS)
✅ **Price Updates**: Total price updates automatically when you change any option
✅ **Cart Integration**: Selected sub-option is saved with the cart item
✅ **Order Tracking**: Sub-option is stored in orders and displayed in order details

## Common Use Cases

### 1. Glass Protection Types

```json
{
  "frame": "NOIR",
  "price": 500,
  "subOptions": [
    { "name": "Sans Protection", "price": 0 },
    { "name": "Verre Standard", "price": 1000 },
    { "name": "Verre Anti-Reflet", "price": 2000 },
    { "name": "Verre Museum (UV)", "price": 3500 }
  ]
}
```

### 2. Material Finish

```json
{
  "frame": "BLANC",
  "price": 500,
  "subOptions": [
    { "name": "Mat", "price": 300 },
    { "name": "Brillant", "price": 500 },
    { "name": "Satin", "price": 400 }
  ]
}
```

### 3. Quality Levels

```json
{
  "frame": "GOLD",
  "price": 800,
  "subOptions": [
    { "name": "Standard", "price": 0 },
    { "name": "Premium", "price": 1200 },
    { "name": "Deluxe", "price": 2500 }
  ]
}
```

### 4. No Sub-Options (Simple Frame)

```json
{
  "frame": "SANS",
  "price": 0
  // No subOptions = no extra options UI
}
```

## Testing

1. **Create a test product** with the JSON above
2. **Visit the product page**
3. **Select different frames** and watch sub-options change
4. **Check price updates** as you select different options
5. **Add to cart** and verify the sub-option is shown
6. **Complete checkout** and check order details

Everything is already implemented and working! 🎉
