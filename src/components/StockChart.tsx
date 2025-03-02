import React from 'react';
import { Company } from '../types';

interface StockChartProps {
  company: Company;
  width?: number;
  height?: number;
  showVolume?: boolean;
}

const StockChart: React.FC<StockChartProps> = ({
  company,
  width = 300,
  height = 150
}) => {
  const priceHistory = company.priceHistory;
  
  // If we don't have enough data points, show a placeholder
  if (priceHistory.length < 2) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 rounded"
        style={{ width, height }}
      >
        <p className="text-gray-500">No Data</p>
      </div>
    );
  }
  
  // Find min and max for scaling
  const maxPrice = Math.max(...priceHistory);
  const minPrice = Math.min(...priceHistory);
  const range = maxPrice - minPrice;
  
  // Calculate points for the SVG path
  const points = priceHistory.map((price, index) => {
    const x = (index / (priceHistory.length - 1)) * width;
    // Add padding to avoid touching the edges
    const normalizedPrice = range === 0 
      ? 0.5 
      : (price - minPrice) / range;
    const y = height - (normalizedPrice * (height * 0.8) + (height * 0.1));
    return `${x},${y}`;
  }).join(' ');
  
  // Determine line color based on price trend
  const firstPrice = priceHistory[0];
  const lastPrice = priceHistory[priceHistory.length - 1];
  const lineColor = lastPrice >= firstPrice ? 'stroke-green-500' : 'stroke-red-500';
  
  return (
    <div className="bg-white rounded-lg p-2">
      <svg width={width} height={height} className="overflow-visible">
        {/* Price line */}
        <polyline
          points={points}
          fill="none"
          className={`${lineColor} stroke-2`}
        />
        
        {/* Current price indicator */}
        <circle
          cx={(priceHistory.length - 1) / (priceHistory.length - 1) * width}
          cy={height - ((lastPrice - minPrice) / range * (height * 0.8) + (height * 0.1))}
          r="3"
          className={lineColor.replace('stroke', 'fill')}
        />
      </svg>
      
      <div className="mt-2 flex justify-between text-sm">
        <span className="font-medium">${company.currentPrice.toFixed(2)}</span>
        <span className={lastPrice >= firstPrice ? 'text-green-600' : 'text-red-600'}>
          {((lastPrice - firstPrice) / firstPrice * 100).toFixed(2)}%
        </span>
      </div>
    </div>
  );
};

export default StockChart;