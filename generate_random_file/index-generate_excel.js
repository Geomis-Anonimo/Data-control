const faker = require("faker");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

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

  return [name, age, address, cpf, paidAmount, birthDate];
}

function generateExcel() {
  const data = [];
  for (let i = 0; i < 100000; i++) {
    data.push(generateMockData());
  }

  const headers = [
    "name",
    "age",
    "address",
    "cpf",
    "paidAmount",
    "birthDate",
  ];
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const dir = path.join(__dirname, 'file_excel');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const filePath = path.join(dir, 'mockData.xlsx');
  XLSX.writeFile(workbook, filePath);

  console.log(`Arquivo salvo em: ${filePath}`);
}

generateExcel();
