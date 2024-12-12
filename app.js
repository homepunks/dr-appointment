const API_URL = 'https://phydoc-test-2d45590c9688.herokuapp.com';

// get elements
const appointmentTypeSelect = document.getElementById('appointment-type');
const appointmentDateInput = document.getElementById('appointment-date');
const timeSlotSelect = document.getElementById('time-slot');
const submitBtn = document.getElementById('submit-btn');
const userNameInput = document.getElementById('user-name');
const userContactInput = document.getElementById('user-contact');
const messageContainer = document.getElementById('message');

// fetchin available slots
async function getAvailableSlots(date, type) {
    try {
        const response = await fetch(`${API_URL}/get_schedule?date=${date}&type=${type}`);
        const data = await response.json();

        // populate the time slots dropdown
        if (data.available_times && data.available_times.length > 0) {
            timeSlotSelect.innerHTML = '<option value="">Select a time slot</option>';
            data.available_times.forEach(time => {
                const option = document.createElement('option');
                option.value = time;
                option.textContent = time;
                timeSlotSelect.appendChild(option);
            });
        } else {
            timeSlotSelect.innerHTML = '<option value="">No available slots</option>';
        }
    } catch (error) {
        console.error('Error fetching available slots:', error);
        showMessage('Error fetching available slots.', 'error');
    }
}

// handle appointment form submission
async function handleBooking() {
    const type = appointmentTypeSelect.value;
    const date = appointmentDateInput.value;
    const time = timeSlotSelect.value;
    const name = userNameInput.value;
    const contact = userContactInput.value;

    if (!date || !time || !name || !contact) {
        showMessage('Please fill in all fields.', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/appoint`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type,
                date,
                time,
                name,
                contact
            })
        });

        const data = await response.json();
        if (data.message === 'Appointment created successfully') {
            showMessage('Appointment booked successfully!', 'success');
        } else {
            showMessage('Failed to book appointment. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error booking appointment:', error);
        showMessage('Error booking appointment. Please try again later.', 'error');
    }
}

// success/error (пан или пропал)
function showMessage(message, type) {
    messageContainer.textContent = message;
    messageContainer.style.color = type === 'success' ? 'green' : 'red';
}

// simple event listening
appointmentDateInput.addEventListener('change', () => {
    const selectedDate = appointmentDateInput.value;
    const selectedType = appointmentTypeSelect.value;
    if (selectedDate && selectedType) {
        getAvailableSlots(selectedDate, selectedType);
    }
});

submitBtn.addEventListener('click', handleBooking);
