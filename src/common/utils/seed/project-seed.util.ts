import * as Faker from 'faker';

import {
  CleanupRequiredType,
  DrainageType,
  MachineAccessType,
  OpinionType,
  PreferredColor,
  PreferredPricePoint,
  ProjectAccessoryType,
  ProjectLocationType,
  ProjectShapeType,
  ProjectTimelineType,
  PropertyGradeType,
  SoilType,
} from '../../../project/enums';
import { randomElementArray, randomEnumElement, randomImageUrlArray } from '../common.util';
import { MaterialType } from '../../../idea-board/enums';
import { getFromDto } from '../repository.util';
import { ProjectAccessory } from '../../../project/entities/project-accessory.entity';
import { Project } from '../../../project/entities/project.entity';
import { ImageAttachment } from '../../../project/entities/image-attachment.entity';
import { ctLatitude, ctLongitude } from './consts';

export function generateProjectAccessory() {
  const projectAccessory = {
    type: randomEnumElement(ProjectAccessoryType),
    materials: randomElementArray(randomEnumElement, MaterialType, { min: 1, max: 5 }),
    locationType: randomEnumElement(ProjectLocationType),
    size: String(Faker.random.number({ min: 50, max: 1000 })),
    shape: randomEnumElement(ProjectShapeType),
    groundState: Faker.random.words(3),
    comment: Faker.random.words(20),
  };
  return getFromDto<ProjectAccessory>(projectAccessory, new ProjectAccessory());
}

export function generateProject() {
  const project = {
    name: Faker.random.words(5),
    address: Faker.address.streetAddress(true),
    projectType: randomEnumElement(ProjectAccessoryType),
    locationType: randomEnumElement(ProjectLocationType),
    projectSize: String(Faker.random.number({ min: 100, max: 500 })),
    shapeType: randomEnumElement(ProjectShapeType),
    accessories: randomElementArray(generateProjectAccessory, ProjectAccessoryType, { min: 3, max: 5 }),
    machineAccess: randomEnumElement(MachineAccessType),
    propertyGrade: randomEnumElement(PropertyGradeType),
    soilType: randomEnumElement(SoilType),
    drainageType: randomEnumElement(DrainageType),
    timelineType: randomEnumElement(ProjectTimelineType),
    budget: Faker.random.number({ min: 10000, max: 500000 }),
    comment: Faker.random.words(30),
    attachments: randomImageUrlArray().map(url => new ImageAttachment(url)),
    interestedInFinancing: randomEnumElement(OpinionType),
    designRequired: true,
    cleanUpType: randomEnumElement(CleanupRequiredType),
    materials: randomElementArray(randomEnumElement, MaterialType, { min: 2, max: 5 }),
    requestDetails: Faker.random.words(20),
    manufacturer: Faker.random.word(),
    productName: Faker.random.word(),
    preferredSize: String(Faker.random.number()),
    preferredTexture: Faker.random.word(),
    preferredPricePoint: randomEnumElement(PreferredPricePoint),
    preferredColors: randomElementArray(randomEnumElement, PreferredColor, { min: 1, max: 3 }),
    additionalDesigns: Faker.random.words(2),
    exteriorUtilities: Faker.random.words(2),
    exteriorHazards: Faker.random.words(2),
    exteriorInconveniences: Faker.random.words(2),
    materialStorage: Faker.random.words(2),
    materialHaulOut: Faker.random.words(2),
    downSpouts: Faker.random.words(2),
    latitude: Faker.random.number(10000) / 10000 + ctLatitude,
    longitude: Faker.random.number(10000) / 10000 + ctLongitude,
    shrubRemoval: Faker.random.words(2),
  };
  return getFromDto<Project>(project, new Project());
}
