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
