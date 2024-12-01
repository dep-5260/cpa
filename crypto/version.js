
var version = "0.0.8";
var versionUrl = "https://raw.githubusercontent.com/dep-5260/cpa/refs/heads/main/.version";
function checkVersion() {
  fetch(versionUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(data => {
      var remoteVersion = data.trim();
      if (remoteVersion === version) {
        document.getElementById('outdated').style.display = 'none'
      } else {
        document.getElementById('outdated').style
        .display = 'block'
      }
    })
    .catch(error => {
      console.error('Error fetching the version:', error);
    });
}

checkVersion();