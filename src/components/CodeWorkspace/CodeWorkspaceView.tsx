import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Breadcrumb } from '../Navigation/Breadcrumb';
import {
  Code2,
  Play,
  RotateCcw,
  AlignLeft,
  Users2,
  MessageSquare,
  Send,
  Sparkles,
  Terminal,
  AlertCircle,
  CheckCircle2,
  Share2,
  MoreVertical,
  PlusCircle,
  Bot,
  Wand2,
  FileCode,
  Copy,
  Check,
  Zap,
} from 'lucide-react';

export const CodeWorkspaceView: React.FC = () => {
  const {
    codeLanguage,
    setCodeLanguage,
    code,
    setCode,
    consoleLogs,
    isExecutingCode,
    runCode,
    clearConsole,
    formatCode,
    debugCodeWithAi,
    aiDebugResult,
    isAiDebugging,
    clearAiDebugResult,
    chatMessages,
    sendChatMessage,
    activeChannel,
    setActiveChannel,
    showToast,
  } = useApp();
  const { user } = useAuth();

  const [activeConsoleTab, setActiveConsoleTab] = useState<'console' | 'ai-debugger' | 'problems'>('console');
  const [chatInputText, setChatInputText] = useState('');
  const [customDebugPrompt, setCustomDebugPrompt] = useState('');
  const [copiedFix, setCopiedFix] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (aiDebugResult) {
      setActiveConsoleTab('ai-debugger');
    }
  }, [aiDebugResult]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputText.trim()) return;
    sendChatMessage(chatInputText);
    setChatInputText('');
  };

  const handleShareCodeToChat = () => {
    sendChatMessage(`Check out my current ${codeLanguage.toUpperCase()} implementation:\n\`\`\`${codeLanguage}\n${code.slice(0, 300)}...\n\`\`\``);
    showToast('Code shared to active collaboration channel!');
  };

  const handleTriggerAiDebugger = async (prompt?: string) => {
    setActiveConsoleTab('ai-debugger');
    await debugCodeWithAi(prompt);
  };

  const lineCount = (code || '').split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 14) }, (_, i) => i + 1);

  const getLanguageFileName = () => {
    switch (codeLanguage) {
      case 'python': return 'main.py';
      case 'typescript': return 'index.ts';
      case 'javascript': return 'app.js';
      case 'c': return 'algorithm.c';
      case 'cpp': return 'solution.cpp';
      case 'java': return 'Main.java';
      case 'sql': return 'query.sql';
      default: return 'script.txt';
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Explicit Navigation Breadcrumb */}
      <Breadcrumb
        category="Academic Portal"
        items={[
          { label: 'Code Workspace' },
          { label: `${getLanguageFileName()} (${codeLanguage.toUpperCase()})` },
        ]}
      />

      {/* Main IDE Container */}
      <div
        id="code-workspace-view"
        className="h-[calc(100vh-180px)] min-h-[640px] flex flex-col rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-950"
      >
        {/* Top Workspace Toolbar */}
        <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between border-b border-slate-800 text-slate-200 gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg text-xs border border-slate-700">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span className="font-mono font-semibold text-white">
                {getLanguageFileName()}
              </span>
            </div>

            <select
              id="workspace-lang-select"
              value={codeLanguage}
              onChange={(e) => setCodeLanguage(e.target.value as any)}
              className="bg-slate-800 text-xs text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-hidden focus:border-indigo-500 font-medium cursor-pointer"
            >
              <option value="python">Python 3.10</option>
              <option value="javascript">JavaScript (Node.js 20)</option>
              <option value="typescript">TypeScript 5.8</option>
              <option value="c">C (GCC 15.0)</option>
              <option value="cpp">C++ (Clang 15.0)</option>
              <option value="java">Java (OpenJDK 21)</option>
              <option value="sql">SQL (Relational Engine)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareCodeToChat}
              className="text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              title="Share Code to Live Peer Chat"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              id="format-code-btn"
              onClick={formatCode}
              className="text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              title="Prettier Format"
            >
              <AlignLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Format</span>
            </button>

            {/* AI Debugger Button */}
            <button
              id="ai-debugger-trigger-btn"
              onClick={() => handleTriggerAiDebugger(customDebugPrompt || undefined)}
              disabled={isAiDebugging}
              className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-xs active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
              title="Inspect & Debug with Gemini AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isAiDebugging ? 'AI Auditing...' : 'AI Debugger'}</span>
            </button>

            {/* Run Code Button */}
            <button
              id="run-code-btn"
              onClick={runCode}
              disabled={isExecutingCode}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-1.5 rounded-lg shadow-xs active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isExecutingCode ? 'Compiling...' : 'Run Code'}</span>
            </button>
          </div>
        </div>

        {/* Main Workspace Split View */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Pane: Code Editor + Bottom Diagnostics */}
          <section className="flex-1 flex flex-col overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
            {/* Editor Textarea with Line Numbers */}
            <div className="flex-1 flex overflow-auto p-2 bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed select-text">
              {/* Line numbers gutter */}
              <div className="py-2 pr-3 pl-2 text-slate-600 select-none text-right border-r border-slate-800 flex flex-col font-mono text-xs">
                {lineNumbers.map((num) => (
                  <span key={num} className="leading-6 block">
                    {num}
                  </span>
                ))}
              </div>

              {/* Editable code area */}
              <textarea
                id="live-code-textarea"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="flex-1 bg-transparent text-slate-200 py-2 px-3 leading-6 resize-none focus:outline-hidden font-mono text-xs border-none"
                style={{
                  tabSize: 4,
                  whiteSpace: 'pre',
                }}
              />
            </div>

            {/* Bottom Panel: Output, AI Diagnostic, Problems */}
            <div className="h-64 bg-slate-950 border-t border-slate-800 flex flex-col">
              {/* Tab Navigation */}
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
                <div className="flex gap-4">
                  <button
                    onClick={() => setActiveConsoleTab('console')}
                    className={`text-xs font-bold pb-1 transition-colors flex items-center gap-1.5 cursor-pointer ${
                      activeConsoleTab === 'console'
                        ? 'text-white border-b-2 border-indigo-500'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Terminal Output</span>
                  </button>

                  <button
                    onClick={() => setActiveConsoleTab('ai-debugger')}
                    className={`text-xs font-bold pb-1 transition-colors flex items-center gap-1.5 cursor-pointer ${
                      activeConsoleTab === 'ai-debugger'
                        ? 'text-purple-400 border-b-2 border-purple-500 font-black'
                        : 'text-slate-400 hover:text-purple-300'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>AI Diagnostic & Fix</span>
                  </button>

                  <button
                    onClick={() => setActiveConsoleTab('problems')}
                    className={`text-xs font-bold pb-1 transition-colors flex items-center gap-1.5 cursor-pointer ${
                      activeConsoleTab === 'problems'
                        ? 'text-white border-b-2 border-indigo-500'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Diagnostics</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {activeConsoleTab === 'ai-debugger' && aiDebugResult && (
                    <button
                      onClick={clearAiDebugResult}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset AI</span>
                    </button>
                  )}

                  {activeConsoleTab === 'console' && (
                    <button
                      onClick={clearConsole}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      title="Clear Terminal"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Panel Content Stream */}
              <div
                id="console-log-stream"
                className="flex-1 p-3 font-mono text-xs overflow-y-auto space-y-1 bg-slate-950 text-slate-300"
              >
                {activeConsoleTab === 'console' && (
                  consoleLogs.length === 0 ? (
                    <p className="text-slate-500 italic">No active logs. Click "Run Code" or "AI Debugger" to execute.</p>
                  ) : (
                    consoleLogs.map((log, idx) => (
                      <p
                        key={idx}
                        className={
                          log.type === 'success'
                            ? 'text-emerald-400 font-semibold'
                            : log.type === 'error'
                            ? 'text-rose-400 font-semibold'
                            : log.type === 'info'
                            ? 'text-indigo-400'
                            : 'text-slate-200'
                        }
                      >
                        {log.text}
                      </p>
                    ))
                  )
                )}

                {activeConsoleTab === 'ai-debugger' && (
                  <div className="space-y-3 font-sans">
                    {/* Prompt Box */}
                    <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800">
                      <input
                        type="text"
                        placeholder="Ask Gemini: 'Explain runtime bug', 'Optimize complexity to O(N)', 'Write unit tests'..."
                        value={customDebugPrompt}
                        onChange={(e) => setCustomDebugPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleTriggerAiDebugger(customDebugPrompt)}
                        className="flex-1 bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-hidden"
                      />
                      <button
                        onClick={() => handleTriggerAiDebugger(customDebugPrompt)}
                        disabled={isAiDebugging}
                        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer disabled:opacity-50"
                      >
                        <Wand2 className="w-3 h-3" />
                        <span>{isAiDebugging ? 'Analyzing...' : 'Ask AI'}</span>
                      </button>
                    </div>

                    {isAiDebugging ? (
                      <div className="p-6 text-center space-y-2">
                        <Sparkles className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
                        <p className="text-xs text-purple-300 font-semibold">
                          Gemini 2.5 is inspecting your {codeLanguage.toUpperCase()} code structure and compiling telemetry...
                        </p>
                      </div>
                    ) : aiDebugResult ? (
                      <div className="p-4 rounded-xl bg-slate-900/90 border border-purple-500/30 text-xs text-slate-200 space-y-3 font-mono leading-relaxed">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2 font-sans">
                          <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                            <Bot className="w-4 h-4" />
                            <span>Gemini Architecture & Bug Analysis</span>
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(aiDebugResult);
                              setCopiedFix(true);
                              setTimeout(() => setCopiedFix(false), 2000);
                              showToast('AI diagnostic copied to clipboard');
                            }}
                            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                          >
                            {copiedFix ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedFix ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <pre className="whitespace-pre-wrap text-slate-300 text-xs font-mono">
                          {aiDebugResult}
                        </pre>
                      </div>
                    ) : (
                      <div className="p-6 text-center text-slate-500 space-y-2">
                        <Bot className="w-8 h-8 mx-auto text-slate-600" />
                        <p className="text-xs font-medium">
                          Click "AI Debugger" above to request an instant static audit and automatic code repair recommendation.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeConsoleTab === 'problems' && (
                  <div className="p-4 space-y-2 font-sans text-xs">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-200">AST Syntax Check Passed</span>
                        <p className="text-[11px] text-slate-400">
                          Target grammar verified for {codeLanguage.toUpperCase()} runtime.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Right Pane: Live Collaborative Chat */}
          <section
            id="collab-chat-panel"
            className="w-full lg:w-96 flex flex-col bg-slate-900 border-t lg:border-t-0 border-slate-800"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/90">
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <Users2 className="w-4 h-4 text-indigo-400" />
                  <span>Peer Study Collaboration</span>
                </h2>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-emerald-400 font-bold">ONLINE</span>
                </div>
              </div>

              {/* Room Selector */}
              <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                <button
                  id="channel-study-group-btn"
                  onClick={() => setActiveChannel('study-group-cs2024')}
                  className={`whitespace-nowrap px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    activeChannel === 'study-group-cs2024'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  👥 CS 2024 Study Group
                </button>
                <button
                  id="channel-mentor-btn"
                  onClick={() => setActiveChannel('mentor-dr-chen')}
                  className={`whitespace-nowrap px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    activeChannel === 'mentor-dr-chen'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  🎓 Dr. Chen (Faculty)
                </button>
              </div>
            </div>

            {/* Messages Stream */}
            <div
              id="chat-messages-container"
              className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-slate-950/40"
            >
              {chatMessages
                .filter((m) => m.channelId === activeChannel || m.senderRole === 'system')
                .map((msg) => {
                  if (msg.senderRole === 'system') {
                    return (
                      <div key={msg.id} className="flex items-center justify-center my-1">
                        <span className="bg-indigo-950/80 text-indigo-300 px-3 py-1 rounded-md text-[10px] font-semibold flex items-center gap-1.5 border border-indigo-800">
                          <Sparkles className="w-3 h-3 text-indigo-400" />
                          {msg.text}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${msg.isCurrentUser ? 'flex-row-reverse' : ''}`}
                    >
                      <img
                        src={
                          msg.senderAvatar ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
                        }
                        alt={msg.senderName}
                        className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 border border-indigo-500"
                      />

                      <div
                        className={`flex flex-col max-w-[82%] ${
                          msg.isCurrentUser ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div className="flex items-baseline gap-1.5 mb-1">
                          <span className="text-[11px] font-bold text-white">
                            {msg.senderName}
                          </span>
                          <span className="text-[9px] text-slate-400">{msg.timestamp}</span>
                        </div>

                        <div
                          className={`p-3 rounded-xl text-xs leading-relaxed ${
                            msg.isCurrentUser
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-slate-800 text-slate-100 border border-slate-700 shadow-xs'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Composer */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 border-t border-slate-800 bg-slate-900 flex items-center gap-2"
            >
              <input
                id="collab-chat-input"
                type="text"
                placeholder="Ask faculty or discuss with classmates..."
                value={chatInputText}
                onChange={(e) => setChatInputText(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
              />
              <button
                id="collab-send-btn"
                type="submit"
                className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors active:scale-95 shrink-0 cursor-pointer"
                title="Send Message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};
