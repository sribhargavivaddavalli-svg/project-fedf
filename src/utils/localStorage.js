// src/utils/localStorage.js
export const getUsers = () => JSON.parse(localStorage.getItem('sevaTrackUsers') || '[]');
export const setUsers = (users) => localStorage.setItem('sevaTrackUsers', JSON.stringify(users));

export const getApplications = () => JSON.parse(localStorage.getItem('sevaTrackApplications') || '[]');
export const setApplications = (apps) => localStorage.setItem('sevaTrackApplications', JSON.stringify(apps));

export const getNotifications = () => JSON.parse(localStorage.getItem('sevaTrackNotifications') || '[]');
export const setNotifications = (notifs) => localStorage.setItem('sevaTrackNotifications', JSON.stringify(notifs));

// Seed default users (admin + sample citizens)
export function seedDefaultUsers() {
	const users = getUsers();
	let changed = false;
	if (!users.some(u => u.username === 'admin')) {
		users.push({
			fullname: 'System Administrator',
			mobile: '9999999999',
			email: 'admin@sevatrack.com',
			username: 'admin',
			password: 'admin123',
			role: 'admin',
			address: 'Secretariat',
			aadhaar: '',
			registeredDate: new Date().toLocaleString()
		});
		changed = true;
	}
	if (!users.some(u => u.username === 'ramesh123')) {
		users.push({
			fullname: 'Ramesh Kumar',
			mobile: '9876543210',
			email: 'ramesh@example.com',
			username: 'ramesh123',
			password: 'user123',
			role: 'citizen',
			address: 'H.No. 4-56, Miyapur, Hyderabad',
			aadhaar: '123456789012',
			registeredDate: new Date().toLocaleString()
		});
		changed = true;
	}
	if (!users.some(u => u.username === 'sita_dev')) {
		users.push({
			fullname: 'Sita Devi',
			mobile: '9988776655',
			email: 'sita@example.com',
			username: 'sita_dev',
			password: 'sita@123',
			role: 'citizen',
			address: '12-34, MG Road, Vijayawada',
			aadhaar: '987654321098',
			registeredDate: new Date().toLocaleString()
		});
		changed = true;
	}
	if (changed) setUsers(users);
}
