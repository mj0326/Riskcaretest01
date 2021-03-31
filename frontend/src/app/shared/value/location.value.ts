export class Location {
  dong: string;
  lDongCd: string;
  siDo: string;
  siGunGu: string;
}

export class LocationEdit extends Location {
  isDelete: boolean = false;
  favoriteLocationId: number;
  order: number;

  constructor() {
    super();
  }
}

export class LocationHome extends Location {
  isExpand: boolean = false;
  // contactCovidClass: string;
  // contactIndexPercentile: number = 0;
  contactDensityPercentile: number = 0;
  covidContent: any;
  order: number;

  constructor() {
    super();
  }
}
