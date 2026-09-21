
export const validate = (schema, source ="body") => {
  return (req, res, next) => {
    try {
      schema.parse(req[source]);
      next()
    } catch (error) {
      next(error)
    }
  };
};
