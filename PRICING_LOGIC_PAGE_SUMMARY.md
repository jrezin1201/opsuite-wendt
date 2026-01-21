# Pricing Logic Page - Complete Reference

## Overview
A comprehensive page showing **all pricing logic** with base prices, increments per difficulty level, and calculated prices for levels 1-5.

## Page Location
**Navigation:** Tab #7 - "📊 Pricing Logic"
**Keyboard Shortcut:** Cmd/Ctrl + 7

## Features

### 1. **Quick Stats Dashboard**
- Total Items: Shows count of all configured price items
- Difficulty Levels: 5 levels
- Configured Prices: Total number of prices in system
- Categories: 7 main categories

### 2. **Category Filter**
- **Show All** - View all categories at once
- Individual category buttons to focus on specific sections:
  - Unit Interior
  - Corridors
  - Stairwells
  - Amenity Areas
  - Exterior
  - Garage
  - Landscape

### 3. **Pricing Table for Each Category**
Shows for every item:
- **Item Name** - Clear description
- **Base Price** - Level 1 pricing
- **+Per Level** - Increment added for each difficulty level
- **Level 1-5 Prices** - Actual calculated prices
- **Formula** - Shows the calculation logic

### 4. **Visual Indicators**
- **Color-coded levels**:
  - Level 1: Gray background
  - Level 2: Blue background
  - Level 3: Green background
  - Level 4: Yellow background
  - Level 5: Red background
- **Badges**:
  - "Follows Units" - Items that use unit difficulty
  - "Fixed" - Items with no difficulty adjustment

### 5. **Example Calculations**
Shows real examples with quantities:

#### Corridor Doors (10 doors)
- Level 1: 10 × $175 = $1,750
- Level 2: 10 × $200 = $2,000
- Level 3: 10 × $225 = $2,250
- Level 4: 10 × $250 = $2,500
- Level 5: 10 × $275 = $2,750
- Formula: Base $175 + ($25 increment × (Level - 1))

#### Units (14 units)
- Level 1: 14 × $1,350 = $18,900
- Level 2: 14 × $1,400 = $19,600
- Level 3: 14 × $1,450 = $20,300
- Level 4: 14 × $1,500 = $21,000
- Level 5: 14 × $1,550 = $21,700
- Formula: Base $1,350 + ($50 increment × (Level - 1))

## Verified Pricing Examples

### Doors (Correctly showing $25 increments)
**Corridor Doors:**
- Base: $175
- Increment: $25/level
- Prices: $175, $200, $225, $250, $275 ✓

**Entry Doors:**
- Base: $250
- Increment: $25/level
- Prices: $250, $275, $300, $325, $350 ✓

### Units
- Base: $1,350
- Increment: $50/level
- Prices: $1,350, $1,400, $1,450, $1,500, $1,550 ✓

### Stairwell Rails
- Base: $600
- Increment: $100/level
- Prices: $600, $700, $800, $900, $1,000 ✓

## How to Use

1. **Navigate** to the "Pricing Logic" tab
2. **Filter** by category or view all
3. **Review** base prices and increments
4. **Verify** calculations match your expectations
5. **Reference** during bidding to ensure correct pricing

## Benefits

1. **Complete Transparency** - See all pricing logic in one place
2. **Easy Verification** - Confirm all calculations are correct
3. **Training Tool** - New staff can understand pricing structure
4. **Reference Guide** - Quick lookup during estimates
5. **Quality Control** - Verify pricing matches your sheets

## Technical Details

### Files Created/Modified
- `/src/app/paintbid/screens/PricingLogicScreen.tsx` - Main pricing logic page
- `/src/app/page.tsx` - Added navigation tab
- `/src/lib/paintbid/pricing/difficultyPricing.ts` - Pricing configuration

### Data Source
All pricing comes from the `DIFFICULTY_PRICING` configuration object, which was built from your difficulty level sheets (difficulty_lvl_page_1, 2, 3).

## Legend

### Pricing Formula
**Price at Level X = Base Price + (Increment × (X - 1))**

Example for doors at Level 3:
- Base: $175
- Increment: $25
- Level 3: $175 + ($25 × 2) = $225

### Special Cases
- **Follows Units**: These items use the same difficulty level as the units
- **Fixed Price**: These items don't change with difficulty (checkboxes only)