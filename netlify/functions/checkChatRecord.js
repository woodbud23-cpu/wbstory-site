export async function handler(event) {
  const { answer } = JSON.parse(event.body || "{}");
  const ok = (answer || "").trim().toLowerCase() === "beta";
  if (ok) return resp({ message: "答對了！" });
  return resp({ message: "不對，再推理看看！" });
}
function resp(obj, statusCode = 200) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj) };
}
