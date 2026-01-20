/**
 * PaintBid POC - Sample Data
 * Pre-built pricebook items for quick testing
 */

import type { PricebookItem } from './types';

export function getSamplePricebook(): PricebookItem[] {
  return [
    {
      id: crypto.randomUUID(),
      code: 'WALL-INT',
      name: 'Interior Walls',
      unit: 'sqft',
      baseUnitPrice: 1.50,
      defaultComplexity: 2,
      defaultScopeText: 'Paint interior walls with premium paint',
    },
    {
      id: crypto.randomUUID(),
      code: 'CEIL-INT',
      name: 'Interior Ceilings',
      unit: 'sqft',
      baseUnitPrice: 1.75,
      defaultComplexity: 3,
      defaultScopeText: 'Paint interior ceilings',
    },
    {
      id: crypto.randomUUID(),
      code: 'BASE-INT',
      name: 'Baseboards',
      unit: 'lf',
      baseUnitPrice: 2.00,
      defaultComplexity: 2,
      defaultScopeText: 'Paint baseboards',
    },
    {
      id: crypto.randomUUID(),
      code: 'DOOR-INT',
      name: 'Interior Doors',
      unit: 'each',
      baseUnitPrice: 75.00,
      defaultComplexity: 2,
      defaultScopeText: 'Paint interior door including frame',
    },
    {
      id: crypto.randomUUID(),
      code: 'TRIM-INT',
      name: 'Interior Trim',
      unit: 'lf',
      baseUnitPrice: 2.50,
      defaultComplexity: 3,
      defaultScopeText: 'Paint interior trim and molding',
    },
    {
      id: crypto.randomUUID(),
      code: 'CAB-INT',
      name: 'Kitchen Cabinets',
      unit: 'sqft',
      baseUnitPrice: 8.00,
      defaultComplexity: 4,
      defaultScopeText: 'Paint kitchen cabinets with primer and finish coat',
    },
    {
      id: crypto.randomUUID(),
      code: 'MASK',
      name: 'Masking & Protection',
      unit: 'sqft',
      baseUnitPrice: 0.25,
      defaultComplexity: 1,
      defaultScopeText: 'Mask and protect surfaces',
    },
    {
      id: crypto.randomUUID(),
      code: 'WASH-EXT',
      name: 'Pressure Wash Exterior',
      unit: 'sqft',
      baseUnitPrice: 0.50,
      defaultComplexity: 2,
      defaultScopeText: 'Pressure wash exterior surfaces',
    },
    {
      id: crypto.randomUUID(),
      code: 'STUCCO-PATCH',
      name: 'Stucco Patch Repair',
      unit: 'each',
      baseUnitPrice: 45.00,
      defaultComplexity: 3,
      defaultScopeText: 'Repair and patch stucco damage',
    },
    {
      id: crypto.randomUUID(),
      code: 'CAULK',
      name: 'Caulking',
      unit: 'lf',
      baseUnitPrice: 1.00,
      defaultComplexity: 2,
      defaultScopeText: 'Caulk joints and seams',
    },
  ];
}
