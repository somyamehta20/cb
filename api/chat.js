export default async function handler(req, res) {
    const apiKey = process.env.VITE_OPENAI_API_KEY;
    const { messages } = await req.json();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: messages,
        }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a reply.";
    res.status(200).json({ reply });
}
