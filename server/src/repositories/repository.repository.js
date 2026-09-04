import Repository from "../models/Repository.js";

export const createRepository = async (repoData) => {
  const repository = new Repository({
    userId: repoData.userId,
    name: repoData.name,
    owner: repoData.owner,
    description: repoData.description,
    stars: repoData.stars,
    topics: repoData.topics,
    languages: repoData.languages,
    readme: repoData.readme,
    files: repoData.files,
    url: repoData.url,
  });
  return repository.save();
};

export const findRepositoriesByUser = async (userId) => {
  const repositories = await Repository.find({
    userId: userId,
  });
  return repositories;
};

export const findRepositoryById = async (id, userId) => {
  const repository = await Repository.findOne({ _id: id, userId: userId });
  return repository;
};

export const findRepository = async (owner, name, userId) => {
  const repository = await Repository.findOne({
    owner: owner,
    name: name,
    userId: userId,
  });
  return repository;
};

export const updateRepository = async (updateData, userId) => {
  const repository = await Repository.findOneAndUpdate({
    owner: updateData.repoData.owner,
    name: updateData.repoData.name,
    userId: userId,},{ description : updateData.repoData.description,
    stars : updateData.repoData.stars,
    topics : updateData.repoData.topics,
    languages : updateData.repoLanguage,
    readme : updateData.repoReadme,
    files : updateData.repoFiles,
    url : updateData.repoData.url},
      { new: true } 
  )
  return repository
};
