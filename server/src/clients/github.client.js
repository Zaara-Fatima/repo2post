import axios from "axios";
import AppError from "../utils/AppError.js";
import createHttpClient from "./http.client.js";
import { handleGithubError } from "../utils/githubErrorHandler.js";

const githubApi = createHttpClient({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github+json",
  },
});

export const githubClient = async (owner, repo) => {
  try {
    const response = await githubApi.get(`/repos/${owner}/${repo}`);
    return response.data;
  } catch (error) {
    handleGithubError(error);
  }
};

export const getLanguages = async (owner, repo) => {
  try {
    const response = await githubApi.get(`/repos/${owner}/${repo}/languages`);
    return response.data;
  } catch (error) {
    handleGithubError(error);
  }
};

export const getReadme = async (owner, repo) => {
  try {
    const response = await githubApi.get(`/repos/${owner}/${repo}/readme`);
    const decodedContent = Buffer.from(
      response.data.content,
      "base64",
    ).toString("utf-8");
    return decodedContent;
  } catch (error) {
    handleGithubError(error);
  }
};

export const getFiles = async (owner, repo) => {
  try {
    const response = await githubApi.get(`/repos/${owner}/${repo}/contents`);
    
    const files = response.data.map((item) => {
      return item.name
    });
    return files;
  } catch (error) {
    handleGithubError(error);
  }
};
