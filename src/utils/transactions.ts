import { Portfolio, Company } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface TransactionResult {
  success: boolean;
  message?: string;
  portfolio: Portfolio;
}

export const buyStock = (
  portfolio: Portfolio,
  company: Company,
  shares: number
): TransactionResult => {
  // Validate the transaction
  if (shares <= 0) {
    return {
      success: false,
      message: 'Number of shares must be positive',
      portfolio
    };
  }

  const totalCost = company.currentPrice * shares;
  
  if (totalCost > portfolio.cash) {
    return {
      success: false,
      message: 'Insufficient funds',
      portfolio
    };
  }

  // Create a deep copy of the portfolio
  const updatedPortfolio = JSON.parse(JSON.stringify(portfolio)) as Portfolio;
  
  // Update cash
  updatedPortfolio.cash -= totalCost;
  
  // Update holdings
  const companyId = company.id;
  const existingHolding = updatedPortfolio.holdings[companyId];
  
  if (existingHolding) {
    // Calculate new average purchase price
    const totalShares = existingHolding.shares + shares;
    const totalInvestment = 
      (existingHolding.shares * existingHolding.averagePurchasePrice) + 
      (shares * company.currentPrice);
    
    updatedPortfolio.holdings[companyId] = {
      shares: totalShares,
      averagePurchasePrice: totalInvestment / totalShares
    };
  } else {
    updatedPortfolio.holdings[companyId] = {
      shares,
      averagePurchasePrice: company.currentPrice
    };
  }
  
  // Add transaction to history
  updatedPortfolio.transactionHistory.push({
    id: uuidv4(),
    type: 'buy',
    companyId: company.id,
    companyName: company.name,
    shares,
    pricePerShare: company.currentPrice,
    totalAmount: totalCost,
    timestamp: Date.now()
  });
  
  // Update net worth (should be the same since we're just converting cash to stock)
  // But we'll recalculate to be safe
  let stockValue = 0;
  for (const [id, holding] of Object.entries(updatedPortfolio.holdings)) {
    const companyPrice = company.id === id ? 
      company.currentPrice : 
      portfolio.holdings[id]?.averagePurchasePrice || 0;
    
    stockValue += holding.shares * companyPrice;
  }
  
  updatedPortfolio.netWorth = updatedPortfolio.cash + stockValue;
  
  return {
    success: true,
    portfolio: updatedPortfolio
  };
};

export const sellStock = (
  portfolio: Portfolio,
  company: Company,
  shares: number
): TransactionResult => {
  // Validate the transaction
  if (shares <= 0) {
    return {
      success: false,
      message: 'Number of shares must be positive',
      portfolio
    };
  }
  
  const companyId = company.id;
  const existingHolding = portfolio.holdings[companyId];
  
  if (!existingHolding || existingHolding.shares < shares) {
    return {
      success: false,
      message: 'Insufficient shares',
      portfolio
    };
  }
  
  // Create a deep copy of the portfolio
  const updatedPortfolio = JSON.parse(JSON.stringify(portfolio)) as Portfolio;
  
  // Calculate sale amount
  const saleAmount = company.currentPrice * shares;
  
  // Update cash
  updatedPortfolio.cash += saleAmount;
  
  // Update holdings
  if (existingHolding.shares === shares) {
    // Sold all shares
    delete updatedPortfolio.holdings[companyId];
  } else {
    // Sold some shares
    updatedPortfolio.holdings[companyId] = {
      ...existingHolding,
      shares: existingHolding.shares - shares
    };
  }
  
  // Add transaction to history
  updatedPortfolio.transactionHistory.push({
    id: uuidv4(),
    type: 'sell',
    companyId: company.id,
    companyName: company.name,
    shares,
    pricePerShare: company.currentPrice,
    totalAmount: saleAmount,
    timestamp: Date.now()
  });
  
  // Update net worth
  let stockValue = 0;
  for (const [id, holding] of Object.entries(updatedPortfolio.holdings)) {
    const companyPrice = company.id === id ? 
      company.currentPrice : 
      portfolio.holdings[id]?.averagePurchasePrice || 0;
    
    stockValue += holding.shares * companyPrice;
  }
  
  updatedPortfolio.netWorth = updatedPortfolio.cash + stockValue;
  
  return {
    success: true,
    portfolio: updatedPortfolio
  };
};