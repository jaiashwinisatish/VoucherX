import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, TrendingUp, AlertCircle, Sparkles, DollarSign, Lightbulb } from 'lucide-react';
import { Voucher } from '../types';
import {
  analyzeVouchers,
  checkExpiryStatus,
  calculateMultiVoucherDiscount,
  generateSmartRecommendations,
  optimizeVoucherPortfolio,
} from '../utils/aiAssistant';

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
• Total Value: $${analysis.totalValue.toFixed(2)}
• Total Savings: $${analysis.totalSavings.toFixed(2)}
• Average Discount: ${analysis.averageDiscount}%
• Expiring Soon: ${analysis.expiringCount} voucher${analysis.expiringCount !== 1 ? 's' : ''}

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
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 md:p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-card backdrop-blur-2xl rounded-[2rem] shadow-2xl w-full max-w-md h-[600px] flex flex-col border border-main-border overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
        <div className="bg-gradient-brand p-6 flex items-center justify-between shadow-brand relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-white/5 translate-y-1/2 rounded-full blur-2xl"></div>
          <div className="flex items-center space-x-4 relative z-10">
            <div className="w-11 h-11 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/30 shadow-inner group transition-transform duration-500 hover:rotate-12">
              <Bot className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white leading-tight tracking-tight">AI Suite</h3>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-status-success rounded-full animate-pulse"></div>
                <span className="text-white/80 text-[8px] uppercase font-black tracking-[0.2em]">Active</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-xl transition-all group relative z-10"
          >
            <X className="h-5 w-5 group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-muted-bg/10 custom-scrollbar">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`max-w-[85%] rounded-[1.5rem] px-5 py-3 shadow-soft relative ${message.type === 'user'
                  ? 'bg-gradient-brand text-white rounded-tr-none'
                  : 'bg-card text-main-text border border-main-border rounded-tl-none'
                  }`}
              >
                <div className="text-sm whitespace-pre-line leading-relaxed font-medium">{message.content}</div>
                <div className={`text-[8px] mt-2 flex justify-end font-black uppercase tracking-widest ${message.type === 'user' ? 'text-white/50' : 'text-dim'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-card text-main-text border border-main-border rounded-[1.5rem] rounded-tl-none px-5 py-3 shadow-soft">
                <div className="flex space-x-1.5">
                  <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 bg-card border-t border-main-border shrink-0">
          <div className="flex flex-wrap gap-1.5 mb-5">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.action)}
                  className="px-3 py-1.5 bg-muted-bg/50 hover:bg-brand-primary/10 text-main-text border border-main-border hover:border-brand-primary/30 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center space-x-1.5 group active:scale-95 whitespace-nowrap"
                >
                  <Icon className="h-3 w-3 text-brand-primary group-hover:scale-110 transition-transform" />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex space-x-2.5">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Query system..."
              className="flex-1 px-5 py-3.5 bg-muted-bg/50 border border-main-border text-main-text rounded-1.5xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all text-sm font-bold outline-none placeholder:text-dim"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="px-5 py-3.5 bg-gradient-brand text-white rounded-1.5xl hover:shadow-brand hover:-translate-y-0.5 active:translate-y-0.5 transition-all disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed group shadow-lg"
            >
              <Send className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
