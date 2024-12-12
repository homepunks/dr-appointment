document.addEventListener('DOMContentLoaded', () => {
    const appointmentTypeSelect = document.getElementById('appointment-type');
    const datesContainer = document.getElementById('dates');
    const showMoreButton = document.querySelector('.show-more button');
    const btnNext = document.querySelector('.btn-next');
    const btnBack = document.querySelector('.btn-back');
    const alertButton = document.querySelector('.alert button');

    let scheduleData = []; 
    let selectedDate = '';  

    async function fetchSchedule() {
        try {
            const response = await fetch('https://phydoc-test-2d45590c9688.herokuapp.com/get_schedule');
            if (!response.ok) {
                throw new Error('Failed to fetch schedule');
            }
            scheduleData = await response.json();
            renderDates();
        } catch (error) {
            console.error('Error fetching schedule:', error);
        }
    }

    function renderDates() {
        datesContainer.innerHTML = '';  

        scheduleData.forEach(day => {
            const dateGroup = document.createElement('div');
            dateGroup.classList.add('date-group');
            
            const dateTitle = document.createElement('h2');
            dateTitle.textContent = day.date;
            dateGroup.appendChild(dateTitle);

            day.slots.forEach(slot => {
                const timeSlot = document.createElement('div');
                timeSlot.classList.add('time-slot');
                timeSlot.textContent = `${slot.time}\n${slot.price}₸`;
                timeSlot.addEventListener('click', () => selectTimeSlot(day.date, slot));
                dateGroup.appendChild(timeSlot);
            });

            datesContainer.appendChild(dateGroup);
        });
    }


    function selectTimeSlot(date, slot) {
        selectedDate = date;
        const selectedTime = slot.time;
        const appointmentType = appointmentTypeSelect.value;

        btnNext.disabled = false;

        btnNext.addEventListener('click', () => bookAppointment(appointmentType, selectedDate, selectedTime));
    }

    async function bookAppointment(type, date, time) {
        const appointmentData = {
            type: type,
            date: date,
            time: time
        };

        try {
            const response = await fetch('https://phydoc-test-2d45590c9688.herokuapp.com/appoint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(appointmentData)
            });

            if (!response.ok) {
                throw new Error('Failed to book appointment');
            }

            const result = await response.json();
            alert('Appointment booked successfully!');
            console.log('Appointment Details:', result);
        } catch (error) {
            console.error('Error booking appointment:', error);
            alert('Failed to book appointment');
        }
    }

    showMoreButton.addEventListener('click', () => {
        alert('Show more functionality is not implemented yet.');
    });

    btnBack.addEventListener('click', () => {
        alert('Going back...');
    });

    alertButton.addEventListener('click', () => {
        alert('Here you can find more information about cancellation policies.');
    });

    fetchSchedule();
});
