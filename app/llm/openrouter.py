import requests

from .base import LLMProvider


class OpenRouterProvider(LLMProvider):
    """OpenRouter provider — aggregator with free model tiers.

    Free models available (e.g. meta-llama/llama-3.1-8b-instruct:free).
    OpenAI-compatible API. Sign up at openrouter.ai.
    """

    API_URL = "https://openrouter.ai/api/v1/chat/completions"

    def __init__(self, api_key: str, model: str = "qwen/qwen3-coder:free"):
        self._api_key = api_key
        self._model = model

    @property
    def provider_name(self) -> str:
        return "openrouter"

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
