const resp = (obj, statusCode = 200) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(obj),
});
exports.handler = async (event) => {
  const { answer } = JSON.parse(event.body || "{}");
  const ok = (answer || "").trim().toLowerCase() === "alpha";
  if (ok) return resp({ message: "正確！進入下一關。" });
  return resp({ message: "錯誤，再試一次！" });
};
