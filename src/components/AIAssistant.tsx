import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, TrendingUp, AlertCircle, Sparkles, DollarSign, Lightbulb, BarChart3 } from 'lucide-react';
import { Voucher } from '../types';
import {
  analyzeVouchers,
  checkExpiryStatus,
  calculateMultiVoucherDiscount,
  generateSmartRecommendations,
  optimizeVoucherPortfolio,
} from '../utils/aiAssistant';
import { predictVoucherDemand, analyzeMarket, formatSellTime, formatPriceRange } from '../utils/pricePrediction';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  userVouchers: Voucher[];
  marketplaceVouchers: Voucher[];
}

export default function AIAssistant({ isOpen, onClose, userVouchers, marketplaceVouchers }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your VoucherX AI Assistant. I can help you analyze your vouchers, track expiries, calculate discounts, and provide smart recommendations. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { label: 'Analyze My Vouchers', icon: TrendingUp, action: 'analyze' },
    { label: 'Price Predictions', icon: BarChart3, action: 'predict' },
    { label: 'Check Expiry Status', icon: AlertCircle, action: 'expiry' },
    { label: 'Optimize Portfolio', icon: Sparkles, action: 'optimize' },
    { label: 'Calculate Discounts', icon: DollarSign, action: 'calculate' },
    { label: 'Get Recommendations', icon: Lightbulb, action: 'recommend' },
  ];

  const handleQuickAction = (action: string) => {
    let userMessage = '';
    let assistantResponse = '';

    switch (action) {
      case 'analyze':
        userMessage = 'Analyze my vouchers';
        const analysis = analyzeVouchers(userVouchers);
        assistantResponse = `📊 **Voucher Portfolio Analysis**

**Overview:**
- Total Value: $${analysis.totalValue.toFixed(2)}
- Total Savings: $${analysis.totalSavings.toFixed(2)}
- Average Discount: ${analysis.averageDiscount}%
- Expiring Soon: ${analysis.expiringCount} voucher${analysis.expiringCount !== 1 ? 's' : ''}

**Recommendations:**
${analysis.recommendations.map(r => `• ${r}`).join('\n')}`;
        break;

      case 'expiry':
        userMessage = 'Check voucher expiry status';
        const expiryStatus = checkExpiryStatus(userVouchers);
        assistantResponse = `⏰ **Expiry Status Report**

**Expiring Within 30 Days (${expiryStatus.expiringSoon.length}):**
${expiryStatus.expiringSoon.length > 0
  ? expiryStatus.expiringSoon.map(v => {
      const days = Math.ceil((new Date(v.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return `• ${v.brand_name} - $${v.original_value} (${days} days left) ⚠️`;
    }).join('\n')
  : '✅ No vouchers expiring soon!'}

**Already Expired (${expiryStatus.expired.length}):**
${expiryStatus.expired.length > 0
  ? expiryStatus.expired.map(v => `• ${v.brand_name} - $${v.original_value}`).join('\n')
  : '✅ No expired vouchers!'}

**Safe Vouchers (${expiryStatus.safe.length}):**
${expiryStatus.safe.slice(0, 3).map(v => `• ${v.brand_name} - $${v.original_value}`).join('\n')}
${expiryStatus.safe.length > 3 ? `... and ${expiryStatus.safe.length - 3} more` : ''}`;
        break;

      case 'optimize':
        userMessage = 'Optimize my voucher portfolio';
        const optimization = optimizeVoucherPortfolio(userVouchers);
        assistantResponse = `🎯 **Portfolio Optimization Advice**

**Keep for Personal Use (${optimization.keepVouchers.length}):**
${optimization.keepVouchers.slice(0, 3).map(v => `• ${v.brand_name} - ${optimization.reasons[v.id]}`).join('\n')}
${optimization.keepVouchers.length > 3 ? `... and ${optimization.keepVouchers.length - 3} more` : ''}

**Recommended for Trading (${optimization.tradeVouchers.length}):**
${optimization.tradeVouchers.slice(0, 3).map(v => `• ${v.brand_name} - ${optimization.reasons[v.id]}`).join('\n')}
${optimization.tradeVouchers.length > 3 ? `... and ${optimization.tradeVouchers.length - 3} more` : ''}

**Should Sell Quickly (${optimization.sellVouchers.length}):**
${optimization.sellVouchers.slice(0, 3).map(v => `• ${v.brand_name} - ${optimization.reasons[v.id]}`).join('\n')}
${optimization.sellVouchers.length > 3 ? `... and ${optimization.sellVouchers.length - 3} more` : ''}`;
        break;

      case 'calculate':
        userMessage = 'Calculate discount for multiple vouchers';
        const sampleAmount = 500;
        const calculation = calculateMultiVoucherDiscount(sampleAmount, userVouchers.slice(0, 3), {
          maxStackable: 3,
          allowSameCategory: false,
          maxTotalDiscount: 50,
        });
        assistantResponse = `💰 **Multi-Voucher Discount Calculator**

**Example Calculation (Base Amount: $${sampleAmount}):**

Original Total: $${calculation.originalTotal.toFixed(2)}
Total Discount: -$${calculation.totalDiscount.toFixed(2)}
**Final Total: $${calculation.finalTotal.toFixed(2)}**

**Discount Breakdown:**
${calculation.discountBreakdown.map(d => `• ${d.voucher}: -$${d.discount.toFixed(2)}`).join('\n')}

${calculation.warnings.length > 0 ? `**Notes:**\n${calculation.warnings.map(w => `⚠️ ${w}`).join('\n')}` : ''}

*You can stack up to 3 vouchers with a maximum 50% total discount.*`;
        break;

      case 'recommend':
        userMessage = 'Give me smart recommendations';
        const recommendations = generateSmartRecommendations(userVouchers, marketplaceVouchers);
        assistantResponse = `💡 **Smart Recommendations**

${recommendations.length > 0
  ? recommendations.map(r => `• ${r}`).join('\n\n')
  : '✨ You\'re all set! Keep checking the marketplace for new deals.'}

**Pro Tips:**
• Enable notifications on your wishlist to catch great deals
• Trade vouchers with 60+ days validity for better matches
• Check the challenges page to earn VoucherCoins for free vouchers`;
        break;

      case 'predict':
        userMessage = 'Show me price predictions for my vouchers';
        {
          const marketStats = analyzeMarket(marketplaceVouchers);
          const predictions = userVouchers.slice(0, 5).map(v => {
            const pred = predictVoucherDemand({
              voucher: v,
              similarVouchers: marketplaceVouchers.filter(mv => mv.category === v.category),
            });
            return { voucher: v, prediction: pred };
          });

          assistantResponse = `📊 **AI Price & Demand Predictions**

**Market Overview:**
• Avg Price: ₹${marketStats.avgPrice} | Avg Discount: ${marketStats.avgDiscount}%
• Demand Trend: ${marketStats.demandTrend === 'rising' ? '📈 Rising' : marketStats.demandTrend === 'falling' ? '📉 Falling' : '➡️ Stable'}
• Trending: ${marketStats.hotCategories.join(', ')}

**Your Voucher Predictions:**
${predictions.map(({ voucher: v, prediction: p }) => 
`━━━━━━━━━━━━━━━━
🏷️ **${v.brand_name}** (${v.category})
💰 Suggested: ${formatPriceRange(p.suggestedPriceMin, p.suggestedPriceMax)}
⏱️ Sell Time: ~${formatSellTime(p.expectedSellTimeHours, p.expectedSellTimeMax)}
${p.demandEmoji} Demand: **${p.demandScore}** | Liquidity: ${p.liquidityScore}%
${p.priceAction !== 'hold' ? `💡 ${p.priceAction === 'decrease' ? 'Reduce' : 'Increase'} by ₹${p.priceActionAmount}` : '✅ Price is optimal'}`
).join('\n\n')}

💡 *Go to Marketplace → click "AI Details" on any voucher for full analysis*`;
        }
        break;

      default:
        return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: assistantResponse,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      let response = '';
      const lowerInput = inputValue.toLowerCase();

      if (lowerInput.includes('analyze') || lowerInput.includes('portfolio')) {
        const analysis = analyzeVouchers(userVouchers);
        response = `Based on your ${userVouchers.length} vouchers, you have a total value of $${analysis.totalValue.toFixed(2)} with $${analysis.totalSavings.toFixed(2)} in savings. ${analysis.recommendations[0] || 'Keep up the great work!'}`;
      } else if (lowerInput.includes('expir')) {
        const expiryStatus = checkExpiryStatus(userVouchers);
        response = `You have ${expiryStatus.expiringSoon.length} voucher${expiryStatus.expiringSoon.length !== 1 ? 's' : ''} expiring within 30 days. ${expiryStatus.expiringSoon.length > 0 ? 'I recommend using or trading them soon to maximize value!' : 'All your vouchers are safe for now!'}`;
      } else if (lowerInput.includes('recommend') || lowerInput.includes('suggest')) {
        const recommendations = generateSmartRecommendations(userVouchers, marketplaceVouchers);
        response = recommendations.length > 0 ? recommendations[0] : 'Everything looks good! Keep exploring the marketplace for new opportunities.';
      } else if (lowerInput.includes('discount') || lowerInput.includes('calculate')) {
        response = 'I can help you calculate the total discount when stacking multiple vouchers! Use the "Calculate Discounts" quick action to see a detailed breakdown with your current vouchers.';
      } else if (lowerInput.includes('price') || lowerInput.includes('predict') || lowerInput.includes('demand') || lowerInput.includes('sell time') || lowerInput.includes('how much')) {
        const predictions = userVouchers.slice(0, 3).map(v => {
          const pred = predictVoucherDemand({ voucher: v, similarVouchers: marketplaceVouchers.filter(mv => mv.category === v.category) });
          return `${v.brand_name}: ${formatPriceRange(pred.suggestedPriceMin, pred.suggestedPriceMax)} ${pred.demandEmoji} ${pred.demandScore}`;
        });
        response = `📊 Here are quick price predictions for your vouchers:\n${predictions.join('\n')}\n\nUse the "Price Predictions" quick action for the full detailed analysis!`;
      } else if (lowerInput.includes('optimize') || lowerInput.includes('what should')) {
        const optimization = optimizeVoucherPortfolio(userVouchers);
        response = `I recommend keeping ${optimization.keepVouchers.length} voucher${optimization.keepVouchers.length !== 1 ? 's' : ''} for personal use, trading ${optimization.tradeVouchers.length}, and selling ${optimization.sellVouchers.length} quickly. Use the "Optimize Portfolio" action for detailed reasons!`;
      } else if (lowerInput.includes('help') || lowerInput.includes('what can')) {
        response = 'I can help you with:\n• Analyzing your voucher portfolio\n• Checking expiry dates and alerts\n• Calculating multi-voucher discounts\n• Optimizing your portfolio (keep/trade/sell)\n• Providing smart recommendations\n\nTry using the quick action buttons or ask me anything about your vouchers!';
      } else {
        response = `I understand you're asking about "${inputValue}". I can analyze your vouchers, check expiries, calculate discounts, and provide recommendations. Try using the quick action buttons below, or ask me specifically about analyzing, expiry checking, or recommendations!`;
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 md:p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col border-2 border-slate-200">
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">VoucherX AI Assistant</h3>
              <p className="text-white/80 text-xs">Always here to help</p>
            </div>
          </div>
          <button
            onClick={onClose}
            title="Close assistant"
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white'
                    : 'bg-white text-slate-800 border border-slate-200'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-white/70' : 'text-slate-400'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white text-slate-800 border border-slate-200 rounded-2xl px-4 py-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-200">
          <div className="flex flex-wrap gap-2 mb-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.action)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1"
                >
                  <Icon className="h-3 w-3" />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              title="Send message"
              className="px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
