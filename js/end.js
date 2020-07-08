const username = document.getElementById("username")
const saveScoreBtn = document.getElementById("saveScoreBtn")
const finalScore = document.getElementById("finalScore")
const mostRecentScore = localStorage.getItem("mostRecentScore")

// Saving highScores in local storage
const highScores = JSON.parse(localStorage.getItem("highScores")) || []
const MAX_HIGH_SCORES = 5

// Showing the final score
finalScore.innerText = mostRecentScore

// SaveScoreBtn is disabled unless there's a value in the username input
username.addEventListener("keyup", () => {
  // console.log(username.value)
  saveScoreBtn.disabled = !username.value
})

// Highscore button
saveHighScore = (e) => {
  e.preventDefault()

  const score = {
    score: mostRecentScore,
    name: username.value
  }
  highScores.push(score)
  highScores.sort( (a, b) => b.score - a.score)
  highScores.splice(5)

  localStorage.setItem("highScores", JSON.stringify(highScores))
  window.location.assign("index.html")
}
