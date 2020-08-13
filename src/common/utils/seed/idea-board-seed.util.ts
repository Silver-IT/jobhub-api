import * as Fs from 'fs';

import { Idea } from '../../../idea-board/entities/idea.entity';
import { ProjectAccessoryType } from '../../../project/enums';
import { MaterialType } from '../../../idea-board/enums';
import { S3Folder } from '../../../upload/enums/s3-folder.enum';

const dataFilePath = './data/idea-board-data.txt';

const projectTypeMapping = {
  'pool patio': ProjectAccessoryType.PoolPatio,
  patio: ProjectAccessoryType.Patio,
  'retaining wall': ProjectAccessoryType.RetainingWall,
  walkway: ProjectAccessoryType.Walkway,
  steps: ProjectAccessoryType.Steps,
  other: ProjectAccessoryType.Other,
  driveway: ProjectAccessoryType.DrivewayParking,
  firepit: ProjectAccessoryType.FirePit,
  'raised patio': ProjectAccessoryType.RaisedPatio,
};

const materialTypeMapping = {
  bluestone: MaterialType.BlueStone,
  pavers: MaterialType.Pavers,
  srw: MaterialType.SrwSystems,
  granite: MaterialType.Granite,
  'natural stone': MaterialType.NaturalStone,
  veneer: MaterialType.Veneer,
  other: MaterialType.Other,
};

export function getDummyIdeas(): Idea[] {
  const urlPrefix =  `${process.env.STORAGE_HOST}${S3Folder.IdeaBoard}`;
  const rawIdeas = Fs.readFileSync(dataFilePath).toString();
  const lines = rawIdeas.split(/\r?\n/);
  return lines.map(line => {
    const segs = line.split(/\t/);
    if (segs.length !== 5) {
      return;
    }
    const idea = new Idea();
    idea.indexNumber = Number(segs[0]);
    idea.url = `${urlPrefix}/${segs[0]}.jpg`;
    const projectTypes = segs[1].split(/\//);
    idea.projectType = projectTypeMapping[projectTypes[0].trim()];
    const materialTypes = segs[2].split(/\//);
    idea.materialTypes = materialTypes.map(materialType => materialTypeMapping[materialType.trim()]);
    idea.width = +segs[3];
    idea.height = +segs[4];
    return idea;
  });
}
