#! /usr/bin/env node

const path = require('path');
const { spawnSync } = require('child_process');
const minimist = require('minimist');
const { oneLine } = require('common-tags');
const { gitAuthors } = require('../git-authors');
const { gitMessage } = require('../git-message');
const { runHelp, runVersion } = require('../helpers');

const gitMessagePath =
  process.env.GITMOB_MESSAGE_PATH ||
  commitTemplatePath() ||
  path.join('.git', '.gitmessage');

const argv = minimist(process.argv.slice(2), {
  alias: {
    h: 'help',
    v: 'version',
  },
});

if (argv.help) {
  runHelp();
  process.exit(0);
}
if (argv.version) {
  runVersion();
  process.exit(0);
}

runMob(argv._);

function runMob(args) {
  if (args.length === 0) {
    printMob();
  } else {
    setMob(args);
  }
}

function printMob() {
  console.log(author());

  if (isCoAuthorSet()) {
    console.log(coauthors());
  }
}

function setMob(initials) {
  const authors = gitAuthors();
  const message = gitMessage(gitMessagePath);
  authors
    .read()
    .then(authorList => authors.coAuthors(initials, authorList))
    .then(coAuthors => {
      setCommitTemplate();
      resetMob();
      coAuthors.forEach(addCoAuthorToGitConfig);
      message.writeCoAuthors(coAuthors);
      printMob();
    })
    .catch(err => {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    });
}

function author() {
  const name = silentRun('git config user.name').stdout.trim();
  const email = silentRun('git config user.email').stdout.trim();
  return oneLine`${name} <${email}>`;
}

function coauthors() {
  return silentRun('git config --get-all git-mob.co-author').stdout.trim();
}

function isCoAuthorSet() {
  const { status } = silentRun('git config git-mob.co-author');
  return status === 0;
}

function addCoAuthorToGitConfig(coAuthor) {
  silentRun(`git config --add git-mob.co-author "${coAuthor}"`);
}

function resetMob() {
  silentRun('git config --remove-section git-mob');
}

function silentRun(command) {
  return spawnSync(command, { encoding: 'utf8', shell: true });
}

function setCommitTemplate() {
  const { status } = silentRun('git config commit.template');
  if (status !== 0) silentRun(`git config commit.template ${gitMessagePath}`);
}

function commitTemplatePath() {
  return silentRun('git config commit.template').stdout.trim();
}
