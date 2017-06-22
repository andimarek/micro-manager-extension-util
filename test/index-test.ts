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
  replaceInFileSync,
  findMatchInFileSync,
  createSimpleBareRepoWithBranches,
  gitClone
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
    replaceInFileSync(tmpFile, { key1: 'newKey1', key3: 'newKey3' })
    expect(readFileSync(tmpFile)).to.equal('newKey1, key2, newKey3');
  });

  it('find match in file', () => {
    const tmpFile = newTmpFile();
    writeFileSync(tmpFile, "key1\nkey2 = 'hallo' key2 = ''\nkey3");
    const result = findMatchInFileSync(tmpFile, /^key2 = '[^']*'/);
    expect(result.length).to.equal(1);
    expect(result[0]).to.equal("key2 = 'hallo'");
  });

  it('create bare repo', () => {
    const tmpDir = newTmpDir();
    const targetDir = newTmpDir();
    const masterDir = makePath(targetDir, 'master');
    const branchDir = makePath(targetDir, 'branch');
    console.log('creating test repo in ', tmpDir);
    return createSimpleBareRepoWithBranches(tmpDir, {
      master: {
        file1: 'Hello 1'
      },
      otherBranch: {
        file2: 'Hello 2'
      }
    }).then(() => {
      return gitClone(tmpDir, masterDir, targetDir);
    }).then(() => {
      return gitClone(tmpDir, branchDir, targetDir, 'otherBranch');
    }).then(() => {
      expect(readFileSync(makePath(masterDir,'file1'))).to.equal('Hello 1');
      expect(readFileSync(makePath(branchDir,'file2'))).to.equal('Hello 2');
    });
  });

});