export const generateRandomPassword = (min = 10, max = 20) => {
  const passwordChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#@!%&()/';
  const randPwLen = Math.floor(Math.random() * (max - min + 1)) + min;
  return Array(randPwLen).fill(passwordChars).map(function(x) {
    return x[Math.floor(Math.random() * x.length)];
  }).join('');
};

export const concatStringArray = (data: string[]) => {
  let result = '';
  for (let i = 0; i < data.length; i++) {
    result += data[i];
    if (i != data.length - 1) {
      result += ', ';
    }
  }
  return result;
};

export function extractEmailFromString(text: string): string {
  const start = text.indexOf('<') + 1;
  const end = text.indexOf('>');
  if (end === -1) {
    return text;
  }
  return text.slice(start, end);
}

export function enumToLabel(enumValue: any) {
  const source = String(enumValue);
  if (source === '') {
    return '';
  }
  return source.split('_').map(item => {
    const labelItem = item.toLowerCase();
    return labelItem[0].toUpperCase() + labelItem.slice(1);
  }).join(' ');
}

export function splitName(fullName: string): [string, string] {
  if (!fullName) {
    return ['', ''];
  }
  fullName = fullName.trim().replace(/\s\s+/g, ' ');
  const names = fullName.split(' ');
  if (names.length === 1) {
    return ['', names[0]];
  }
  const lastName = names[names.length - 1];
  const firstName = names.slice(0, names.length - 1).join(' ');
  return [firstName, lastName];
}
