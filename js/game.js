const question = document.getElementById("question")
const choices = Array.from(document.getElementsByClassName("choice-text"))
const progressText = document.getElementById("progressText")
const scoreText = document.getElementById("score")
const progressBarFull = document.getElementById("progressBarFull")
const loader = document.getElementById("loader")
const game = document.getElementById("game")

let currentQuestion = {}
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = []

let questions = [];

// Fetch Questions API
fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple")
  .then( res => {
    return res.json()
  })
  .then( loadedQuestions => {
    // console.log( loadedQuestions.results )

    // Iterating through the Questions API Array
    questions = loadedQuestions.results.map( loadedQuestion => {
      const formattedQuestion = {
        question: loadedQuestion.question
      }

      const answerChoices = [ ...loadedQuestion.incorrect_answers]
      formattedQuestion.answer = Math.floor(Math.random() * 3) +1
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestion.correct_answer
      )

      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice
      })

      return formattedQuestion
    })
    // questions = loadedQuestions
    startGame()
  })
  .catch( err => {
    console.error(err)
  })

// Constants
const CORRECT_BONUS = 10
const MAX_QUESTIONS = 10

startGame = () => {
  questionCounter = 0
  score = 0
  availableQuestions = [...questions]
  // console.log(availableQuestions)
  getNewQuestions()
  game.classList.remove("hidden")
  loader.classList.add("hidden")
}

getNewQuestions = () => {

  if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    // Save the user's score
    localStorage.setItem('mostRecentScore', score)
    // Go to the End page
    window.location.assign("end.html")
  }
  questionCounter++
  // Display the Question # / Total Questions
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`

  // Update the progress Bar
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`

  const questionIndex = Math.floor(Math.random() * availableQuestions.length)
    currentQuestion = availableQuestions[questionIndex]
    question.innerText = currentQuestion.question

    choices.forEach( choice => {
      const number = choice.dataset['number']
      choice.innerText = currentQuestion['choice' + number]
    })

    availableQuestions.splice(questionIndex, 1)
    acceptingAnswers = true
}

choices.forEach(choice => {
  choice.addEventListener("click", e => {
    // console.log(e.target)
    if(!acceptingAnswers) return

    acceptingAnswers = false
    const selectedChoice = e.target
    const selectedAnswer = selectedChoice.dataset["number"]

    // const classToApply = 'incorrect'
    //   if (selectedAnswer == currentQuestion.answer) {
    //     classToApply = 'correct'
    //   }

    // OR use a turnary operator like so:
    const classToApply =
      selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect'

      if(classToApply === 'correct') {
        incrementScore(CORRECT_BONUS)
      }
    selectedChoice.parentElement.classList.add(classToApply)

    setTimeout( () => {
      selectedChoice.parentElement.classList.remove(classToApply)
      getNewQuestions()
    }, 1000)

    // console.log(classToApply)
    // console.log(selectedAnswer == currentQuestion.answer)
  })
})

incrementScore = num => {
  score += num
  scoreText.innerText = score
}
