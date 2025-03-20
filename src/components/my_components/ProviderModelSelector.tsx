"use client";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";

// Danh sách các provider và model
const providers = {
  OpenRouter: [
    "openai/gpt-3.5-turbo",
    "google/gemini-pro-1.5",
    "google/gemini-flash-1.5",
    "meta-llama/llama-3.2-1b-instruct",
    "meta-llama/llama-3.2-3b-instruct",
    "meta-llama/llama-3.2-11b-vision-instruct",
    "meta-llama/llama-3.2-90b-vision-instruct",
    "meta-llama/llama-3.1-405b-instruct",
    "meta-llama/llama-3.1-70b-instruct",
    "meta-llama/llama-3.1-8b-instruct",
    "meta-llama/llama-3-70b-instruct",
    "meta-llama/llama-3-8b-instruct",
    "qwen/qwq-32b:free",
    "moonshotai/moonlight-16b-a3b-instruct:free",
    "nousresearch/deephermes-3-llama-3-8b-preview:free",
    "google/gemini-2.0-pro-exp-02-05:free",
    "deepseek/deepseek-r1:free",
    "deepseek/deepseek-chat:free",
  ],
  NVIDIA: [
    "google/gemma-7b",
    "google/codegemma-7b",
    "meta/llama2-70b",
    "meta/llama-3.1-8b-instruct",
    "meta/llama-3.1-70b-instruct",
    "meta/llama-3.1-405b-instruct",
    "meta/llama3-8b-instruct",
    "meta/llama3-70b-instruct",
    "mistralai/mixtral-8x7b-instruct-v0.1",
    "mistralai/mixtral-8x22b-instruct-v0.1",
  ],
  Fireworks: [
    "accounts/fireworks/models/llama-v3p1-405b-instruct",
    "accounts/fireworks/models/llama-v3p1-8b-instruct",
    "accounts/fireworks/models/llama-v3-70b-instruct",
    "accounts/fireworks/models/llama-v3p2-1b-instruct",
    "accounts/fireworks/models/llama-v3p1-70b-instruct",
    "accounts/fireworks/models/llama-v3-8b-instruct",
    "accounts/fireworks/models/llama-v3p2-3b-instruct",
  ],
};

interface Props {
  provider: string;
  model: string;
  onProviderChange: (provider: string) => void;
  onModelChange: (model: string) => void;
}

// Hàm normalize: chuyển giá trị provider về dạng đã định nghĩa trong đối tượng providers
function normalizeProvider(value: string): string {
  const keys = Object.keys(providers);
  for (const key of keys) {
    if (key.toLowerCase() === value.toLowerCase()) {
      return key;
    }
  }
  return value;
}

export default function ProviderModelSelector({
  provider,
  model,
  onProviderChange,
  onModelChange,
}: Props) {
  // Sử dụng normalizeProvider cho provider ban đầu
  const initialProvider = normalizeProvider(provider);
  const [selectedProvider, setSelectedProvider] = useState(initialProvider);
  const [selectedModel, setSelectedModel] = useState(model);

  useEffect(() => {
    setSelectedProvider(normalizeProvider(provider));
    setSelectedModel(model);
  }, [provider, model]);

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProviderRaw = e.target.value;
    const newProvider = normalizeProvider(newProviderRaw);
    const defaultModel = providers[newProvider]?.[0] || "";
    setSelectedProvider(newProvider);
    setSelectedModel(defaultModel);
    onProviderChange(newProvider);
    onModelChange(defaultModel);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Provider */}
      <div className="flex-1">
        <Label htmlFor="provider" className="block mb-1">
          Provider
        </Label>
        <select
          id="provider"
          value={selectedProvider}
          onChange={handleProviderChange}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {Object.keys(providers).map((prov) => (
            <option key={prov} value={prov}>
              {prov}
            </option>
          ))}
        </select>
      </div>

      {/* Model */}
      <div className="flex-1">
        <Label htmlFor="model" className="block mb-1">
          Model
        </Label>
        <select
          id="model"
          value={selectedModel}
          onChange={(e) => {
            setSelectedModel(e.target.value);
            onModelChange(e.target.value);
          }}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {(providers[selectedProvider] || []).map((mod) => (
            <option key={mod} value={mod}>
              {mod}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
