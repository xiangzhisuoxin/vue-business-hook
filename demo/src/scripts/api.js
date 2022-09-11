const getRandomDelay = (data) => {
  const delay = Math.random().toFixed(2);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay * 1000);
  });
};

export const getData = ({ pageNo = 0, size = 10 } = {}) => {
  const list = JSON.parse(localStorage.getItem("data"));
  const index = pageNo * size;
  const data = list.slice(index, index + size);

  return getRandomDelay({
    total: list.length,
    data,
  });
};

export const editData = (data = {}) => {
  const { id } = data;
  const list = JSON.parse(localStorage.getItem("data"));
  const item = list.find((l) => l.id === id);
  if (item) {
    Object.assign(item, data);
    localStorage.setItem("data", JSON.stringify(list));
    return getRandomDelay();
  } else {
    console.error("edit data error", data);
    return Promise.reject();
  }
};

export const removeData = (id) => {
  const list = getDB();
  const index = list.findIndex((l) => l.id === id);
  if (index !== undefined) {
    list.splice(index, 1);
    setDB(list);
    return getRandomDelay();
  } else {
    console.error("remove data err", id, list);
    return Promise.reject();
  }
};

export const addData = (data) => {
  const list = getDB();
  const id = list[list.length - 1].id + 1;
  list.push({
    ...data,
    id,
  });
  setDB(list);
  return getRandomDelay();
};

function getDB() {
  return JSON.parse(localStorage.getItem("data"));
}

function setDB(data) {
  return localStorage.setItem("data", JSON.stringify(data));
}
