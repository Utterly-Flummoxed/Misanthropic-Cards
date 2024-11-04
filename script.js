const url = 'https://raw.githubusercontent.com/crhallberg/json-against-humanity/master/cah-all-full.json';

async function fetchData() {
    const response = await fetch(url);
    return response.json();
}

async function drawBlackCard() {
    const data = await fetchData();
    const blackCards = data.black;
    const randomCard = blackCards[Math.floor(Math.random() * blackCards.length)];
    
    document.getElementById('cards').innerHTML = `<div class="card">${randomCard.text}</div>`;
    showCards();
}

async function drawWhiteCards() {
    const data = await fetchData();
    const whiteCards = data.white;
    let drawnCards = [];
    
    for (let i = 0; i < 7; i++) {
        const randomCard = whiteCards[Math.floor(Math.random() * whiteCards.length)];
        drawnCards.push(randomCard.text);
    }
    
    document.getElementById('cards').innerHTML = `<div class="white-cards">${drawnCards.map(card => `<div class="card">${card}</div>`).join('')}</div>`;
    showCards();
}

function showCards() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('cards').style.display = 'block';
    document.getElementById('backButton').style.display = 'block';
}

function showMenu() {
    document.getElementById('menu').style.display = 'block';
    document.getElementById('cards').style.display = 'none';
    document.getElementById('backButton').style.display = 'none';
}
