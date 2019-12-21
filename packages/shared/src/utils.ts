export const encode = (obj: any) =>
  Buffer.from(JSON.stringify(obj)).toString("base64");

export const decode = (str: string) =>
  JSON.parse(Buffer.from(str, "base64").toString());
