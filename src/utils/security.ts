const isAuthenticated = () => {
  return !!localStorage.getItem("access_token");
};

export { isAuthenticated };
