var dealerHand = [];
var yourHand = [];
var yourAmount = 0;
var hidden;
var canHit = true;
var initialMoney = parseFloat(prompt("How much money would you like to start with?")); // Prompt the player for initial money amount
var currentMoney = initialMoney;
var wager;
// Validate the entered amount
if (isNaN(currentMoney) || currentMoney <= 0) {
   currentMoney = 100; // Set a default starting amount if the entered value is invalid
}


window.onload = function() {
   buildDeck();
   shuffleDeck();
   document.getElementById("deal").addEventListener("click", deal);
   document.getElementById("hit").addEventListener("click", hit);
   document.getElementById("stand").addEventListener("click", stand);
   document.getElementById("end-game").addEventListener("click", endBalance);


   deal(); // Add this line to start the game with an initial hand
}


function buildDeck() {
   let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Q", "K"];
   let types = ["C", "D", "H", "S"];
   deck = [];


   for (let i = 0; i < types.length; i++) {
       for (let j = 0; j < values.length; j++) {
           deck.push({ value: values[j], type: types[i] });
       }
   }
}


function shuffleDeck() {
   for (let i = 0; i < deck.length; i++) {
       let j = Math.floor(Math.random() * deck.length);
       let temp = deck[i];
       deck[i] = deck[j];
       deck[j] = temp;
   }
}

function deal() {
    wager = parseFloat(prompt("How much would you like to wager?"));
    
    // Validate the entered amount
    if (isNaN(wager) || wager <= 0 || wager > currentMoney) {
        alert("Invalid wager amount. Please enter a valid wager.");
        return;
    }

    // Deduct the wager amount from the current money
    currentMoney -= wager;
    resetGame();
    
    // Create the dealer's hidden card
    hidden = deck.pop();
    document.getElementById("dealer-cards").innerHTML = '<img id="hidden" src="./cards/BACK.png">';

    // Deal one visible card for the dealer
    let card = deck.pop();
    dealerHand.push(card);
    document.getElementById("dealer-cards").innerHTML += '<img src="./cards/' + card.value + '-' + card.type + '.png">';

    // Deal two cards for the player
    for (let i = 0; i < 2; i++) {
        let yourCard = deck.pop();
        yourHand.push(yourCard);
        yourAmount += getCardAmount(yourCard);
        document.getElementById("your-cards").innerHTML += '<img src="./cards/' + yourCard.value + '-' + yourCard.type + '.png">';
    }

    updateSums();
    updateAmount();
    document.getElementById("deal").disabled = true;
    document.getElementById("hit").disabled = false;
    document.getElementById("stand").disabled = false;
}


function hit() {
   if (!canHit) {
       return;
   }


   let card = deck.pop();
   yourHand.push(card);
   let cardAmount = getCardAmount(card);
   yourAmount += cardAmount;
   document.getElementById("your-cards").innerHTML += '<img src="./cards/' + card.value + '-' + card.type + '.png">';


   if (getHandSum(yourHand) > 21) {
       endGame("You Bust!");
   }


   updateSums();
   updateAmount();
}
function stand() {
   document.getElementById("hidden").src = './cards/' + hidden.value + '-' + hidden.type + '.png';
   dealerHand.push(hidden); // Add the hidden card back to the dealer's hand
    let dealerSum = getHandSum(dealerHand);
   let yourSum = getHandSum(yourHand);
    // Dealer stands on 17 or higher
   while (dealerSum < 17 && dealerSum < yourSum) {
     let card = deck.pop();
     dealerHand.push(card);
     document.getElementById("dealer-cards").innerHTML += '<img src="./cards/' + card.value + '-' + card.type + '.png">';
     dealerSum = getHandSum(dealerHand);
   }
    if (dealerSum > 21) {
     endGame("Dealer Busts! You Win!");
   } else if (dealerSum === yourSum) {
     endGame("It's a Tie!");
   } else if (dealerSum > yourSum) {
     endGame("Dealer Wins!");
   } else {
     endGame("You Win!");
   }
 }




function resetGame() {
   dealerHand = [];
   yourHand = [];
   yourAmount = 0;
   canHit = true;
   document.getElementById("dealer-cards").innerHTML = '';
   document.getElementById("your-cards").innerHTML = '';
   document.getElementById("results").innerText = '';
   document.getElementById("dealer-sum").innerText = '';
   document.getElementById("your-sum").innerText = '';
}


function endGame(message) {
   let dealerSum = getHandSum(dealerHand);
   let yourSum = getHandSum(yourHand);
   if (message === "You Win!" || message === "Dealer Busts! You Win!") {
       if (yourSum === 21 && yourHand.length === 2) { // Check if the player has a blackjack
           currentMoney += wager * 2.5;
       } else {
           currentMoney += wager * 2;
       }
   } else if (message === "It's a Tie!") {
       currentMoney += wager;
   } // No need to update balance in case of losing, as it was deducted at the time of dealing.


   document.getElementById("results").innerText = message;
   document.getElementById("dealer-sum").innerText = dealerSum;
   updateAmount(); // Update the balance after modifying the currentMoney
   document.getElementById("deal").disabled = false;
   document.getElementById("hit").disabled = true;
   document.getElementById("stand").disabled = true;
}








function updateSums() {
   let dealerSum = getHandSum(dealerHand);
   let yourSum = getHandSum(yourHand);
   document.getElementById("dealer-sum").innerText = dealerSum;
   document.getElementById("your-sum").innerText = yourSum;
}
function displayBalance() {
   document.getElementById("balance").innerText = "Balance: $" + currentMoney;
}
function updateAmount() {
   let amountElement = document.getElementById("your-amount");
   if (amountElement) {
       amountElement.innerText = yourAmount;
   }
   displayBalance(); // Call displayBalance to update the balance
}




function getHandSum(hand) {
   let sum = 0;
   let numAces = 0;
    for (let i = 0; i < hand.length; i++) {
     let cardValue = getCardValue(hand[i]);
     sum += cardValue;
      if (hand[i].value === "A") {
       numAces++;
     }
   }
    // Adjust the sum for Aces, considering 1 instead of 11 if the sum exceeds 21
   while (sum > 21 && numAces > 0) {
     sum -= 10;
     numAces--;
   }
    return sum;
 }


function getCardValue(card) {
   if (!card) {
       console.log("Error: Card is undefined");
       return 0;
   }


   if (card.value === "A") {
       return 11;
   } else if (card.value === "K" || card.value === "Q" || card.value === "J") {
       return 10;
   } else {
       return parseInt(card.value);
   }
}


function getCardAmount(card) {
   if (card.value === "A") {
       return 11;
   } else if (card.value === "K" || card.value === "Q" || card.value === "J") {
       return 10;
   } else {
       return parseInt(card.value);
   }
}


function startGame() {
   hidden = deck.pop();
   dealerHand.push(hidden);


   for (let i = 0; i < 2; i++) {
       let card = deck.pop();
       if (i === 0) {
           dealerHand.push(card);
           continue; // Skip the first card for the dealer
       }
       yourHand.push(card);
       yourAmount += getCardAmount(card);
       document.getElementById("your-cards").innerHTML += '<img src="./cards/' + card.value + '-' + card.type + '.png">';
   }


   document.getElementById("dealer-cards").innerHTML += '<img id="hidden" src="./cards/BACK.png">';
   updateAmount();
   document.getElementById("hit").disabled = false;
   document.getElementById("stand").disabled = false;
}


function endBalance() {
   document.getElementById("hit").disabled = true;
   document.getElementById("stand").disabled = true;
   document.getElementById("deal").disabled = true;
   document.getElementById("end-game").disabled = true;


   let balanceDifference = currentMoney - initialMoney;
   let resultMessage;


   if (balanceDifference > 0) {
       resultMessage = "Congrats! You won $" + balanceDifference;
       document.getElementById("results").style.color = "green";
   } else if (balanceDifference < 0) {
       resultMessage = "Better luck next time!";
       document.getElementById("results").style.color = "red";
   } else {
       resultMessage = "You have broken even!";
       document.getElementById("results").style.color = "gray";
   }

   document.getElementById("results").innerText = resultMessage;
}
