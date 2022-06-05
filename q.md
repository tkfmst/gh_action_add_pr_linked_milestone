```
query PullReqLinkedCommitAndMilestone {
  repository(name: "cel", owner: "compass-inc") {
    id
    pullRequest(number: 3441) {
      id
      title
      commits(first: 5, after: "MzU") {
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
```
