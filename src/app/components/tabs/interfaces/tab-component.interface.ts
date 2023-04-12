export interface TabComponent {
  title: string;
  component: { new (...args: any[]): any };
}
