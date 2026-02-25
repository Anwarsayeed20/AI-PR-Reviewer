import requests

from .base import LLMProvider


class GeminiProvider(LLMProvider):
    """Google Gemini (AI Studio) provider.

    Free tier: 15 RPM, 1 million tokens/day.
    Uses the generativelanguage REST API so no extra SDK is needed.
    """

    API_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

    def __init__(self, api_key: str, model: str = "gemini-2.0-flash"):
        self._api_key = api_key
        self._model = model

    @property
    def provider_name(self) -> str:
        return "gemini"

    @property
    def model_name(self) -> str:
        return self._model

    def query(self, prompt: str) -> str:
        url = self.API_URL.format(model=self._model)
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.2,
                "maxOutputTokens": 1024,
            },
        }
        response = requests.post(
            url, headers=headers, json=payload, params={"key": self._api_key}
        )
        response.raise_for_status()
        data = response.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]
