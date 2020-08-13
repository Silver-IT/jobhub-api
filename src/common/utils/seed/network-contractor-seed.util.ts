import * as Faker from 'faker';

import { randomPhoneNumbers } from '../common.util';
import { NetworkContractorCategory } from '../../../network-contractor/entities/network-contractor-category.entity';
import { concatStringArray } from '../string.util';

export const defaultNetworkContractorCategories = [
  'Outdoor Structures',
  'Outdoor Lighting/Design',
  'Fence',
  'Driveway Seal Coat',
  'Power Washing',
];

export function generateNetworkCategories() {
  return defaultNetworkContractorCategories.map(category => ({
    name: category,
    published: true,
  }));
}

export function generateNetworkContractors(categories: NetworkContractorCategory[], count = 1) {
  const ary = [];
  for (let i = 0; i < count; i++) {
    ary.push({
      companyName: Faker.company.companyName(),
      address: Faker.address.streetAddress(),
      contacts: concatStringArray(randomPhoneNumbers({ min: 1, max: 2 })),
      website: Faker.internet.url(),
      serviceDescription: Faker.company.catchPhraseDescriptor(),
      category: Faker.random.arrayElement(categories.map(category => category.id)),
      logoUrl: Faker.image.avatar(),
    });
  }

  return ary;
}
