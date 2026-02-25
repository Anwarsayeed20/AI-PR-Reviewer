import logging

from .base import LLMProvider
from .huggingface import HuggingFaceProvider
from .groq import GroqProvider
from .gemini import GeminiProvider
from .cerebras import CerebrasProvider
from .openrouter import OpenRouterProvider
from ..config import get_settings

logger = logging.getLogger("pr-guardian")

# Default provider/model used when no installation config exists.
DEFAULT_PROVIDER = "huggingface"
DEFAULT_MODEL = "Qwen/Qwen2.5-Coder-7B-Instruct"


def get_llm_provider(
    provider: str | None = None,
    model: str | None = None,
) -> LLMProvider:
    """Return an LLMProvider instance based on the requested provider name.

    If *provider* is ``None`` the default (Hugging Face) is used.
    If *model* is ``None`` the provider's built-in default model is used.
    """
    settings = get_settings()
    provider = (provider or DEFAULT_PROVIDER).lower().strip()

    kwargs: dict = {}
    if model:
        kwargs["model"] = model

    if provider == "huggingface":
        return HuggingFaceProvider(
            api_url=settings.hf_api_url,
            token=settings.hf_token,
            **kwargs,
        )

    if provider == "groq":
        return GroqProvider(api_key=settings.groq_api_key, **kwargs)

    if provider == "gemini":
        return GeminiProvider(api_key=settings.gemini_api_key, **kwargs)

    if provider == "cerebras":
        return CerebrasProvider(api_key=settings.cerebras_api_key, **kwargs)

    if provider == "openrouter":
        return OpenRouterProvider(api_key=settings.openrouter_api_key, **kwargs)

    raise ValueError(f"Unknown LLM provider: {provider!r}")
