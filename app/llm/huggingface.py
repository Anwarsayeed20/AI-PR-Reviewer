import requests

from .base import LLMProvider


class HuggingFaceProvider(LLMProvider):
    """Hugging Face Inference API provider."""

    def __init__(self, api_url: str, token: str, model: str = "Qwen/Qwen2.5-Coder-7B-Instruct"):
        self._api_url = api_url
        self._token = token
        self._model = model

    @property
    def provider_name(self) -> str:
        return "huggingface"

    @property
    def model_name(self) -> str:
        return self._model

    def query(self, prompt: str) -> str:
        headers = {"Authorization": f"Bearer {self._token}"}
        payload = {
            "model": self._model,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 512,
            "temperature": 0.2,
        }
        response = requests.post(self._api_url, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
