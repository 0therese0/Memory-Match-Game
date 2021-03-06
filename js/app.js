// VARIABLE DECLARATIONS
const stars = document.querySelectorAll(".fa-star"),
    deck = document.getElementById("deck-of-cards"),
    restartBtn = document.querySelector('#restart'),
    playAgain = document.getElementById("replay"),
    counter = document.querySelector(".moves"),
    matchedCard = document.getElementsByClassName("match"),
    modal = document.getElementById("simpleModal"),
    closeBtn = document.getElementsByClassName("closeBtn")[0],
    timer = document.querySelector(".timer");

let card = document.getElementsByClassName("card"),
    cards = [...card],
    openedCards = [],
    moves = 0,
    second = 1,
    minute = 0,
    hour = 0,
    interval;

// MEMORY GAME INSPIRATION FROM https://scotch.io/tutorials
// FUNCTION TO SHUFFLE CARDS http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue,
        randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// CARDS ARE SHUFFLED WHEN PAGE RELOADS
document.body.onload = startGame();

// FUNCTION TO START THE GAME
function startGame() {
    // SHUFFLE CARD
    cards = shuffle(cards);
    // REMOVE ALL EXISTING CLASSES FROM EACH CARD
    for (let x = 0; x < cards.length; x++) {
        deck.innerHTML = "";
        [].forEach.call(cards, function(item) {
            deck.appendChild(item);
        });
        cards[x].classList.remove("show", "open", "match", "disabled");
    }
    // MOVE RESET
    moves = 0;
    counter.innerHTML = moves;
    // RATING RESET
    for (let x = 0; x < stars.length; x++) {
        stars[x].style.color = "#FFD700";
        stars[x].style.visibility = "visible";
    }
    // TIMER RESET
    second = 0;
    minute = 0;
    hour = 0;
    // TIMER
    let timer = document.querySelector(".timer");
    timer.innerHTML = "0 mins 0 secs";
    clearInterval(interval);
}

// FUNCTION TO CHECK IF CARDS ARE MATCHED
function cardOpen() {
    if (openedCards.length === 2){
        return;
    } else {

        // FLIP THE CARD
        this.classList.toggle("open");
        this.classList.toggle("show");
        this.classList.toggle("disabled");
        moves++;
        console.log("Moves is: " + moves); // DEBUG

        if(moves === 1) {
            startTimer();
        }
        openedCards.push(this);

        if(openedCards.length === 2) {
            moveCounter();
            if(openedCards[0].type === openedCards[1].type) {
                matched();
            } else {
                unmatched();
            }
        }
    }
}

// FUNCTION FOR WHEN CARDS ARE MATCHED
function matched() {
    setTimeout(function() {
        openedCards[0].classList.add("match", "disabled");
        openedCards[1].classList.add("match", "disabled");
        openedCards[0].classList.remove("show", "open", "no-event");
        openedCards[1].classList.remove("show", "open", "no-event");
        openedCards = [];
        enable();
    }, 500);
}

// FUNCTION FOR WHEN CARDS DON'T MATCH
function unmatched() {
    setTimeout(function() {
        openedCards[0].classList.add("unmatched");
        openedCards[1].classList.add("unmatched");
        disable();
        console.log("disabled called"); // DEBUG
    }, 500);
    setTimeout(function() {
        openedCards[0].classList.remove("show", "open", "no-event", "unmatched");
        openedCards[1].classList.remove("show", "open", "no-event", "unmatched");
        enable();
        console.log("enable called"); // DEBUG
        openedCards = [];
    }, 1000);
}

// FUNCTION TO DISABLE CARDS
function disable() {
    Array.prototype.filter.call(cards, function(card) {
        card.classList.add("disabled");
    });
}

// FUNCTION TO ENABLE CARDS AND DISABLE MATCHED CARDS
function enable() {
    console.log("enable called"); // DEBUG
    Array.prototype.filter.call(cards, function(card) {
        card.classList.remove("disabled");
        for(let x = 0; x < matchedCard.length; x++) {
            matchedCard[x].classList.add("disabled");
        }
    });
    // CHECK IF ALL CARDS ARE MATCHED
    congratulations();
    console.log("inside enable, matched card length is: " + matchedCard.length); // DEBUG
}

// FUNCTION FOR COUNTING MOVES
function moveCounter() {
    counter.innerHTML = moves / 2;
    // FOR STAR RATING CALCULATION
    if(moves > 24 && moves < 38) {
        for (let x = 0; x < 3; x++) {
            if(x > 1) {
                stars[x].style.visibility = "collapse";
            }
        }
    }
    else if( moves > 39 ) {
        for (let x = 0; x < 3; x++) {
            if(x > 0) {
                stars[x].style.visibility = "collapse";
            }
        }
    }
}

// FUNCTION TO START TIMER
function startTimer() {
    interval = setInterval(function() {
        timer.innerHTML = minute + " mins " + second + " secs";
        second++;
        if(second == 60) {
            minute++;
            second = 0;
        }
        if(minute == 60) {
            hour++;
            minute = 0;
        }
    }, 1000);
}

// FUNCTION FOR WHEN ALL CARDS ARE MATCHED, MODAL POP UP AND GAME STATS
function congratulations() {
    console.log("congratulations called.  matchedCard.length="+ matchedCard.length); //DEBUG
    if (matchedCard.length == 16){
        clearInterval(interval);
        // SHOW CONGRATULATIONS MODAL
        openModal();
        // SHOW STATS(MOVE, TIME AND RATING) ON MODAL
        document.getElementById("finalMove").innerHTML = moves / 2;
        document.getElementById("totalTime").innerHTML = timer.innerHTML;
        document.getElementById("finalRating").innerHTML = document.querySelector(".stars").outerHTML;
    };
}

// FUNCTION TO OPEN MODAL
function openModal() {
    modal.style.display = "block";
}

// FUNCTION TO CLOSE MODAL
function closeModal() {
    modal.style.display = "none";
}

// FUNCTION TO CLOSE MODAL IF CLICKED OUTSIDE
function outsideClick(event) {
    if(event.target == modal) {
        modal.style.display = "none";
    }
}

// ADD EVENT LISTENER TO CARD
for(let x = 0; x < cards.length; x++) {
    card = cards[x];
    card.addEventListener("click", cardOpen);
};

// EVENT LISTENER FOR RESTART BUTTON / RELOADS PAGE
restartBtn.addEventListener("click", function() {
    document.location.reload();
});

// EVENT LISTENER FOR PLAY AGAIN BUTTON
playAgain.addEventListener("click", function() {
    closeModal();
    startGame();
});

// EVENT LISTENER FOR CLOSE "X" ON MODAL
closeBtn.addEventListener("click", closeModal);

// EVENT LISTENER FOR OUTSIDE CLICK ON MODAL
window.addEventListener("click", outsideClick);