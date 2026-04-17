const contactForm = document.getElementById('contactForm');
const contactList = document.getElementById('contactList');
const contactCount = document.getElementById('contactCount');
const messageDiv = document.getElementById('message');
const detailModal = document.getElementById('detailModal');
const contactDetails = document.getElementById('contactDetails');
const closeBtn = document.querySelector('.close-btn');

const API_URL = '/api/contacts';

let currentContactId = null;

async function fetchContacts() {
    try {
        const response = await fetch(API_URL);
        const contacts = await response.json();
        
        contactCount.textContent = `${contacts.length} Contatos`;
        renderContacts(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        contactList.innerHTML = '<div class="error">Erro ao carregar contatos</div>';
    }
}

function renderContacts(contacts) {
    if (contacts.length === 0) {
        contactList.innerHTML = '<div class="empty">Nenhum contato ativo encontrado.</div>';
        return;
    }

    contactList.innerHTML = contacts.map(contact => `
        <div class="contact-card" onclick="viewDetails('${contact._id}')">
            <div class="contact-info">
                <h3>${contact.name}</h3>
                <p>${contact.age} anos • ${contact.gender}</p>
            </div>
            <div class="contact-actions">
                <span>Ver detalhes ›</span>
            </div>
        </div>
    `).join('');
}

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            showMessage('Contato criado com sucesso!', 'success');
            contactForm.reset();
            fetchContacts();
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        showMessage('Erro de conexão com o servidor', 'error');
    }
});

async function viewDetails(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const contact = await response.json();

        if (response.ok) {
            currentContactId = id;
            const birthDate = new Date(contact.birthDate).toLocaleDateString('pt-BR');
            contactDetails.innerHTML = `
                <div class="detail-item"><strong>Nome:</strong> ${contact.name}</div>
                <div class="detail-item"><strong>Data Nasc:</strong> ${birthDate}</div>
                <div class="detail-item"><strong>Idade:</strong> ${contact.age} anos</div>
                <div class="detail-item"><strong>Sexo:</strong> ${contact.gender}</div>
                <div class="detail-item"><strong>Status:</strong> ${contact.isActive ? 'Ativo' : 'Inativo'}</div>
            `;
            detailModal.style.display = 'block';
        } else {
            alert(contact.message);
        }
    } catch (error) {
        console.error('Error fetching details:', error);
    }
}

document.getElementById('deactivateBtn').addEventListener('click', async () => {
    if (!currentContactId) return;

    try {
        const response = await fetch(`${API_URL}/${currentContactId}/deactivate`, {
            method: 'PATCH'
        });

        if (response.ok) {
            detailModal.style.display = 'none';
            fetchContacts();
        }
    } catch (error) {
        console.error('Error deactivating:', error);
    }
});

document.getElementById('deleteBtn').addEventListener('click', async () => {
    if (!currentContactId || !confirm('Deseja realmente excluir este contato?')) return;

    try {
        const response = await fetch(`${API_URL}/${currentContactId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            detailModal.style.display = 'none';
            fetchContacts();
        }
    } catch (error) {
        console.error('Error deleting:', error);
    }
});

function showMessage(msg, type) {
    messageDiv.textContent = msg;
    messageDiv.className = `message ${type}`;
    setTimeout(() => {
        messageDiv.className = 'message';
    }, 5000);
}

closeBtn.onclick = () => detailModal.style.display = 'none';
window.onclick = (e) => {
    if (e.target == detailModal) detailModal.style.display = 'none';
};

fetchContacts();
