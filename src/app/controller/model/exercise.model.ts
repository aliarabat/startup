export class Exercise {
  id: string;
  name: string;
  duration: number;
  calories: number;
  date?: Date;
  state?: 'Complete' | 'Cancelled' | null;
}
