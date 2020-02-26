export const useLocalStorage = (): [
  string | null | undefined,
  (auth: string) => void
] => {
  return [
    window.localStorage.getItem("auth"),
    (auth: string) => window.localStorage.setItem("auth", auth)
  ];
};
