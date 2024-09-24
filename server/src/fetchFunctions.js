// Fetches from API given path
export const fetchData= (path) => {
  return fetch("http://localhost:8081/" + path)
    .then((res) => res.json())
    .then((data) => {
        return data;
    })
    .catch((err) => console.log(err));
};

// Deletes a saved input
export const deleteSavedInputById = (id) => {
  fetch(`http://localhost:8081/deleteSavedInput/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to delete row");
      }
    })
    .catch((err) => console.error("Error:", err));
};
