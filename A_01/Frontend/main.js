document.addEventListener('DOMContentLoaded', async function() {
    const entryList = document.getElementById('entryList');

    async function fetchEntries() {
        const response = await fetch('/api/entries');
        const entries = await response.json();
        entryList.innerHTML = '';
        entries.forEach(entry => {
            const listItem = document.createElement('tr');
            listItem.innerHTML = `
                <td>${new Date(entry.date).toLocaleDateString()}</td>
                <td>${entry.title}</td>
                <td>${entry.description}</td>
                <td>${calculateRemainingTime(entry.date)}</td>
                <td><button class="button" onclick="deleteEntry('${entry._id}')">Löschen</button></td>
            `;
            entryList.appendChild(listItem);
        });
    }

    function calculateRemainingTime(date) {
        const now = new Date();
        const entryDate = new Date(date);
        const timeDiff = entryDate - now;
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        return days > 0 ? `${days} Tage` : 'Abgelaufen';
    }

    window.deleteEntry = async function(id) {
        const response = await fetch(`/api/entries/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            fetchEntries();
        } else {
            alert('Fehler beim Löschen des Eintrags');
        }
    };

    fetchEntries();
});
