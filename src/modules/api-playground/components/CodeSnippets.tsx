"use client";

import React, { useState } from "react";
import type { APIRequest } from "./APIPlayground";

interface CodeSnippetsProps {
  request: APIRequest;
}

type Language = "curl" | "javascript" | "python" | "ruby";

export function CodeSnippets({ request }: CodeSnippetsProps) {
  const [language, setLanguage] = useState<Language>("curl");

  const generateSnippet = (): string => {
    switch (language) {
      case "curl":
        return `curl -X ${request.method} '${request.url}' \\
${request.headers.map((h) => `  -H '${h.key}: ${h.value}'`).join(" \\\n")}${request.body ? ` \\\n  -d '${request.body}'` : ""}`;

      case "javascript":
        return `fetch('${request.url}', {
  method: '${request.method}',
  headers: {
${request.headers.map((h) => `    '${h.key}': '${h.value}'`).join(",\n")}
  }${request.body ? `,\n  body: JSON.stringify(${request.body})` : ""}
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`;

      case "python":
        return `import requests

headers = {
${request.headers.map((h) => `  '${h.key}': '${h.value}'`).join(",\n")}
}

response = requests.${request.method.toLowerCase()}('${request.url}', headers=headers${request.body ? `, json=${request.body}` : ""})
print(response.json())`;

      case "ruby":
        return `require 'net/http'
require 'json'

uri = URI('${request.url}')
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true

request = Net::HTTP::${request.method.charAt(0) + request.method.slice(1).toLowerCase()}.new(uri)
${request.headers.map((h) => `request['${h.key}'] = '${h.value}'`).join("\n")}${request.body ? `\nrequest.body = ${request.body}` : ""}

response = http.request(request)
puts JSON.parse(response.body)`;

      default:
        return "";
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
      {/* Language Tabs */}
      <div className="flex gap-2 mb-4">
        {(["curl", "javascript", "python", "ruby"] as Language[]).map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              language === lang
                ? "bg-purple-500 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            {lang === "curl" ? "cURL" : lang.charAt(0).toUpperCase() + lang.slice(1)}
          </button>
        ))}
      </div>

      {/* Code Snippet */}
      <div className="relative">
        <pre className="bg-black/40 rounded p-4 text-xs text-green-400 font-mono overflow-x-auto">
          {generateSnippet()}
        </pre>
        <button
          onClick={() => navigator.clipboard.writeText(generateSnippet())}
          className="absolute top-2 right-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white/60 hover:text-white rounded text-xs font-medium transition-colors"
        >
          Copy Code
        </button>
      </div>
    </div>
  );
}
