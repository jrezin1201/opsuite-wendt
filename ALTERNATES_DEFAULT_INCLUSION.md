# Add Alternates (ALTs) Default Inclusion

## Summary
All Add Alternates (ALTs) are now **included by default** in proposals and will automatically appear at the bottom of the proposal unless unchecked.

## Changes Made

### 1. Default Template Updated (`/src/lib/paintbid/bidform/defaultTemplate.ts`)
- Changed line 170: `included: true` for ALL items (both main lines and alternates)
- Previously alternates were excluded by default (`included: !isAlternate`)
- Now all items start as included

### 2. Proposal Generation
Both proposal formats properly handle included alternates:

#### Standard Format (`/src/lib/paintbid/proposal/fromBidForm.ts`)
- Line 80: Checks `line.isAlternate && line.included && line.qty > 0`
- Adds included alternates to the `addAlternates` section

#### Professional Format (`/src/lib/paintbid/proposal/toProfessional.ts`)
- Line 100: Filters for `line.included && line.isAlternate`
- Fixed pricing calculation to use `computeBidFormLine`
- Alternates appear in the ADD ALTERNATES section

### 3. User Interface Updates (`/src/app/paintbid/screens/NewBidFormScreen.tsx`)
- Added blue notice box explaining ALTs are included by default
- Updated ALT badge with tooltip explaining default inclusion
- Checkbox allows users to exclude specific alternates if needed

## How It Works

### Default Behavior
1. All alternates start with checkbox ✅ **checked**
2. Alternates automatically appear in proposals
3. Listed in "Add Alternates" section at bottom of proposal
4. Pricing calculated based on quantity and difficulty level

### To Exclude Alternates
1. Uncheck the checkbox next to any alternate
2. Unchecked alternates won't appear in proposal
3. Changes apply immediately to live proposal

## Example Alternates Included by Default

### Units
- True Prime Coat
- Eggshell Walls
- Two Tone
- Base over Floor
- Cased Windows
- Smooth Wall
- Mask Hinges

### Corridors
- True Prime Coat
- Eggshell Walls
- Smooth Wall
- Mask Hinges

### Stairwells
- True Prime Coat
- Eggshell Walls
- Smooth Wall
- Mask Hinges

### Exterior
- Stucco Body
- Prime Stucco
- Stucco Accents
- Prime Accents
- Balcony Doors

### Garage
- Garage Walls
- Columns

## Benefits
1. **Complete Proposals**: All options visible to clients by default
2. **Easy Exclusion**: Simply uncheck items not needed
3. **Better Pricing**: Clients see all available upgrades
4. **Reduced Errors**: No forgotten alternates in proposals

## Files Modified
- `/src/lib/paintbid/bidform/defaultTemplate.ts`
- `/src/lib/paintbid/proposal/toProfessional.ts`
- `/src/app/paintbid/screens/NewBidFormScreen.tsx`

## Testing Completed
✅ Alternates included by default in new bid forms
✅ Alternates appear in standard format proposals
✅ Alternates appear in professional format proposals
✅ Unchecking removes alternates from proposal
✅ Dev server running without errors