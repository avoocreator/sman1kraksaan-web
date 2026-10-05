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

export async function getAiIntro() {
  const response = await fetch("/api/chat");
  if (!response.ok) throw new Error("intro unavailable");
  return (await response.json()) as { enabled: boolean; welcome: string; questions: string[] };
}
