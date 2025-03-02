function detectFakeID() {
    // Get input values
    const username = document.getElementById('username').value.trim();
    const followers = parseInt(document.getElementById('followers').value);
    const posts = parseInt(document.getElementById('posts').value);

    const resultMessage = document.getElementById('result-message');

    // Validation
    if (!username || isNaN(followers) || isNaN(posts)) {
        resultMessage.style.color = 'red';
        resultMessage.textContent = "Please fill all fields correctly.";
        return;
    }

    // Detection Logic
    let fakeLikelihood = 0;

    if (followers < 50) fakeLikelihood += 40;
    if (posts < 5) fakeLikelihood += 30;
    if (/^[0-9]+$/.test(username)) fakeLikelihood += 30;

    let resultText;
    if (fakeLikelihood >= 70) {
        resultMessage.style.color = 'red';
        resultText = `Fake ID Detected! (Score: ${fakeLikelihood}%)`;
    } else if (fakeLikelihood >= 40) {
        resultMessage.style.color = 'orange';
        resultText = `Suspicious Account! (Score: ${fakeLikelihood}%)`;
    } else {
        resultMessage.style.color = 'green';
        resultText = "This account seems legitimate.";
    }

    resultMessage.textContent = resultText;

    // Send data to the backend for storage
    fetch("/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, followers, posts }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log("Data stored with ID:", data.id);
            } else {
                console.error("Error storing data:", data.error);
            }
        })
        .catch(err => console.error("Error:", err));
}

