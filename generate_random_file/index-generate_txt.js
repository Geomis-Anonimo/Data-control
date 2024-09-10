const faker = require("faker");
const fs = require("fs");
const path = require("path");
const folderPath = path.join(__dirname, "file_txt");
const fileName = "mockData.txt";

if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}

const filePath = path.join(folderPath, fileName);

function fillStringNumber(value, totalLength, fillCharacter) {
  const valueString = value.toString();
  const truncatedValue = valueString.slice(0, totalLength);
  const fillingCount = Math.max(0, totalLength - truncatedValue.length);
  const filling = fillCharacter.repeat(fillingCount);
  return `${filling}${truncatedValue}`;
}

function generateMockData() {
  const name = fillStringNumber(
    faker.name.firstName() + " " + faker.name.lastName(),
    15,
    " "
  );

  const age = fillStringNumber(
    faker.datatype.number({ min: 1, max: 100 }).toString().padStart(4, "0"),
    4,
    "0"
  );

  const address = fillStringNumber(
    faker.address.streetAddress() +
      " " +
      faker.address.city().substring(0, 34),
    34,
    " "
  );

  const cpf = fillStringNumber(
    faker.datatype
      .number({ min: 10000000000, max: 99999999999 })
      .toString()
      .padStart(11, "0"),
    11,
    "0"
  );

  const paidAmount = fillStringNumber(
    faker.finance.amount().toString().replace(".", "").padStart(16, "0"),
    16,
    "0"
  );

  const birthDate = fillStringNumber(
    faker.date.past().toISOString().slice(0, 10).replace(/-/g, ""),
    8,
    "0"
  );

  return `${name}${age}${address}${cpf}${paidAmount}${birthDate}`;
}

const writeStream = fs.createWriteStream(filePath);

for (let i = 0; i < 10000; i++) {
  writeStream.write(generateMockData() + "\n");
}

writeStream.end();

console.log(`Dados salvos em ${filePath}`);