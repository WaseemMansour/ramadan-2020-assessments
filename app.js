
document.addEventListener('DOMContentLoaded', () => {
  // Initial Data from DB
  updateVidReqUI();
  
  // Listen to Form Submit Request
  const formVideoReq = document.getElementById('videoReqForm');
  formVideoReq.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(formVideoReq);
    submitVideosRequest(formData, updateVidReqUI);
    formVideoReq.reset()
  });

})

function updateVidReqUI() {
  // Get And Display Video Requests
  const listContainer = document.getElementById('listOfRequests');
  let requestsListHtml = '';
  getVideoRequests()
    .then(res => {
      if (res.length) {
        
        requestsListHtml = res.map(req => {
          const submitDate = new Date(req.submit_date)
          const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
          const formatedDate = submitDate.toLocaleDateString('en-US', options)
          return `<div class="card mb-3">
          <div class="card-body d-flex justify-content-between flex-row">
            <div class="d-flex flex-column">
              <h3>${req.topic_title}</h3>
              <p class="text-muted mb-2">${req.topic_details}</p>
              <p class="mb-0 text-muted">
                ${
                  req.expected_result ?
                  `<strong>Expected results:</strong> ${req.expected_result}`
                  : ``
                }
              </p>
            </div>
            <div class="d-flex flex-column text-center">
              <a class="btn btn-link" onClick="updateReqVote('${req._id}', 'ups');">🔺</a>
              <h3 id="vote-score__${req._id}">${req.votes.ups - req.votes.downs}</h3>
              <a class="btn btn-link" onClick="updateReqVote('${req._id}', 'downs');">🔻</a>
            </div>
          </div>
          <div class="card-footer d-flex flex-row justify-content-between">
            <div>
              <span class="text-info">${req.status}</span>
              &bullet; added by <strong>${req.author_name}</strong> on
              <strong>${formatedDate}</strong>
            </div>
            <div
              class="d-flex justify-content-center flex-column 408ml-auto mr-2"
            >
              <div class="badge badge-success">
                ${req.target_level}
              </div>
            </div>
          </div>
        </div>`
        })

        listContainer.innerHTML = requestsListHtml;
      }
    }
  );
}

function updateReqVote (id, vote_type) {
  updateVote(id, vote_type)
    .then(videoVoted => {
      const requestEl = document.getElementById(`vote-score__${videoVoted._id}`);
      requestEl.innerText = +videoVoted.votes.ups - +videoVoted.votes.downs;
    })
}

/**
 * Submit Vote Up/Down on Video Request
 * @param {*} id Video Request ID
 * @param {*} vote_type "ups" OR "downs"
 */
async function updateVote(id, vote_type) {
  const data = {id: id, vote_type: vote_type};
  const response = await fetch('http://localhost:7777/video-request/vote', {
    method: 'PUT',
    headers: {
      'content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
}

/**
 * Get All Video Requests
 */
async function getVideoRequests() {
  const response = await fetch('http://localhost:7777/video-request');
  return response.json();
}

/**
 * Submit New Video Request to DB
 * @param {*} data Form Data
 * @param {Function} cb Optional Call Back Func to fire after submission.
 */
async function submitVideosRequest(data, cb = null) {
  const response = await fetch('http://localhost:7777/video-request', {
    method: 'POST',
    body: data
  });
  if (cb) cb();
  return response.json();
}
