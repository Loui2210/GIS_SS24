document.addEventListener("DOMContentLoaded", () => {
    // Header und Footer durch DOM reinladen
    const headerHtml = `
        <img src="../img/logo.png" alt="LogoHFU" id="logo" />
        <nav>
            <a href="indexneu.html" class="button">Home</a>
            <a href="eintrag.html" class="button">Eintrag hinzufügen</a>
            <a href="vergangen.html" class="button">Vergangene Abgaben</a>
        </nav>
    `;
    document.getElementById('header').innerHTML = headerHtml;

    const footerHtml = `<a href="impressum.html">Impressum</a>`;
    document.getElementById('footer').innerHTML = footerHtml;

    // Event erstellen mit dem Formular auf der Eintragseite
    const entryForm = document.getElementById('entryForm');
    if (entryForm) {
        entryForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const datum = document.getElementById('datum').value;
            const inhalt = document.getElementById('inhalt').value;
            const zusatzinfos = document.getElementById('zusatzinfos').value;

            const entry = { datum, inhalt, zusatzinfos };
            saveEntry(entry);
        });
    }

    // Einträge anzeigen auf der Startseite
    const entriesTableBody = document.getElementById('entriesTableBody');
    if (entriesTableBody) {
        displayTableEntries(entriesTableBody);
    }

    // Vergangene Einträge anzeigen
    const pastEntriesTableBody = document.getElementById('pastEntriesTableBody');
    if (pastEntriesTableBody) {
        displayPastEntries(pastEntriesTableBody);
    }

    // Kalender anzeigen
    const calendar = document.getElementById('calendar');
    const currentMonth = document.getElementById('currentMonth');
    let displayedDate = new Date();

    if (calendar && currentMonth) {
        displayCalendar(calendar, displayedDate);
        updateMonthDisplay(currentMonth, displayedDate);

        document.getElementById('prevMonth').addEventListener('click', () => {
            displayedDate.setMonth(displayedDate.getMonth() - 1);
            displayCalendar(calendar, displayedDate);
            updateMonthDisplay(currentMonth, displayedDate);
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            displayedDate.setMonth(displayedDate.getMonth() + 1);
            displayCalendar(calendar, displayedDate);
            updateMonthDisplay(currentMonth, displayedDate);
        });
    }
});
//Eintrag wird im lokalen Speicher gespeichert
function saveEntry(entry) {
    let entries = JSON.parse(localStorage.getItem('entries')) || [];
    entries.push(entry);
    localStorage.setItem('entries', JSON.stringify(entries));
    alert('Eintrag erfolgreich gespeichert!');
}
//Einträge werden aus dem lokalen Speicher entnommen und in Tabelle eingefügt
function displayTableEntries(container) {
    const entries = JSON.parse(localStorage.getItem('entries')) || [];
    container.innerHTML = '';

    entries.forEach((entry, index) => {
        const row = document.createElement('tr');
        const restlicheZeit = calculateRemainingTime(entry.datum);

        row.innerHTML = `
            <td>${entry.datum}</td>
            <td>${entry.inhalt}</td>
            <td>${entry.zusatzinfos}</td>
            <td>${restlicheZeit}</td>
            <td><button onclick="deleteEntry(${index})">Löschen</button></td>
        `;
        container.appendChild(row);
    });
}
//alle vergangenen Einträge werden aus dem lokalen Speicher entnommen und in die vergangen Tabelle gesteckt
function displayPastEntries(container) {
    const entries = JSON.parse(localStorage.getItem('entries')) || [];
    container.innerHTML = '';

    const currentDate = new Date();

    entries.forEach((entry, index) => {
        const entryDate = new Date(entry.datum);

        if (entryDate < currentDate) {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${entry.datum}</td>
                <td>${entry.inhalt}</td>
                <td>${entry.zusatzinfos}</td>
                <td><button onclick="deleteEntry(${index})">Löschen</button></td>
            `;
            container.appendChild(row);
        }
    });
}
//Kalender mit dem ausgewählten Monat wird erstellt
function displayCalendar(container, date) {
    const entries = JSON.parse(localStorage.getItem('entries')) || [];
    const currentDate = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    const calendarDays = [];
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        calendarDays.push(new Date(currentYear, currentMonth, day));
    }

    container.innerHTML = '';
    calendarDays.forEach(date => {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.innerText = date.getDate();

        if (date.toDateString() === currentDate.toDateString()) {
            dayDiv.classList.add('today');
        }

        if (entries.some(entry => new Date(entry.datum).toDateString() === date.toDateString())) {
            dayDiv.classList.add('has-entry');
        }

        container.appendChild(dayDiv);
    });
}
//der aktuelle Monat soll als erstes Angezeigt werden
function updateMonthDisplay(container, date) {
    const options = { year: 'numeric', month: 'long' };
    container.innerText = date.toLocaleDateString('de-DE', options);
}
//Restliche Zeit bis zu einem Datum berechnen
function calculateRemainingTime(date) {
    const currentDate = new Date();
    const targetDate = new Date(date);
    const diffTime = Math.abs(targetDate - currentDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (targetDate < currentDate) {
        return "Vergangen";
    } else if (diffDays === 1) {
        return "1 Tag";
    } else {
        return `${diffDays} Tage`;
    }
}
//Einträge aus dem Index des Lokalen Speichers lassen sich löschen
function deleteEntry(index) {
    let entries = JSON.parse(localStorage.getItem('entries')) || [];
    entries.splice(index, 1);
    localStorage.setItem('entries', JSON.stringify(entries));

    const entriesTableBody = document.getElementById('entriesTableBody');
    if (entriesTableBody) {
        displayTableEntries(entriesTableBody);
    }

    const pastEntriesTableBody = document.getElementById('pastEntriesTableBody');
    if (pastEntriesTableBody) {
        displayPastEntries(pastEntriesTableBody);
    }

    const calendar = document.getElementById('calendar');
    const currentMonth = document.getElementById('currentMonth');
    if (calendar && currentMonth) {
        displayCalendar(calendar, new Date());
        updateMonthDisplay(currentMonth, new Date());
    }
}
