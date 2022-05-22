const core = require("@actions/core");
const github = require("@actions/github");

// most @actions toolkit packages have async methods
async function run() {
  try {
    core.info(`test2`);

    const token = core.getInput("token");
    failIfMissing(token, "Can't find token");

    const payloadContext = github.context.payload;
    failIfMissing(payloadContext, "Can't find payload context");
    failIfMissing(payloadContext.repository, "Can't find repository");
    failIfMissing(payloadContext.repository.owner, "Can't find owner");
    failIfMissing(payloadContext.repository.owner.login, "Can't find owner");

    const pull = payloadContext.pull_request;
    failIfMissing(pull, "Can't find pull request");
    // const pull_number = pull.number;

    const octokit = new github.getOctokit(token);

    core.info(await octokit.pulls);
    // const commitsListed = await octokit.pulls.listCommits({
    //   owner: payloadContext.repository.owner.login,
    //   repo: payloadContext.repository.name,
    //   pull_number: pull_number,
    // });

    // let commits = commitsListed.data;
    //
    // for (const { commit, sha } of commits) {
    //   core.info(`pr number: ${commit.pull_number}, sha: ${sha}`);
    // }
  } catch (error) {
    core.setFailed(error.message);
  }
}

function failIfMissing(val, errorMessage) {
  if (!val) {
    throw new Error(errorMessage);
  }
}

run();
