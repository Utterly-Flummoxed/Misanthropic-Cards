// URL for the JSON file
const url = 'https://raw.githubusercontent.com/crhallberg/json-against-humanity/refs/heads/latest/web/CAHDeck.js';

// Fetch data from the URL
async function fetchData() {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const text = await response.text();
        return JSON.parse(text.replace(/^var CAHDeck = /, '').replace(/;$/, '')); // Convert from JS to JSON
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch card data. Please try again later.');
    }
}

// Display card packs
async function fetchAndDisplayPacks() {
    const data = await fetchData();
    if (data) {
        const packsList = document.getElementById('packsList');
        packsList.innerHTML = '';

        for (const [key, pack] of Object.entries(data)) {
            const label = document.createElement('label');
            label.innerHTML = `<input type="checkbox" value="${key}" checked> ${pack.name}`;
            packsList.appendChild(label);
            packsList.appendChild(document.createElement('br'));
        }
    }
}

// Get selected card packs
function getSelectedPacks(data) {
    const selectedPacks = Array.from(document.querySelectorAll('#packSelection input:checked')).map(input => input.value);
    const blackCards = [];
    const whiteCards = [];

    selectedPacks.forEach(pack => {
        const packData = data[pack];
        if (packData) {
            blackCards.push(...packData.black);
            whiteCards.push(...packData.white);
        }
    });

    return { blackCards, whiteCards };
}

// Draw a random black card
async function drawBlackCard() {
    const data = await fetchData();
    const { blackCards } = getSelectedPacks(data);
    
    if (blackCards.length === 0) {
        alert("No black cards available from selected packs.");
        return;
    }

    const randomCard = blackCards[Math.floor(Math.random() * blackCards.length)];
    document.getElementById('cards').innerHTML = `<div class="card">${randomCard.text}</div>`;
    showCards();
}

// Draw seven random white cards
async function drawWhiteCards() {
    const data = await fetchData();
    const { whiteCards } = getSelectedPacks(data);
    
    if (whiteCards.length === 0) {
        alert("No white cards available from selected packs.");
        return;
    }

    let drawnCards = [];
    let remainingWhiteCards = [...whiteCards];

    for (let i = 0; i < 7; i++) {
        const randomIndex = Math.floor(Math.random() * remainingWhiteCards.length);
        drawnCards.push(remainingWhiteCards[randomIndex].text);
        remainingWhiteCards.splice(randomIndex, 1);
    }

    document.getElementById('cards').innerHTML = `<div class="white-cards">${drawnCards.map(card => `<div class="card">${card}</div>`).join('')}</div>`;
    showCards();
}

// Show and hide elements for drawing cards
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

// Initialise the packs list on load
fetchAndDisplayPacks();
