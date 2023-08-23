export interface NightwatchNodeError extends NodeJS.ErrnoException {
  detailedErr?: string;
  link?: string;
  help?: string[];
  extraDetail?: string;
  showTrace?: boolean;
  reportShown?: boolean;
}
