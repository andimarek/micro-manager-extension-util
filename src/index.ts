import { execFile, ExecFileOptions } from 'child_process';
import { dirSync } from 'tmp';
const jetpack = require('fs-jetpack');

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

export function existsFile(file: string): boolean | string {
  return jetpack.exists(file);
}

export function gitInit(path: string): Promise<any> {
  return executeCommand('git', ['init'], path)
}

export function touchFile(path: string): void {
  writeToFile(path, '');
}

export function writeToFile(path: string, data: string | object): void {
  jetpack.write(path, data);
}

export function gitClone(url: string, cloneInto: string, workDir: string): Promise<string> {
  return executeCommand('git', ['clone', '--progress', url, cloneInto], workDir);
}

export function gitSetEmailAndUser(repoPath: string, email: string, user: string): Promise<any> {
  return executeCommand('git', ['config', 'user.email', email], repoPath)
    .then(() => executeCommand('git', ['config', 'user.name', user], repoPath));
}

export function gitAdd(repoPath: string, fileInRepo: string): Promise<any> {
  return executeCommand('git', ['add', fileInRepo], repoPath);
}

export function gitCommit(repoPath: string, message: string): Promise<any> {
  return executeCommand('git', ['commit', '-m', message], repoPath);
}

export function newTmpDir(): string {
  return dirSync().name;
}

export function gitStatus(path: string): Promise<string>;
export function gitStatus(path: string, file: string): Promise<string>;
export function gitStatus(path: string, file?: string): Promise<string> {
  const args = ['status', '--porcelain=v2'];
  if (file) {
    args.push(file);
  }
  return executeCommand('git', args, path).then((result) => {
    return result;
  });
}

export function createMockExtensionApi(): ExtensionApi {
  const log: Logger = <any>(() => { });
  log.error = () => { };
  log.debug = () => { };
  const result: ExtensionApi = {
    log,
    registerTask(): Promise<void> {
      return Promise.resolve();
    }
  };
  return result;
}
