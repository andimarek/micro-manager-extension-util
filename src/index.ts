import { execFile, ExecFileOptions } from 'child_process';
import { dirSync, fileSync } from 'tmp';
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
        mm.log.debug('command finished with error: ', error, stdout, stderr);
        reject({ error, stdout, stderr });
        return;
      }
      mm.log('command finished with: ', stdout);
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

export function touchFileSync(path: string): void {
  writeFileSync(path, '');
}

export function writeFileSync(path: string, data: string | object): void {
  jetpack.write(path, data);
}

export function assert(value: boolean, message?: string): void {
  if (!value) {
    throw new Error('Assertion error' + message ? (': ' + message) : '');
  }
}

export function assertFileExists(path: string): void {
  const file = existsFile(path);
  assert(file === 'file', `file ${path} doesn't exists`);
}

export function replaceInFileSync(path: string, toReplace: { [key: string]: string }) {
  assertFileExists(path);
  mm.log.debug('replacing ', toReplace, ' in file ', path);
  const currentContent = readFileSync(path);
  let newContent = currentContent;
  for (const key of Object.keys(toReplace)) {
    newContent = newContent!.replace(key, toReplace[key]);
  }
  writeFileSync(path, newContent!);
}

export function findMatchInFileSync(path: string, regex: RegExp): string[] {
  assertFileExists(path);
  const result: string[] = [];
  const fileContent = <string>readFileSync(path);
  let execResult: RegExpMatchArray | null;
  const globalRegEx = new RegExp(regex.source, 'gm');
  while ((execResult = globalRegEx.exec(fileContent)) !== null) {
    result.push(execResult![0]);
  }
  return result;
}

export function readFileSync(path: string): string | undefined {
  return jetpack.read(path);
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

export function gitCommitAll(repoPath: string, message: string): Promise<any> {
  return executeCommand('git', ['commit', '-am', message], repoPath);
}

export function newTmpDir(): string {
  return dirSync().name;
}

export function newTmpFile(): string {
  return fileSync().name;
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
  const log: Logger = <any>((message: any, ...args: any[]) => { console.log(message, ...args); });
  log.error = (message: any, ...args: any[]) => { console.log('[ERROR] ' + message, ...args); };
  log.debug = (message: any, ...args: any[]) => { console.log('[DEBUG] ' + message, ...args); };
  const result: ExtensionApi = {
    log,
    registerTask(): Promise<void> {
      return Promise.resolve();
    }
  };
  return result;
}
export function makePath(part1: string, part2: string): string;
export function makePath(part1: string, part2: string, part3: string): string;
export function makePath(part1: string, part2: string, part3?: string): string {
  if (part3) {
    return makePath(makePath(part1, part2), part3);
  }
  let p1 = part1;
  let p2 = part2;
  if (p1.endsWith('/')) {
    p1 = p1.substring(0, p1.length - 1);
  }
  if (!p2.startsWith('/')) {
    p2 = '/' + p2;
  }
  return p1 + p2;
}
