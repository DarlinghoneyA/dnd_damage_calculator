document.querySelector('.btn-primary').addEventListener('click', function() {
    const diceCount = parseInt(document.getElementById('numberInput').value);
    const diceType = parseInt(document.getElementById('Dice-type').options[document.getElementById('Dice-type').selectedIndex].text.replace('D', ''));
    
    const isGWF = document.getElementById('checkGreatWeapon').checked;
    const isSA = document.getElementById('checkSavage').checked;

    function rollDice(sides) {
        return Math.floor(Math.random() * sides) + 1;
    }

    function rollSingleDie(sides, useGWF) {
        let result = rollDice(sides);
        if (useGWF && (result === 1 || result === 2)) {
            result = rollDice(sides);
        }
        return result;
    }

    let totalDamage = 0;

    if (isSA) {
        let set1 = 0;
        let set2 = 0;
        for (let i = 0; i < diceCount; i++) {
            set1 += rollSingleDie(diceType, isGWF);
            set2 += rollSingleDie(diceType, isGWF);
        }
        totalDamage = Math.max(set1, set2);
    } else {
        for (let i = 0; i < diceCount; i++) {
            totalDamage += rollSingleDie(diceType, isGWF);
        }
    }

    alert("ผลลัพธ์การทอยคือ : " + totalDamage);
});