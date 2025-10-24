# Sub-Options Testing Guide

## ✅ Implementation Status

### Database Schema

- ✅ `products.frames` field supports nested sub-options structure
- ✅ `orderItems.subOption` field stores selected sub-option

### Backend (Server Actions)

- ✅ `product-actions.ts` - Schema validation includes sub-options
- ✅ `order-actions.ts` - Correctly maps `frameSubOption` to `subOption`

### Frontend (Admin)

- ✅ New Product Form - Add/edit/remove sub-options per frame
- ✅ Edit Product Form - Load and modify existing sub-options
- ✅ UI displays nested structure with visual hierarchy

### Frontend (Client)

- ✅ Product Details Page - Dynamic sub-option display
- ✅ Cart Context - Stores `frameSubOption` in cart items
- ✅ Cart Display - Shows selected sub-option
- ✅ Order Details - Shows sub-option in order summary
- ✅ Price calculation includes sub-option price

## 🧪 Testing Checklist

### Test 1: Create Product with Sub-Options

1. Navigate to `/admin/products`
2. Click "Nouveau Produit"
3. Fill in basic product info (name, price, description)
4. Add a size (e.g., "1M×50CM" with price 5000)
5. Add a frame (e.g., "AVEC ENCADREMENT" with price 10000)
6. Click "Ajouter une sous-option" under the frame
7. Add sub-option 1: Name: "Bois Naturel", Price: 2000
8. Add sub-option 2: Name: "Bois Noir", Price: 3000
9. Save the product
10. ✅ Verify product is created successfully

### Test 2: Verify Data in Database

```sql
-- Check if product has frames with sub-options
SELECT id, name, frames FROM products WHERE name = 'Your Test Product';
```

Expected JSON structure:

```json
[
  {
    "frame": "AVEC ENCADREMENT",
    "price": 10000,
    "subOptions": [
      { "name": "Bois Naturel", "price": 2000 },
      { "name": "Bois Noir", "price": 3000 }
    ]
  }
]
```

### Test 3: Edit Product Sub-Options

1. Navigate to `/admin/products`
2. Click "Modifier" on the test product
3. ✅ Verify sub-options are displayed correctly
4. Modify a sub-option (change name or price)
5. Add another sub-option
6. Remove one sub-option
7. Save changes
8. ✅ Verify changes are saved

### Test 4: Client-Side Display

1. Navigate to the product page (e.g., `/products/your-test-product`)
2. ✅ Verify size options are displayed with prices
3. Select a frame option
4. ✅ Verify sub-options section appears if frame has sub-options
5. ✅ Verify sub-options show their names and prices
6. Select different sub-options
7. ✅ Verify total price updates correctly
8. Formula: `Total = Base Price + Size Price + Frame Price + Sub-Option Price`

### Test 5: Add to Cart

1. On product page, select:
   - Size: "1M×50CM"
   - Frame: "AVEC ENCADREMENT"
   - Sub-option: "Bois Naturel"
2. Click "Ajouter au panier"
3. Open cart
4. ✅ Verify cart item shows:
   - Product name
   - Selected size
   - Selected frame
   - Selected sub-option
   - Correct total price

### Test 6: Complete Order

1. With item in cart, proceed to checkout
2. Fill in shipping details
3. Place order
4. ✅ Verify order confirmation shows sub-option
5. In admin, check order details
6. ✅ Verify sub-option is stored in order items

## 🐛 Common Issues & Solutions

### Issue 1: Sub-options not saving

**Solution**: The schema validation was missing `subOptions` field. Fixed in `product-actions.ts`.

### Issue 2: Sub-options not displaying in edit form

**Solution**: Check that the product data mapping includes sub-options conversion from number to string.

### Issue 3: Sub-options not appearing on product page

**Solution**: Verify that `currentFrameSubOptions` is calculated correctly and the conditional rendering is working.

### Issue 4: Price not updating when selecting sub-option

**Solution**: Ensure `getSelectedFrameSubOptionPrice()` function is included in the `finalPrice` calculation.

## 📝 Code Structure

### Data Flow

```
Admin Form
  ↓ (form submission)
product-actions.ts (validation + save)
  ↓ (stored in DB)
Database (products.frames JSON field)
  ↓ (query)
Product Details Page (client display)
  ↓ (add to cart)
Cart Context (state management)
  ↓ (checkout)
order-actions.ts (create order)
  ↓ (stored in DB)
Database (orderItems.subOption field)
```

### Key Files

- `/src/lib/db/schema.ts` - Database schema
- `/src/lib/actions/product-actions.ts` - Product CRUD
- `/src/lib/actions/order-actions.ts` - Order creation
- `/src/app/(adminLayout)/admin/products/_components/new-product-form.tsx` - Create product
- `/src/app/(adminLayout)/admin/products/_components/edit-product.tsx` - Edit product
- `/src/components/product-details-page.tsx` - Product display
- `/src/contexts/cart-context.tsx` - Cart management

## ✨ Features Implemented

1. **Nested Structure**: Frames can have multiple sub-options
2. **Dynamic Display**: Sub-options only show for frames that have them
3. **Auto-Reset**: Selecting a different frame resets sub-option selection
4. **Price Transparency**: All options show their prices
5. **Visual Hierarchy**: Admin UI uses borders and indentation
6. **Full CRUD**: Create, read, update, delete sub-options
7. **Type Safety**: TypeScript types throughout the stack
