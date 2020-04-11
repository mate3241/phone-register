const readlineSync = require('readline-sync');
const { table } = require('table');
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
  const value = await knex.from('numbers').select();
  drawTable(value);
};

const numberByName = async () => {
  const firstName = readlineSync.question('First name of person? ');
  const lastName = readlineSync.question('Last name of person? ');
  const value = await knex.from('numbers').select().where('firstName', firstName).andWhere('lastName', lastName);
  drawTable(value);
};

const drawTable = (value) => {
  if (value.length !== 0) {
    const data = [];
    data[0] = Object.keys(value[0]);
    value.forEach(row => {
      data.push(Object.values(row));
    });
    console.log(table(data));
  } else {
    console.log('Found nothing.');
  }
};

const newNumber = async () => {
  const firstName = readlineSync.question('First name of person? ');
  const lastName = readlineSync.question('Last name of person? ');
  const number = readlineSync.question('Number to add? ');
  await knex('numbers').insert({ firstName: firstName, lastName: lastName, phoneNumber: number });
  console.log('Added');
};

const modifyNumber = async () => {
  const originalNumber = readlineSync.question('Number to modify? ');
  const newNumber = readlineSync.question('New number? ');
  await knex('numbers').where({ phoneNumber: originalNumber }).update({ phoneNumber: newNumber });
  console.log('Modified');
};

const deleteNumber = async () => {
  const numberToDelete = readlineSync.question('Number to delete? ');
  await knex('numbers').where({ phoneNumber: numberToDelete }).del();
  console.log('Deleted');
};

const menu = async () => {
  const options = ['List numbers', 'Search by name', 'Insert number', 'Modify Number', 'Delete number'];
  const queries = [selectAll, numberByName, newNumber, modifyNumber, deleteNumber];
  const prompt = 'Please choose:';
  const index = readlineSync.keyInSelect(options, prompt, { cancel: 'Quit' });
  if (index === -1) {
    console.log('Goodbye!');
    process.exit();
  } else {
    try {
      await queries[index]();
    } catch (error) {
      console.log('Problem with database.');
      console.log(error);
      process.exit();
    }
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
