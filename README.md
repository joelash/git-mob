# Git Mob [![npm version](https://badge.fury.io/js/git-mob.svg)](https://www.npmjs.com/package/git-mob) [![build status](https://travis-ci.org/findmypast-oss/git-mob.svg?branch=master)](https://travis-ci.org/findmypast-oss/git-mob)

A command-line tool for social coding. Includes co-authors in commits.

Whether you're pairing with a buddy at a shared computer, or mobbing with your
team in front of a projector, git mob has got you covered.

![Use git mob gif animation](https://github.com/findmypast-oss/git-mob/blob/master/docs/git-mob-intro.gif)

## Install

**Warning: This package hasn't reached v1.0.0 yet. There may be many missing
features, lots of bugs, and the API could change until we reach a stable version.**

git-mob is a CLI tool, so you'll need to install the package globally.

```
npm i -g git-mob
```

## Workflow / Usage

With git-mob, the primary author will always be the primary user of the computer.
Set your author info in git if you haven't done so before.

```
$ git config --global user.name "Jane Doe"
$ git config --global user.email "jane@example.com"
```

To keep track of potential co-authors, git-mob uses a JSON file called `~/.git-coauthors`.
Here's a template of its structure.

```
{
  "coauthors": {
    "initials": {
      "name": "<name>",
      "email": "<email>"
    }
  }
}
```

Start by adding a few co-authors that you work with.

```
$ cat <<-EOF > ~/.git-coauthors
{
  "coauthors": {
    "jd": {
      "name": "Jane Doe",
      "email": "jane@findmypast.com"
    },
    "fb": {
      "name": "Frances Bar",
      "email": "frances-bar@findmypast.com"
    }
  }
}
EOF
```

You're ready to create your mob. Tell git-mob you're pairing with Amy by using her initials.

```
$ git mob ad
Jane Doe <jane@example.com>
Amy Doe <amy@example.com>
```

Commit like you normally would.
You should see `Co-authored-by: Amy Doe <amy@example.com>` appear at the end of the commit message.

Let's add Bob to the group to create a three-person mob.

```
$ git mob ad bd
Jane Doe <jane@example.com>
Amy Doe <amy@example.com>
Bob Doe <bob@example.com>
```

Once you're done mobbing, switch back to developing solo.

```
$ git solo
Jane Doe <jane@example.com>
```

Find out more with `git mob --help`
