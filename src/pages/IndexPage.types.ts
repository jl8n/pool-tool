interface HeaterOptions {
  total: number;
  gas: number;
  solar: number;
  heatpump: number;
  ultratemp: number;
  hybrid: number;
  mastertemp: number;
  maxetherm: number;
}

export interface TempBody {
  id: number;
  heaterOptions: HeaterOptions;
  isCovered: boolean;
  heaterCooldownDelay: boolean;
  startDelay: boolean;
  stopDelay: boolean;
  showInDashboard: boolean;
  heatMode: {
    val: number;
    name: string;
    desc: string;
  };
  name: string;
  setPoint: number;
  circuit: number;
  type: {
    val: number;
    name: string;
    desc: string;
  };
  heatStatus: {
    val: number;
    name: string;
    desc: string;
  };
  isOn: boolean;
}

export interface NixieResponse {
  systemUnits: {
    val: number;
    name: string;
    desc: string;
  };
  startTime: string; // ISO 8601 formatted string
  time: string; // ISO 8601 formatted string
  valve: number;
  // delay: {}; // Consider further defining this if usage requires details
  batteryVoltage: number;
  status: {
    val: number;
    name: string;
    desc: string;
    percent: number;
  };
  mode: {
    val: number;
    name: string;
    desc: string;
  };
  appVersion: string;
  appVersionState: {
    gitLocalBranch: string;
    gitLocalCommit: string;
    installed: string;
    status: {
      val: number;
      name: string;
      desc: string;
    };
    nextCheckTime: string; // ISO 8601 formatted string
    githubRelease: string;
    equipmentType: string;
  };
  clockMode: {
    val: number;
    name: string;
  };
  clockSource: {
    val: number;
    name: string;
    desc: string;
  };
  controllerType: string;
  model: string;
  sunrise: string; // May be empty string
  sunset: string; // May be empty string
  nextSunrise: string; // May be empty string
  nextSunset: string; // May be empty string
  freeze: boolean;
  // valveMode: {}; // Consider further defining this if usage requires details
  temps: {
    units: {
      val: number;
      name: string;
      desc: string;
    };
    bodies: TempBody[];
    equipmentType: string;
  };
  equipment: {
    messages: string[];
    controllerType: string;
    shared: boolean;
    dual: boolean;
    single: boolean;
    maxValves: number;
    maxCircuits: number;
    maxFeatures: number;
    maxHeaters: number;
    maxLightGroups: number;
    maxCircuitGroups: number;
    maxSchedules: number;
    maxPumps: number;
    model: string;
    maxBodies: number;
    equipmentType: string;
    softwareVersion: string;
    bootLoaderVersion: string;
  };
  pumps: [];
  valves: [];
  heaters: [];
  chlorinators: [];
  circuits: []
  features: [];
  circuitGroups: [];
  lightGroups: [];
  virtualCircuits: []
  covers: [];
  filters: []
  schedules: [];
  chemControllers: [];
  chemDosers: [];
  delays: [];
}

// Define interfaces for the remaining sub-objects (Pump, Valve, Heater, Chlorinator, Circuit, Feature, CircuitGroup, LightGroup, VirtualCircuit
