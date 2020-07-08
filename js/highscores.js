const highScoresList = document.getElementById("highScoresList")
const highScores  = JSON.parse(localStorage.getItem("highScores")) || []

// Display the high scores on the page
highScoresList.innerHTML =
  highScores.map( score => {
  return `<li class="high-score">${score.name} - ${score.score}</li>`
}).join("")
