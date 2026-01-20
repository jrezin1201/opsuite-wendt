/**
 * Financial Analytics Module
 *
 * P&L statements, burn rate gauge, cap table, and tax estimator
 */

export {
  ProfitLossStatement,
  type PLLineItem,
} from "./components/ProfitLossStatement";
export { BurnRateGauge } from "./components/BurnRateGauge";
export {
  CapTableVisualizer,
  type Shareholder,
} from "./components/CapTableVisualizer";
export { TaxEstimator } from "./components/TaxEstimator";
