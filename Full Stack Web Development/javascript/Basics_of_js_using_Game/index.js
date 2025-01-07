// Basics_of_js_using_Game/index.js

// Game Variables
let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ['stick'];

// DOM Elements
const button1 = document.querySelector('#button1');
const button2 = document.querySelector('#button2');
const button3 = document.querySelector('#button3');
const text = document.querySelector("#text");
const monsterHealthText = document.querySelector('#monsterHealth');
const xpText = document.querySelector('#xpTest');
const healthText = document.querySelector('#healthText');
const goldText = document.querySelector('#goldText');
const monsterStats = document.querySelector('#monsterStats');
const monsterNameText = document.querySelector('#monsterName');

// Game Data
const locations = [
    {
        name: 'Town Square',
        buttonText: ["Visit the Store", "Explore the Cave", "Challenge the Dragon"],
        buttonFunction: [goStore, goCave, fightDragon],
        text: "You are in the Town Square. It's bustling with activity."
    },
    {
        name: 'Store',
        buttonText: ["Buy Health (+10) [10 Gold]", "Buy New Weapon [30 Gold]", "Return to Town Square"],
        buttonFunction: [buyHealth, buyWeapon, goTown],
        text: "Welcome to the Store. Spend your gold wisely!"
    },
    {
        name: 'Cave',
        buttonText: ["Fight a Slime", "Fight a Beast", "Return to Town Square"],
        buttonFunction: [fightSlime, fightBeast, goTown],
        text: "The cave is dark and eerie. Monsters lurk in the shadows."
    },
    {
        name: 'Battle',
        buttonText: ["Attack", "Dodge", "Run"],
        buttonFunction: [attack, dodge, goTown],
        text: "You are battling a fierce monster!"
    },
    {
        name: 'Victory',
        buttonText: ["Return to Town Square", "Return to Town Square", "Return to Town Square"],
        buttonFunction: [goTown, goTown, goTown],
        text: "Congratulations! You defeated the monster and earned rewards."
    },
    {
        name: 'Defeat',
        buttonText: ["Restart Game", "Restart Game", "Restart Game"],
        buttonFunction: [restartGame, restartGame, restartGame],
        text: "You have been defeated. Better luck next time!"
    },
    {
        name: 'Victory Over Dragon',
        buttonText: ["Restart Game", "Restart Game", "Restart Game"],
        buttonFunction: [restartGame, restartGame, restartGame],
        text: "You defeated the dragon! You are the ultimate hero!"
    }
];

const weapons = [
    { name: "Stick", power: 5 },
    { name: "Dagger", power: 30 },
    { name: "Claw Hammer", power: 50 },
    { name: "Sword", power: 100 }
];

const monsters = [
    { name: "Slime", level: 2, health: 15 },
    { name: "Fanged Beast", level: 8, health: 60 },
    { name: "Dragon", level: 20, health: 300 }
];

// Button Initial Setup
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

// Functions
function update(location) {
    button1.innerText = location.buttonText[0];
    button2.innerText = location.buttonText[1];
    button3.innerText = location.buttonText[2];
    button1.onclick = location.buttonFunction[0];
    button2.onclick = location.buttonFunction[1];
    button3.onclick = location.buttonFunction[2];
    text.innerText = location.text;
}

function goTown() {
    update(locations[0]);
}

function goStore() {
    update(locations[1]);
}

function goCave() {
    update(locations[2]);
}

function buyHealth() {
    if (gold >= 10) {
        gold -= 10;
        health += 10;
        updateStats();
        text.innerText = "You feel rejuvenated! Health increased by 10.";
    } else {
        text.innerText = "You don't have enough gold to buy health.";
    }
}

function buyWeapon() {
    if (currentWeapon < weapons.length - 1 && gold >= 30) {
        gold -= 30;
        currentWeapon++;
        let newWeapon = weapons[currentWeapon].name;
        inventory.push(newWeapon);
        updateStats();
        text.innerText = `You purchased a ${newWeapon}. Your inventory now includes: ${inventory.join(", ")}.`;
    } else if (currentWeapon >= weapons.length - 1) {
        text.innerText = "You already own the most powerful weapon!";
    } else {
        text.innerText = "You don't have enough gold to buy a new weapon.";
    }
}

function fightSlime() {
    fighting = 0;
    startBattle();
}

function fightBeast() {
    fighting = 1;
    startBattle();
}

function fightDragon() {
    fighting = 2;
    startBattle();
}

function startBattle() {
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block";
    monsterNameText.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsterHealth;
}

function attack() {
    text.innerText = `You attack the ${monsters[fighting].name} with your ${weapons[currentWeapon].name}.`;
    health -= monsters[fighting].level;
    monsterHealth -= weapons[currentWeapon].power;
    updateStats();
    if (health <= 0) {
        loseGame();
    } else if (monsterHealth <= 0) {
        fighting === 2 ? winGame() : monsterDefeated();
    } else {
        text.innerText += ` The ${monsters[fighting].name} retaliates!`;
    }
}

function dodge() {
    text.innerText = `You dodge the ${monsters[fighting].name}'s attack!`;
}

function loseGame() {
    update(locations[5]);
}

function winGame() {
    update(locations[6]);
}

function monsterDefeated() {
    gold += monsters[fighting].level * 10;
    xp += monsters[fighting].level * 5;
    update(locations[4]);
    updateStats();
    text.innerText = `You defeated the ${monsters[fighting].name}! You earned gold and experience points.`;
}

function updateStats() {
    healthText.innerText = health;
    goldText.innerText = gold;
    xpText.innerText = xp;
    monsterHealthText.innerText = monsterHealth;
}

function restartGame() {
    xp = 0;
    health = 100;
    gold = 50;
    currentWeapon = 0;
    inventory = ['stick'];
    goTown();
}
