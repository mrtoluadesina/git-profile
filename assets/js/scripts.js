// open mobile menu
let button = document.querySelector('.hamburger');
let drawer = document.querySelector(".header-menu-drawer");

button.addEventListener('click', (e) => {
  e.preventDefault();
  drawer.classList.toggle('show-nav');
});

//fetch the repos
(function () {
  console.log('I am here')
  const getRepos = (username) => `{
    user(login: "${username}") {
      repositories(last: 20) {
        edges {
          node {
            id
            isPrivate
            name
            shortDescriptionHTML(limit:100)
            primaryLanguage {
              color
              name
            }
            stargazerCount
            forkCount
            updatedAt
          }
        }
      }
    }
  }`

  const renderRepos = ({ data: { user: { repositories } } }) => {
    const { edges } = repositories;
    console.log(edges);
    return edges.reverse().map(({ node }) => {
      return `<div class="repo dflex align-start justify-between full-width">
      <div class="repo-details dflex flex-col align-start">
        <h3 class="repo-title dflex justify-start">
          <a href="/">${node.name}</a>
          ${node.isPrivate && `<span class="badge dflex ml-0-4">Private</span>`}
        </h3>
        ${node.shortDescriptionHTML && `<p class="repo-description small-text mt-0-8">${node.shortDescriptionHTML}</p>`}
        <div class="repo-meta dflex justify-start mt-0-4 flex-wrap">
          <div class="meta-box dflex justify-start mr-1 mt-0-4">
            <span class="language-color mr-0-4" style="background-color: ${node.primaryLanguage?.color}"></span>
            <p class="x-small-text">${node.primaryLanguage?.name}</p>
          </div>
          ${node.stargazerCount && `<div class="meta-box dflex justify-start mr-1 mt-0-4">
            <svg class="svg-icon icon-star mr-0-4" viewBox="0 0 16 16" version="1.1" width="16" height="16"
              aria-hidden="true">
              <path fill-rule="evenodd"
                d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z">
              </path>
            </svg>
            <p class="x-small-text">${node.stargazerCount}</p>
          </div>`}
          ${node.forkCount && `<div class="meta-box dflex justify-start mr-1 mt-0-4">
            <svg aria-label="fork" class="svg-icon icon-forked-repo mr-0-4" viewBox="0 0 16 16" version="1.1"
              width="16" height="16" role="img">
              <path fill-rule="evenodd"
                d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z">
              </path>
            </svg>
            <p class="x-small-text">${node.forkCount}</p>
          </div>`}
          <div class="meta-box dflex justify-start mr-0-8 mt-0-4">
            <p class="x-small-text">Updated on ${node.updatedAt}</p>
          </div>
        </div>
      </div>
      <a class="btn">
        <svg class="svg-icon icon-star mr-0-4" viewBox="0 0 16 16" version="1.1" width="16" height="16"
          aria-hidden="true">
          <path fill-rule="evenodd"
            d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z">
          </path>
        </svg>
        <p>Star</p>
      </a>
    </div>`
    })
  }

  const config = {
    method: 'POST',
    headers: {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 8e81bfd2b84d03eb050ad0d535dae950dc2c2094"
      },
      body: JSON.stringify({
        // Change username here to fetch github user repos - last:20
        query: getRepos("mrtoluadesina"),
      }),
      mode: 'cors'
    }
  }

  fetch('https://api.github.com/graphql', config)
    .then(res => res.json())
    .then(renderRepos);

  let repoContainer = document.querySelector('#repo-container');
  repoContainer.innerHTML = renderRepos();
   
})();