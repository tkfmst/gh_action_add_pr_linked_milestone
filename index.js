const core = require("@actions/core");
const github = require("@actions/github");
// const graphql = require("@octokit/graphql");

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

    const repo_names = payloadContext.repository.full_name.split("/");

    const pull = payloadContext.pull_request;
    failIfMissing(pull, "Can't find pull request");
    const pull_number = pull.number;

    const octokit = new github.getOctokit(token);

    console.log(payloadContext.repository);
    let cursor = "";
    const result = await octokit.graphql(
      `
        query PullReqLinkedCommitAndMilestone($pull_number: Int!, $repo_name: String!, $repo_owner: String!, $cursor: String!) {
          repository(name: $repo_name, owner: $repo_owner) {
            id
            pullRequest(number: $pull_number) {
              id
              title
              commits(first: 100, after: $cursor) {
                nodes {
                  commit {
                    id
                    message
                    associatedPullRequests(first: 1) {
                      nodes {
                        title
                        milestone {
                          title
                        }
                      }
                    }
                  }
                }
                pageInfo {
                  endCursor
                  hasNextPage
                }
              }
            }
          }
        }
      `,
      {
        pull_number: pull_number,
        repo_name: repo_names[1],
        repo_owner: repo_names[0],
        cursor: cursor,
      }
    );

    console.log(result.toSource());
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
