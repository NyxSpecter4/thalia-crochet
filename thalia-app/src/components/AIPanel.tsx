import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Message {
  id: string;
  sender: 'beginner' | 'expert' | 'ai';
  text: string;
  timestamp: Date;
  avatar?: string;
  name: string;
}

interface Beginner {
  id: string;
  name: string;
  skillLevel: 'novice' | 'intermediate' | 'advanced-beginner';
  question: string;
  avatar: string;
}

interface Expert {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  credentials: string[];
}

const AIPanel: React.FC = () => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'beginner',
      text: "I'm struggling with increasing stitches evenly in the round. My work keeps getting wavy!",
      timestamp: new Date(Date.now() - 3600000),
      avatar: '🧶',
      name: 'Sam (Beginner)'
    },
    {
      id: '2',
      sender: 'expert',
      text: "Sam, that's a common issue! Try using stitch markers every 10 stitches to keep track. Also, make sure you're not accidentally adding extra stitches at the end of rounds.",
      timestamp: new Date(Date.now() - 1800000),
      avatar: '👑',
      name: 'Maria (Expert Lace Designer)'
    },
    {
      id: '3',
      sender: 'ai',
      text: "Based on Maria's advice and pattern analysis, I recommend: 1) Use a row counter, 2) Check your tension consistency, 3) Consider switching to a smaller hook for tighter stitches.",
      timestamp: new Date(Date.now() - 900000),
      avatar: '🤖',
      name: 'Thalia AI Assistant'
    },
    {
      id: '4',
      sender: 'beginner',
      text: "Thank you both! The stitch marker tip helped a lot. My latest round looks much more even.",
      timestamp: new Date(Date.now() - 300000),
      avatar: '🧶',
      name: 'Sam (Beginner)'
    }
  ]);

  const [beginners, _setBeginners] = useState<Beginner[]>([
    {
      id: 'b1',
      name: 'Sam',
      skillLevel: 'novice',
      question: 'Increasing stitches evenly in the round',
      avatar: '🧶'
    },
    {
      id: 'b2',
      name: 'Jordan',
      skillLevel: 'intermediate',
      question: 'How to transition colors smoothly in amigurumi?',
      avatar: '🐻'
    },
    {
      id: 'b3',
      name: 'Taylor',
      skillLevel: 'advanced-beginner',
      question: 'Reading complex lace charts - where to start?',
      avatar: '📊'
    }
  ]);

  const [experts, _setExperts] = useState<Expert[]>([
    {
      id: 'e1',
      name: 'Maria',
      specialty: 'Irish Lace & Hyperbolic Surfaces',
      avatar: '👑',
      credentials: ['40+ years experience', 'Published 12 pattern books', 'Math-craft fusion specialist']
    },
    {
      id: 'e2',
      name: 'David',
      specialty: 'Amigurumi & 3D Sculptural Crochet',
      avatar: '🎨',
      credentials: ['Toy design background', 'Geometry optimization', 'Color theory expert']
    },
    {
      id: 'e3',
      name: 'Lin',
      specialty: 'Historical Reconstruction & Cultural Motifs',
      avatar: '📜',
      credentials: ['Anthropology PhD', 'Museum consultant', 'Traditional technique preservation']
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [selectedBeginner, setSelectedBeginner] = useState<Beginner>(beginners[0]);
  const [selectedExpert, setSelectedExpert] = useState<Expert>(experts[0]);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'beginner',
      text: newMessage,
      timestamp: new Date(),
      avatar: '🧶',
      name: 'You (Beginner)'
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');

    // Simulate AI and expert responses
    setIsAiAnalyzing(true);
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "I've analyzed your question. Based on the pattern context and Maria's expertise, I suggest checking your foundation chain tension and using a larger hook for the first row.",
        timestamp: new Date(),
        avatar: '🤖',
        name: 'Thalia AI Assistant'
      };

      const expertResponse: Message = {
        id: (Date.now() + 2).toString(),
        sender: 'expert',
        text: "Great question! For foundation chain issues, try the chainless foundation method - it gives more stretch and prevents tight starting edges.",
        timestamp: new Date(),
        avatar: '👑',
        name: 'Maria (Expert Lace Designer)'
      };

      setMessages(prev => [...prev, aiResponse, expertResponse]);
      setIsAiAnalyzing(false);
    }, 2000);
  };

  const handleAskAiForHelp = () => {
    setIsAiAnalyzing(true);
    setTimeout(() => {
      const aiHelp: Message = {
        id: Date.now().toString(),
        sender: 'ai',
        text: `I'm analyzing ${selectedBeginner.name}'s ${selectedBeginner.question} with ${selectedExpert.name}'s ${selectedExpert.specialty} expertise. Recommendation: Practice with scrap yarn first, focus on consistent tension, and use the "magic circle" method for smoother starts.`,
        timestamp: new Date(),
        avatar: '🤖',
        name: 'Thalia AI Assistant'
      };
      setMessages(prev => [...prev, aiHelp]);
      setIsAiAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-serif mb-2" style={{ color: theme.colors.accent }}>
            THALIA AI PANEL: MENTORSHIP BRIDGE
          </h1>
          <p className="text-lg" style={{ color: theme.colors.textSecondary }}>
            Beginner Crocheters ↔ Expert Designer Council ↔ AI Guidance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Beginners Panel */}
          <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.colors.card, borderColor: theme.colors.border }}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: theme.colors.primary }}>
              <span>🧶</span> Beginners Seeking Help
            </h2>
            <div className="space-y-4">
              {beginners.map(beginner => (
                <div
                  key={beginner.id}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${selectedBeginner.id === beginner.id ? 'ring-2' : ''}`}
                  style={{
                    backgroundColor: selectedBeginner.id === beginner.id ? theme.colors.primary + '20' : theme.colors.background,
                    border: `1px solid ${theme.colors.border}`,
                    boxShadow: selectedBeginner.id === beginner.id ? `0 0 0 2px ${theme.colors.primary}` : 'none'
                  }}
                  onClick={() => setSelectedBeginner(beginner)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">{beginner.avatar}</div>
                    <div>
                      <div className="font-semibold" style={{ color: theme.colors.text }}>{beginner.name}</div>
                      <div className="text-xs px-2 py-1 rounded-full inline-block mt-1" style={{
                        backgroundColor: beginner.skillLevel === 'novice' ? '#EF4444' + '20' :
                                       beginner.skillLevel === 'intermediate' ? '#F59E0B' + '20' : '#10B981' + '20',
                        color: beginner.skillLevel === 'novice' ? '#EF4444' :
                              beginner.skillLevel === 'intermediate' ? '#F59E0B' : '#10B981'
                      }}>
                        {beginner.skillLevel}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
                    "{beginner.question}"
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Panel */}
          <div className="lg:col-span-2 rounded-2xl border p-6" style={{ backgroundColor: theme.colors.card, borderColor: theme.colors.border }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold" style={{ color: theme.colors.primary }}>Mentorship Conversation</h2>
              <button
                onClick={handleAskAiForHelp}
                disabled={isAiAnalyzing}
                className="px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                style={{
                  backgroundColor: isAiAnalyzing ? theme.colors.border : theme.colors.accent,
                  color: theme.colors.background
                }}
              >
                {isAiAnalyzing ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    <span>AI Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>🤖</span>
                    <span>Ask AI for Help</span>
                  </>
                )}
              </button>
            </div>

            <div className="h-96 overflow-y-auto mb-6 space-y-4 p-2" style={{ backgroundColor: theme.colors.background + '40', borderRadius: '0.75rem' }}>
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg max-w-3xl ${message.sender === 'beginner' ? 'ml-auto' : ''}`}
                  style={{
                    backgroundColor: message.sender === 'beginner' ? theme.colors.primary + '20' :
                                    message.sender === 'expert' ? '#D4AF37' + '20' :
                                    '#7C3AED' + '20',
                    border: `1px solid ${message.sender === 'beginner' ? theme.colors.primary + '40' :
                            message.sender === 'expert' ? '#D4AF37' + '40' :
                            '#7C3AED' + '40'}`
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-xl">{message.avatar}</div>
                    <div>
                      <div className="font-semibold" style={{ color: theme.colors.text }}>{message.name}</div>
                      <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm" style={{ color: theme.colors.text }}>{message.text}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask a question as a beginner..."
                className="flex-1 px-4 py-3 rounded-lg"
                style={{
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  border: `1px solid ${theme.colors.border}`
                }}
              />
              <button
                onClick={handleSendMessage}
                className="px-6 py-3 rounded-lg font-semibold"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.background
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Experts Panel */}
        <div className="rounded-2xl border p-6 mb-8" style={{ backgroundColor: theme.colors.card, borderColor: theme.colors.border }}>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: theme.colors.primary }}>
            <span>👑</span> Expert Designer Council
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {experts.map(expert => (
              <div
                key={expert.id}
                className={`p-6 rounded-lg cursor-pointer transition-all ${selectedExpert.id === expert.id ? 'ring-2' : ''}`}
                style={{
                  backgroundColor: selectedExpert.id === expert.id ? '#D4AF37' + '20' : theme.colors.background,
                  border: `1px solid ${theme.colors.border}`,
                  boxShadow: selectedExpert.id === expert.id ? '0 0 0 2px #D4AF37' : 'none'
                }}
                onClick={() => setSelectedExpert(expert)}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl">{expert.avatar}</div>
                  <div>
                    <div className="font-bold text-lg" style={{ color: theme.colors.text }}>{expert.name}</div>
                    <div className="text-sm" style={{ color: theme.colors.accent }}>{expert.specialty}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {expert.credentials.map((cred, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.colors.primary }} />
                      <div className="text-sm" style={{ color: theme.colors.textSecondary }}>{cred}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t" style={{ borderColor: theme.colors.border }}>
                  <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
                    Currently advising on: {selectedBeginner.question}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analysis Panel */}
        <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.colors.card, borderColor: theme.colors.border }}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: theme.colors.primary }}>
            <span>🤖</span> Thalia AI Guidance Engine
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
              <div className="text-sm font-semibold mb-2" style={{ color: theme.colors.text }}>Pattern Analysis</div>
              <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
                Analyzing stitch tension, curvature consistency, and structural integrity
              </div>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
              <div className="text-sm font-semibold mb-2" style={{ color: theme.colors.text }}>Expert Matching</div>
              <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
                Connecting {selectedBeginner.name} with {selectedExpert.name} based on skill gap analysis
              </div>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
              <div className="text-sm font-semibold mb-2" style={{ color: theme.colors.text }}>Learning Path</div>
              <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
                Generating personalized tutorials and practice exercises
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#7C3AED' + '20', border: `1px solid #7C3AED` + '40' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="text-xl">💡</div>
              <div className="font-semibold" style={{ color: theme.colors.text }}>AI Recommendation</div>
            </div>
            <div className="text-sm" style={{ color: theme.colors.text }}>
              For {selectedBeginner.name}'s issue with "{selectedBeginner.question}", {selectedExpert.name} recommends starting with foundational exercises. Try the "Hyperbolic Practice Swatch" in the Pattern Viewer to build muscle memory for consistent increases.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPanel;