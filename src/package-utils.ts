import path from 'path';
import fs from 'fs';

function getCallerFile() {
    var filename;

    var _pst = (Error as any).prepareStackTrace
    Error.prepareStackTrace = function (err: any, stack: any) { return stack; };
    try {
        var err: any = new Error();
        var callerfile;
        var currentfile;

        currentfile = err!.stack!.shift()!.getFileName();

        while (err!.stack!.length) {
            callerfile = err!.stack!.shift()!.getFileName();

            if(currentfile !== callerfile) {
                filename = callerfile;
                break;
            }
        }
    } catch (err) {}
    (Error as any).prepareStackTrace = _pst;

    return filename;
}

function getCallerFileByIndex(index: number) {
    var filename;

    var _pst = (Error as any).prepareStackTrace
    Error.prepareStackTrace = function (err: any, stack: any) { return stack; };
    try {
        var err: any = new Error();
        var callerfile;
        var currentfile;

        for (let i=0; i<index; i++) {
          currentfile = err!.stack!.shift()!.getFileName();
        }
        filename = currentfile;
    } catch (err) {}
    (Error as any).prepareStackTrace = _pst;

    return filename;
}

/**
* Nest size if the directory nesting level below package.json in the
* calling function.
*/
export function getPackageJson(nestSize: number, callerIndex = 1): any {
  let callerFileName;
  if (callerIndex == 1) {

   callerFileName = getCallerFile();
  } else {
    callerFileName = getCallerFileByIndex(callerIndex);
  }
  const upDirs = getUpDirs(nestSize);
   const packageJson = JSON.parse(fs.readFileSync(path.join(path.dirname(callerFileName), upDirs, 'package.json')).toString());
  return packageJson;

  
}

function getUpDirs(nestSize: number) {
  let upDirs = "";
for(let i=0 ;i<nestSize; i++) {
  upDirs += "../";
}
  return upDirs;
}
