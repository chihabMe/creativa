# Testing Product Additions Feature

## How to Test

### 1. Test Adding a New Product with Additions

1. Go to: **Admin Panel → Products → New Product**
2. Fill in basic product info (name, price, description, stock)
3. Add at least one image
4. Add a size:
   - Size: "1M×50CM"
   - Price: 500
   - Click "Ajouter option" under this size
   - Add: "Protection verre" with price 200
   - Add another: "Finition premium" with price 300
5. Add a frame:
   - Frame: "Noir"
   - Price: 400
   - Click "Ajouter option" under this frame
   - Add: "Anti-reflet" with price 150
6. Click "Enregistrer"
7. **Check Console**: You should see detailed logs showing:
   ```json
   {
     "sizes": [
       {
         "size": "1M×50CM",
         "price": 500,
         "additions": [
           { "name": "Protection verre", "price": 200 },
           { "name": "Finition premium", "price": 300 }
         ]
       }
     ],
     "frames": [
       {
         "frame": "Noir",
         "price": 400,
         "additions": [{ "name": "Anti-reflet", "price": 150 }]
       }
     ]
   }
   ```

### 2. Test Editing an Existing Product

1. Go to: **Admin Panel → Products**
2. Click "Edit" on any product
3. Add additions to existing sizes/frames or add new variants
4. Click "Enregistrer"
5. **Check Console**: Same detailed logs as above

### 3. Test Viewing Product on Frontend

1. Go to the product page you just created/edited
2. **Check Console**: You should see logs showing the product data including additions
3. Select a size that has additions
4. You should see checkboxes appear below the size selection:
   ```
   Options supplémentaires pour cette taille:
   ☐ Protection verre (+200 DA)
   ☐ Finition premium (+300 DA)
   ```
5. Select a frame that has additions
6. You should see checkboxes appear below the frame selection
7. Check some additions
8. **Verify**: The price should update to include:
   - Base price
   - Size price
   - Frame price
   - Selected additions prices

### 4. Test Adding to Cart

1. Select size, frame, and some additions
2. Click "Ajouter au panier"
3. Open the cart
4. **Verify**: The item shows the correct final price

### 5. Test Creating an Order

1. Add product to cart with additions selected
2. Go to checkout
3. Complete the order
4. Go to **Admin Panel → Orders**
5. View the order details
6. **Verify**: Order should show the selected additions

## What to Look For

### In Browser Console (F12)

When editing/creating products:

```
=== Product Data Being Sent ===
Sizes: [...]
Frames: [...]
```

When viewing products:

```
=== Product Data Received ===
Product: [product name]
Sizes: [...]
Frames: [...]
```

### Common Issues

**If additions are not saving:**

- Check the console logs to see if additions are being sent
- Check for any errors in the console
- Verify the database migration was applied

**If additions are not displaying:**

- Check console logs to see if additions data is present in the product
- Verify the product has additions in the admin panel
- Clear cache and reload the page

**If price is not calculating:**

- Check that additions have valid price values
- Verify selectedSizeAdditions and selectedFrameAdditions state
- Check browser console for any errors

## Expected Behavior

1. ✅ Additions save correctly when creating/editing products
2. ✅ Additions display as checkboxes on product page
3. ✅ Price updates when additions are selected
4. ✅ Cart includes selected additions
5. ✅ Orders store selected additions
6. ✅ Changing size/frame resets selected additions
