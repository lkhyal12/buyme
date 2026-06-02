export function getErrorMsg(err) {
  return (
    err?.response?.data?.message ||
    err?.message ||
    err ||
    "Something went wrong"
  );
}
