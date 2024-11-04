// URL for the new JSON file
const url = 'https://raw.githubusercontent.com/crhallberg/json-against-humanity/refs/heads/latest/cah-all-compact.json';

// Asynchronously fetch card data from the specified URL
async function fetchData() {
    try {
        const response = await fetch(url); // Attempt to fetch data
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`); // Handle HTTP errors
        }
        return await response.json(); // Return the entire data set as JSON
    } catch (error) {
        console.error('Error fetching data:', error); // Log any errors that occur during fetch
        alert('Failed to fetch card data. Please try again later.'); // Alert user about the fetch failure
    }
}

// Get selected card packs based on user input
function getSelectedPacks(data) {
    // Retrieve selected pack names from the checkboxes
    const selectedPacks = Array.from(document.querySelectorAll('#packSelection input:checked')).map(input => input.value);
    const blackCards = []; // Array to hold selected black cards
    const whiteCards = []; // Array to hold selected white cards

    // Loop through selected packs to find and collect their cards
    selectedPacks.forEach(pack => {
        const packData = data.packs[pack]; // Access the pack data by its key
        if (packData) {
            // Retrieve black and white cards using the indexes from the pack
            blackCards.push(...packData.black.map(index => data.black[index])); // Retrieve black cards by index
            whiteCards.push(...packData.white.map(index => data.white[index])); // Retrieve white cards by index
        }
    });

    return { blackCards, whiteCards }; // Return the arrays of selected cards
}

// Asynchronously draw a random black card from selected packs
async function drawBlackCard() {
    const data = await fetchData(); // Fetch card data
    const { blackCards } = getSelectedPacks(data); // Get black cards from selected packs
    const randomCard = blackCards[Math.floor(Math.random() * blackCards.length)]; // Select a random black card

    // Display the drawn black card
    document.getElementById('cards').innerHTML = `<div class="card">${randomCard.text}</div>`;
    showCards(); // Show the drawn card
}

// Asynchronously draw seven random white cards from selected packs
async function drawWhiteCards() {
    const data = await fetchData(); // Fetch card data
    const { whiteCards } = getSelectedPacks(data); // Get white cards from selected packs
    let drawnCards = []; // Array to hold drawn white cards

    // Create a copy of the white cards array to avoid modifying the original
    let remainingWhiteCards = [...whiteCards];

    // Draw seven random white cards
    for (let i = 0; i < 7; i++) {
        const randomIndex = Math.floor(Math.random() * remainingWhiteCards.length); // Get a random index
        drawnCards.push(remainingWhiteCards[randomIndex]); // Add the drawn card to the array
        // Remove the drawn card to avoid repeats
        remainingWhiteCards.splice(randomIndex, 1);
    }

    // Display the drawn white cards
    document.getElementById('cards').innerHTML = `<div class="white-cards">${drawnCards.map(card => `<div class="card">${card}</div>`).join('')}</div>`;
    showCards(); // Show the drawn cards
}
