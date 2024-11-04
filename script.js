async function fetchData() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json(); // Return the entire data set
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch card data. Please try again later.');
    }
}

function getSelectedPacks(data) {
    const selectedPacks = Array.from(document.querySelectorAll('#packSelection input:checked')).map(input => input.value);
    const blackCards = [];
    const whiteCards = [];

    selectedPacks.forEach(pack => {
        const packData = data.find(p => p.name === pack);
        if (packData) {
            blackCards.push(...packData.black);
            whiteCards.push(...packData.white);
        }
    });

    return { blackCards, whiteCards };
}

async function drawBlackCard() {
    const data = await fetchData();
    const { blackCards } = getSelectedPacks(data);
    const randomCard = blackCards[Math.floor(Math.random() * blackCards.length)];

    document.getElementById('cards').innerHTML = `<div class="card">${randomCard.text}</div>`;
    showCards();
}

async function drawWhiteCards() {
    const data = await fetchData();
    const { whiteCards } = getSelectedPacks(data);
    let drawnCards = [];

    // Create a copy of the white cards array
    let remainingWhiteCards = [...whiteCards];

    for (let i = 0; i < 7; i++) {
        const randomIndex = Math.floor(Math.random() * remainingWhiteCards.length);
        drawnCards.push(remainingWhiteCards[randomIndex].text);
        // Remove drawn card to avoid repeats
        remainingWhiteCards.splice(randomIndex, 1);
    }

    document.getElementById('cards').innerHTML = `<div class="white-cards">${drawnCards.map(card => `<div class="card">${card}</div>`).join('')}</div>`;
    showCards();
}
