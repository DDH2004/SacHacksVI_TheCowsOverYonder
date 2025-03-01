import React from 'react';
import { useGame } from '../context/GameContext';
import { Newspaper, TrendingUp, TrendingDown } from 'lucide-react';

const NewsPanel: React.FC = () => {
  const { state } = useGame();
  const { news, companies } = state;
  
  // Sort news by timestamp (newest first)
  const sortedNews = [...news].sort((a, b) => b.timestamp - a.timestamp);
  
  // Get company name from ID
  const getCompanyName = (companyId: string): string => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : 'Unknown';
  };
  
  // Format timestamp
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center mb-4">
        <Newspaper size={20} className="mr-2 text-blue-600" />
        <h2 className="text-xl font-bold">Market News</h2>
      </div>
      
      {sortedNews.length > 0 ? (
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {sortedNews.map(item => (
            <div key={item.id} className="border-l-4 pl-4 py-1" style={{ 
              borderColor: item.sentiment > 0 ? '#10B981' : item.sentiment < 0 ? '#EF4444' : '#6B7280' 
            }}>
              <div className="flex items-center mb-1">
                {item.sentiment > 0 ? (
                  <TrendingUp size={16} className="mr-1 text-green-500" />
                ) : item.sentiment < 0 ? (
                  <TrendingDown size={16} className="mr-1 text-red-500" />
                ) : null}
                <h3 className="font-semibold">{item.headline}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-1">{item.body}</p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  {item.affectedCompanies.length === companies.length 
                    ? 'All Companies' 
                    : item.affectedCompanies.map(id => getCompanyName(id)).join(', ')}
                </span>
                <span>{formatTime(item.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No news available yet
        </div>
      )}
    </div>
  );
};

export default NewsPanel;