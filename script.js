const API_URL =
  "https://script.google.com/macros/s/AKfycbyvcnom72udi9Ck_vqgIh6px9AVlEPxoE08O2yXuto3e2JbRbuv5_buB87J_DgZAMTk/exec";

// Load movie hints and live results
async function loadData() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    document.getElementById("hintA").innerText =
      data.movie?.[2] || "Movie A";

    document.getElementById("hintB").innerText =
      data.movie?.[3] || "Movie B";

    let a = 0;
    let b = 0;

    if (Array.isArray(data.votes)) {
      data.votes.forEach((v) => {
        if (v[1] === "A") a++;
        if (v[1] === "B") b++;
      });
    }

    document.getElementById(
      "results"
    ).innerText = `A: ${a} votes | B: ${b} votes`;

  } catch (error) {
    console.error(error);

    document.getElementById("hintA").innerText =
      "Unable to load";

    document.getElementById("hintB").innerText =
      "Unable to load";

    document.getElementById("results").innerText =
      "Unable to load results";
  }
}

// Vote for a movie
async function vote(choice) {
  const name = document.getElementById("name").value.trim();

  if (!name) {
    document.getElementById("msg").innerText =
      "⚠️ Please enter your name first.";
    return;
  }

  document.getElementById("msg").innerText =
    "⏳ Submitting your vote...";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "vote",
        name,
        vote: choice
      })
    });

    await res.json();

    document.getElementById("msg").innerText =
      `✅ Thank you ${name}! Your vote has been submitted successfully.`;

    loadData();

  } catch (error) {
    console.error(error);

    document.getElementById("msg").innerText =
      "❌ Failed to submit vote.";
  }
}

// Optional movie suggestion
async function suggest() {
  const name = document.getElementById("name").value.trim();
  const movie = document.getElementById("movie").value.trim();
  const reason = document.getElementById("reason").value.trim();

  // If nothing was suggested, still show success
  if (!movie) {
    document.getElementById("msg").innerText =
      "✅ No suggestion submitted. Thank you for participating!";
    return;
  }

  document.getElementById("msg").innerText =
    "⏳ Sending suggestion...";

  try {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "suggest",
        name,
        movie,
        reason
      })
    });

    document.getElementById("msg").innerText =
      "✅ Movie suggestion submitted successfully!";

    document.getElementById("movie").value = "";
    document.getElementById("reason").value = "";

  } catch (error) {
    console.error(error);

    document.getElementById("msg").innerText =
      "❌ Failed to send suggestion.";
  }
}

// Start page
loadData();
setInterval(loadData, 5000);
