import { existsFile, newTmpDir, gitInit, createMockExtensionApi, gitStatus } from '../src/index';
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
});