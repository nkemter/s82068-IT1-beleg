//erstellen der Verbindung aus HTML und JS
let topicSaver
let selectedTopic
let integerSaver 
let numberOfAnswersClicked = 0
let rightAnswerClickedVariable = 0
let wrongAnswerClickedVariable = 0
let alreadyUsedQuestions= []  
let orderOfQuestions = []
let resultJSON
let randomInteger = -1
let randomInt
let questionIndex = 0
let NUMBER_OF_QUESTIONS_REST
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
//dies wird benötigt, damit später die richtigen fragen geladen werden
function topicButtonClicked(element){
  const pressedButtonTopic = element.currentTarget
   //geht sicher, dass ein thema ausgewählt ist und dass der rest dann auch funktionieren kann
  if(topicSaver != null){
    alert("Das aktuelle Quiz muss erst beendet werden, bevor du ein weiter beginnen darfst!")
    return
  }
  //speichert das thema in variabeln
  //es werden die fragen randomized und danach werden die fragen geladen
  if(pressedButtonTopic == btn1){
    selectedTopic = quizQuestion["teil-mathe"]
    shuffleQuestions(selectedTopic)
    loadPossibleQuestions(selectedTopic)
  } 
  else if(pressedButtonTopic == btn2){
    selectedTopic = quizQuestion["teil-internettechnologien"]
    shuffleQuestions(selectedTopic)
    loadPossibleQuestions(selectedTopic)
  } 
  else if (pressedButtonTopic == btn3){ 
    selectedTopic = quizQuestion["teil-allgemein"]
    shuffleQuestions(selectedTopic)
    loadPossibleQuestions(selectedTopic)
  }
  else if(pressedButtonTopic == btn4){
    selectedTopic = quizQuestion["online-fragen"]
    NUMBER_OF_QUESTIONS_REST = 5
    shuffleQuestionsREST()
    loadPossibleQuestionsREST()
  }
}

//diese funktion tauscht, nachdem ein thema festgelegt wurde, zu erst die reihenfolge der fragen 
//und danach tauscht es die antwortmöglichkeiten im button

function shuffleQuestions(selectedTopic){
  
  let shuffledQuestionJSON = selectedTopic
  let questionTemp //prinzipiell bräuchte man bloß eine temp variable, ist aber so übersichtlicher
  let answerTemp
  let randomInt2 
  
  //zuerst werden die fragen getauscht
  for(let i = 0; i <= shuffledQuestionJSON.length - 1; i++){
    questionTemp = shuffledQuestionJSON[i]
    randomInt = Math.floor(Math.random() * shuffledQuestionJSON.length)
    //es ist quasi ein normaler dreieckstausch über eine temp variable
    shuffledQuestionJSON[i] = shuffledQuestionJSON[randomInt] 
    shuffledQuestionJSON[randomInt] = questionTemp

    //auch hier ist es ein normaler dreieckstausch über eine temp variable
    //bloß das hier noch die richtige antwort mit erhalten bleiben muss. dies passiert im if teil
    //-> feld der richtigen antwort wird verschoben -> lösungsfeld auch
    for(let j = 0; j <= shuffledQuestionJSON[randomInt].l.length -1; j++){
      answerTemp = shuffledQuestionJSON[randomInt].l[j]
      randomInt2 = Math.floor(Math.random() * shuffledQuestionJSON[randomInt].l.length)
      if(j == shuffledQuestionJSON[randomInt].c){
        shuffledQuestionJSON[randomInt].c = randomInt2
      } else if (shuffledQuestionJSON[randomInt].c == randomInt2){
        shuffledQuestionJSON[randomInt].c = j 
      }
      shuffledQuestionJSON[randomInt].l[j] = shuffledQuestionJSON[randomInt].l[randomInt2]
      shuffledQuestionJSON[randomInt].l[randomInt2] = answerTemp
    }
  }
  console.log(selectedTopic[randomInt].c)
  return
}

//die fragen und antworten aus der nächsten funktion müssen einzeln randomized werden, da es anders ist als lokal 
function shuffleQuestionsREST(){
  let i = 0
  while(NUMBER_OF_QUESTIONS_REST > i) {  //erstellt eine zufällige liste, wie die fragen abgerbeitet werden
    let randomInt3 = Math.floor((Math.random() * 5) +70)
    if(!orderOfQuestions.includes(randomInt3)){ //wenn randomInt3 nicht in array, dann kommt es rein, wenn schon drin
      orderOfQuestions[i] = randomInt3  //dann schleife solange bis eine zahl, die noch nicht drinnen ist
      i++   //wird maximal so oft ausgeführt, wie es fragen gibt
    }
  }
}

//züfallige anordnung der antwort, leider wird hier die richtige lösung gespeichert, da die info nicht verfügbar
//die antwort wird später geprüft
function shuffleAnswersREST(){
  let i = 0 
  while(i < 4){ //4 ist anzahl der antwortmöglichkeiten
    let randomInt4 = Math.floor((Math.random() * 4))
    let answerTemp
    answerTemp = shuffledResultJSON.options[randomInt4]   //tauscht die antworten   
    shuffledResultJSON.options[randomInt4] =  shuffledResultJSON.options[i] //bsp  feld 0 tauscht mit randomInt4 
    shuffledResultJSON.options[i] = answerTemp         //im nächsten schleifendurchlauf tauscht feld 1 mit randomInt4
    i++                                                //so wird ein feld mindestens einmal getauscht werden
  }
}

//holt sich die fragen vom server und befüllt damit das label und die button
function loadPossibleQuestionsREST() {
  topicSaver = "online-fragen"
  selectedTopic = "online-fragen"
  //bereitet die ajax abfrage vor als HMTL Request
  //der request braucht einen genauen aufbau, welcher auf der in der dokumentation angegeben wird
  randomQuizID = orderOfQuestions[questionIndex] //lädt aus der zufälligen reihenfolge-array eine frage
  let url = 'https://irene.informatik.htw-dresden.de:8888/api/quizzes/' + randomQuizID.toString() //url des servers mit Fragen ID
  let xhr = new XMLHttpRequest();
    xhr.open('GET', url, false); 
    xhr.setRequestHeader("Authorization", "Basic " + window.btoa(email+":"+password)) 
    xhr.send() //schickt ajax ab
  shuffledResultJSON = JSON.parse(xhr.responseText) //lädt antwort in json und danach in label und button
                                                   //die ursprüngliche antwort ist ein string in form eines json, welches umgewandelt wird
  resultJSON = JSON.parse(xhr.responseText) //die antworten werden nochmal in ein anderes json geladen, damit dann später
                                            //ein vergleich der richtigen antworten stattfinden kann in (compareGivenAnswerWithOrderBefore)
  label1.innerHTML = shuffledResultJSON.text
  shuffleAnswersREST() //antwortbutton werden zufällig angeordnert im json
  btn5.innerHTML = shuffledResultJSON.options[0] //belädt die fragen aus den zufällig angeordneten json
  btn6.innerHTML = shuffledResultJSON.options[1]
  btn7.innerHTML = shuffledResultJSON.options[2]
  btn8.innerHTML = shuffledResultJSON.options[3] 
}



//lädt fragen aus lokalen json und befüllt damit das label und die button
function loadPossibleQuestions(selectedTopic){
  //randomInteger = Math.floor(Math.random() * selectedTopic.length)
  topicSaver = selectedTopic
  //diese funktion und die speziellen string werden hier benötigt damit die 
  //mathe fragen "mathematisch" angezeigt werden, dafür müssen die antworten und frage in "$$" eingeschlossen werden
  if(topicSaver == quizQuestion["teil-mathe"]){
    const questionString = "$$" + selectedTopic[questionIndex].a + "$$" 
    const renderedQuestions = []
    for(let i = 0; i<=3; i++){
      renderedQuestions[i] = "$$" + selectedTopic[questionIndex].l[i] + "$$" //frage, die laut random liste dran ist, 
    }                                                   //bekommt seine bereits zufälligen fragen für katex vorbereitet
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
    const questionString = selectedTopic[questionIndex].a //frage, die laut random liste dran ist, bekommt seine random fragen in button
    label1.innerHTML = questionString
    btn5.innerHTML = selectedTopic[questionIndex].l[0]
    btn6.innerHTML = selectedTopic[questionIndex].l[1]
    btn7.innerHTML = selectedTopic[questionIndex].l[2]
    btn8.innerHTML = selectedTopic[questionIndex].l[3]    
  }
}


//ein antwortknopf wurde gedrückt -> entscheiden, ob richtig oder nicht + neue frage
//funktioniert bloß bei lokalen fragen. das prinzip wird aber auch bei ajax wiederverendet 
function answerButtonClicked(element){ 
  const pressedButton = element.currentTarget
  let pressedButtonAsInt = null
  //geht sicher, dass ein thema ausgewählt ist und dass der rest dann auch funktionieren kann
  if(topicSaver === null){
    return
  } 
  //je nach online und lokal werden unterschiedliche funktionen nach dem anklicken eines buttons aufgerufen, da
  //sich sich die "reaktionen" leicht unterscheiden
  if(topicSaver === "online-fragen"){
    //bei online fragen muss sich die antwort kurz gemerkt werden, damit diese an den server geschickt werden kann
    //hier als int (eigentlich string), damit es in die url eingefügt werden kann 
    if(pressedButton == btn5){
      pressedButtonAsInt = 0
    } else if (pressedButton == btn6){
      pressedButtonAsInt = 1
    } else if (pressedButton == btn7){
      pressedButtonAsInt = 2
    } else {
      pressedButtonAsInt = 3
    }
    sendButtonPressedToServerAndRecieveAnswer(pressedButtonAsInt, pressedButton) //hier wird die antwort ausgewertet
    return
  } else{
    if(pressedButton.innerHTML == selectedTopic[questionIndex].c){
      console.log("richtige antwort")
      rightAnswerClickedFunction(pressedButton)
    } else{
      console.log("falsche antwort")
      wrongAnswerClickedFunction(pressedButton)
    } 
  }
}


//richtige antwort angeklickt -> button wird grün und nächste frage wird nach einer sekunde geladen 
//und button werden wieder normal
function rightAnswerClickedFunction(pressedButton){
  pressedButton.style.backgroundColor = 'green' 
  disableAnswerButtons() //damit nicht mehrere fragen als beantwortet zählen, obwohl es eigentlich bloß 1 war
  setTimeout(function(){ //damit man sich die richtige antwort anschauen kann, wird die nächste frage nach einer sekunde geladen
    pressedButton.style.backgroundColor = ''
    loadPossibleQuestions(topicSaver)
    activateAnswerButtons()
  }, 1000);
  //außerdem wird die progress bar aktualisiert und für die statistik der index für richtige fragen hochgesetzt
  numberOfAnswersClicked++
  rightAnswerClickedVariable++
  questionIndex++
  moveProgressBar()
  //außerdem checkt es, ob "genug" fragen beantwortet wurden sind und wenn ja lädt es die statistik
  checkIfEnoughAnswers()
}

//falscher antwort gedrückt 
//funktional genau wie bei den richtigen antworten, bloß das hier die falsche antwort hochgezählt wird
function wrongAnswerClickedFunction(pressedButton){
  //pressedButton.style.backgroundColor = 'green' wenn richtiges erkannt, dann muss es grün sein 
  pressedButton.style.backgroundColor = 'red'
  disableAnswerButtons() 
  setTimeout(function(){
    pressedButton.style.backgroundColor = ''
    pressedButton.style.backgroundColor = ''
    activateAnswerButtons() //buttons (und ihre angehängten funktionen) funktionieren erst wieder, wenn sie wieder aktiviert sind
    loadPossibleQuestions(topicSaver)
  }, 1000);
  numberOfAnswersClicked++
  wrongAnswerClickedVariable++
  questionIndex++
  moveProgressBar()
  checkIfEnoughAnswers()
}

//wenn entweder keine fragen mehr im lokalen json sind oder 5 fragen beantwortet wurden, wird die statistik geladen
function checkIfEnoughAnswers(){
  if(numberOfAnswersClicked >= topicSaver.length || numberOfAnswersClicked == 5){
    loadStats()
  }
}


function sendButtonPressedToServerAndRecieveAnswer(pressedButtonAsInt, pressedButton){
  //abfrage der angeklickten antwort wird vorbereitet
  pressedButtonAsInt = compareGivenAnswerWithOrderBefore(pressedButton)
  let xhr = new XMLHttpRequest();
  let url = 'https://irene.informatik.htw-dresden.de:8888/api/quizzes/'+ randomQuizID +'/solve' //damit immer zufälliges quiz genommen wird
  xhr.open('POST', url, false);
  xhr.setRequestHeader("Authorization", "Basic " + window.btoa(email+":"+password));
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Accept", "application/json");
  let dataToSend = "["+pressedButtonAsInt+"]" //die antwort muss bestimmt eingepacht werden, damit der server es annimmt
  xhr.send(dataToSend); //abfrage wird gesendet
  let resultJSON = JSON.parse(xhr.responseText)
  //wenn antwort falsch ist, dann tut es vom prinzip, dass gleiche wie bei lokal, bloß ohne die richtige antwort zu zeigen
  // -> bewegt progress bar, zählt richtig/falsch und beendet evtl quiz
  disableAnswerButtons()

  if(resultJSON.success == false){
    pressedButton.style.backgroundColor = 'red'
    //richtige anwort wird atm nicht gezeigt, da dafür neue abfragen nötig wären 
    wrongAnswerClickedVariable++ 
    numberOfAnswersClicked++
    disableAnswerButtons()
    moveProgressBar()
    questionIndex++ 
    setTimeout(function(){
      pressedButton.style.backgroundColor = ''
      activateAnswerButtons() //buttons (und ihre angehängten funktionen) funktionieren erst wieder, wenn sie wieder aktiviert sind
      loadPossibleQuestionsREST()
    }, 1000);
    checkIfEnoughAnswers()
  }
  else { 
    pressedButton.style.backgroundColor = 'green'
    rightAnswerClickedVariable++
    numberOfAnswersClicked++
    moveProgressBar()
    questionIndex++ 
    console.log("richtig")
    setTimeout(function(){
      pressedButton.style.backgroundColor = ''
      activateAnswerButtons() //buttons (und ihre angehängten funktionen) funktionieren erst wieder, wenn sie wieder aktiviert sind
      loadPossibleQuestionsREST()
    }, 1000);
    checkIfEnoughAnswers()
  }
  
}

function compareGivenAnswerWithOrderBefore(pressedButton){
  let index =0
  while(true){
    if(pressedButton.innerHTML == resultJSON.options[index]){
      return index
    }
    index++
  }
}

//Progressbar, stellt den Fortschritt dar
function moveProgressBar(){
  let intProgress
  if(topicSaver === "online-fragen"){
    intProgress = (numberOfAnswersClicked / 5) * 100
  } else {
    intProgress = (numberOfAnswersClicked / topicSaver.length) * 100
  }
  bar.style.width = intProgress + "%"
}

//statistikfunktion. hier wird der fragen teil versteckt und durch eine neue div mit der statistik ersetzt
function loadStats(){ 
  statscontainer.classList.remove("hide")
  inhaltcontainer.classList.add("hide")
  btn9.disabled = true
  let statsString = null
  if(topicSaver != "online-fragen"){
    statsString = "Du hast " + rightAnswerClickedVariable + " richtige Antworten und " + wrongAnswerClickedVariable +  " falsche Antworten, bei insgesamt "+ topicSaver.length +" Fragen."
  } else {
    statsString = "Du hast " + rightAnswerClickedVariable + " richtige Antworten und " + wrongAnswerClickedVariable +  " falsche Antworten, bei insgesamt "+ numberOfAnswersClicked++ +" Fragen."
  }
  label2.innerHTML = statsString
  setTimeout(function(){
    btn9.disabled = false
  }, 1500);
}

//deaktiveren der button, damit es zu keinen bugs kommt
function disableAnswerButtons(){
  btn5.disabled = true
  btn6.disabled = true
  btn7.disabled = true
  btn8.disabled = true
}
//... und das aktiveren der button, damit das quiz weitergehen kann
function activateAnswerButtons(){
  btn5.disabled = false
  btn6.disabled = false
  btn7.disabled = false
  btn8.disabled = false
}


//wenn am ende der neustart button gedrückt wurde, werden die "zähler" und andere elemente wieder auf anfang gesetzt 
//die fragen erscheinen wieder und die statistik verschwindet 
function restartClicked(){
  statscontainer.classList.add("hide")
  inhaltcontainer.classList.remove("hide")
  bar.style.width= "0%"
  label1.innerHTML= "Bitte klick ein Thema an!"
  topicSaver = null
  integerSaver = null 
  numberOfAnswersClicked = 0
  rightAnswerClickedVariable = 0
  wrongAnswerClickedVariable = 0
  questionIndex = 0
  orderOfQuestions = []
  activateAnswerButtons()//fixt ein bug, dass answerbutton deaktiviert sind
  btn5.innerHTML = "A"
  btn6.innerHTML = "B"
  btn7.innerHTML = "C"
  btn8.innerHTML = "D"
}

//lokale fragen
const quizQuestion = { 
    "teil-mathe": [
      {"a":"(x^2)+(x^2)", "l":["2x^2","x^4","x^8","2x^4"],"c":"2x^2"},
      {"a":"x^2*x^2", "l":["x^4","x^2","2x^2","4x"],"c":"x^4"},
      {"a":"(x^2)*(x^3)", "l":["x^2*x^3","x^5","5x","x^6"],"c":"x^2*x^3"},
      {"a":"77+33", "l":["110","100", "103", "2541"],"c":"110"}
      ],
    "teil-internettechnologien": [
      {"a":"Welche Authentifizierung bietet HTTP", "l":["Digest Access Authentication","OTP","OAuth","2-Faktor-Authentifizierung"],"c":"0"},
      {"a":"Welches Transportprotokoll eignet sich für zeitkritische Übertragungen", "l":["UDP","TCP","HTTP","Fast Retransmit"],"c":"0"},
      {"a":"Wann begann das Internet?", "l":["1969"," 1950","1970","2000"],"c":"0"},
      {"a":"Wie viele Menschen haben 2021 Internetzugang?", "l":["4,1 Milliarden", "6 Milliarden", "2 Milliarden", "3,4 Milliarden"],"c":"0"}
      ],
    "teil-allgemein": [
      {"a":"Karl der Große, Geburtsjahr", "l":["747","828","650","1150"],"c":"747"},
      {"a":"Wer ist der aktuelle Schachweltmeister?", "l":["Magnus Carlsen","Hikaru Nakamura","Ding Liren","Fabiano Caruana"],"c":"Magnus Carlsen"},
      {"a":"In welchem Land hat Deutschland 2014 die Fußball-WM gewonnen?", "l":["Brasilien", "Frankreich", "Katar", "Deutschland"],"c":"Brasilien"},
      {"a":"Wer ist der aktuelle Bundeskanzler von Deutschland?", "l":["Olaf Scholz","Christian Lindner","Angela Merkel","Friedrich Merz"],"c":"Olaf Scholz"}
      ]   
  }


