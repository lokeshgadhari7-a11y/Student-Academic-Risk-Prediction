import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  GraduationCap,
  RotateCcw,
  BookOpen,
  Calendar,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface ChatbotScreenProps {
  studentData: Record<string, any>;
  onNavigateToPredict?: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export const ChatbotScreen: React.FC<ChatbotScreenProps> = ({
  studentData,
  onNavigateToPredict,
}) => {
  const cgpa = Number(studentData.CGPA_LAST ?? 7.5).toFixed(1);
  const attendance = Number(studentData.ATTENDANCE_PERCENT ?? 85);
  const backlogs = Number(studentData.BACKLOGS_COUNT ?? 0);
  const internals = Number(studentData.INTERNAL_MARKS ?? 24);

  const initialBotGreeting: Message = {
    id: 'welcome',
    sender: 'bot',
    text: `Hello! I am your **AI Academic Mentor**.\n\nI have reviewed your currently entered engineering academic profile:\n- **Prior CGPA:** ${cgpa} / 10.0\n- **Attendance:** ${attendance}%\n- **Active Backlogs:** ${backlogs}\n- **Internal Marks:** ${internals} / 30\n\nHow can I help you improve your academic performance today? You can ask me for a customized study plan, backlog clearing strategy, or tips to boost your grades into the Distinction tier (8.0+ CGPA)!`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<Message[]>([initialBotGreeting]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickPrompts = [
    `How can I boost my CGPA from ${cgpa} to 8.5+ (Distinction)?`,
    backlogs > 0
      ? `Step-by-step strategy to clear my ${backlogs} active backlog(s)`
      : 'Create a balanced 15-hour weekly study timetable',
    attendance < 75
      ? 'Urgent plan to recover my attendance above 75%'
      : 'How to score 27+/30 in continuous internal assessments?',
    'What are high-impact exam preparation strategies for engineering theory papers?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Build conversation history for context
      const history = messages.slice(-6).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const res = await fetch('/api/academic-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          studentData,
          history,
        }),
      });

      if (!res.ok) {
        throw new Error('Server error');
      }

      const data = await res.json();
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.response || 'No response received.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      // Fallback local smart response based on dataset knowledge
      let fallback = `### Academic Improvement Recommendations for your Profile:\n\n`;
      fallback += `1. **Targeted Study Allocation:** With a current CGPA of **${cgpa}/10.0**, you are within striking distance of the next higher academic tier. Dedicate at least 2 hours daily to numerical problem solving and pseudo-code implementations.\n\n`;
      if (backlogs > 0) {
        fallback += `2. **Backlog Resolution:** Isolate the ${backlogs} backlog subject(s). Analyze previous 3 years' university question papers and master the recurring 40% high-frequency modules.\n\n`;
      }
      if (attendance < 75) {
        fallback += `3. **Attendance Warning:** At ${attendance}%, you risk detention. Meet your course coordinator immediately to verify medical/participatory leave eligibility.\n\n`;
      }
      fallback += `4. **Internal Test Optimization:** Maximizing internal continuous assessment (${internals}/30) provides the highest safety buffer against difficult university final exams.`;

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: fallback,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([initialBotGreeting]);
  };

  return (
    <div className="flex flex-col h-[75vh] max-h-[750px] bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Top Advisor Header & Student Context Bar */}
      <div className="p-4 bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 text-white shrink-0 border-b border-indigo-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Bot className="w-6 h-6 text-indigo-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-tight">AI Academic Advisor</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-medium">
                  Dataset-Grounded Mentorship
                </span>
              </div>
              <p className="text-[11px] text-indigo-200">
                Personalized suggestions tailored to your 1.0–10.0 CGPA profile
              </p>
            </div>
          </div>

          <button
            onClick={handleClearChat}
            className="p-1.5 text-indigo-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors text-xs flex items-center gap-1 font-medium"
            title="Clear Chat History"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* Live Synchronized Student Metrics Strip */}
        <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-indigo-300 font-semibold">Active Profile:</span>
            <span className="bg-white/15 px-2 py-0.5 rounded font-mono font-bold">
              CGPA: {cgpa} / 10.0
            </span>
            <span
              className={`px-2 py-0.5 rounded font-mono font-bold ${
                attendance >= 75 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/30 text-red-200'
              }`}
            >
              Attendance: {attendance}%
            </span>
            <span
              className={`px-2 py-0.5 rounded font-mono font-bold ${
                backlogs === 0 ? 'bg-white/15' : 'bg-amber-500/30 text-amber-200'
              }`}
            >
              Backlogs: {backlogs}
            </span>
            <span className="bg-white/15 px-2 py-0.5 rounded font-mono font-bold">
              Internals: {internals}/30
            </span>
          </div>

          {onNavigateToPredict && (
            <button
              onClick={onNavigateToPredict}
              className="text-[11px] text-indigo-200 hover:text-white underline flex items-center gap-1"
            >
              <span>Edit Metrics in Predict Tab</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Message History Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 max-w-[88%] ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white ${
                msg.sender === 'user' ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-white text-gray-800 border border-gray-200/80 rounded-tl-none whitespace-pre-wrap'
              }`}
            >
              {msg.text}
              <div
                className={`text-[9px] mt-1.5 text-right ${
                  msg.sender === 'user' ? 'text-indigo-200' : 'text-gray-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-gray-500 mr-auto p-2 bg-white rounded-xl border border-gray-200 shadow-xs">
            <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
            <span>Prof. AI is analyzing your dataset metrics & generating suggestions...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Contextual Question Chips */}
      <div className="p-2.5 bg-gray-50 border-t border-gray-200 shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1.5 px-1">
          Suggested Academic Inquiries (Click to Ask):
        </span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="shrink-0 bg-white hover:bg-indigo-50 border border-gray-300 hover:border-indigo-300 text-gray-700 hover:text-indigo-900 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all shadow-2xs disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Message Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white border-t border-gray-200 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Ask Prof. AI anything about improving your ${cgpa} CGPA, study habits, or exam prep...`}
          disabled={isLoading}
          className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl transition-colors disabled:opacity-40 shadow-xs"
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
