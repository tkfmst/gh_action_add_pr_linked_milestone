const core = require("@actions/core");
const github = require("@actions/github");
// const graphql = require("@octokit/graphql");

// most @actions toolkit packages have async methods
async function run() {
  try {
    core.info(`test2`);

    const token = core.getInput("token");
    failIfMissing(token, "Can't find token");

    const octokit = new github.getOctokit(token);
    const payloadContext = github.context.payload;
    failIfMissing(payloadContext, "Can't find payload context");
    failIfMissing(payloadContext.repository, "Can't find repository");
    failIfMissing(payloadContext.repository.owner, "Can't find owner");
    failIfMissing(payloadContext.repository.owner.login, "Can't find owner");

    const pull = payloadContext.pull_request;
    failIfMissing(pull, "Can't find pull request");
    const pull_number = pull.number;

    const result = await octokit.graphql(
      `
        query PullReqLinkedCommitAndMilestone {
          repository(name: "cel", owner: "compass-inc") {
            id
            pullRequest(number: $pull) {
              id
              title
              commits(first: 100) {
                nodes {
                  commit {
                    id
                    message
                    associatedPullRequests(first: 1) {
                      totalCount
                      nodes {
                        title
                        milestone {
                          title
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `,
      {
        pull: pull_number,
      }
    );

    console.log(result);
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
