// fetch('http://localhost:7777/video-request').then(res => console.log(res))

document.addEventListener('DOMContentLoaded', () => {
  
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
                <strong>Expected results:</strong> ${req.expected_result}
              </p>
            </div>
            <div class="d-flex flex-column text-center">
              <a class="btn btn-link">🔺</a>
              <h3>${req.votes.ups + req.votes.downs}</h3>
              <a class="btn btn-link">🔻</a>
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



  // Send Request
  const formVideoReq = document.getElementById('videoReqForm');
  formVideoReq.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(formVideoReq);
    submitVideosRequest(formData)
  });

})



async function getVideoRequests() {
  const response = await fetch('http://localhost:7777/video-request');
  return response.json();
}


async function submitVideosRequest(data) {
  const response = await fetch('http://localhost:7777/video-request', {
    method: 'POST',
    body: data
  });
  return response.json();
}
