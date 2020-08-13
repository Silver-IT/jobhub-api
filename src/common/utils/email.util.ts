export function replaceTagsOnMailString(text: string, substitutes: any): string {
  const keys = Object.keys(substitutes);
  keys.forEach(key => {
    text = text.replace(new RegExp('{{' + key + '}}', 'g'), substitutes[key]);
  });
  text = text.replace('{{unsubscribeLink}}', process.env.UNSUBSCRIBE_LINK);
  return text;
}
