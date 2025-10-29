export const getCookies = () => {
  const cookieString = document.cookie;
  return Object.fromEntries(
    cookieString.split("; ").map(c => c.split("="))
  );
};