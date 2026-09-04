export const healthCheck=(req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Repo2Post API is running",
  });
};
