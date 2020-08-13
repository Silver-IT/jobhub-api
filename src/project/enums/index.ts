export enum ProjectAccessoryType {
  Steps = 'STEPS',
  SittingWall = 'SITTING_WALL',
  Pillars = 'PILLARS',
  Lighting = 'LIGHTING',
  Patio = 'PATIO',
  RaisedPatio = 'RAISED_PATIO',
  Walkway = 'WALKWAY',
  RetainingWall = 'RETAINING_WALL',
  PoolPatio = 'POOL_PATIO',
  FirePit = 'FIRE_PIT',
  DrivewayParking = 'DRIVEWAY_PARKING',
  Veneer = 'VENEER',
  Fireplace = 'FIREPLACE',
  OutdoorKitchen = 'OUTDOOR_KITCHEN',
  CleaningSanding = 'CLEANING_SANDING',
  MinorRepair = 'MINOR_REPAIR',
  LandscapingPlants = 'LANDSCAPING_PLANTS',
  Other = 'OTHER',
}

export enum ProjectLocationType {
  FrontYard = 'FRONT_YARD',
  BackYard = 'BACK_YARD',
  SideYard = 'SIDE_YARD',
  PartOfPatioDesign = 'PART_OF_PATIO_DESIGN',
  Other = 'OTHER',
}

export enum ProjectShapeType {
  Straight = 'STRAIGHT',
  CurvedCorners = 'CURVED_CORNERS',
  SShaped = 'S_SHAPED',
  FreeForm = 'FREE_FORM',
  Other = 'OTHER',
}

export enum MachineAccessType {
  Yes = 'YES',
  No = 'NO',
  NotSure = 'NOT_SURE',
}

export enum PropertyGradeType {
  Level = 'LEVEL',
  FairlyLevel = 'FAIRLY_LEVEL',
  WellOutOfLevel = 'WELL_OUT_OF_LEVEL',
}

export enum SoilType {
  Clay = 'CLAY',
  Sand = 'SAND',
  Rock = 'ROCK',
  TopSoil = 'TOP_SOIL',
}

export enum DrainageType {
  Dry = 'DRY',
  SoftInSpring = 'SOFT_IN_SPRING',
  WetYearRound = 'WET_YEAR_ROUND',
}

export enum ProjectTimelineType {
  Immediately = 'IMMEDIATELY',
  About30Days = 'ABOUT_30_DAYS',
  About1To3Months = 'ABOUT_1_TO_3_MONTHS',
  About3To6Months = 'ABOUT_3_TO_6_MONTHS',
  MoreThan6Months = 'MORE_THAN_6_MONTHS',
}

export enum ProjectStatusFilterType {
  All = 'ALL',
  EstimatePending = 'ESTIMATE_PENDING',
  FinalProposalPending = 'FINAL_PROPOSAL_PENDING',
  InProgress = 'IN_PROGRESS',
  FinalProposalSent = 'FINAL_PROPOSAL_SENT'
}

export enum OpinionType {
  Yes = 'YES',
  No = 'NO',
  NotSure = 'NOT_SURE'
}

export enum CleanupRequiredType {
  TopSoil = 'TOPSOIL',
  NoTopSoil = 'NO_TOPSOIL',
  TopSoilAndSeed = 'TOPSOIL_AND_SEED',
  Other = 'OTHER',
}

export enum PreferredPricePoint {
  Economy = 'ECONOMY',
  Average = 'AVERAGE',
  AboveAverage = 'ABOVE_AVERAGE',
}

export enum PreferredColor {
  EarthTone = 'EARTH_TONE',
  Brown = 'BROWN',
  ShaleGrey = 'SHALE_GREY',
  ChamplainGrey = 'CHAMPLAIN_GREY',
  OnyxBlack = 'ONYX_BLACK',
  DanvilleBlend = 'DANVILLE_BLEND',
  Sherwood = 'SHERWOOD',
  ChestnutBrown = 'CHESTNUT_BROWN',
  Sandlewood = 'SANDLEWOOD',
  Hickory = 'HICKORY',
  BedfordBrown = 'BEDFORD_BROWN'
}

export enum HardscapeBrand {
  Belgard = 'BELGARD',
  TechoBloc = 'TECHO_BLOC',
  Unilock = 'UNILOCK',
  Cambridge = 'CAMBRIDGE',
  Nicolock = 'NICOLOCK',
  Rinox = 'RINOX',
  Pavestone = 'PAVESTONE',
  Ideal = 'IDEAL',
  Other = 'OTHER',
}

export enum WarrantyWorkmanShip {
  OneYear = '1_YEAR',
  TwoYears = '2_YEARS',
  ThreeYears = '3_YEARS',
  FourYears = '4_YEARS',
  FiveYears = '5_YEARS',
}

export enum EstimateStatus {
  Declined = 'DECLINED',
  Pending = 'PENDING',
  SiteVisitScheduled = 'SITE_VISIT_SCHEDULED',
}

export enum ProposalStatus {
  Declined = 'DECLINED',
  Pending = 'PENDING',
  Accepted = 'ACCEPTED',
}

export enum MilestoneStatus {
  Pending = 'PENDING',
  ReleaseRequested = 'RELEASE_REQUESTED',
  Released = 'RELEASED'
}

export enum ContractStatus {
  Pending = 'PENDING',
  Requested = 'REQUESTED',
  Ready = 'READY',
  Accepted = 'SIGNED'
}
