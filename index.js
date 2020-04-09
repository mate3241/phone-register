const readlineSync = require('readline-sync');
const table = require('table');
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: 'toor',
    database: 'phoneregister'
  }
});

const selectAll = async () => {
  await knex.from('numbers').select()
    .then(rows => {
      for (const row of rows) {
        console.log(row.phoneNumber, row.firstName, row.lastName);
      }
    });
};

const numberByName = async () => {
  const firstName = readlineSync.question('First name of person? ');
  const lastName = readlineSync.question('Last name of person? ');
  const returnValue = await knex.from('numbers').select('*').where('firstName', firstName).andWhere('lastName', lastName);
};

const newNumber = async () => {
  const firstName = readlineSync.question('First name of person? ');
  const lastName = readlineSync.question('Last name of person? ');
  const number = readlineSync.question('Number to add? ');
  await knex('numbers').insert({ firstName: firstName, lastName: lastName, phoneNumber: number });
};

const modifyNumber = async () => {
  const originalNumber = readlineSync.question('Number to modify? ');
  const newNumber = readlineSync.question('New number? ');
  await knex('numbers').where({ phoneNumber: originalNumber }).update({ phoneNumber: newNumber });
};

const deleteNumber = async () => {
  const numberToDelete = readlineSync.question('Number to delete? ');
  await knex('numbers').where({ phoneNumber: numberToDelete }).del();
};

const menu = async () => {
  const options = ['List numbers', 'Search by name', 'Insert number', 'Modify Number', 'Delete number'];
  const queries = [selectAll, numberByName, newNumber, modifyNumber, deleteNumber];
  const prompt = 'Válassz a menüpontok közül:';
  const index = readlineSync.keyInSelect(options, prompt, { cancel: 'Kilépés' });
  if (index === -1) {
    console.log('Viszlát!');
    process.exit();
  } else {
    await queries[index]();
  }
  const newQuery = readlineSync.keyInYN('Another query?');
  if (newQuery === true) {
    menu();
  } else {
    process.exit();
  }
};

const main = () => {
  menu();
};

main();
