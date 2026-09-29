class HttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);

    this.name = "HttpError";
    this.status = status;
  }
}

export const fetchWithRetry = async (
  url: string,
  options = {},
  maxRetries = 3,
) => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const error = new Error(`HTTP Error: ${response.status}`) as HttpError;

        error.status = response.status;

        throw error;
      }

      return await response.json();
    } catch (error) {
      lastError = error;

      // Don't retry 4xx errors
      if (
        error instanceof HttpError &&
        error.status >= 400 &&
        error.status < 500
      ) {
        throw error;
      }

      // Stop after final attempt
      if (attempt === maxRetries) {
        throw lastError;
      }

      console.log(`Retrying... Attempt ${attempt + 1}/${maxRetries}`);
    }
  }
};
