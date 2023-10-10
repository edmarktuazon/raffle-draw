/** @format */

function openModal() {
	var modal = document.getElementById("myModal");
	modal.style.display = "block";
}

function closeModal() {
	var modal = document.getElementById("myModal");
	modal.style.display = "none";
}

function submitReservation() {
	var name = document.getElementById("name").value;
	var mobile = document.getElementById("mobile").value;

	if (name && mobile) {
		var checkboxes = document.querySelectorAll('input[type="checkbox"]');
		var slots = document.getElementsByClassName("empty");
		var count = 0;

		for (var i = 0; i < checkboxes.length && count < checkboxes.length; i++) {
			if (checkboxes[i].checked && slots[i].innerHTML === "") {
				slots[i].innerHTML = name;
				checkboxes[i].disabled = true;
				count++;
			}
		}
		checkedCount = 0;
		updateReserveButtonLabel();

		saveDataToStorage();

		closeModal();
	} else {
		alert("Please enter both name and mobile number.");
	}
}

function updateReserveButtonLabel() {
	var reserveButton = document.getElementById("reserve-button");
	reserveButton.innerHTML = "Reserve slot here (" + checkedCount + ")";
}

function saveDataToStorage() {
	var slots = document.getElementsByClassName("empty");
	var data = {};

	for (var i = 0; i < slots.length; i++) {
		data["slot" + (i + 1)] = slots[i].innerHTML;
	}

	sessionStorage.setItem("reservationData", JSON.stringify(data));

	localStorage.setItem("reservationData", JSON.stringify(data));
}

function loadDataFromStorage() {
	var sessionData = sessionStorage.getItem("reservationData");
	var localData = localStorage.getItem("reservationData");
	var storedCount = sessionStorage.getItem("checkedCount");

	if (sessionData || localData) {
		data = JSON.parse(sessionData || localData);
		var slots = document.getElementsByClassName("empty");
		var checkboxes = document.querySelectorAll('input[type="checkbox"]');

		for (var i = 0; i < slots.length; i++) {
			var slotData = data["slot" + (i + 1)];
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

document.getElementById("reserve-button").addEventListener("click", openModal);

var checkboxes = document.querySelectorAll('input[type="checkbox"]');
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
});
