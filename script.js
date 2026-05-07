// --- ฟังก์ชันทอยเต๋าพื้นฐาน ---
function rollDice(sides) {
    return Math.floor(Math.random() * sides) + 1;
}

// --- ฟังก์ชันทอย 1 ลูก โดยเช็คเงื่อนไข Great Weapon Fighting (GWF) ---
function rollSingleDie(sides, useGWF) {
    let result = rollDice(sides);
    // GWF: ถ้าทอยได้ 1 หรือ 2 ให้ทอยใหม่ครั้งเดียว
    if (useGWF && (result === 1 || result === 2)) {
        result = rollDice(sides);
    }
    return result;
}

document.getElementById('calcBtn').addEventListener('click', function() {
    const form = document.querySelector('form'); 

    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return; 
    }

    // ดึงสถานะของ Checkbox
    const isSA = document.getElementById('checkSavage').checked;
    const isGWF = document.getElementById('checkGreatWeapon').checked;

    const rows = document.querySelectorAll('.dice-entry-row');
    let grandTotal = 0;
    let resultHTML = '';

    rows.forEach((row, index) => {
        const diceCount = parseInt(row.querySelector('.dice-count').value);
        const diceType = parseInt(row.querySelector('.dice-type').value);
        
        let additionalDamage = parseInt(row.querySelector('.additional-damage').value);
        if (isNaN(additionalDamage)) additionalDamage = 0;

        let damageType = row.querySelector('.damage-type').value.trim() || "None";

        let rowDiceTotal = 0;

        // --- เริ่มการทอยตามเงื่อนไข Savage Attacker (SA) ---
        if (isSA) {
            // ทอย 2 ชุด
            let set1 = 0;
            let set2 = 0;
            for (let i = 0; i < diceCount; i++) {
                set1 += rollSingleDie(diceType, isGWF);
                set2 += rollSingleDie(diceType, isGWF);
            }
            // เลือกชุดที่ได้ผลรวมมากกว่า
            rowDiceTotal = Math.max(set1, set2);
        } else {
            // ทอยชุดเดียวปกติ
            for (let i = 0; i < diceCount; i++) {
                rowDiceTotal += rollSingleDie(diceType, isGWF);
            }
        }

        // นำผลทอยเต๋ามาบวกลบกับโบนัส (D&D ขั้นต่ำคือ 0)
        let finalRowDamage = Math.max(0, rowDiceTotal + additionalDamage);
        grandTotal += finalRowDamage;

        // แสดงสัญลักษณ์โบนัส
        let bonusLabel = "";
        if (additionalDamage > 0) bonusLabel = ` <span class="text-success">(+${additionalDamage})</span>`;
        else if (additionalDamage < 0) bonusLabel = ` <span class="text-danger">(${additionalDamage})</span>`;

        resultHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center p-3">
                <div>
                    <h6 class="mb-1">ชุดที่ ${index + 1}: ${diceCount}D${diceType}</h6>
                    <small class="text-muted">ผลทอย: ${rowDiceTotal}${bonusLabel} | ประเภท: ${damageType}</small>
                </div>
                <div class="text-end">
                    <span class="badge bg-danger fs-5 rounded-pill">${finalRowDamage}</span>
                </div>
            </li>
        `;
    });

    // แสดงผลลัพธ์
    let displayArea = document.getElementById('resultArea');
    if (!displayArea) {
        displayArea = document.createElement('div');
        displayArea.id = 'resultArea';
        displayArea.className = 'mt-4 animate-fade-in';
        document.getElementById('calcBtn').parentElement.insertAdjacentElement('afterend', displayArea);
    }

    displayArea.innerHTML = `
        <div class="card border-primary shadow">
            <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <span class="h5 mb-0">ผลลัพธ์การคำนวณ</span>
                <span class="h3 mb-0">Total: ${grandTotal}</span>
            </div>
            <ul class="list-group list-group-flush">
                ${resultHTML}
            </ul>
        </div>
    `;
});

// --- ระบบเพิ่มแถวใหม่ ---
document.getElementById('addRowBtn').addEventListener('click', function() {
    const newRow = `
        <div class="row w-100 align-items-end mb-3 dice-entry-row border-top pt-3">
            <div class="col-lg-2 col-md-3 col-sm-12 mb-3">
                <label class="form-label small">จำนวนลูกเต๋า</label>
                <input type="number" class="form-control dice-count" min="1" max="100" placeholder="1-100" required>
            </div>
            <div class="col-lg-3 col-md-4 col-sm-12 mb-3">
                <label class="form-label small">ประเภทลูกเต๋า</label>
                <select class="form-select dice-type" required>
                    <option selected disabled value="">เลือก</option>
                    <option value="4">D4</option>
                    <option value="6">D6</option>
                    <option value="8">D8</option>
                    <option value="10">D10</option>
                    <option value="12">D12</option>
                    <option value="20">D20</option>
                </select>
            </div>
            <div class="col-lg-3 col-md-5 col-sm-12 mb-3">
                <label class="form-label small">Bonus Damage</label>
                <input class="form-control additional-damage" type="text" placeholder="(+/-)">
            </div>
            <div class="col-lg-3 col-md-10 col-sm-10 mb-3">
                <label class="form-label small">Damage Type</label>
                <input class="form-control damage-type" type="text" placeholder="Optional">
            </div>
            <div class="col-lg-1 col-md-2 col-sm-2 mb-3 d-flex justify-content-center">
                <button type="button" class="btn btn-outline-danger remove-row-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                </button>
            </div>
        </div>`;
    document.getElementById('diceRows').insertAdjacentHTML('beforeend', newRow);
});

// --- ระบบลบแถว ---
document.addEventListener('click', function(e) {
    if (e.target.closest('.remove-row-btn')) {
        e.target.closest('.dice-entry-row').remove();
    }
});