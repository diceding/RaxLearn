import { useState, useEffect } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
}

export function CodeEditor({ value, onChange, language }: CodeEditorProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="relative h-[600px]">
      <textarea
        value={localValue}
        onChange={handleChange}
        className="w-full h-full p-4 font-mono text-sm bg-gray-900 text-gray-100 resize-none focus:outline-none"
        spellCheck={false}
        style={{
          tabSize: 2,
          lineHeight: '1.5',
        }}
      />
      <div className="absolute bottom-4 right-4 text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
        {language}
      </div>
    </div>
  );
}
