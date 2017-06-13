import {
  gitCommit,
  gitSetEmailAndUser,
  makePath,
  existsFile,
  newTmpDir,
  gitInit,
  gitAdd,
  touchFileSync,
  createMockExtensionApi,
  gitStatus,
  newTmpFile,
  writeFileSync,
  readFileSync,
  replaceInFileSync
} from '../src/index';
import { expect } from 'chai';

describe('test', () => {

  before(() => {
    (<any>global).mm = createMockExtensionApi();
  });

  it('existsFile', () => {
    const tmpDir = newTmpDir();
    expect(existsFile(tmpDir)).to.equal('dir');
  });

  it('git init', async () => {
    const tmpDir = newTmpDir();
    await gitInit(tmpDir);
    const status = await gitStatus(tmpDir);
    expect(status).to.equal('');
  });

  it('git commmit', async () => {
    const repo = newTmpDir();
    await gitInit(repo);
    await gitSetEmailAndUser(repo, 'mail@example.com', 'user');
    const testFile = makePath(repo, 'test.txt');
    await touchFileSync(testFile);
    expect(await gitStatus(repo, 'test.txt')).to.equal('? test.txt\n');
    await gitAdd(repo, 'test.txt');
    await gitCommit(repo, 'add new file');
    expect(await gitStatus(repo, 'test.txt')).to.equal('')
  });

  it('write to file', () => {
    const tmpFile = newTmpFile();
    writeFileSync(tmpFile, 'test');
    expect(readFileSync(tmpFile)).to.equal('test');
  });

  it('replace in file', () => {
    const tmpFile = newTmpFile();
    writeFileSync(tmpFile, 'key1, key2, key3');
    replaceInFileSync(tmpFile, {key1: 'newKey1', key3: 'newKey3'})
    expect(readFileSync(tmpFile)).to.equal('newKey1, key2, newKey3');
  });

});