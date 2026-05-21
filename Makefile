.PHONY: install-ollama pull-model setup start dev

OLLAMA_MODEL ?= qwen2.5-coder:3b

# Install Ollama (macOS / Linux)
install-ollama:
	@if command -v ollama >/dev/null 2>&1; then \
		echo "Ollama already installed: $$(ollama --version)"; \
	else \
		echo "Installing Ollama..."; \
		curl -fsSL https://ollama.com/install.sh | sh; \
	fi

# Pull Qwen model
pull-model:
	@echo "Pulling model: $(OLLAMA_MODEL)"
	ollama pull $(OLLAMA_MODEL)

# Full setup: install Ollama + pull model
setup: install-ollama pull-model
	@echo "Setup complete. Run 'make start' to start."

# Start Ollama server + Next.js dev server
start:
	@echo "Starting Ollama..."
	@ollama serve &
	@sleep 2
	@echo "Starting Next.js..."
	npm run dev

# Next.js only (if Ollama already running)
dev:
	npm run dev
