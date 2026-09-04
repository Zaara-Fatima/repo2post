import { parseGithubUrl } from "../utils/parseGithubUrl.js";
import {
  getFiles,
  getLanguages,
  getReadme,
  githubClient,
} from "../clients/github.client.js";

import { createRepository, findRepositoriesByUser, findRepository, findRepositoryById, updateRepository } from "../repositories/repository.repository.js";
import AppError from "../utils/AppError.js";
import normalizeGithubData from "../utils/normalizeGithubData.js";

export const analyzeRepository = async (url, userId) => {
  const { owner, repo } = parseGithubUrl(url);
  const repository = await githubClient(owner, repo);
  const repoData = normalizeGithubData(repository)
  

  const [repoFiles, repoLanguage, repoReadme] = await Promise.all([
    getFiles(owner, repo),
    getLanguages(owner, repo),
    getReadme(owner, repo),
  ]);

const existingRepo = await findRepository(repoData.owner, repoData.name, userId)
const updateData = {repoData, repoFiles, repoLanguage,repoReadme }
  if(existingRepo){
    const userRepo = await updateRepository(updateData, userId)
    return userRepo
  }
  const userRepo = await createRepository({
    userId: userId,
    name: repoData.name,
    owner: repoData.owner,
    description: repoData.description,
    stars: repoData.stars,
    topics: repoData.topics,
    languages: repoLanguage,
    readme: repoReadme,
    files: repoFiles,
    url: repoData.url,
  });

  return {
    name: userRepo.name,
    owner: userRepo.owner,
    description: userRepo.description,
    stars: userRepo.stars,
    topics: userRepo.topics,
    url: userRepo.url,
  };
};

export const getRepoByUser=async(userId)=>{
  const repo = await findRepositoriesByUser(userId)
  if  (repo.length === 0){
    throw new AppError("NO REP FOUND", 404)
  }
  return repo
}

export const getRepoById = async (id,user) => {
  const repo = await findRepositoryById(id,user)
  if(!repo){
    throw new AppError("NO REPO FOUND WITH THIS ID", 404)
  }
  return repo
}