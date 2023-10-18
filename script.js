/** @format */

// alert modal
function showInitialModal() {
	const modal = document.getElementById("initialModal");
	modal.style.display = "flex";
}

function closeInitialModal() {
	const modal = document.getElementById("initialModal");
	modal.style.display = "none";
}

function pickSlot() {
	const modal = document.getElementById("initialModal");
	modal.style.display = "none";
}

window.onload = showInitialModal;

// reserve form modal
function openModal() {
	const modal = document.getElementById("modalContainer");
	modal.classList.add("is-open");
	modal.style.display = "flex";
}

function closeModal() {
	const modal = document.getElementById("modalContainer");
	modal.style.display = "none";
	modal.classList.remove("is-open");
}

function closeSuccessModal() {
	const modal = document.getElementById("successModal");
	modal.style.display = "none";
}

document.getElementById("reserveButton").addEventListener("click", openModal);

function goToMessage() {
	window.location.href = "https://www.facebook.com/KUPALSIMARK";
}

const searchInput = document.getElementById("searchInput");
const slotRows = document.querySelectorAll("#slotRow");

searchInput.addEventListener("input", function () {
	const searchText = searchInput.value.trim().toLowerCase();

	slotRows.forEach(function (row) {
		const slotText = row.textContent.trim().toLowerCase();
		const isVisible = slotText.includes(searchText);

		row.style.display = isVisible ? "table-row" : "none";
	});
});

function filterSlots(filterValue) {
	const slots = document.getElementsByClassName("slot-name");

	for (let i = 0; i < slots.length; i++) {
		const slotStatus = slots[i].innerHTML.trim().toLowerCase();
		const checkbox = document.getElementById(`checkbox${i}`);
		const slotRow = slots[i].closest("tr");

		if (
			filterValue === "all" || // Show all elements
			(filterValue === "reserved" && (!checkbox || checkbox.checked)) ||
			(filterValue === "available" && checkbox && !checkbox.checked)
		) {
			slotRow.style.display = "table-row";

			if (slotStatus === "reserved") {
				slotRow.classList.add("reserved");
			} else if (slotStatus === "paid") {
				slotRow.classList.add("paid");
			}
		} else {
			slotRow.style.display = "none";
		}
	}
}

const filterSelect = document.getElementById("filterSelect");

filterSelect.addEventListener("change", function () {
	const selectedFilter = filterSelect.value;
	filterSlots(selectedFilter);
});

filterSlots(filterSelect.value);

let availableSlots = 0;

function updateAvailableSlots() {
	const slots = document.getElementsByClassName("slot-name");
	let filledSlots = 0;

	for (let i = 0; i < slots.length; i++) {
		if (slots[i].innerHTML !== "") {
			filledSlots++;
		}
	}

	const totalSlots = 4000;
	availableSlots = (filledSlots / totalSlots) * 100;

	const availableSlotElement = document.getElementById("availableSlot");

	if (availableSlotElement) {
		availableSlotElement.textContent =
			availableSlots.toFixed(2) + "% out of 100%";
	}
}

updateAvailableSlots();

function submitReservation() {
	const name = document.getElementById("name").value;
	const mobile = document.getElementById("mobile").value;
	const successModal = document.getElementById("successModal");
	const totalPayElement = document.getElementById("totalPay");
	const registeredNameElement = document.getElementById("registeredName");
	const checkboxes = document.querySelectorAll('input[type="checkbox"]');
	const checkboxPrice = 85;
	let totalPay = 0;

	if (name && mobile) {
		const slots = document.getElementsByClassName("slot-name");

		for (let i = 0; i < checkboxes.length; i++) {
			if (checkboxes[i].checked && slots[i].innerHTML === "") {
				slots[i].innerHTML = name;
				checkboxes[i].disabled = true;
				totalPay += checkboxPrice;
			}
		}

		if (totalPay > 0) {
			successModal.style.display = "flex";
			totalPayElement.textContent = totalPay + " PHP";
			registeredNameElement.textContent = name;
			updateReserveButtonLabel();
			saveDataToStorage();
			closeModal();
		} else {
			alert("Please pick at least 1 slot to proceed.");
		}
	} else {
		alert("Please enter both name and mobile number.");
	}
}

const basePrice = 0;
const pricePerCheckbox = 85;
let slotCount = 0;

function updateReserveButtonLabel() {
	const reserveButton = document.getElementById("reserveButton");
	const checkedCheckboxes = document.querySelectorAll(
		'input[type="checkbox"]:checked:not([disabled])'
	);
	const totalPriceResult = document.getElementById("totalPrice");

	const checkedSlotNumbers = Array.from(checkedCheckboxes).map((checkbox) => {
		const tdElement = checkbox.closest("tr").querySelector(".slot-num");
		const slotNum = tdElement.textContent;
		return "#" + slotNum;
	});

	const totalPrice = basePrice + checkedSlotNumbers.length * pricePerCheckbox;
	const slotCountResult = checkedSlotNumbers.length;

	if (slotCountResult > 0) {
		reserveButton.innerHTML = `Reserve slot here <div class="slot-added">${slotCountResult}</div> `;
		totalPriceResult.innerHTML = `<strong>Slot Number:</strong>&nbsp;&nbsp;(<span>${slotCountResult} slot = ${totalPrice} PHP</span>)
    <br>
    <br>`;
		totalPriceResult.innerHTML += checkedSlotNumbers
			.map((slot) => `<div class="slot-box">${slot}</div>`)
			.join(" ");
	} else {
		reserveButton.innerHTML = "Reserve slot here";
		totalPriceResult.innerHTML = "";
	}
}

function saveDataToStorage() {
	const slots = document.getElementsByClassName("slot-name");
	const data = {};

	for (let i = 0; i < slots.length; i++) {
		data["slot" + (i + 1)] = slots[i].innerHTML;
	}

	sessionStorage.setItem("reservationData", JSON.stringify(data));

	localStorage.setItem("reservationData", JSON.stringify(data));
}

function loadDataFromStorage() {
	const sessionData = sessionStorage.getItem("reservationData");
	const localData = localStorage.getItem("reservationData");
	const storedCount = sessionStorage.getItem("checkedCount");

	if (sessionData || localData) {
		const data = JSON.parse(sessionData || localData);
		const slots = document.getElementsByClassName("slot-name");
		const checkboxes = document.querySelectorAll('input[type="checkbox"]');

		for (let i = 0; i < slots.length; i++) {
			const slotData = data["slot" + (i + 1)];
			if (slotData) {
				slots[i].innerHTML = slotData;

				checkboxes[i].checked = true;
				checkboxes[i].disabled = true;
			}
		}
	}

	if (storedCount) {
		checkedCount = parseInt(storedCount, 10);
	}
	updateReserveButtonLabel();
}

const checkboxes = document.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach(function (checkbox) {
	checkbox.addEventListener("change", function () {
		if (this.checked) {
			checkedCount++;
		} else {
			checkedCount--;
		}
		updateReserveButtonLabel();
		saveDataToStorage();
	});
});

window.addEventListener("load", function () {
	checkedCount = 0;
	loadDataFromStorage();

	updateAvailableSlots();

	document.getElementById("availableSlot").textContent =
		availableSlots.toFixed(2) + "% out of 100%";
});
