"""
Lightweight client for open-source GPT-style models via Ollama.

This module provides a minimal wrapper around the Ollama HTTP API so the
application can generate responses from local OSS models (e.g., Llama 3,
Mistral, Phi, etc.) without changing the existing app structure.

Usage:
    client = OllamaClient()
    reply = client.chat("Hello!", system_prompt="You are a helpful fitness coach.")
"""

from __future__ import annotations

import os
from typing import Optional, Dict, Any

import requests


class OllamaClient:
    """Simple HTTP client for the Ollama chat API."""

    def __init__(
        self,
        base_url: Optional[str] = None,
        model: Optional[str] = None,
        timeout_seconds: int = 60,
    ) -> None:
        self.base_url = (base_url or os.getenv("OLLAMA_BASE_URL") or "http://localhost:11434").rstrip("/")
        self.model = model or os.getenv("OLLAMA_MODEL") or "llama3.1"
        self.timeout_seconds = timeout_seconds

    def _build_messages(self, user_message: str, system_prompt: Optional[str]) -> list[Dict[str, str]]:
        messages: list[Dict[str, str]] = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": user_message})
        return messages

    def chat(
        self,
        user_message: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.4,
        max_tokens: Optional[int] = None,
    ) -> str:
        """Send a single-turn chat request. Returns assistant's text content.

        Raises an exception if the request fails.
        """
        url = f"{self.base_url}/api/chat"
        payload: Dict[str, Any] = {
            "model": self.model,
            "messages": self._build_messages(user_message, system_prompt),
            "stream": False,
            "options": {"temperature": temperature},
        }
        if max_tokens is not None:
            payload["options"]["num_predict"] = max_tokens

        response = requests.post(url, json=payload, timeout=self.timeout_seconds)
        response.raise_for_status()

        data = response.json()

        # Non-streaming chat API returns an object with a final "message"
        # Example: { "message": {"role": "assistant", "content": "..."}, "done": true }
        if isinstance(data, dict):
            message = data.get("message")
            if isinstance(message, dict):
                content = message.get("content")
                if isinstance(content, str):
                    return content.strip()

        # Fallback if format unexpectedly changes
        return str(data)


DEFAULT_FITNESS_SYSTEM_PROMPT = (
    "You are a friendly, concise fitness assistant. Provide safe, evidence-"
    "based guidance. When asked for a workout plan, give a clear day-by-day"
    " split with exercises and rep ranges. Keep answers short unless asked"
    " to elaborate."
)


