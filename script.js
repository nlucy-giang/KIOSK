document.addEventListener("DOMContentLoaded", function() {
  function resetSelectedTimeSlotsForAllRooms() {
    rooms.forEach(function(room) {
        room.selectedTimeSlots = []; // Reset selectedTimeSlots to an empty array
    });
}
function resetSquareSelection() {
    // Get all the squares
    var squares = document.querySelectorAll('.time-square');

    // Remove the selected state from each square
    squares.forEach(function(square) {

      if (square.classList.contains("yellow")) {
          // If it's yellow, make it blue
          square.classList.remove("yellow");
          square.classList.add("blue");
      }
    });
}
  console.log(bookedRooms);
  // Get the input and checkbox elements
    var preferredEmailInput = document.getElementById('preferredEmail');
    var udcEmailCheckbox = document.getElementById('udcEmail');

    // Initially disable the input
    preferredEmailInput.disabled = true;

    // Add event listener to the checkbox
    udcEmailCheckbox.addEventListener('change', function() {
      // Enable/disable the input based on the checkbox status
      preferredEmailInput.disabled = this.checked;

      // If checkbox is checked, clear the input value
      if (this.checked) {
        preferredEmailInput.value = '';
      }
    });
  // Display room information in the accordion menu
  var roomsByFloor = {};
rooms.forEach(function(room) {
    if (!roomsByFloor.hasOwnProperty(room.floor)) {
        roomsByFloor[room.floor] = [];
    }
    roomsByFloor[room.floor].push(room);
});
  var accordionItems = document.querySelectorAll(".accordion-item");

  for (var floor in roomsByFloor) {
      if (roomsByFloor.hasOwnProperty(floor)) {
          var accordionItem = Array.from(accordionItems).find(item => item.querySelector(".accordion-header").textContent.trim() === "Floor " + floor);
          if (accordionItem) {
            var accordionContent = accordionItem.querySelector(".accordion-content");
            var floorRooms = roomsByFloor[floor];


              floorRooms.forEach(function(room) {


                var buttonContent = document.createElement("div");
                buttonContent.classList.add("button-content");

                // Create the button element
                var button = document.createElement("button");
                button.textContent = "Book";
                button.classList.add("book-button");
                button.setAttribute("id", "bookButtonID" + room.roomNum);

                // Append the button to the buttonContent element
                buttonContent.appendChild(button);


                var timeLabelDiv = document.createElement("div");
                timeLabelDiv.classList.add("time-labels-container");
                timeLabels.forEach(function(time) {
                    var timeContainer = document.createElement("span");
                    timeContainer.classList.add("times-container");
                    timeContainer.textContent = time;
                    timeLabelDiv.appendChild(timeContainer);
                });
                // Create the content for Row 2

                var row2Content = document.createElement("div");
                row2Content.appendChild(timeLabelDiv);
                row2Content.appendChild(createAvailableTimesHTML(room));
                // Array to store selected time slots for each room
                  // Create the content for Row 1
                  var roomItem = document.createElement("div");
                  roomItem.classList.add("roomItem");
                  var row1Content = document.createElement("div");
                  row1Content.classList.add("row1");
                  var roominfo = document.createElement("div");
                  roominfo.innerHTML = room.name;

                  if (room.charge) {
                      roominfo.innerHTML += `<img src="charging.png" alt="Charging" />`;
                  }
                  if (room.handicap) {
                      roominfo.innerHTML += `<img src="handicap.png" alt="Handicap" />`;
                  }
                  if (room.monitor) {
                      roominfo.innerHTML += `<img src="monitor.png" alt="Monitor" />`;
                  }
                  if (room.whiteboard) {
                      roominfo.innerHTML += `<img src="whiteboard.png" alt="Whiteboard" />`;
                  }
                  roominfo.innerHTML += `&nbsp&nbsp<img src="ppl.png" alt="person icon" id="pplicon"/>`;
                  roominfo.innerHTML += '&nbsp<span class="seats">' + room.seats + '</span>';


                  row1Content.appendChild(roominfo);
                  row1Content.appendChild(buttonContent);
                  roomItem.appendChild(row1Content);
                  roomItem.appendChild(row2Content);
                  accordionContent.appendChild(roomItem);
              });
          }
      }
  }

  document.querySelectorAll('.time-square').forEach(function(square) {
  square.addEventListener('click', function() {
  if (square.getAttribute('data-available') == "true") {
  // Get the time associated with the clicked square
  var time = square.getAttribute('data-time');
  var roomNumber = parseInt(square.getAttribute('data-room'));
  // Check if the square is already selected
  var index = rooms[roomNumber].selectedTimeSlots.indexOf(time);
  // if square is consecutive to the prior selected or if it is the same square or if selectedTimeSlots is empty, continue
  // else console.log('Square is not consecutive.')
  // if this is already selected
  if (index !== -1) {
      square.classList.remove("yellow");
      square.classList.add("blue");
      rooms[roomNumber].selectedTimeSlots.splice(index, 1); // Remove the time
  } else {
    // if it isn't the first selected, check to see if it matches the requirements
    if (rooms[roomNumber].selectedTimeSlots.length !== 0) {
      var timeString1 = rooms[roomNumber].selectedTimeSlots[0];
        var firstTime = parseInt(timeString1.split(':')[0]);
        if (timeString1.includes('30')) {
            firstTime += 0.5; // Add 0.5 hours (30 minutes)
        }
        console.log(firstTime);

        var timeString2 = rooms[roomNumber].selectedTimeSlots[rooms[roomNumber].selectedTimeSlots.length - 1];
        var lastTime = parseInt(timeString2.split(':')[0]);
        if (timeString2.includes('30')) {
            lastTime += 0.5; // Add 0.5 hours (30 minutes)
        }
        console.log(lastTime);

        var squareTimeValue = parseInt(time.split(':')[0]);
        if (time.includes('30')) {
            squareTimeValue += 0.5; // Add 0.5 hours (30 minutes)
        }
        console.log(squareTimeValue);

      if (squareTimeValue === lastTime + 0.5 || squareTimeValue === firstTime - 0.5) {
          // The square's time is consecutive
          console.log("The square's time is consecutive.");
          rooms[roomNumber].selectedTimeSlots.push(time);
          square.classList.remove("blue");
          square.classList.add("yellow");
      } else {
          // The square's time is not consecutive
          console.log("The square's time is not consecutive.");
      }
    } else {
      // if it is the first selected just add
      rooms[roomNumber].selectedTimeSlots.push(time);
      square.classList.remove("blue");
      square.classList.add("yellow");
    }
  }

  // If the square is selected, remove it from selectedTimeSlots; otherwise, add it

  // You can perform any additional logic here, such as updating UI elements
  // For example, you can console.log the selectedTimeSlots for the room
  rooms[roomNumber].selectedTimeSlots.sort();

  console.log(rooms[roomNumber].selectedTimeSlots); // this logs a populated array

} else {
  // Square is not available (not blue), so do nothing or provide feedback to the user
  console.log('Square is not available.');
}
});
});
function findEndTime(roomNumber) {
    // Get the start time of the last selected time slot
    const lastSelectedStartTime = rooms[roomNumber].selectedTimeSlots[rooms[roomNumber].selectedTimeSlots.length - 1];

    // Loop through the timeslots array to find the matching object
    for (let i = 0; i < timeslots.length; i++) {
        if (timeslots[i].startTime === lastSelectedStartTime) {
            // Return the end time of the matching timeslot
            return timeslots[i].endTime;
        }
    }

    // If no matching timeslot is found, return null or handle the case as needed
    return null;
}
function setUpModal(roomNumber) {
  if (rooms[roomNumber].selectedTimeSlots.length === 0) {
    const modal = document.getElementById("emptyListModal");
    modal.style.display = "block";
  } else {
    var endTime = findEndTime(roomNumber);
    const bookinfoelem = document.getElementById("bookinginfo" + roomNumber);
    const globalDATE = "Mar 19, 2024";
    const modalContent = `
        <p>${rooms[roomNumber].name}</p>
        <p id="dateInfo">${globalDATE}</p>
        <p>Time Booked: ${rooms[roomNumber].selectedTimeSlots[0]} to ${endTime}</p>
        <p>Confirm?</p>
    `;
    bookinfoelem.innerHTML = modalContent;
    var yesButton = document.createElement("button");
    yesButton.textContent = "Yes";
    yesButton.setAttribute("id", "yesButton" + roomNumber);
    yesButton.classList.add("yesnoButtonClass");
    bookinfoelem.appendChild(yesButton);
    yesButton.addEventListener("click", function() {
        // Retrieve the start and end time for the selected room
        const startTime = rooms[roomNumber].selectedTimeSlots[0];
        const endTime = findEndTime(roomNumber);

        const globalDATE = "Mar 19, 2024";
        var success = bookRoom(rooms[roomNumber], startTime, endTime, globalDATE);

        // Display appropriate modal based on the result
        if (success === 0) {
          const modal = document.getElementById("bookModal" + roomNumber);
          modal.style.display = "none";
          const confirmModal = document.getElementById("confirmModal");
          confirmModal.style.display = "block";
          console.log(bookedRooms);
          if (endTime) { //asdasdasd
          document.querySelectorAll("#screen9 .rounded-box").forEach(function(box, index) {
              // Clear the existing content of the rounded boxes
              box.innerHTML = '';
              // UPDATE CHECK IN PAGE
              // Check if it's the first rounded box (Available Now) or the second (Available Later)
              if (index === 0) {
                  // Filter available rooms
                  var availableNowRooms = bookedRooms.filter(function(booking) {
                      return booking.available === true;
                  });

                  // Create buttons for available now rooms
                  availableNowRooms.forEach(function(booking) {
                      var button = createRoomButton(booking);
                        // button.classList.add();
                        box.appendChild(button);
                        button.addEventListener('click', function() {
                            showScreen("screen7");
                        });
                  });
              } else if (index === 1) {
                  // Filter rooms not available now (available later)
                  var availableLaterRooms = bookedRooms.filter(function(booking) {
                      return booking.available === false;
                  });

                  // Create buttons for available later rooms
                  availableLaterRooms.forEach(function(booking) {
                      var button = createRoomButton(booking);
                      if (button !== null) {
                        // button.classList.add();
                        box.appendChild(button);
                        button.addEventListener('click', function() {
                            showScreen("screen7");
                        });
                      }
                  });
              }
          });
        }
        } else if (success === 1){
            const modal = document.getElementById("bookModal" + roomNumber);
            modal.style.display = "none";
            const failedModal = document.getElementById("failedModal");
            failedModal.style.display = "block";
        } else if (success === 2){
            const modal = document.getElementById("bookModal" + roomNumber);
            modal.style.display = "none";
            const failedModal2 = document.getElementById("failedModal2");
            failedModal2.style.display = "block";
        }
        const modal = document.getElementById("bookModal" + roomNumber);
        modal.style.display = "none";
    });
    var noButton = document.createElement("button");
    noButton.textContent = "No";
    noButton.classList.add("yesnoButtonClass");
    noButton.setAttribute("id", "noButton" + roomNumber);
    noButton.addEventListener("click", function() {
        // Hide the book modal
        const modal = document.getElementById("bookModal" + roomNumber);
        modal.style.display = "none";
    });
    bookinfoelem.appendChild(noButton);
    // Display the modal
    const modal = document.getElementById("bookModal" + roomNumber);
    modal.style.display = "block";
  }
}

// Event listener for all buttons with the class "book-button"
for (let roomNumber = 0; roomNumber < rooms.length; roomNumber++) {
  const button = document.getElementById("bookButtonID" + roomNumber);
    button.addEventListener('click', function() {
      function findEndTime(roomNumber) {
          // Get the start time of the last selected time slot
          const lastSelectedStartTime = rooms[roomNumber].selectedTimeSlots[rooms[roomNumber].selectedTimeSlots.length - 1];

          // Loop through the timeslots array to find the matching object
          for (let i = 0; i < timeslots.length; i++) {
              if (timeslots[i].startTime === lastSelectedStartTime) {
                  // Return the end time of the matching timeslot
                  return timeslots[i].endTime;
              }
          }

          // If no matching timeslot is found, return null or handle the case as needed
          return null;
      }
        // Retrieve the room number from the button's ID
        setUpModal(roomNumber);
    });
  }

// Event listener for the "Yes" button in the book modal
// Event listeners for the "Close" buttons in the confirm and failed modals
const closeButtonConfirm = document.getElementById("closeButtonConfirm");
closeButtonConfirm.addEventListener("click", function() {
    const confirmModal = document.getElementById("confirmModal");
    resetSelectedTimeSlotsForAllRooms();
    resetSquareSelection();
    confirmModal.style.display = "none";
});

const closeButtonFailed = document.getElementById("closeButtonFailed");
closeButtonFailed.addEventListener("click", function() {
    const failedModal = document.getElementById("failedModal");
    failedModal.style.display = "none";
});

const closeButtonFailed2 = document.getElementById("closeButtonFailed2");
closeButtonFailed2.addEventListener("click", function() {
    const failedModal2 = document.getElementById("failedModal2");
    failedModal2.style.display = "none";
});

const closeButtonEmpty = document.getElementById("closeButtonEmpty");
closeButtonEmpty.addEventListener("click", function() {
    const emptyListModal = document.getElementById("emptyListModal");
    emptyListModal.style.display = "none";
});

  document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
          const parent = header.parentElement;
          const content = parent.querySelector('.accordion-content');

          // Toggle the "hidden" class
          content.classList.toggle('hidden');

          // Scroll to the top of the page
          window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  });

  document.querySelectorAll('.accordion-header').forEach(function(header) {
    header.addEventListener('click', function() {
      var content = this.nextElementSibling;
      if (content.style.display === 'block') {
        content.style.display = 'none';
      } else {
        content.style.display = 'block';
      }

      var backbutt = document.getElementById("backButton2");
      backbutt.addEventListener('click', function() {
          content.style.display = 'none';
      });

      var prev = document.getElementById("prevDate");
      prev.addEventListener('click', function() {
          resetSelectedTimeSlotsForAllRooms();
          resetSquareSelection();
          content.style.display = 'none';
      });

      var next = document.getElementById("nextDate");
      next.addEventListener('click', function() {
          resetSelectedTimeSlotsForAllRooms();
          resetSquareSelection();
          content.style.display = 'none';
      });
    });
    });



  document.querySelectorAll('.accordion-header').forEach(item => {
  item.addEventListener('click', () => {
    const parent = item.parentElement;
    const content = parent.querySelector('.accordion-content');
    content.classList.toggle('hidden'); // Toggle the "hidden" class
  });
});

    // Show the first screen when the page loads
    showScreen("screen1");
    const roomData = [
            { floor: 1, roomNumber: 102, direction: "EAST", times: ["1PM", "2PM", "3PM"] },
            { floor: 1, roomNumber: 103, direction: "West", times: ["1PM", "2PM", "3PM"] },
            // Add more room data as needed
        ];
    // Event listener for screen transitions
    document.getElementById("screen1").addEventListener("click", function() {
        playPingSound();
        showScreen("screen2");
        setTimeout(function() {
            showScreen("screen3");
        }, 500); // 2000
    });

    var currentDate = new Date(2024, 2, 19);
        var dateSelectButton = document.getElementById("dateSelect");
        var flatpickrInstance = null;

        function updateDateButtonText(date) {
                var options = { month: 'short', day: 'numeric', year: 'numeric' };
                dateSelectButton.textContent = date.toLocaleDateString('en-US', options);
            }
            flatpickr("#dateSelect", {
                    dateFormat: "M d, Y",
                    defaultDate: currentDate,
                    onClose: function(selectedDates) {
                        if (selectedDates && selectedDates.length > 0) {
                            currentDate = selectedDates[0];
                            updateDateButtonText(currentDate);
                        }
                        flatpickrInstance.close(); // Close Flatpickr instance after selecting date
                    }
                });
            updateDateButtonText(currentDate);
                // Event listener for the nextDate button
                document.getElementById("nextDate").addEventListener("click", function() {
                    currentDate.setDate(currentDate.getDate() + 1);
                    updateDateButtonText(currentDate);
                });

                // Event listener for the prevDate button
                document.getElementById("prevDate").addEventListener("click", function() {
                    currentDate.setDate(currentDate.getDate() - 1);
                    updateDateButtonText(currentDate);
                });
    // Event listener for button clicks on screen 3
    document.querySelectorAll("#screen3 button").forEach(function(button) {
        button.addEventListener("click", function() {
            var buttonText = button.textContent.trim();
            if (buttonText === "Book a room") {
                showScreen("screen4");
            }
            else if (buttonText === "Check in") {
              showScreen("screen9");
              console.log(bookedRooms);
            }
            else if (buttonText === "BACK") {
              showScreen("screen1");
            }
        });
    });

    document.querySelectorAll("#screen3 button").forEach(function(button) {
      var checkinmd = document.getElementById("checkinModal");
      var cancel = document.getElementById("cancelModal");
        button.addEventListener("click", function() {
            var buttonText = button.textContent.trim();
            if (buttonText === "Check In") {
              checkinmd.style.display = "block";
            }
            else if (buttonText === "Cancel Reservation") {
              cancel.style.display = "block";
            }
            else if (buttonText === "Return") {
              cancel.style.display = "none";
              checkinmd.style.display = "none";
            }

        });
    });

    // Event listener for button clicks on screen 4

    document.querySelectorAll("#screen4 button").forEach(function(button) {
        button.addEventListener("click", function() {
            var buttonText = button.textContent.trim();
            if (buttonText === "View All Rooms") {
                showScreen("screen5");
            } else if (buttonText === "Join Waitlist") {
                showScreen("screen6");
            }
            else if (buttonText === "BACK") {
              showScreen("screen3");
            }
              var modal = document.getElementById("filtermodal");

              // Get the button that opens the modal
              var btn = document.getElementById("filterButton");

              // Get the <span> element that closes the modal
              var span = document.getElementsByClassName("filterclose")[0];
              var span2 = document.getElementsByClassName("show-btn")[0];

              // When the user clicks the button, open the modal
              btn.onclick = function() {
                modal.style.display = "block";
              }

              // When the user clicks on <span> (x), close the modal
              span.onclick = function() {
                modal.style.display = "none";
              }

              span2.onclick = function() {
                modal.style.display = "none";
              }
        });
    });

    document.querySelectorAll("#screen9 button").forEach(function(button) {
        button.addEventListener("click", function() {
            var buttonText = button.textContent.trim();
            if (buttonText === "BACK") {
              showScreen("screen3");
            }
        });
    });


    const modal1 = document.getElementById("myModal");
    const underlay = document.getElementById("modal-overlay");
    document.querySelectorAll("#screen6 button").forEach(function(button) {
        button.addEventListener("click", function() {
            var buttonText = button.textContent.trim();
            if (buttonText === "BACK") {
                showScreen("screen4");
            }
            else if (buttonText === "Join") {
                modal1.style.display = "block";
                underlay.style.display = "block";
            }
            else if (buttonText === "Return") {
              modal1.style.display = "none";
              underlay.style.display = "none";
            }
        });
    });

    document.querySelectorAll("#screen5 button").forEach(function(button) {
        button.addEventListener("click", function() {
            var buttonText = button.textContent.trim();
            if (buttonText === "BACK") {
                resetSelectedTimeSlotsForAllRooms();
                resetSquareSelection();
                showScreen("screen4");
            }
        });
    });

    document.querySelectorAll("#screen7 button").forEach(function(button) {
        button.addEventListener("click", function() {
            var buttonText = button.textContent.trim();
            if (buttonText === "BACK") {
                showScreen("screen9");
            }
        });
    });
    function createRoomButton(booking) {
      if (booking.endTime !== null) {
        var button = document.createElement("div");
        button.classList.add("roomcheckbutton");
        console.log(booking.room.name);
        button.style.whiteSpace = "pre-line";
        button.textContent = `${booking.room.name}\n\n${booking.date}\n${booking.startTime} to ${booking.endTime} `;
        return button;
      }
      return null;
    }
});

function showScreen(screenId) {
    var screens = document.getElementsByClassName("screen");
    for (var i = 0; i < screens.length; i++) {
        screens[i].classList.remove("active");
        if (screens[i].id === screenId) {
            screens[i].style.display = "block";
        } else {
            screens[i].style.display = "none";
        }
    }
    document.getElementById(screenId).classList.add("active");
}

function playPingSound() {
    var pingSound = document.getElementById("pingSound");
    pingSound.play();
}

function Booking(room, startTime, endTime, date) {
    this.room = room;
    this.startTime = startTime;
    this.endTime = endTime;
    if (startTime == '1:00 PM' || startTime == '2:00 PM' || startTime == '1:30 PM' || startTime == '2:30 PM' ) { // fix this
      this.available = true;
    } else {
      this.available = false;
    }
    this.date = date;
}

function Room(name, floor, charge, seats, handicap, monitor, whiteboard, roomNum) {
    this.name = name;
    this.floor = floor;
    this.charge = charge;
    this.seats = seats;
    this.handicap = handicap;
    this.monitor = monitor;
    this.whiteboard = whiteboard;
    this.roomNum = roomNum;
    this.availableTimes = roomTimes[roomNum];
    this.selectedTimeSlots = [];
}


// Sample available times object
function Time(startTime, endTime) {
    this.startTime = startTime;
    this.endTime = endTime;
}

var timeslots = [
  new Time("2:00 PM", "2:30 PM"),
  new Time("2:30 PM", "3:00 PM"),
  new Time("3:00 PM", "3:30 PM"),
  new Time("3:30 PM", "4:00 PM"),
  new Time("4:00 PM", "4:30 PM"),
  new Time("4:30 PM", "5:00 PM"),
  new Time("5:00 PM", "5:30 PM"),
  new Time("5:30 PM", "6:00 PM"),
  new Time("6:00 PM", "6:30 PM"),
  new Time("6:30 PM", "7:00 PM"),
  new Time("7:00 PM", "7:30 PM"),
  new Time("7:30 PM", "8:00 PM"),
  new Time("8:00 PM", "8:30 PM"),
  new Time("8:30 PM", "9:00 PM"),
  new Time("9:00 PM", "9:30 PM"),
  new Time("9:30 PM", "10:00 PM"),
  new Time("10:00 PM", "10:30 PM"),
  new Time("10:30 PM", "11:00 PM"),
  new Time("11:00 PM", "11:30 PM"),
  new Time("11:30 PM", "12:00 AM")
];
var availableTimesF1R1 = [
  timeslots[3],
  timeslots[4],
  timeslots[5],
  timeslots[6],
  timeslots[7],
  timeslots[12],
  timeslots[17],
  timeslots[18],
  timeslots[19],
];

var availableTimesF1R2 = [
  timeslots[2],
  timeslots[3],
  timeslots[8],
  timeslots[10],
  timeslots[17],
  timeslots[18],
  timeslots[19],
];

var availableTimesF2R1 = [
  timeslots[0],
  timeslots[1],
  timeslots[6],
  timeslots[8],
  timeslots[11],
  timeslots[12],
  timeslots[16],
  timeslots[18],
  timeslots[19],
];

var availableTimesF2R2 = [
  timeslots[4],
  timeslots[5],
  timeslots[6],
  timeslots[7],
  timeslots[9],
  timeslots[11],
  timeslots[17],
  timeslots[18],
  timeslots[19]
];

var roomTimes = [
  availableTimesF1R1,
  availableTimesF1R2,
  availableTimesF2R1,
  availableTimesF2R2,
];
// Create Room objects
var rooms = [
    new Room("Room 101 - EAST", 1, true, 4, true, true, false, 0, true),
    new Room("Room 102 - EAST", 1, true, 6, false, true, false, 1, false),
    new Room("Room 201 - WEST", 2, false, 2, false, false, true, 2, true),
    new Room("Room 202 - WEST", 2, true, 5, false, false, true, 3, true)
    // Add more Room objects as needed
];

function createAvailableTimesHTML(room) {
    var availableTimesHTML = document.createElement("div");
    availableTimesHTML.classList.add("available-times");

    // Loop through each timeslot
    timeslots.forEach(function(timeslot) {
        var square = document.createElement("div");
        square.classList.add("time-square");
        square.dataset.time = timeslot.startTime;
        square.dataset.room = room.roomNum;



        // Check if the time is available for this room
        var isAvailable = room.availableTimes.some(function(time) {
            return time.startTime === timeslot.startTime && time.endTime === timeslot.endTime;
        });

        if (isAvailable) {
            square.dataset.available = "true";
            square.classList.add("blue");
            // Add click event listener
        } else {
          square.dataset.available = "false";
            square.classList.add("grey");
        }
        var backBt = document.getElementById("backButton2");
        backBt.addEventListener("click", function() {
          if (square.classList.contains("yellow")) {
            square.classList.remove("yellow");
            square.classList.add("blue");
          }
        });
        availableTimesHTML.appendChild(square);
    });

    return availableTimesHTML;
}

var timeLabels = [
    "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM"
];

var bookedRooms = [];
function bookRoom(room, startTime, endTime, date) {
    // Parse start and end times into Date objects
    var isBooked = 0;
    for (let i = 0; i < bookedRooms.length; i++) {
        const booking = bookedRooms[i];
        if (booking.room === room) {
            isBooked = 2;
            break; // Exit the loop early if the room is already booked
        } else if (booking.startTime === startTime) {
            isBooked = 1;
            break; // Exit the loop early if the time is already booked
        }
    }

    // If the room is not already booked for the selected time, book it
    if (isBooked === 0) {
      var booking = new Booking(room, startTime, endTime, date);
      // Add the booking to the bookedRooms array
      bookedRooms.push(booking);
      var bookingDetails = `${startTime} to ${endTime} - ${date}`;
      document.getElementById("roomheader").textContent = room.name;
      document.getElementById("roomdetails").textContent = bookingDetails;
      return isBooked;

    } else {
      return isBooked;
    }
}
