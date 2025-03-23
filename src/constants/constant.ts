export const errorToastProps = (option: {
  description: string;
}): {
  variant: "default" | "destructive" | null;
  title: string;
  description: string;
} => ({
  variant: "destructive",
  title: "Oops! Something went wrong",
  description: option.description,
});
