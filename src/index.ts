import { execFile, ExecFileOptions } from "child_process";

export function executeCommand(command: string, args: string[], path?: string): Promise<string> {
  mm.log.debug(`execute command ${command} ${args} in path ${path}`);
  const result = new Promise((resolve, reject) => {
    const options: ExecFileOptions = {};
    if (path) {
      options.cwd = path;
    }
    execFile(command, args, options, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stdout, stderr });
        return;
      }
      resolve(stdout);
    });
  });
  return result;
}

export function gitClone(url: string, cloneInto: string, workDir: string): Promise<string> {
  return executeCommand('git', ['clone', '--progress', url, cloneInto], workDir);
}