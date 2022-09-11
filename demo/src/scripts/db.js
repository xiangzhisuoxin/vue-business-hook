const initData = [
  {
    id: 1,
    date: "2016-05-02",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1518 弄",
  },
  {
    id: 2,
    date: "2016-05-04",
    name: "王小虎",
    address: "邢台 1517 弄",
  },
  {
    id: 3,
    date: "2016-05-05",
    name: "王小虎",
    address: "沙河 1519 弄",
  },
  {
    id: 4,
    date: "2016-05-06",
    name: "王小虎",
    address: "北京 1516 弄",
  },
];

export const initDB = () => {
  const data = localStorage.getItem("data");
  if (!data) {
    localStorage.setItem("data", JSON.stringify(initData));
  }
  console.log("data", JSON.parse(data));
};

export const resetDB = () => {
  localStorage.setItem("data", JSON.stringify(initData));
};
