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

document.getElementById('calcBtn').addEventListener('click', function() {
    // 2. เลือกฟอร์มที่ครอบอยู่ (แนะนำให้ใส่ id ให้ form ด้วย เช่น id="calcForm")
    const form = document.querySelector('form'); 

    // 3. ตรวจสอบความถูกต้อง (checkValidity)
    if (!form.checkValidity()) {
        // ถ้าไม่ผ่าน ให้เพิ่มคลาส was-validated เพื่อโชว์ข้อความเตือนของ Bootstrap
        form.classList.add('was-validated');
        return; // หยุดการทำงาน ไม่ให้คำนวณต่อ
    }

    // 4. ถ้าผ่านการตรวจสอบแล้ว ทำการคำนวณปกติ
    const diceCount = parseInt(document.getElementById('numberInput').value);
    
    // ดึงค่าจาก Select (แนะนำให้ใช้ .value และจัดการกรณีไม่ได้เลือก
    const diceTypeSelect = document.getElementById('Dice-type');
    const diceType = parseInt(diceTypeSelect.options[diceTypeSelect.selectedIndex].text.replace('D', ''));
    
    const isGWF = document.getElementById('checkGreatWeapon').checked;
    const isSA = document.getElementById('checkSavage').checked;

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