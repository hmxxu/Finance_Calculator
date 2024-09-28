// Fetches from API given path
export const fetchData = (path) => {
  return fetch("http://localhost:8081/" + path)
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((err) => console.log(err));
};
