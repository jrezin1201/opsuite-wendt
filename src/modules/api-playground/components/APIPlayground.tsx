"use client";

import React, { useState } from "react";
import { EndpointSidebar } from "./EndpointSidebar";
import { RequestBuilder } from "./RequestBuilder";
import { ResponseViewer } from "./ResponseViewer";
import { CodeSnippets } from "./CodeSnippets";

export interface APIRequest {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  headers: { key: string; value: string }[];
  body: string;
}

export interface APIResponse {
  status: number;
  statusText: string;
  time: number;
  headers: { key: string; value: string }[];
  body: string;
}

export function APIPlayground() {
  const [request, setRequest] = useState<APIRequest>({
    method: "GET",
    url: "https://api.example.com/users",
    headers: [
      { key: "Content-Type", value: "application/json" },
      { key: "Authorization", value: "Bearer your-api-key" },
    ],
    body: "",
  });

  const [response, setResponse] = useState<APIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState("users");

  const sendRequest = async () => {
    setIsLoading(true);
    const startTime = Date.now();

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockResponse: APIResponse = {
      status: 200,
      statusText: "OK",
      time: Date.now() - startTime,
      headers: [
        { key: "Content-Type", value: "application/json" },
        { key: "X-RateLimit-Remaining", value: "99" },
      ],
      body: JSON.stringify(
        {
          data: [
            { id: 1, name: "John Doe", email: "john@example.com" },
            { id: 2, name: "Jane Smith", email: "jane@example.com" },
          ],
          meta: { total: 2, page: 1 },
        },
        null,
        2
      ),
    };

    setResponse(mockResponse);
    setIsLoading(false);
  };

  return (
    <div className="flex gap-4 h-[800px]">
      {/* Endpoint Sidebar */}
      <EndpointSidebar
        selectedEndpoint={selectedEndpoint}
        onSelectEndpoint={(endpoint, method, url) => {
          setSelectedEndpoint(endpoint);
          setRequest({ ...request, method, url });
        }}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Request Builder */}
        <RequestBuilder
          request={request}
          onRequestChange={setRequest}
          onSend={sendRequest}
          isLoading={isLoading}
        />

        {/* Response Viewer */}
        {response && <ResponseViewer response={response} />}

        {/* Code Snippets */}
        <CodeSnippets request={request} />
      </div>
    </div>
  );
}
