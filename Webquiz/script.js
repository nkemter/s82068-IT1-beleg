//Idee dafür, das nicht bloß erster Button richtig ist 
//neues feld in json und button mit richtiger zuerst randomisiert belegen und dann den rest 

let topicSaver = null
let integerSaver = null
let numberOfAnswersClicked = 0
let rightAnswerClickedVariable = 0
let wrongAnswerClickedVariable = 0
let alreadyUsedQuestions= []  
let randomInteger = -1
const bar = document.getElementById("Bar")
const statscontainer = document.getElementById("stats-container")
const inhaltcontainer = document.getElementById("inhaltcontainer")
const label1 = document.getElementById("label-1")
const label2 = document.getElementById("label-2")
const btn9 = document.getElementById("btn-9")
btn9.addEventListener("click", restartClicked)
//AJAX
const email = "s82068@htw-dresden.de"
const password = "secret"
let randomQuizID

//Themen
const btn1 = document.getElementById("btn-1") //Mathe
const btn2 = document.getElementById("btn-2") //Internettechnologien
const btn3 = document.getElementById("btn-3") //Allgemein
const btn4 = document.getElementById("btn-4") //Noten
btn1.addEventListener("click", topicButtonClicked)
btn2.addEventListener("click", topicButtonClicked)
btn3.addEventListener("click", topicButtonClicked)
btn4.addEventListener("click", topicButtonClicked)
//Antworten
const btn5 = document.getElementById("btn-5")
const btn6 = document.getElementById("btn-6")
const btn7 = document.getElementById("btn-7")
const btn8 = document.getElementById("btn-8")
btn5.addEventListener("click", answerButtonClicked)
btn6.addEventListener("click", answerButtonClicked)
btn7.addEventListener("click", answerButtonClicked)
btn8.addEventListener("click", answerButtonClicked)

//wählt Thema aus
//themenwechsel ist erlaubt, aber dann wird statistik unterbrochen 
function topicButtonClicked(element){
  const pressedButtonTopic = element.currentTarget
  if(topicSaver != null){
    alert("Das aktuelle Quiz muss erst beendet werden, bevor du ein weiter beginnen darfst!")
    return
  }

  if(pressedButtonTopic == btn1){
    const selectedTopic = quizQuestion["teil-mathe"]
    loadPossibleQuestions(selectedTopic)
  } 
  else if(pressedButtonTopic == btn2){
    const selectedTopic = quizQuestion["teil-internettechnologien"]
    loadPossibleQuestions(selectedTopic)
  } 
  else if (pressedButtonTopic == btn3){ 
    const selectedTopic = quizQuestion["teil-allgemein"]
    loadPossibleQuestions(selectedTopic)
  }
  else if(pressedButtonTopic == btn4){
    const selectedTopic = quizQuestion["online-fragen"]
    loadPossibleQuestionsREST()
    
  }
}

function loadPossibleQuestionsREST() {
  topicSaver = "online-fragen"
  console.log(topicSaver)
  randomQuizID = Math.floor((Math.random() * 4) +70) //Zahl noch noch nicht richtig     74, 73, 72,71, 70
  let url = 'https://irene.informatik.htw-dresden.de:8888/api/quizzes/' + randomQuizID.toString()
  let xhr = new XMLHttpRequest();
  //while(xhr.readyState == 4){
    xhr.open('GET', url, false);
    xhr.setRequestHeader("Authorization", "Basic " + window.btoa(email+":"+password))
    xhr.send()
    console.log("request hoffentlich gesendet")
    console.log(xhr.responseText)
  //}
  let resultJSON = JSON.parse(xhr.responseText)
  label1.innerHTML = resultJSON.text
  btn5.innerHTML = resultJSON.options[0]
  btn6.innerHTML = resultJSON.options[1]
  btn7.innerHTML = resultJSON.options[2]
  btn8.innerHTML = resultJSON.options[3]
  console.log(topicSaver)
  
}

//lädt fragen
//atm kann selbe frage nochmal geladen werden
function loadPossibleQuestions(selectedTopic){
  randomInteger = Math.floor(Math.random() * selectedTopic.length)
  topicSaver = selectedTopic
  if(topicSaver == quizQuestion["teil-mathe"]){
    const questionString = "$$" + topicSaver[randomInteger].a + "$$" 
    const renderedQuestions = []
    for(let i = 0; i<=3; i++){
      renderedQuestions[i] = "$$" + topicSaver[randomInteger].l[i] + "$$"
    }
    label1.innerHTML = questionString
    btn5.innerHTML = renderedQuestions[0]
    btn6.innerHTML = renderedQuestions[1]
    btn7.innerHTML = renderedQuestions[2]
    btn8.innerHTML = renderedQuestions[3]
    renderMathInElement(document.body, {
      delimiters: [
          {left: "$$", right: "$$", display: true},
          {left: "$", right: "$", display: false},
          {left: "\(", right: "\)", display: false},
          {left: "\[", right: "\]", display: true},
          {left: "\begin{equation}", right: "\end{equation}", display: true}
      ]
  });
  } else{
    const questionString = topicSaver[randomInteger].a
    label1.innerHTML = questionString
    btn5.innerHTML = topicSaver[randomInteger].l[0]
    btn6.innerHTML = topicSaver[randomInteger].l[1]
    btn7.innerHTML = topicSaver[randomInteger].l[2]
    btn8.innerHTML = topicSaver[randomInteger].l[3]
  }
}


//ein antwortknopf wurde gedrückt -> entscheiden, ob richtig oder nicht + neue frage
function answerButtonClicked(element){ 
  //die farbe noch als funktion schreiben
  //atm immer antwort bei 1 button als richtig
  const pressedButton = element.currentTarget
  let pressedButtonAsInt = null
  if(topicSaver === null){
    return
  } 
  if(topicSaver === "online-fragen"){
    if(pressedButton == btn5){
      console.log("btn5")
      pressedButtonAsInt = 0
    } else if (pressedButton == btn6){
      console.log("btn6")
      pressedButtonAsInt = 1
    } else if (pressedButton == btn7){
      pressedButtonAsInt = 2
    } else {
      pressedButtonAsInt = 3
    }
    console.log("helleeloeoeo" + pressedButtonAsInt)
    sendButtonPressedToServerAndRecieveAnswer(pressedButtonAsInt, pressedButton)
    return
  }
  
  if(pressedButton == btn5){
    rightAnswerClickedFunction(btn5)
  }
  else {
    wrongAnswerClickedFunction(pressedButton)
  }  
}


//richtige antwort -> button wird grün und nächste frage wird geladen
function rightAnswerClickedFunction(btn5){
  btn5.style.backgroundColor = 'green' 
  disableAnswerButtons() 
  setTimeout(function(){
    btn5.style.backgroundColor = ''
    loadPossibleQuestions(topicSaver)
    activateAnswerButtons()
  }, 1000);
  numberOfAnswersClicked++
  rightAnswerClickedVariable++
  moveProgressBar()
  checkIfEnoughAnswers()
}

//falscher button gedrückt -> farben werden angezeigt und nächste frage wird geladen
function wrongAnswerClickedFunction(pressedButton){
  btn5.style.backgroundColor = 'green'
  pressedButton.style.backgroundColor = 'red'
  disableAnswerButtons()
  setTimeout(function(){
    btn5.style.backgroundColor = ''
    pressedButton.style.backgroundColor = ''
    activateAnswerButtons() //buttons (und ihre angehängten funktionen) funktionieren erst wieder, wenn sie wieder aktiviert sind
    loadPossibleQuestions(topicSaver)
  }, 1000);
  numberOfAnswersClicked++
  wrongAnswerClickedVariable++
  moveProgressBar()
  checkIfEnoughAnswers()
  
}

function checkIfEnoughAnswers(){
  if(numberOfAnswersClicked >= topicSaver.length || numberOfAnswersClicked == 5){
    loadStats()
  }
}
function sendButtonPressedToServerAndRecieveAnswer(pressedButtonAsInt, pressedButton){
  let xhr = new XMLHttpRequest();
  let url = 'https://irene.informatik.htw-dresden.de:8888/api/quizzes/'+ randomQuizID +'/solve'
  xhr.open('POST', url, false);
  xhr.setRequestHeader("Authorization", "Basic " + window.btoa(email+":"+password));
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Accept", "application/json");
  console.log("ich schicke antwort")
  //xhrCheck.onload = () => console.log(xhrCheck.responseText);
  
  let dataToSend = "["+pressedButtonAsInt+"]"
  xhr.send(dataToSend);
  console.log("ich habe antwort " + xhr.responseText)
  let resultJSON = JSON.parse(xhr.responseText)
  if(resultJSON.success == false){
    pressedButton.style.backgroundColor = 'red'
    //richtige anwort wird atm nicht gezeigt, da dafür neue abfragen nötig wären 
    wrongAnswerClickedVariable++ 
    numberOfAnswersClicked++
    disableAnswerButtons()
    moveProgressBar()
    
    setTimeout(function(){
      console.log("timeout ")
      pressedButton.style.backgroundColor = ''
      activateAnswerButtons() //buttons (und ihre angehängten funktionen) funktionieren erst wieder, wenn sie wieder aktiviert sind
      loadPossibleQuestionsREST(topicSaver)
    }, 1000);
    checkIfEnoughAnswers()
  }
  else { 
    pressedButton.style.backgroundColor = 'green'
    rightAnswerClickedVariable++
    numberOfAnswersClicked++
    moveProgressBar()
    
    setTimeout(function(){
      pressedButton.style.backgroundColor = ''
      activateAnswerButtons() //buttons (und ihre angehängten funktionen) funktionieren erst wieder, wenn sie wieder aktiviert sind
      loadPossibleQuestionsREST(topicSaver)
    }, 1000);
    checkIfEnoughAnswers()
  }
}

function moveProgressBar(){
  let intProgress
  if(topicSaver === "online-fragen"){
    intProgress = (numberOfAnswersClicked / 5) * 100
  } else {
    intProgress = (numberOfAnswersClicked / topicSaver.length) * 100
  }
  bar.style.width = intProgress + "%"
}

function loadStats(){ 
  statscontainer.classList.remove("hide")
  inhaltcontainer.classList.add("hide")
  let statsString = null
  if(topicSaver != "online-fragen"){
    statsString = "Du hast " + rightAnswerClickedVariable + " richtige Antworten und " + wrongAnswerClickedVariable +  " falsche Antworten, bei insgesamt "+ topicSaver.length +" Fragen."
  } else {
    statsString = "Du hast " + rightAnswerClickedVariable + " richtige Antworten und " + wrongAnswerClickedVariable +  " falsche Antworten, bei insgesamt "+ numberOfAnswersClicked++ +" Fragen."
  }

  label2.innerHTML = statsString
}

function disableAnswerButtons(){
  btn5.disabled = true
  btn6.disabled = true
  btn7.disabled = true
  btn8.disabled = true
}

function activateAnswerButtons(){
  btn5.disabled = false
  btn6.disabled = false
  btn7.disabled = false
  btn8.disabled = false
}

function restartClicked(){
  statscontainer.classList.add("hide")
  inhaltcontainer.classList.remove("hide")
  bar.style.width= "0%"
  label1.innerHTML= "Bitte klick ein Thema an!"
  topicSaver = null
  integerSaver = null 
  index = 0
  alreadyUsedQuestions= []
  numberOfAnswersClicked = 0
  rightAnswerClickedVariable = 0
  wrongAnswerClickedVariable = 0
  activateAnswerButtons()//fixt ein bug, dass answerbutton deaktiviert sind
  btn5.innerHTML = "A"
  btn6.innerHTML = "B"
  btn7.innerHTML = "C"
  btn8.innerHTML = "D"
}


const quizQuestion = { 
    "teil-mathe": [
      {"a":"(x^2)+(x^2)", "l":["2x^2","x^4","x^8","2x^4"]},
      {"a":"x^2*x^2", "l":["x^4","x^2","2x^2","4x"]},
      {"a":"(x^2)*(x^3)", "l":["x^2*x^3","x^5","5x","x^6"]},
      {"a":"77+33", "l":["110","100", "103", "2541"]}
      ],
    "teil-internettechnologien": [
      {"a":"Welche Authentifizierung bietet HTTP", "l":["Digest Access Authentication","OTP","OAuth","2-Faktor-Authentifizierung"]},
      {"a":"Welches Transportprotokoll eignet sich für zeitkritische Übertragungen", "l":["UDP","TCP","HTTP","Fast Retransmit"]},
      {"a":"Wann begann das Internet?", "l":["1969"," 1950","1970","2000"]},
      {"a":"Wie viele Menschen haben 2021 Internetzugang?", "l":["4,1 Milliarden", "6 Milliarden", "2 Milliarden", "3,4 Milliarden"]}
      ],
    "teil-allgemein": [
      {"a":"Karl der Große, Geburtsjahr", "l":["747","828","650","1150"]},
      {"a":"Wer ist der aktuelle Schachweltmeister?", "l":["Magnus Carlsen","Hikaru Nakamura","Ding Liren","Fabiano Caruana"]},
      {"a":"In welchem Land hat Deutschland 2014 die Fußball-WM gewonnen?", "l":["Brasilien", "Frankreich", "Katar",]},
      {"a":"Wer ist der aktuelle Bundeskanzler von Deutschland?", "l":["Olaf Scholz","Christian Lindner","Angela Merkel","Friedrich Merz"]}
      ]   
  }


//TODO
//wenn Grün/rot bei button ist schrift schlecht zu lesen
//selectedtopic zu topicsaver umcoden 
//richtige antwort bei REST anzeigen
//button verschieben sich bei unterschiedlich langen fragen z.T.
//code besser strukturieren (funktionen)
//fragen bei lokal und rest nicht doppeln
//bei lokalen fragen nicht immer feld A richtig haben, sondern random
