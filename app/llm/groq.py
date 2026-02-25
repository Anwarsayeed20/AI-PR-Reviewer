import requests

from .base import LLMProvider


class GroqProvider(LLMProvider):
    """Groq API provider — ultra-fast inference."""

    API_URL = "https://api.groq.com/openai/v1/chat/completions"

    def __init__(self, api_key: str, model: str = "llama-3.3-70b-versatile"):
        self._api_key = api_key
        self._model = model

    @property
    def provider_name(self) -> str:
        return "groq"

    @property
    def model_name(self) -> str:
        return self._model

    def query(self, prompt: str) -> str:
        headers = {
            "Authorization": f"Bearer {self._api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": self._model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.2,
            "max_tokens": 1024,
        }
        response = requests.post(self.API_URL, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
