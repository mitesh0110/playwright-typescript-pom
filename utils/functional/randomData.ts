// Utility to generate random registration data for tests
export function generateRandomRegistrationData(workerIndex = 0) {
  const randomString = (length: number) => Array.from({length}, () => Math.random().toString(36)[2]).join('');
  const randomNumber = (length: number) => Array.from({length}, () => Math.floor(Math.random() * 10)).join('');

  const firstName = 'Test' + randomString(5);
  const lastName = 'User' + randomString(5);
  const address = `${Math.floor(Math.random() * 1000)} Main St`;
  const city = 'City' + randomString(4);
  const state = randomString(2).toUpperCase();
  const zipCode = randomNumber(5);
  const phoneNumber = randomNumber(10);
  const ssn = `${randomNumber(3)}-${randomNumber(5)}-${randomNumber(4)}`;

  // Username: 5 random chars + 3 random digits (as before)
  const username = randomString(5) + randomNumber(3);

  // Password: use CryptoJS to generate and encrypt a strong password, then use a substring for the plain password
  const CryptoJS = require('crypto-js');
  const secretKey = 'SECRET';
  const specials = '!@#$%';
  const allChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' + specials;
  // Generate a random password up to 17 chars
  let rawPassword = Array.from({length: 12 + Math.floor(Math.random() * 6)}, () => allChars[Math.floor(Math.random() * allChars.length)]).join('');
  const encryptedPassword = CryptoJS.AES.encrypt(rawPassword, secretKey).toString();
  // Use the first 12 characters of the encrypted password as the plain password
  const plainPassword = encryptedPassword.substring(0, 12);

  return {
    firstName,
    lastName,
    address,
    city,
    state,
    zipCode,
    phoneNumber,
    ssn,
    username,
    password: plainPassword,
    plainPassword: plainPassword,
    confirmPassword: plainPassword
  };
}
export function generateRandomPayeeData() {
  const randomString = (length: number) => Array.from({length}, () => Math.random().toString(36)[2]).join('');
  const randomNumber = (length: number) => Array.from({length}, () => Math.floor(Math.random() * 10)).join('');

  const payeeName = 'Payee' + randomString(5);
  const address = `${Math.floor(Math.random() * 1000)} Payee St`;
  const city = 'PayeeCity' + randomString(4);
  const state = randomString(2).toUpperCase();
  const zipCode = randomNumber(5);
  const phoneNumber = randomNumber(10);
  const accountNumber = randomNumber(5);
  const verifyAccountNumber = accountNumber;
  const amount = (Math.random() * 1000).toFixed(2); // Random amount up to $1000

  return {
    payeeName,
    address,
    city,
    state,
    zipCode,
    phoneNumber,
    accountNumber,
    verifyAccountNumber,
    amount
  };
}
