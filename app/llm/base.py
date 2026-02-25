from abc import ABC, abstractmethod


class LLMProvider(ABC):
    """Abstract base class for all LLM providers."""

    @abstractmethod
    def query(self, prompt: str) -> str:
        """Send a prompt to the LLM and return the response text."""
        ...

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Return the provider identifier string."""
        ...

    @property
    @abstractmethod
    def model_name(self) -> str:
        """Return the model identifier string."""
        ...
