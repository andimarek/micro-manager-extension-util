import { gitCommit, gitSetEmailAndUser, makePath, existsFile, newTmpDir, gitInit, gitAdd, touchFile, createMockExtensionApi, gitStatus } from '../src/index';
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
    await touchFile(testFile);
    expect(await gitStatus(repo, 'test.txt')).to.equal('? test.txt\n');
    await gitAdd(repo, 'test.txt');
    await gitCommit(repo, 'add new file');
    expect(await gitStatus(repo, 'test.txt')).to.equal('')
  });

});