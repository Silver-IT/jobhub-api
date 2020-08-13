export function mergeArray(source: any[], dest: any[], compareField = 'id') {
  const added = dest.filter(x => !Boolean(source.find(s => s[compareField] === x[compareField])));
  const deleted = source.filter(x => !Boolean(dest.find(d => d[compareField] === x[compareField])));
  deleted.forEach(x => {
    x.deletedAt = new Date().toISOString();
  });
  return [...source, ...added];
}

export function groupByArray(xs: Array<any>, key: string) {
  return xs.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}
