export default function AsyncCatch(fun) {
  return (req, res, next) => {
    fun(req, res, next).catch(next);
  };
}
