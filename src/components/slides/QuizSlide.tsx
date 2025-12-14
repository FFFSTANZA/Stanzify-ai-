import { useState } from 'react';
import { BaseSlide, BaseSlideProps } from './BaseSlide';
import { Check, X } from 'lucide-react';

export interface QuizSlideProps extends Omit<BaseSlideProps, 'children'> {
  question: string;
  options: Array<{
    text: string;
    correct: boolean;
    explanation?: string;
  }>;
  multipleChoice?: boolean;
}

export function QuizSlide({
  question,
  options,
  multipleChoice = false,
  ...baseProps
}: QuizSlideProps) {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleOptionClick = (index: number) => {
    if (showResults) return;
    
    if (multipleChoice) {
      setSelectedOptions(prev =>
        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
      );
    } else {
      setSelectedOptions([index]);
      setTimeout(() => setShowResults(true), 500);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  return (
    <BaseSlide {...baseProps} align="center" verticalAlign="center">
      <div className="max-w-4xl mx-auto w-full">
        <h1 
          className="text-4xl font-bold mb-12 text-center"
          style={{ color: baseProps.palette?.primary }}
        >
          {question}
        </h1>
        <div className="space-y-4">
          {options.map((option, index) => {
            const isSelected = selectedOptions.includes(index);
            const isCorrect = option.correct;
            const showCorrectness = showResults && isSelected;
            
            return (
              <div key={index} className="animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                <button
                  onClick={() => handleOptionClick(index)}
                  disabled={showResults}
                  className={`w-full p-6 rounded-xl text-left text-xl font-medium transition-all ${
                    isSelected
                      ? showCorrectness
                        ? isCorrect
                          ? 'bg-green-100 border-4 border-green-500'
                          : 'bg-red-100 border-4 border-red-500'
                        : 'border-4'
                      : 'bg-white border-2 hover:border-4'
                  } ${!showResults ? 'hover:shadow-lg cursor-pointer' : 'cursor-default'}`}
                  style={{
                    borderColor: isSelected && !showResults ? baseProps.palette?.accent : undefined,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.text}</span>
                    {showCorrectness && (
                      isCorrect ? (
                        <Check className="w-8 h-8 text-green-600" />
                      ) : (
                        <X className="w-8 h-8 text-red-600" />
                      )
                    )}
                  </div>
                </button>
                {showResults && isSelected && option.explanation && (
                  <div className="mt-2 p-4 bg-blue-50 rounded-lg text-base">
                    <strong>Explanation:</strong> {option.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {multipleChoice && !showResults && selectedOptions.length > 0 && (
          <button
            onClick={handleSubmit}
            className="mt-8 px-8 py-4 rounded-lg text-white text-xl font-semibold shadow-lg hover:scale-105 transition-transform mx-auto block"
            style={{ backgroundColor: baseProps.palette?.accent }}
          >
            Submit Answer
          </button>
        )}
      </div>
    </BaseSlide>
  );
}
