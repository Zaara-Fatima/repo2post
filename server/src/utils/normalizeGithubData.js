const normalizeGithubData = (repoData) => {
  return {
    name: repoData.name,
    owner: repoData.owner.login,
    description: repoData.description ?? "" ,
    stars: repoData.stargazers_count,
    topics: repoData.topics,
    url: repoData.html_url,
  };
};

export default normalizeGithubData;
