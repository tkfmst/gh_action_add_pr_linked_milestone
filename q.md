```
query PullReqLinkedCommitAndMilestone {
  repository(name: "cel", owner: "compass-inc") {
    id
    pullRequest(number: 3441) {
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
```
