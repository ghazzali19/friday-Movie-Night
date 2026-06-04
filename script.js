const API_URL =
  "https://script.google.com/macros/s/AKfycbyvcnom72udi9Ck_vqgIh6px9AVlEPxoE08O2yXuto3e2JbRbuv5_buB87J_DgZAMTk/exec";

async function loadData() {
  const res = await fetch(API_URL);
  const data = await res.json();

  document.getElementById("hintA").innerText = data.movie[2];
  document.getElementById("hintB").innerText = data.movie[3];

  const votes = data.votes;

  let a = 0;
  let b = 0;

  votes.forEach((v) => {
    if (v[1] === "A") a++;
    if (v[1] === "B") b++;
  });

  document.getElementById(
    "results"
  ).innerText = `A: ${a} votes | B: ${b} votes`;
}

async function vote(choice) {
  const name = document.getElementById("name").value;

  if (!name) {
    document.getElementById("msg").innerText =
      "⚠️ Please enter your name first.";
    return;
  }

  document.getElementById("msg").innerText = "⏳ Submitting your vote...";

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

    document.getElementById(
      "msg"
    ).innerText = `✅ Thank you ${name}! Your vote for Movie ${choice} has been submitted.`;

    loadData();
  } catch (error) {
    document.getElementById("msg").innerText =
      "❌ Error submitting vote. Please try again.";
  }
}

async function suggest() {
  const name = document.getElementById("name").value;
  const movie = document.getElementById("movie").value;
  const reason = document.getElementById("reason").value;

  if (!movie) {
    document.getElementById("msg").innerText =
      "⚠️ Please enter a movie suggestion.";
    return;
  }

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
      "✅ Suggestion sent successfully!";

    document.getElementById("movie").value = "";
    document.getElementById("reason").value = "";
  } catch (error) {
    document.getElementById("msg").innerText = "❌ Error sending suggestion.";
  }
}

loadData();
setInterval(loadData, 5000);
