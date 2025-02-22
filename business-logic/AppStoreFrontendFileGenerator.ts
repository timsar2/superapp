import fs from "fs";
import glob from "glob";
import path from "path";

export default class AppStoreFrontendFileGenerator {
  APP_STORE_PATH = path.join(__dirname, "..", "app-store");
  APPS_PATH = path.join(this.APP_STORE_PATH, "apps");
  GENERATED_FILES_PATH = path.join(this.APP_STORE_PATH, "config", "generated-files");
  FILE_NAME = "frontend.generated.ts";

  generateFile() {
    glob(this.APPS_PATH + "/**/pages/**", (error, files) => {
      if (error) this.generateFileErrorHandling(error);

      const allFilesInCorrectFormat = files
        .filter((file) => this.isFrontendComponent(file))
        .map((file) => this.formatFilePath(file));

      const filePath = `${this.GENERATED_FILES_PATH}/${this.FILE_NAME}`;
      const fileContent = this.generateAppImportsFile(allFilesInCorrectFormat);

      fs.writeFile(filePath, fileContent, this.generateFileErrorHandling);
      console.info(`Generated file: ${filePath}`);
    });
  }

  private generateAppImportsFile(files: string[]) {
    let appImportsContent = "";
    files.forEach((file) => {
      const urlPath = this.buildUrlPathFromFilePath(file);
      appImportsContent += `  "${urlPath}": dynamic(() => import("@app-store/apps/${file}")),\n`;
    });

    return this.fileContent(appImportsContent);
  }

  private isFrontendComponent(file: string) {
    return this.isNonApiFile(file) && this.isFileWithTsTsxJsJsxEnding(file);
  }

  private isNonApiFile(file: string) {
    return !file.includes("/pages/api/");
  }

  private isFileWithTsTsxJsJsxEnding(file: string) {
    const hasTsTsxJsJsxEndingRegex = /.*\.ts$|.*\.tsx$|.*\.js$|.*\.jsx$/;
    const hasTsTsxJsJsxEnding = hasTsTsxJsJsxEndingRegex.test(file);
    return hasTsTsxJsJsxEnding;
  }

  private formatFilePath(file: string) {
    // '/Users/daniel/dev/simba-app/app-store/apps/mini-blog/pages/index.tsx'
    // becomes
    // 'mini-blog/pages/index'
    const relativePath = this.getRelativePathFromFile(file);
    return this.removeFileEnding(relativePath);
  }

  private removeFileEnding(file: string) {
    // 'mini-blog/pages/index.tsx'
    // becomes
    // 'mini-blog/pages/index'
    return file.split(".")[0];
  }

  private getRelativePathFromFile(file: string) {
    // '/Users/daniel/dev/simba-app/app-store/apps/mini-blog/pages/index.tsx'
    // becomes
    // 'mini-blog/pages/index.tsx'
    return file.split("simba-app/app-store/apps/")[1];
  }

  private buildUrlPathFromFilePath(file: string) {
    // 'mini-blog/pages/posts/index'
    // becomes
    // 'mini-blog/posts'
    const url = file.split("/pages/").join("/");
    if (url.endsWith("/index")) return url.split("/index")[0];
    return url;
  }

  private generateFileErrorHandling(error: NodeJS.ErrnoException | null) {
    if (error) console.error(error);
  }

  private fileContent(appImportsContent: string) {
    return `// *********************************************************************
// This file is autogenerated with /cli/app-store-generate-files.ts
// Don't modify this file manually
// *********************************************************************
import dynamic from "next/dynamic";\n
type Imports = { [key: string]: React.ElementType };\n
export const AppImports: Imports = {\n${appImportsContent}};\n`;
  }
}
