# Mandatory Additions Feature

## Overview

When an admin adds sub-options (additions) to a size or frame, customers **must** select one of them. There is no "None" or "Aucune" option available.

## Behavior

### When Additions Exist

- ✅ First addition is **auto-selected** on page load
- ✅ First addition is **auto-selected** when changing size/frame
- ✅ Customer **must** choose one addition (no opt-out)
- ✅ Selected addition price is **always included** in total

### When No Additions Exist

- No additional options displayed
- Base price remains unchanged

## User Flow Example

```
1. Customer lands on product page
   → Size "1M×50CM" is selected (default)
   → If this size has additions, first one is auto-selected

2. Customer changes to size "2M×1M"
   → If this new size has additions, first one is auto-selected
   → Price updates to reflect new size + first addition

3. Customer manually selects different addition
   → "Protection verre" → "Finition premium"
   → Price updates accordingly

4. Customer adds to cart
   → Selected addition is saved with cart item
   → No way to proceed without an addition if they exist
```

## Visual Representation

### Before (Optional - with "Aucune")

```
┌─────────────────────────────────┐
│ Options supplémentaires:        │
│ [Aucune] [Protection] [Premium] │
│    ✓         +200      +300     │
│                                 │
│ User could select "Aucune"      │
└─────────────────────────────────┘
```

### After (Mandatory - no "Aucune")

```
┌─────────────────────────────────┐
│ Options supplémentaires:        │
│ [Protection] [Premium] [Mat]    │
│      ✓          +300    +150    │
│                                 │
│ User MUST select one            │
└─────────────────────────────────┘
```

## Implementation Details

### Initial State

```typescript
// Auto-select first addition on component mount
const initialSizeAddition =
  product.sizes &&
  product.sizes.length > 0 &&
  product.sizes[0].additions &&
  product.sizes[0].additions.length > 0
    ? product.sizes[0].additions[0].name
    : "";

const [selectedSizeAddition, setSelectedSizeAddition] =
  useState<string>(initialSizeAddition);
```

### Size/Frame Change Handler

```typescript
onValueChange={(value) => {
  setSelectedSize(value);
  // Auto-select first addition if available
  const newSize = product.sizes?.find((s) => s.size === value);
  if (newSize?.additions && newSize.additions.length > 0) {
    setSelectedSizeAddition(newSize.additions[0].name);
  } else {
    setSelectedSizeAddition("");
  }
}}
```

### UI Rendering

```typescript
{
  /* No "Aucune" option - only actual additions */
}
<RadioGroup value={selectedSizeAddition}>
  {product.sizes
    .find((s) => s.size === selectedSize)!
    .additions!.map((addition) => (
      <RadioGroupItem value={addition.name}>
        {addition.name} +{addition.price}
      </RadioGroupItem>
    ))}
</RadioGroup>;
```

## Admin Implications

### Creating Products

When an admin adds additions to a size/frame:

- They should understand that customers **will be required** to select one
- The first addition should be the most common/popular choice
- Additions should provide meaningful options, not just filler

### Pricing Strategy

Since additions are mandatory:

- Consider if the base option should be one of the additions
- Example: Instead of "Protection verre" as mandatory addition, make base size include no protection, and add it as an optional upgrade through a different mechanism
- OR: Treat additions as genuine mandatory choices (e.g., "Mat finish" vs "Glossy finish")

## Use Cases

### Good Use Cases (Mandatory makes sense)

✅ **Finish Type**: "Mat" vs "Glossy" vs "Satin"
✅ **Paper Quality**: "Standard" vs "Premium" vs "Luxury"
✅ **Protection Level**: "Basic" vs "Advanced" vs "Maximum"

### Questionable Use Cases

❓ **Optional Upgrades**: "Protection verre" (might not be wanted)
❓ **Extra Features**: "Anti-reflet" (should be truly optional)

## Testing Checklist

- [ ] Load product page with additions → First addition is selected
- [ ] Change size to one with additions → First addition auto-selected
- [ ] Change size to one without additions → No additions shown
- [ ] Select different addition → Price updates correctly
- [ ] Add to cart → Selected addition is saved
- [ ] View cart → Addition is displayed
- [ ] Complete checkout → Addition price is included

## Future Enhancements

If optional additions are needed in the future:

1. Add a boolean field `mandatory` to additions schema
2. If `mandatory: true` → Current behavior
3. If `mandatory: false` → Show "Aucune" option and allow empty selection
4. Update admin UI to let admins toggle mandatory/optional per addition

## Files Modified

1. `src/components/product-details-page.tsx`
   - Removed "Aucune" options from RadioGroups
   - Added auto-selection logic for first addition
   - Updated initial state to include first addition

## Related Documentation

- `ADDITIONS_FEATURE.md` - Original feature documentation
- `SINGLE_SELECT_UPDATE.md` - Single-select implementation
- `VISUAL_COMPARISON.md` - UI before/after comparison
