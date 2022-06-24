
function isEmpty(str) {
    return (!str || str.length === 0 );
}

function updateCommitId() {
    if (isEmpty(document.getElementById("commit-id").value)) {
        console.log(document.getElementById("commit-id").value);
        chrome.storage.sync.get("commitId", function (data) {
            if (data.commitId === undefined) return;
            document.getElementById("commit-id").value = data.commitId;
        });
    }
    else {
        chrome.storage.sync.set({ commitId: document.getElementById("commit-id").value });
    }
}

function startTimer() {
    updateCommitId();
    setInterval(updateCommitId, configUpdateTime);
}

var configUpdateTime = 5000;
window.onload = startTimer;
