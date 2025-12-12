import React, { useState, useRef, useEffect } from 'react';
import { Pause, Play, RotateCcw, Settings } from 'lucide-react';

function App() {
  const [text, setText] = useState('在此输入要滚动显示的文字...');
  const [speed, setSpeed] = useState(2);
  const [isPlaying, setIsPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current || !isPlaying) return;

    const container = containerRef.current;
    const content = contentRef.current;
    let animationFrameId: number;
    let position = 0;

    const animate = () => {
      position -= speed;
      content.style.transform = `translateX(${position}px)`;

      if (Math.abs(position) > content.offsetWidth) {
        position = container.offsetWidth;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [speed, isPlaying]);

  const handleReset = () => {
    if (contentRef.current) {
      contentRef.current.style.transform = 'translateX(0)';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">滚动字幕工具</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="text" className="block text-sm font-medium text-gray-700">
              文字内容
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="speed" className="block text-sm font-medium text-gray-700">
              滚动速度: {speed}
            </label>
            <input
              type="range"
              id="speed"
              min="1"
              max="10"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  暂停
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  播放
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              重置
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="mt-8 bg-gray-900 p-6 rounded-lg shadow-lg overflow-hidden"
        >
          <div
            ref={contentRef}
            className="whitespace-nowrap"
          >
            <span className="text-3xl font-bold text-white">{text}</span>
          </div>
        </div>

        <div className="text-center text-gray-600 text-sm">
          <Settings className="inline-block w-4 h-4 mr-1" />
          提示：可以通过滑块调节滚动速度
        </div>
      </div>
    </div>
  );
}

export default App;