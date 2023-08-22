export interface NightwatchError extends Error {
  detailedErr: string;
  link: string;
  help: string[];
}
