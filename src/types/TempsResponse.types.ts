interface Unit {
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
}

interface HeatStatus {
  val: number;
  name: string;
  desc: string;
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
  heatStatus: HeatStatus;
  isOn: boolean;
  setPoint: number;
  name: string;
  coolSetpoint?: number;
}

export interface TempsResponse {
  units: Unit;
  bodies: Body[];
  waterSensor?: number;
  air: number;
  solar?: number;
  equipmentType?: string;
}
