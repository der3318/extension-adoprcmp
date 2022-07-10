
function syncCommitId() {
    chrome.storage.sync.get("commitId", function (data) {
        if (data.commitId === undefined) return;
        commitId = data.commitId;
    });
}

function tryGetCurrentBranchName() {
    // find <span class="pr-header-branches"> sections
    let branchesSpans = document.getElementsByClassName("pr-header-branches");

    // not found or multiple results
    if (branchesSpans === undefined || branchesSpans.length != 1) {
        return undefined;
    }
    
    // locate the only one span
    let branchesSpan = branchesSpans[0];
    
    // num of sub nodes shoud be exactly 5
    if (branchesSpan.childNodes.length != 5) {
        return undefined;
    }

    // return branch name string
    return branchesSpan.childNodes[1].innerHTML;
}

function shouldRenderDiffLinkBesidesViewButton(element) {
    if (element.childNodes.length > 0 && element.childNodes[0].textContent === "View") {
        return true;    // view button is the first element inside the section
    }
    return false;       // view button not found, or diff link already added
}

function renderDiffLink(element, currentBranchName) {
    // find file path from view button's param
    let path = new URL(element.childNodes[0].href).searchParams.get("path");

    // find ado URL from view button's URL
    let page = new URL("../", element.childNodes[0].href).href;

    // compose diff link URL
    let href = `${page}?path=${path}&_a=compare&mversion=GC${commitId}&oversion=GB${currentBranchName}`;
    
    // append link HTML to the head of section
    let html = `
        <a  class="flex-end bolt-button bolt-link-button enabled bolt-focus-treatment
            data-focuszone="
            data-is-focusable="true"
            href="${href}"
            role="link"
            tabindex="0"
        > 🪄 Diff ${commitId.substring(0, 8)} </a>
    `;
    element.innerHTML = html + element.innerHTML;
}

function renderDiffLinks()
{
    let branchName = tryGetCurrentBranchName();
    if (branchName === undefined) {
        return;
    }

    // find <div class="flex-row flex-grow justify-end"> sections
    let elements = document.getElementsByClassName("flex-row flex-grow justify-end");
    
    for (var idx = 0; idx < elements.length; idx++) {
        var element = elements[idx];
        if (shouldRenderDiffLinkBesidesViewButton(element)) {
            renderDiffLink(element, branchName);
        }
    }
}

function startTimer() {
    syncCommitId();
    // rerun every 5s because page contents may change dynamically
    setInterval(renderDiffLinks, pageUpdateTime);
}

var commitId = "4d9f05e9a9ae93304c4b0f78fe0657876a2510f9";
var pageUpdateTime = 5000;
window.onload = startTimer;
