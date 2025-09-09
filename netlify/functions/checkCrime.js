export async function handler(event) {
  const { answer } = JSON.parse(event.body || "{}");
  const ok = (answer || "").trim().toLowerCase() === "gamma";
  if (ok) return resp({ message: "過關！" });
  return resp({ message: "再想想，還沒答對。" });
}
function resp(obj, statusCode = 200) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj) };
}
