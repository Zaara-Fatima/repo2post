import AppError from "./AppError.js";

export const parseGithubUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    console.log(parsedUrl);

    if (parsedUrl.hostname !== "github.com") {
      throw new AppError("Invalid GitHub URL");
    }

    const parts = parsedUrl.pathname.split("/").filter(Boolean);
    console.log(parts);

    if (parts.length < 2) {
      throw new AppError("Invalid GitHub repository URL");
    }
    console.log(`${parts[0]} ${parts[1]}`);
    return {
      owner: parts[0],
      repo: parts[1],
    };
  } catch (error) {
    throw new AppError("Invalid GitHub repository URL");
  }
};
