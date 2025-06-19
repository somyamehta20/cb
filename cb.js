const startBtn = document.getElementById("start-btn");
const transcriptEl = document.getElementById("transcript");

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-US";
recognition.interimResults = false;

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = speechSynthesis.getVoices()[0];
    speechSynthesis.speak(utterance);
}

async function callChatGPT(question) {
    transcriptEl.textContent = "Thinking...";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + (import.meta.env.VITE_OPENAI_API_KEY || "sk-REPLACE_THIS"),
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content:
                        "You are Somya Mehta, a driven and passionate candidate for Home.LLC. Answer in a confident, thoughtful, and concise tone. Your story includes leadership, startup experience, AI work, and curiosity.",
                },
                {
                    role: "user",
                    content: question,
                },
            ],
        }),
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;
    transcriptEl.textContent = reply;
    speak(reply);
}

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    transcriptEl.textContent = "You said: " + transcript;
    callChatGPT(transcript);
};

startBtn.addEventListener("click", () => {
    recognition.start();
});
