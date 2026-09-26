import { useState } from 'react';
import { aiService } from '../../services';
import { Bot, Sparkles, Send, User, BookOpen, Clock, Lightbulb, Compass } from 'lucide-react';
import toast from 'react-hot-toast';

export const AiStudyAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hello! I am your AI Study Copilot. I can help explain difficult academic concepts, create a personalized revision study plan for your upcoming examinations, or quiz you on any topic. What are we studying today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || thinking) return;

    const userMsg = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setThinking(true);

    try {
      const res = await aiService.askAssistant({ prompt: input });
      const aiReply =
        res.data?.data?.response ||
        res.data?.response ||
        generateLocalTutorResponse(userMsg.content);

      setMessages((prev) => [...prev, { role: 'assistant', content: aiReply }]);
    } catch (err) {
      console.error(err);
      const fallbackReply = generateLocalTutorResponse(userMsg.content);
      setMessages((prev) => [...prev, { role: 'assistant', content: fallbackReply }]);
    } finally {
      setThinking(false);
    }
  };

  const generateLocalTutorResponse = (query) => {
    const q = query.toLowerCase();
    if (q.includes('study plan') || q.includes('schedule') || q.includes('exam')) {
      return `📅 **Here is your Recommended 7-Day Revision Plan:**\n\n• **Days 1-2 (Data Structures):** Focus on AVL tree rotations and Graph traversals (BFS/DFS). Solve 5 LeetCode medium problems.\n• **Days 3-4 (DBMS):** Review B+ Tree indexing, normalization (3NF vs BCNF), and ACID transaction properties.\n• **Days 5-6 (Operating Systems):** Practice Semaphore producer-consumer problems and virtual memory page replacement (LRU/FIFO).\n• **Day 7 (Mock Testing):** Take full-length timed tests and review mistake patterns.\n\nTake a 10-minute break every 50 minutes of focused Pomodoro study!`;
    }
    if (q.includes('binary search') || q.includes('bst') || q.includes('tree')) {
      return `🌳 **Binary Search Tree (BST) Concept Breakdown:**\n\n1. **Core Rule:** For any node *X*, all keys in its Left Subtree are `< X`, and all keys in its Right Subtree are `> X`.\n2. **Time Complexity:**\n   - Best / Average Case: **O(log n)** when the tree is balanced.\n   - Worst Case: **O(n)** when nodes are inserted in sorted order (degenerates into a linked list).\n3. **Pro Tip:** That is why self-balancing structures like **AVL Trees** and **Red-Black Trees** are used in production databases!`;
    }
    return `💡 **Key Insights on "${query}":**\n\n1. Break this topic down into core principles first: understand the *problem* it solves before memorizing formulas or code.\n2. Visualize data flows or state changes step-by-step.\n3. Test your understanding by explaining this concept in simple terms to someone else (Feynman Technique).\n\nWould you like me to generate 3 practice test questions on this to check your retention?`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bot className="w-7 h-7 text-primary-500" />
            AI Study Assistant & Concept Tutor
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Interactive academic tutoring, personalized study planning, and exam concept breakdowns
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quick Prompts Sidebar */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 h-fit">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quick Suggestions</h3>
          <div className="space-y-2">
            <button
              onClick={() => setInput('Generate a 7-day study plan for my semester exams')}
              className="w-full text-left p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-primary-50 dark:hover:bg-primary-950/40 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors border border-slate-100 dark:border-slate-700/60 flex items-center gap-2"
            >
              <Clock className="w-4 h-4 text-primary-500 flex-shrink-0" />
              <span>7-Day Exam Study Schedule</span>
            </button>

            <button
              onClick={() => setInput('Explain AVL Tree rotations with a simple example')}
              className="w-full text-left p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-primary-50 dark:hover:bg-primary-950/40 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors border border-slate-100 dark:border-slate-700/60 flex items-center gap-2"
            >
              <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>Explain AVL Rotations</span>
            </button>

            <button
              onClick={() => setInput('How does ACID properties ensure database reliability?')}
              className="w-full text-left p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-primary-50 dark:hover:bg-primary-950/40 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors border border-slate-100 dark:border-slate-700/60 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>DBMS ACID Properties</span>
            </button>
          </div>
        </div>

        {/* Chat Stream Window */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-[650px] overflow-hidden">
          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-[85%] ${
                  m.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm shadow-sm ${
                    m.role === 'user'
                      ? 'bg-gradient-to-tr from-primary-600 to-indigo-600'
                      : 'bg-gradient-to-tr from-violet-600 to-primary-500'
                  }`}
                >
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    m.role === 'user'
                      ? 'bg-primary-600 text-white rounded-tr-none'
                      : 'bg-slate-100 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/50 dark:border-slate-700/50'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {thinking && (
              <div className="flex gap-3 max-w-[85%] mr-auto items-center text-slate-400 text-xs">
                <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl animate-pulse">
                  Synthesizing personalized study explanation...
                </div>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleSend}
            className="p-4 border-t border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/30 flex items-center gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about coursework, study strategies, or syllabus topics..."
              className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              disabled={thinking || !input.trim()}
              className="p-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-2xl shadow-glow transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
