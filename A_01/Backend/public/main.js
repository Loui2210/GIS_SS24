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
      event.preventDefault(); // Verhindert Standardverhalten des Formulars

      const datum = document.getElementById('datum').value;
      const inhalt = document.getElementById('inhalt').value;
      const zusatzinfos = document.getElementById('zusatzinfos').value;

      const entry = { datum, inhalt, zusatzinfos };
      saveEntryToDB(entry); // Funktion aufrufen, um den Eintrag zu speichern
    });
  }

  // Funktion zum Speichern eines Eintrags in der Datenbank
  function saveEntryToDB(entry) {
    fetch('http://127.0.0.1:3000/api/beispiele', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entry)
    })
      .then(response => response.json())
      .then(data => {
        alert('Eintrag erfolgreich gespeichert!');
        fetchEntriesFromDB(); // Nach dem Speichern Einträge aktualisieren
      })
      .catch(error => {
        console.error('Fehler beim Speichern des Eintrags:', error);
      });
  }

  // Funktion zum Abrufen und Anzeigen der Einträge auf der Startseite
  function fetchEntriesFromDB() {
    fetch('http://127.0.0.1:3000/api/beispiele')
      .then(response => response.json())
      .then(entries => {
        const entriesTableBody = document.getElementById('entryList');
        entriesTableBody.innerHTML = '';

        entries.forEach(entry => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${entry.datum}</td>
            <td>${entry.inhalt}</td>
            <td>${entry.zusatzinfos}</td>
            <td>${calculateRemainingTime(entry.datum)}</td>
            <td><button onclick="deleteEntryFromDB('${entry._id}')">Löschen</button></td>
          `;
          entriesTableBody.appendChild(row);
        });
      })
      .catch(error => {
        console.error('Fehler beim Abrufen der Einträge:', error);
      });
  }

  // Funktion zum Löschen eines Eintrags aus der Datenbank
  function deleteEntryFromDB(id) {
    fetch(`http://127.0.0.1:3000/api/beispiele/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        alert('Eintrag erfolgreich gelöscht!');
        fetchEntriesFromDB(); // Nach dem Löschen Einträge aktualisieren
      })
      .catch(error => {
        console.error('Fehler beim Löschen des Eintrags:', error);
      });
  }

  // Restliche Zeit bis zu einem Datum berechnen
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

  // Beim Laden der Seite Einträge abrufen und anzeigen
  fetchEntriesFromDB();
});
