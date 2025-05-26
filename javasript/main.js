// 1. JS Basics & Setup
console.log("Welcome to the Community Portal");
window.onload = () => alert("Page fully loaded!");

// 5. Objects and Prototypes - Event constructor
class Event {
  constructor(name, date, seats, category, location) {
    this.name = name;
    this.date = new Date(date);
    this.seats = seats;
    this.category = category;
    this.location = location;
  }
  checkAvailability() {
    return this.seats > 0 && this.date > new Date();
  }
}

// 6. Arrays and Methods - events list
let events = [
  new Event("Music Festival", "2025-06-15", 50, "Music", "Park"),
  new Event("Baking Workshop", "2025-07-01", 10, "Workshop", "Community Center"),
  new Event("Soccer Match", "2023-12-01", 0, "Sport", "Stadium"),
  new Event("Jazz Night", "2025-06-20", 5, "Music", "Jazz Club"),
];

// 4. Functions, Scope, Closures, Higher-Order Functions
function addEvent(event) {
  events.push(event);
}

function registerUser(eventName) {
  try {
    const event = events.find(e => e.name === eventName);
    if (!event) throw new Error("Event not found");
    if (!event.checkAvailability()) throw new Error("No seats available or event passed");
    event.seats--;
    return true;
  } catch (error) {
    console.error("Registration error:", error.message);
    return false;
  }
}

function filterEventsByCategory(category, callback) {
  return callback(events.filter(e => !category || e.category === category));
}

// Closure to track total registrations per category
function registrationTracker() {
  let registrations = {};
  return function(category) {
    registrations[category] = (registrations[category] || 0) + 1;
    return registrations[category];
  };
}
const trackRegistration = registrationTracker();

// 7. DOM Manipulation
const eventsContainer = document.querySelector("#eventsContainer");
const eventSelect = document.querySelector("select[name='eventSelect']");

function renderEvents(eventList) {
  eventsContainer.innerHTML = "";
  eventSelect.innerHTML = "<option value=''>Select an event</option>";
  eventList.forEach(event => {
    if (event.checkAvailability()) {
      const card = document.createElement("div");
      card.className = "event-card";
      card.textContent = `${event.name} (${event.category}) - ${event.date.toDateString()} - Seats left: ${event.seats}`;
      eventsContainer.appendChild(card);

      const option = document.createElement("option");
      option.value = event.name;
      option.textContent = event.name;
      eventSelect.appendChild(option);
    }
  });
}

renderEvents(events);

// 8. Event Handling
document.getElementById("categoryFilter").onchange = function() {
  const category = this.value;
  filterEventsByCategory(category, renderEvents);
};

document.getElementById("searchInput").onkeydown = function() {
  const query = this.value.toLowerCase();
  const filtered = events.filter(event => event.name.toLowerCase().includes(query) && event.checkAvailability());
  renderEvents(filtered);
};

// 11. Working with Forms
const form = document.getElementById("registrationForm");
const errorElem = document.getElementById("formError");
const successElem = document.getElementById("formSuccess");

form.addEventListener("submit", function(e) {
  e.preventDefault();
  errorElem.textContent = "";
  successElem.textContent = "";

  const name = form.elements["name"].value.trim();
  const email = form.elements["email"].value.trim();
  const selectedEvent = form.elements["eventSelect"].value;

  if (!name || !email || !selectedEvent) {
    errorElem.textContent = "All fields are required!";
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    errorElem.textContent = "Invalid email address!";
    return;
  }

  // 12. AJAX & Fetch API - Simulate POST registration
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, event: selectedEvent }),
  })
    .then(response => {
      if (!response.ok) throw new Error("Network error");
      return response.json();
    })
    .then(data => {
      setTimeout(() => {
        if (registerUser(selectedEvent)) {
          const category = events.find(e => e.name === selectedEvent).category;
          trackRegistration(category);
          successElem.textContent = `Successfully registered for ${selectedEvent}!`;
          renderEvents(events);
          $(eventsContainer).fadeOut(200).fadeIn(200);
        } else {
          errorElem.textContent = "Registration failed: No seats or event passed.";
        }
      }, 1000);
    })
    .catch(err => {
      errorElem.textContent = "Submission error: " + err.message;
      console.error("Fetch error:", err);
    });
});

// 9. Async JS, Promises, Async/Await (fetch events from mock API)
async function fetchEvents() {
  const spinner = document.createElement("p");
  spinner.textContent = "Loading events...";
  eventsContainer.appendChild(spinner);

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=3");
    if (!response.ok) throw new Error("Failed to fetch events");
    const data = await response.json();

    data.forEach((item, i) => {
      addEvent(new Event(`API Event ${i+1}`, "2025-12-31", 15, "Workshop", "API Location"));
    });

    renderEvents(events);
  } catch (error) {
    console.error(error);
  } finally {
    spinner.remove();
  }
}
fetchEvents();

// 10. Modern JavaScript Features - destructuring & spread example
const cloneEvents = [...events];
const [firstEvent, secondEvent] = cloneEvents;
