
async function askOllama(prompt) {
  const response = await fetch("http://0.0.0.0:11435/api/generate", {
    method: "POST",
    body: JSON.stringify({
      model: "llama3",
      prompt,
      stream: false
    })
  });

  const data = await response.json();
  console.log(data);
  return data.response;
}

module.exports = { askOllama };
