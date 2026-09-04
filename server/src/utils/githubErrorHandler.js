import AppError from "./AppError.js";
export const handleGithubError = (error) => {
  if (error.response) {
    const status = error.response.status;

    if (status === 404) {
      throw new AppError("GitHub repository not found", 404);
    }

    if (status === 403) {
      throw new AppError("GitHub API rate limit exceeded", 429);
    }

    if (status >= 500) {
      throw new AppError(
        "GitHub service is temporarily unavailable",
        503
      );
    }
  }

  if (error.code === "ECONNABORTED") {
    throw new AppError("GitHub request timed out", 504);
  }

  throw new AppError(
    "Unable to communicate with GitHub",
    502
  );
};