"use client";
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';


const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
);

const WandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5"><path d="M12 3c.3 0 .5.2.5.5v3c0 .3-.2.5-.5.5s-.5-.2-.5-.5v-3c0-.3.2-.5.5-.5Z"/><path d="M21.4 10.6c.2.2.2.5 0 .7l-2.1 2.1c-.2.2-.5.2-.7 0s-.2-.5 0-.7l2.1-2.1c.2-.2.5-.2.7 0Z"/><path d="M10.6 21.4c.2.2.5.2.7 0l2.1-2.1c.2-.2.2-.5 0-.7s-.5-.2-.7 0l-2.1 2.1c-.2.2-.2.5 0 .7Z"/><path d="M3.1 11.3c.2-.2.5-.2.7 0l2.1 2.1c.2.2.2.5 0 .7s-.5.2-.7 0l-2.1-2.1a.5.5 0 0 1 0-.7Z"/><path d="m18.5 3.1-.2.2a.5.5 0 0 0 0 .7l2.1 2.1c.2.2.5.2.7 0l.2-.2a.5.5 0 0 0 0-.7L19.2 3.1a.5.5 0 0 0-.7 0Z"/><path d="m3.1 18.5.2.2c.2.2.5.2.7 0l2.1-2.1a.5.5 0 0 0 0-.7l-.2-.2a.5.5 0 0 0-.7 0l-2.1 2.1a.5.5 0 0 0 0 .7Z"/><path d="M12 8.5c.3 0 .5.2.5.5v3c0 .3-.2.5-.5.5s-.5-.2-.5-.5v-3c0-.3.2-.5.5-.5Z"/><path d="M9.4 6.4c.2-.2.5-.2.7 0l2.1 2.1c.2.2.2.5 0 .7s-.5.2-.7 0l-2.1-2.1c-.2-.2-.2-.5 0-.7Z"/><path d="M6.4 9.4a.5.5 0 0 0 0 .7l2.1 2.1c.2.2.5.2.7 0a.5.5 0 0 0 0-.7L7.1 9.4a.5.5 0 0 0-.7 0Z"/></svg>
);

// Main Application Component
export default function RefactorTool() {
  // State variables to hold the code, loading status, and any errors
  const [originalCode, setOriginalCode] = useState(`def calculate_sum_and_product(numbers_list):\n    s = 0\n    p = 1\n    for n in numbers_list:\n        s += n\n        p *= n\n    return [s, p]`);
  const [refactoredCode, setRefactoredCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refactorOption, setRefactorOption] = useState('refactor');

  /**
   * Handles the primary action of refactoring the code.
   * It constructs a prompt, sends it to the Gemini API, and processes the response.
   */
  const handleRefactor = async () => {
    setIsLoading(true);
    setError(null);
    setRefactoredCode('');

    // --- Prompt Engineering ---
    // This is the most crucial part. We give the AI a role, a clear task,
    // and specific instructions for the output format.
    let prompt;
    switch (refactorOption) {
        case 'add_comments':
            prompt = `As an expert Python developer, add insightful comments and docstrings to the following code. Do not change the code's logic.
            
Code:
\`\`\`python
${originalCode}
\`\`\`

Return only the commented Python code inside a single code block.`;
            break;
        case 'explain':
            prompt = `As an expert Python developer, explain what the following code does in a concise, step-by-step manner. Use markdown for formatting.

Code:
\`\`\`python
${originalCode}
\`\`\`

Explanation:`;
            break;
        case 'refactor':
        default:
            prompt = `You are an expert Python programmer. Your task is to refactor the following Python code.
Your goal is to improve its readability, maintainability, and adherence to best practices (like PEP 8).
Do not change the code's core functionality.

Original Code:
\`\`\`python
${originalCode}
\`\`\`

Refactored Code:
(Return only the refactored Python code inside a single code block. Do not add any explanations or surrounding text.)`;
            break;
    }


    try {
        // --- Gemini API Call ---
        // We use the gemini-2.0-flash model which is great for fast, creative tasks.
        const chatHistory = [];
        chatHistory.push({ role: "user", parts: [{ text: prompt }] });
        const payload = { prompt };
        const apiUrl = "/api/gemini";
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }

        const result = await response.json();
        console.log("API returned:", result);
        
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            
            let rawText = result.candidates[0].content.parts[0].text;
            
            // --- Response Parsing ---
            // The model is asked to return a markdown code block. We'll parse it out
            // to ensure we only get the code, even if it adds extra text.
            if (refactorOption !== 'explain') {
              const codeBlockMatch = rawText.match(/```(?:python\n)?([\s\S]*?)```/);
              if (codeBlockMatch && codeBlockMatch[1]) {
                  setRefactoredCode(codeBlockMatch[1].trim());
              } else {
                  // Fallback if the model doesn't use a markdown block
                  setRefactoredCode(rawText.trim());
              }
            } else {
              setRefactoredCode(rawText.trim());
            }

        } else {
            throw new Error("Invalid response structure from API.");
        }

    } catch (err) {
        console.error(err);
        setError(err.message);
        setRefactoredCode("An error occurred. Please check the console for details.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans p-4 sm:p-6 lg:p-8 flex flex-col">
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
          Python Code Refactor AI
        </h1>
        <p className="text-center text-gray-400 mt-2">
          Paste your Python code below, choose an action, and let AI work its magic.
        </p>
      </header>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Code Panel */}
        <div className="flex flex-col">
          <label htmlFor="original-code" className="text-lg font-semibold text-gray-300 mb-2 flex items-center">
            <CodeIcon /> Your Python Code
          </label>
          <textarea
            id="original-code"
            value={originalCode}
            onChange={(e) => setOriginalCode(e.target.value)}
            className="flex-grow bg-gray-800 border-2 border-gray-700 rounded-lg p-4 font-mono text-sm text-green-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
            placeholder="def your_function(param): ..."
            spellCheck="false"
          />
          <input
            type="file"
            accept=".py"
            onChange={(e) => {
            const file = e.target.files[0];
                if (file) {
                const reader = new FileReader();
                reader.onload = (e) => setOriginalCode(e.target.result);
                reader.readAsText(file);
                }
             }}
            className="text-sm mt-2 text-gray-300"
        />
        </div>

        {/* Output Code Panel */}
        <div className="flex flex-col">
          <label htmlFor="refactored-code" className="text-lg font-semibold text-gray-300 mb-2 flex items-center">
            <WandIcon /> AI Output
          </label>
          <div className="relative flex-grow">
            <SyntaxHighlighter language="python" style={oneDark} customStyle={{ padding: "1rem", borderRadius: "0.5rem", background: "#1e1e2e" }}>
                {refactoredCode}
            </SyntaxHighlighter>
            <button
                onClick={() => navigator.clipboard.writeText(refactoredCode)}
                className="absolute top-2 right-2 bg-indigo-600 text-white px-2 py-1 text-xs rounded hover:bg-indigo-700"
                >
                    Copy
                </button>
            {isLoading && (
                <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center rounded-lg">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400"></div>
                </div>
            )}
            {error && (
                <div className="absolute bottom-4 right-4 bg-red-500 text-white p-3 rounded-lg text-sm">
                    {error}
                </div>
            )}
          </div>
          <button
            onClick={() => {
                const blob = new Blob([refactoredCode], { type: "text/x-python" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "refactored.py";
                link.click();
            }}
            className="mt-4 px-4 py-2 bg-gray-700 rounded text-sm text-white hover:bg-gray-600 w-max"
            >
                Download Code
            </button>

        </div>
      </div>

      <footer className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
        {/* Refactor Options */}
        <div className="flex items-center space-x-4 bg-gray-800 p-2 rounded-lg">
            <button 
                onClick={() => setRefactorOption('refactor')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${refactorOption === 'refactor' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
            >
                Refactor
            </button>
            <button 
                onClick={() => setRefactorOption('add_comments')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${refactorOption === 'add_comments' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
            >
                Add Comments
            </button>
            <button 
                onClick={() => setRefactorOption('explain')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${refactorOption === 'explain' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
            >
                Explain Code
            </button>
        </div>

        <button
          onClick={handleRefactor}
          disabled={isLoading || !originalCode}
          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:shadow-indigo-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
        >
          {isLoading ? 'Thinking...' : 'Generate'}
        </button>
      </footer>
    </div>
  );
}
