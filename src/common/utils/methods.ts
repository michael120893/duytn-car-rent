export function expiresInToSeconds(expiresIn: string): number {
  const expiresInValue = parseInt(expiresIn);
  const expiresInUnit = expiresIn.slice(-1);

  let expiresInSeconds = expiresInValue;

  switch (expiresInUnit) {
    case 's':
      expiresInSeconds *= 1;
      break;
    case 'm':
      expiresInSeconds *= 60;
      break;
    case 'h':
      expiresInSeconds *= 60 * 60;
      break;
    case 'd':
      expiresInSeconds *= 24 * 60 * 60;
      break;
    default:
      throw new Error('Invalid expiresIn value');
  }

  return expiresInSeconds;
}
