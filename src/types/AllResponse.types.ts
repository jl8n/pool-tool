interface SystemUnits {
  val: number;
  name: string;
  desc: string;
}

interface Delay {
  val: number;
  name: string;
  desc: string;
}

interface Status {
  val: number;
  name: string;
  desc: string;
  percent?: number;
}

interface Mode {
  val: number;
  name: string;
  desc: string;
}

interface AppVersionState {
  gitLocalBranch: string;
  gitLocalCommit: string;
  installed: string;
  status: Status;
  nextCheckTime: string;
  githubRelease: string;
  equipmentType: string;
}

interface ClockMode {
  val: number;
  name: string;
}

interface ClockSource {
  val: number;
  name: string;
  desc: string;
}

interface HeaterOption {
  total: number;
  gas: number;
  solar: number;
  heatpump: number;
  ultratemp: number;
  hybrid: number;
  maxetherm: number;
  mastertemp: number;
}

interface HeatMode {
  val: number;
  name: string;
  desc: string;
}

interface CircuitType {
  val: number;
  name: string;
  desc: string;
  hasHeatSource?: boolean;
}

interface Body {
  id: number;
  heaterOptions: HeaterOption;
  isCovered: boolean;
  heaterCooldownDelay: boolean;
  startDelay: boolean;
  stopDelay: boolean;
  showInDashboard: boolean;
  heatMode: HeatMode;
  type: CircuitType;
  circuit: number;
  heatStatus: Status;
  isOn: boolean;
  setPoint: number;
  name: string;
  coolSetpoint?: number;
}

interface Temps {
  units: SystemUnits;
  bodies: Body[];
  waterSensor1: number;
  air: number;
  solar: number;
  equipmentType: string;
}

// Define other nested objects such as Equipment, Pumps, Valves, Heaters, etc.

export interface AllResponse {
  systemUnits: SystemUnits;
  startTime: string;
  time: string;
  valve: number;
  delay: Delay;
  batteryVoltage: number;
  status: Status;
  mode: Mode;
  appVersion: string;
  appVersionState: AppVersionState;
  clockMode: ClockMode;
  clockSource: ClockSource;
  controllerType: string;
  model: string;
  sunrise: string;
  sunset: string;
  nextSunrise: string;
  nextSunset: string;
  freeze: boolean;
  valveMode: object; // Define more specific interface if possible
  temps: Temps;
  // Add other properties like equipment, pumps, valves, heaters, etc.
}
