interface ScheduleType {
  val: number;
  name: string;
  desc: string;
  startDate?: boolean;
  startTime: boolean;
  endTime: boolean;
  days: string;
  heatSource: boolean;
  heatSetpoint: boolean;
}

interface Day {
  val: number;
  name: string;
  desc: string;
  dow: number;
}

interface ScheduleDays {
  val: number;
  days: Day[];
}

interface ScheduleTime {
  calculatedDate: string;
  startTime: string;
  endTime: string;
  calculated: boolean;
  shouldBeOn: boolean;
}

interface Display {
  val: number;
  name: string;
  desc: string;
}

interface ActionType {
  val: number;
  name: string;
  desc: string;
}

interface CircuitType {
  val: number;
  name: string;
  desc: string;
  isLight?: boolean;
}

interface Circuit {
  id: number;
  freezeProtect: boolean;
  action: ActionType;
  type: CircuitType;
  showInFeatures: boolean;
  isOn: boolean;
  name: string;
  nameId: number;
  equipmentType: string;
}

interface ClockMode {
  val: number;
  name: string;
}

interface Schedule {
  id: number;
  startTimeType: Display;
  endTimeType: Display;
  display: Display;
  circuit: Circuit;
  startTime: number;
  endTime: number;
  scheduleType: ScheduleType;
  scheduleDays: ScheduleDays;
  isActive: boolean;
  scheduleTime: ScheduleTime;
  isOn: boolean;
  equipmentType: string;
  clockMode: ClockMode;
}

export type SchedulesResponse = Schedule[];
