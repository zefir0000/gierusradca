const fs = require("fs");
const newslatterFILE = 'common/newslatterList.txt';

function createImageSlug(title) {
  const parts = title.toLowerCase().trim().split(".");
  if (parts.length < 2) return createSlug(title); // brak rozszerzenia

  const ext = parts.pop(); // ostatnia część = rozszerzenie
  const base = parts.join("."); // w razie gdyby było np. "nazwa.z.kropkami.jpg"

  const slug = createSlug(base);
  return `${slug}.${ext}`;
}

function createSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");
}

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-');
  return `${day}.${month}.${year}`;
}

function saveTextFile(filename, content) {
    fs.writeFileSync(filename, content, "utf8");
    console.log(`Plik ${filename} zapisany.`);
}

const SECRET = 'twoj-sekretny-klucz'; // Trzymaj to w .env lub poza kodem źródłowym

function generateConfirmationToken(email) {
  const data = `${email}|${Date.now()}`;
  const base64 = Buffer.from(data).toString('base64');
  const signature = Buffer.from(base64 + SECRET).toString('base64').slice(0, 12); // prosty podpis
  return `${base64}.${signature}`;
}

function verifyConfirmationToken(token) {
  const [base64, signature] = token.split('.');
  if (!base64 || !signature) return null;

  const expectedSig = Buffer.from(base64 + SECRET).toString('base64').slice(0, 12);
  if (expectedSig !== signature) return null;

  const decoded = Buffer.from(base64, 'base64').toString('utf-8');
  const [email, timestamp] = decoded.split('|');

  return { email, timestamp };
}

function loadSubscribers() {
  const content = fs.readFileSync(newslatterFILE, 'utf-8');
  const lines = content.trim().split('\n');

  const records = lines
    .filter(line => line.trim() !== '') // pomija puste linie
    .map(line => {
      try {
        return JSON.parse(line);
      } catch (e) {
        console.warn('Nieprawidłowy JSON:', line);
        return null;
      }
    })
    .filter(Boolean);

  return records;
}
function confirmSubscriber(emailToConfirm) {
  const raw = fs.readFileSync(newslatterFILE, 'utf-8');
  const lines = raw.trim().split('\n');

  const updatedLines = lines.map(line => {
    try {
      const record = JSON.parse(line);
      if (record.email === emailToConfirm && !record.confirmed) {
        record.confirmed = true;
      }
      return JSON.stringify(record);
    } catch (e) {
      console.warn('Nieprawidłowy JSON:', line);
      return line; // nie ruszaj uszkodzonych linii
    }
  });
  console.log(updatedLines, 'lines')


  fs.writeFileSync(newslatterFILE, updatedLines.join('\n') + '\n', 'utf-8');
  console.log(`✔️ Zaktualizowano potwierdzenie dla: ${emailToConfirm}`);
}
function unsubscribe(emailToRemove) {
  const raw = fs.readFileSync(newslatterFILE, 'utf-8');
  const lines = raw.trim().split('\n');
  let email;
  const updatedLines = lines.map(line => {
    try {
      const record = JSON.parse(line);

      if (record.email === emailToRemove) {
        email = record.email;
        record.confirmed = false;
        record.email = this.generateConfirmationToken(record.email)
      }
      return JSON.stringify(record);
    } catch (e) {
      console.warn('Nieprawidłowy JSON:', line);
      return line; // nie ruszaj uszkodzonych linii
    }
  });

  fs.writeFileSync(newslatterFILE, updatedLines.join('\n') + '\n', 'utf-8');
  console.log(`✔️ Zaktualizowano potwierdzenie dla: ${email}`);
}
module.exports = {
  saveTextFile,
  createSlug,
  createImageSlug,
  generateConfirmationToken,
  verifyConfirmationToken,
  loadSubscribers,
  confirmSubscriber,
  unsubscribe,
  formatDate
};