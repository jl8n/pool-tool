export interface Feature {
  id: number;
  freezeProtect: boolean;
  action: {
    val: number;
    name: string;
    desc: string;
  };
  type: {
    val: number;
    Name: string;
    desc: string;
    hasHeatSource: boolean;
    body: number;
  };
  showInFeatures: boolean;
  isOn: boolean;
  name: string;
  nameId: number;
  equipmentType: string;

}

export interface SimplifiedSchedule {
  id: number;
  name: string;
  startTime: number;
  endTime: number;
  days: number[];
  isOn: boolean;
  isLight: boolean;
  equipmentType: string;
}

interface Day {
  name: string;
  dow: number;
}

interface ScheduleDays {
  days: Day[];
}

interface Circuit {
  name: string;
}

export interface Schedule {
  id: number;
  startTime: number;
  endTime: number;
  scheduleDays: ScheduleDays;
  circuit: Circuit;
  isOn: boolean;
  isLight: boolean;
  equipmentType: string;
}

export interface ParsedSchedule {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  days: number[];
  isOn: boolean;
  isLight: boolean | undefined;
  equipmentType: string;
}
