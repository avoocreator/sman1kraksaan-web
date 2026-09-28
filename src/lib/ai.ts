export async function getAiResponse(
  message: string,
  history: { role: "user" | "assistant"; content: string }[] = [],
) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Asisten sedang tidak tersedia.");
  }

  return data.answer as string;
}
