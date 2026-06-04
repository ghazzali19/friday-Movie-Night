const API_URL =
  "https://script.google.com/macros/s/AKfycbyvcnom72udi9Ck_vqgIh6px9AVlEPxoE08O2yXuto3e2JbRbuv5_buB87J_DgZAMTk/exec";

async function loadData() {
  const res = await fetch(API_URL);

  const data = await res.json();

  document.getElementById("hintA").innerText = data.movie[2];

  document.getElementById("hintB").innerText = data.movie[3];

  const votes = data.votes;

  let a = 0,
    b = 0;

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
    document.getElementById("msg").innerText = "Enter your name first";

    return;
  }

  const res = await fetch(API_URL, {
    method: "POST",

    body: JSON.stringify({
      action: "vote",

      name,

      vote: choice
    })
  });

  const data = await res.json();

  document.getElementById("msg").innerText = data.message;

  loadData();
}

async function suggest() {
  const name = document.getElementById("name").value;

  const movie = document.getElementById("movie").value;

  const reason = document.getElementById("reason").value;

  await fetch(API_URL, {
    method: "POST",

    body: JSON.stringify({
      action: "suggest",

      name,

      movie,

      reason
    })
  });

  document.getElementById("msg").innerText = "Suggestion sent!";
}

loadData();

setInterval(loadData, 5000);
function showAdmin() {
  document.getElementById("adminPanel").style.display = "block";
}

function login() {
  const pass = document.getElementById("adminPass").value;

  if (pass === "movieadmin2026") {
    document.getElementById("adminContent").style.display = "block";
    loadAdminData();
  } else {
    alert("Wrong password");
  }
}
function loadAdminData() {
  fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      // votes
      document.getElementById("voteList").innerHTML = data.votes
        .map((v) => `<p>${v[0]} → ${v[1]}</p>`)
        .join("");

      // suggestions
      document.getElementById("suggestList").innerHTML = data.suggestions
        .map((s) => `<p>${s[0]} → ${s[1]} (${s[2]})</p>`)
        .join("");
    });
}
async function updateHints() {
  const hintA = document.getElementById("newHintA").value;
  const hintB = document.getElementById("newHintB").value;

  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "updateHints",
      hintA,
      hintB
    })
  });

  const data = await res.json();

  document.getElementById("msg").innerText = data.message;
  loadData();
}
async function resetVotes() {
  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "resetVotes"
    })
  });

  alert("Votes reset");
  loadData();
}