
## 🪄 Azure DevOps PR Comparison Plugin

![version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![manifest](https://img.shields.io/badge/manifest-extension%20V3-green.svg)
![size](https://img.shields.io/badge/size-1.4%20MB-brightgreen.svg)
![semanticui](https://img.shields.io/badge/semantic%20ui-2.3.1-pink.svg)
![browsers](https://img.shields.io/badge/browsers-chrome%20edge%20%28chromium%29-yellow.svg)

A chromium extension that helps compare with additional commit when reviewing pull requests on Azure DevOps.

<img src="/imgs/detail.png?raw=true">

| <img src="/imgs/sample.png?raw=true"> | <img src="/imgs/diff.png?raw=true"> |
| :-: | :-: |


### 💭 Why I Need This

Image the scenario below:

<img src="/imgs/scenario.png?raw=true">

<span style="color:blue">A new feature called feature/5</span> has been integrated and tested in the latest dev branch. And now, we want to bring it back and make it also available on an existing release <span style="color:blue">named 21H2</span>. Thus, one of the engineer check-picks all the commits (while resolving conflicts) and <span style="color:red">creates a pull request targeting branch release/21H2.</span>

The PR will of course list all the touched files as usual. However, this might not be comprehensive enough for reviewers to approve. For example, we might also want to check whether all the changes has be properly picked, and what the tiny difference between the migrated and the original one could be, especially when branch release/21H2 does not have feature no.2 and no.4. As a result, <span style="color:green">an additional page showing the diff between feature/5 and feature/5-on-21H2</span> should be very helpful.


### 🔧 How To Use

After installing the unpacked extension package (will need to toggle developer mode), fill in the commit ID of the original feature (e.g., the HEAD of branch feature/5) in popup text box.

Refresh the PR page, and a new diff button will be displayed next to the button "View". It is linked to the ADO's built-in comparison page, with specific parameters fulfilled (so it can show the diff between HEAD of feature/5 and feature/5-on-21H2).


### 💡 How This Works

The plugin finds the current branch name (a.k.a., the PR request's source branch) by class name filter: `pr-header-branches`. Please refer to [tryGetCurrentBranchName()](https://github.com/der3318/extension-adoprcmp/blob/c73a9ada1690ef3d41e5c9fdbbf34168335411e0/content.js#L9) for more info.

The plugin also locates the "View" spans (i.e., where the diff buttons will be shown) by class name filter: `flex-row flex-grow justify-end`. Additional logics can be found in [renderDiffLinks()](https://github.com/der3318/extension-adoprcmp/blob/c73a9ada1690ef3d41e5c9fdbbf34168335411e0/content.js#L60).

The URL of the comparison page has the following format: `https://${AzureRepoRoot}?path=${FilePath}&_a=compare&mversion=GC${TargetCommitId}&oversion=GB${PullRequestBranchName}`. What the extension does is simply putting in all the correct info to make the link works as expected.
