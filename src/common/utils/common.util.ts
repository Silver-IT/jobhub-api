import * as Faker from 'faker';

interface RandOption {
  min: number;
  max: number;
}

export function randomEnumElement(T) {
  return Faker.random.arrayElement(Object.values(T));
}

export function randomElementArray(randFunc, T, options?: RandOption) {
  const min = options ? options.min : 0;
  const max = options ? options.max : 10;
  const randomElementCount = Faker.random.number({ min, max });
  const elements = [];
  for (let i = 0; i < randomElementCount; i++) {
    elements.push(randFunc(T));
  }
  return elements;
}

export function randomPhoneNumbers(options?: RandOption) {
  const min = options ? options.min : 1;
  const max = options ? options.max : 2;
  const randomElementCount = Faker.random.number({ min, max });
  const elements = [];
  for (let i = 0; i < randomElementCount; i++) {
    elements.push(Faker.phone.phoneNumber('###-###-####'));
  }
  return elements;
}

export function randomImageUrlArray(options?: RandOption): string[] {
  const min = options ? options.min : 0;
  const max = options ? options.max : 10;
  const randomImageCount = Faker.random.number({ min, max });
  const elements = [];
  for (let i = 0; i < randomImageCount; i++) {
    elements.push(Faker.internet.avatar());
  }
  return elements;
}

