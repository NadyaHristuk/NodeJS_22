// Подключить модули fs и path

// Создать переменную contactsPath в которую подключить путь к файлу contacts.json,
// который лежит в папке db

function listContacts() {
	fs.readFile(contactsPath, (error, data) => {
		if (error) {
			throw error;
		}
		console.table(JSON.parse(data));
	});
}

function getContactById(contactId) {
	fs.readFile(contactsPath, (error, data) => {
		if (error) {
			throw error;
		}
		const found = JSON.parse(data).find((el) => el.id === contactId);
		console.log(found);
	});
}

function removeContact(contactId) {
	//   ...
	//   функцию прописать самостоятельно
}

function addContact(name, email, phone) {
	//   ...
	//   функцию прописать самостоятельно
}

module.exports = {
	listContacts,
	getContactById,
	removeContact,
	addContact
};
