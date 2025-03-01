import { v4 as uuidv4 } from 'uuid';
import { Company, Portfolio, Transaction } from '../types';

// Execute a buy transaction
export const buyStock = (
  portfolio: Portfolio,
  company: Company,
  shares: number
): { success: boolean; portfolio: Portfolio; message?: string } => {
  // Calculate total cost
  const totalCost = shares * company.currentPrice;
  
  // Check if user has enough cash
  if (totalCost > portfolio.cash) {
    return {
      success: false,
      portfolio,
      message: "Insufficient funds for this transaction."
    };
  }
  
  // Create transaction record
  const transaction: Transaction = {
    id: uuidv4(),
    companyId: company.id,
    ticker: company.ticker,
    shares,
    pricePerShare: company.currentPrice,
    timestamp: Date.now(),
    type: 'buy',
    total: totalCost
  };
  
  // Update portfolio
  const updatedHoldings = { ...portfolio.holdings };
  
  if (updatedHoldings[company.id]) {
    // Update existing holding
    const currentHolding = updatedHoldings[company.id];
    const totalShares = currentHolding.shares + shares;
    const totalCostBasis = (currentHolding.shares * currentHolding.averagePurchasePrice) + totalCost;
    
    updatedHoldings[company.id] = {
      shares: totalShares,
      averagePurchasePrice: totalCostBasis / totalShares
    };
  } else {
    // Create new holding
    updatedHoldings[company.id] = {
      shares,
      averagePurchasePrice: company.currentPrice
    };
  }
  
  const updatedPortfolio: Portfolio = {
    cash: portfolio.cash - totalCost,
    holdings: updatedHoldings,
    transactionHistory: [...portfolio.transactionHistory, transaction],
    netWorth: portfolio.netWorth // This will be recalculated elsewhere
  };
  
  return {
    success: true,
    portfolio: updatedPortfolio,
    message: `Successfully purchased ${shares} shares of ${company.ticker} for $${totalCost.toFixed(2)}.`
  };
};

// Execute a sell transaction
export const sellStock = (
  portfolio: Portfolio,
  company: Company,
  shares: number
): { success: boolean; portfolio: Portfolio; message?: string } => {
  // Check if user owns the stock
  if (!portfolio.holdings[company.id]) {
    return {
      success: false,
      portfolio,
      message: `You don't own any shares of ${company.ticker}.`
    };
  }
  
  // Check if user owns enough shares
  const currentShares = portfolio.holdings[company.id].shares;
  if (shares > currentShares) {
    return {
      success: false,
      portfolio,
      message: `You only own ${currentShares} shares of ${company.ticker}.`
    };
  }
  
  // Calculate total value
  const totalValue = shares * company.currentPrice;
  
  // Create transaction record
  const transaction: Transaction = {
    id: uuidv4(),
    companyId: company.id,
    ticker: company.ticker,
    shares: shares,
    pricePerShare: company.currentPrice,
    timestamp: Date.now(),
    type: 'sell',
    total: totalValue
  };
  
  // Update portfolio
  const updatedHoldings = { ...portfolio.holdings };
  const remainingShares = currentShares - shares;
  
  if (remainingShares > 0) {
    // Update existing holding
    updatedHoldings[company.id] = {
      ...updatedHoldings[company.id],
      shares: remainingShares
    };
  } else {
    // Remove holding completely
    delete updatedHoldings[company.id];
  }
  
  const updatedPortfolio: Portfolio = {
    cash: portfolio.cash + totalValue,
    holdings: updatedHoldings,
    transactionHistory: [...portfolio.transactionHistory, transaction],
    netWorth: portfolio.netWorth // This will be recalculated elsewhere
  };
  
  return {
    success: true,
    portfolio: updatedPortfolio,
    message: `Successfully sold ${shares} shares of ${company.ticker} for $${totalValue.toFixed(2)}.`
  };
};