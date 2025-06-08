import path from "path";

export function getPathRelativeOrAbsoluteCwd(dirPath?: string) {
  if (dirPath) {
    if (dirPath.startsWith("/")) {
      return path.join(dirPath);
    } else {
      return path.join(process.cwd(), dirPath);
    }
  }

  return process.cwd();
}
