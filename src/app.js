const timeSlots = [
  { time: '10:00 AM', booked: false, name: '' },
  { time: '11:00 AM', booked: false, name: '' },
  { time: '12:00 PM', booked: false, name: '' },
  { time: '1:00 PM', booked: false, name: '' },
  { time: '2:00 PM', booked: false, name: '' },
  { time: '3:00 PM', booked: false, name: '' },
  { time: '4:00 PM', booked: false, name: '' },
  { time: '5:00 PM', booked: false, name: '' }
];

const slotsContainer = document.querySelector('.grid');
const bookingModal = document.getElementById('booking-modal');
const closeModalBtn = document.getElementById('close-modal');
const bookingForm = document.getElementById('booking-form');
const cancelBookingBtn = document.getElementById('cancel-booking');
const modalTimeDisplay = document.getElementById('modal-time');
const slotTimeInput = document.getElementById('slot-time');
const nameInput = document.getElementById('name');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const availableCount = document.getElementById('available-count');
const bookedCount = document.getElementById('booked-count');

function init() {
  renderSlots();
  updateStats();
  setupEventListeners();
}

function renderSlots() {
  slotsContainer.innerHTML = '';
  timeSlots.forEach(slot => {
    const slotCard = document.createElement('div');
    slotCard.className = `slot-card bg-white rounded-lg shadow p-4 border-l-4 ${slot.booked ? 'booked border-red-300' : 'available border-green-300'}`;

    slotCard.innerHTML = `
      <div class="flex justify-between items-start mb-2">
        <span class="font-semibold text-gray-800">${slot.time}</span>
        <span class="text-xs px-2 py-1 rounded-full ${slot.booked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}">
          ${slot.booked ? 'Booked' : 'Available'}
        </span>
      </div>
      ${slot.booked ?
        `<div class="mb-4">
          <p class="text-sm text-gray-600">Booked by:</p>
          <p class="font-medium">${slot.name}</p>
        </div>
        <button class="cancel-btn w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition" data-time="${slot.time}">
          <i class="fas fa-times mr-2"></i>Cancel Booking
        </button>` :
        `<button class="book-btn w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition" data-time="${slot.time}">
          <i class="fas fa-bookmark mr-2"></i>Book Slot
        </button>`}
    `;
    slotsContainer.appendChild(slotCard);
  });
}

function updateStats() {
  const availableSlots = timeSlots.filter(slot => !slot.booked).length;
  const bookedSlots = timeSlots.filter(slot => slot.booked).length;

  availableCount.textContent = availableSlots;
  bookedCount.textContent = bookedSlots;
}

function showBookingModal(time) {
  modalTimeDisplay.textContent = `Book ${time}`;
  slotTimeInput.value = time;
  nameInput.value = '';
  bookingModal.classList.remove('modal-closed');
  bookingModal.classList.add('modal-open');
}

function hideBookingModal() {
  bookingModal.classList.remove('modal-open');
  bookingModal.classList.add('modal-closed');
}

function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}

function bookSlot(time, name) {
  const slot = timeSlots.find(slot => slot.time === time);
  if (slot && !slot.booked) {
    slot.booked = true;
    slot.name = name;
    renderSlots();
    updateStats();
    showToast(`Booking confirmed for ${time}!`);
    return true;
  }
  return false;
}

function cancelBooking(time) {
  const slot = timeSlots.find(slot => slot.time === time);
  if (slot && slot.booked) {
    slot.booked = false;
    slot.name = '';
    renderSlots();
    updateStats();
    showToast(`Booking canceled for ${time}`);
    return true;
  }
  return false;
}

function setupEventListeners() {
  closeModalBtn.addEventListener('click', hideBookingModal);
  cancelBookingBtn.addEventListener('click', hideBookingModal);

  bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) hideBookingModal();
  });

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const time = slotTimeInput.value;
    const name = nameInput.value.trim();
    if (name && bookSlot(time, name)) hideBookingModal();
  });

  slotsContainer.addEventListener('click', (e) => {
    const bookBtn = e.target.closest('.book-btn');
    const cancelBtn = e.target.closest('.cancel-btn');

    if (bookBtn) showBookingModal(bookBtn.dataset.time);
    if (cancelBtn && confirm(`Are you sure you want to cancel the booking for ${cancelBtn.dataset.time}?`)) {
      cancelBooking(cancelBtn.dataset.time);
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
