import { useState } from 'react';
import { BaseSlide, BaseSlideProps } from './BaseSlide';
import ReactMarkdown from 'react-markdown';

export interface TabsSlideProps extends Omit<BaseSlideProps, 'children'> {
  title?: string;
  tabs: Array<{
    label: string;
    content: string;
    icon?: string;
  }>;
}

export function TabsSlide({
  title,
  tabs,
  ...baseProps
}: TabsSlideProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <BaseSlide {...baseProps} align="left" verticalAlign="top">
      {title && (
        <h1 
          className="text-5xl font-bold mb-12 text-center"
          style={{ color: baseProps.palette?.primary }}
        >
          {title}
        </h1>
      )}
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex border-b-2 mb-8" style={{ borderColor: baseProps.palette?.accent }}>
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-8 py-4 text-xl font-semibold transition-all ${
                activeTab === index
                  ? 'border-b-4 -mb-[2px]'
                  : 'opacity-60 hover:opacity-100'
              }`}
              style={{
                borderColor: activeTab === index ? baseProps.palette?.accent : 'transparent',
                color: activeTab === index ? baseProps.palette?.accent : baseProps.palette?.primary,
              }}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
            </button>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8 min-h-[400px]">
          <div className="prose prose-lg max-w-none animate-in fade-in slide-in-from-bottom-2 duration-500" key={activeTab}>
            <ReactMarkdown>{tabs[activeTab].content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </BaseSlide>
  );
}
