import * as Faker from 'faker';
import { UserRole } from '../../enums/user-role.enum';

const mailDomain = 'gmail.com';
const jobhubDomain = 'jdlandscaping.net';
const defaultPassword = 'secret';

const defaultAdmins = [
  { email: 'joe', firstName: 'Joseph', lastName: 'Masciovechio' },
  { email: 'nick', firstName: 'Nick', lastName: 'Masciovechio' },
];

const admins = [
  { email: 'admin.admin1', firstName: 'Joseph', lastName: 'Masciovechio' },
];

const contractors = [
  { email: 'smith', firstName: 'Smith', lastName: 'James' },
  { email: 'johnson', firstName: 'Johnson', lastName: 'John' },
  { email: 'williams', firstName: 'Williams', lastName: 'Robert' },
  { email: 'jones', firstName: 'Jones', lastName: 'Michael' },
];

const customers = [
  { email: 'sydni', firstName: 'Sydni', lastName: 'David' },
  { email: 'bella', firstName: 'Bella', lastName: 'Richard' },
  { email: 'aaron', firstName: 'Aaron', lastName: 'Charles' },
  { email: 'flo', firstName: 'Flo', lastName: 'Thomas' },
  { email: 'frances', firstName: 'Frances', lastName: 'Daniel' },
];

export function generateAccount(email: string, firstName: string, lastName: string, phone: string, role: UserRole) {
  return {
    email: email,
    password: defaultPassword,
    firstName: firstName,
    lastName: lastName,
    phone: phone,
    ideas: [],
    role: role,
  };
}

export function generateContractorAccount(count = 1) {
  const ary = [];
  for (let i = 0; i < count; i++) {
    const firstName = i < contractors.length ? contractors[i].firstName : Faker.name.firstName();
    const lastName = i < contractors.length ? contractors[i].lastName : Faker.name.lastName();
    const mailName = i < contractors.length ? contractors[i].email : firstName;
    const email = `contractor${i + 1}.${mailName}@${jobhubDomain}`;
    ary.push(generateAccount(email, firstName, lastName, Faker.phone.phoneNumber(), UserRole.Contractor));
  }
  return ary;
}

export function generateSuperAdminAccounts() {
  return admins.map(admin => generateAccount(`${admin.email}@${jobhubDomain}`, admin.firstName, admin.lastName, Faker.phone.phoneNumber(), UserRole.SuperAdmin));
}

export function generateDefaultAdminAccounts() {
  return defaultAdmins.map(defaultAdmin => generateAccount(`${defaultAdmin.email}@${jobhubDomain}`, defaultAdmin.firstName, defaultAdmin.lastName, Faker.phone.phoneNumber(), UserRole.SuperAdmin));
}

export function generateCustomerAccount(count = 1) {
  const ary = [];
  for (let i = 0; i < count; i++) {
    const firstName = i < customers.length ? customers[i].firstName : Faker.name.firstName();
    const lastName = i < customers.length ? customers[i].lastName : Faker.name.lastName();
    const mailName = i < customers.length ? customers[i].email : firstName;
    const email = `customer${i + 1}.${mailName}@${mailDomain}`;
    ary.push(generateAccount(email, firstName, lastName, Faker.phone.phoneNumber(), UserRole.Customer));
  }
  return ary;
}
