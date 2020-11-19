// open mobile menu
let button = document.querySelector('.hamburger');
let drawer = document.querySelector(".header-menu-drawer");

button.addEventListener('click', (e) => {
  e.preventDefault();
  drawer.classList.toggle('show-nav');
});

//fetch the repos
(function () {
  const getRepos = (username) => `{
    user(login: "${username}") {
      name
      login
      avatarUrl
      bio
      email
      company
      websiteUrl
      followers {
        totalCount
      }
      following {
        totalCount
      }
      starredRepositories {
        totalCount
      }
      status {
        emojiHTML
        message
      }
      location
      repositories(first: 20, ownerAffiliations: OWNER, orderBy: {field: PUSHED_AT, direction: DESC}) {
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
            pushedAt
            licenseInfo {
              name
            }
            url
          }
        }
      }
    }
  }`

  //Converts Datetime to last updated format
function updatedAt(date) {
  let repoDate = new Date(date);

  let today = new Date();

  const minute = 60 * 1000,
        hour = 60 * minute,
        day = 24 * hour,
        month = 30 * day;

  function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  const timeDifference = today.getTime() - repoDate.getTime();

  let seconds = Math.floor(repoDate.getTime() / 1000);
  let currentSeconds = Math.floor(today.getTime() / 1000);
  let dateMonth = repoDate.getMonth();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();
  let currentDay = today.getDate();
  let dateDay = repoDate.getDate();
  let dayDifference = currentDay - dateDay;

  const daysInCurrentMonth = daysInMonth(currentMonth, currentYear);
  const secondsDifference = currentSeconds - seconds;

  const isThisMonth = today.getMonth() === dateMonth;
  const isThisYear = today.getFullYear() === repoDate.getFullYear();

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];

  //Return day and year updated if date not in current year
  if (isThisYear) {
    if (!isThisMonth) {
      return `Updated on ${repoDate.getDate()} ${monthNames[dateMonth]}`;
    }

    if (currentDay < daysInCurrentMonth && dayDifference > 0) {
      return `Updated ${dayDifference} ${dayDifference > 1 ? 'days' : 'day'
        } ago`;
    }

    switch (true) {
      case Math.floor(timeDifference / month) > 1:
        return `Updated ${Math.floor(timeDifference / month)} minutes ago`;

      case Math.floor(timeDifference / minute) > 1:
        if (Math.floor(timeDifference / minute) > 60) {
          return `Updated ${Math.floor(
            timeDifference / minute / 60,
          )} hours ago`;
        }

        return `Updated ${Math.floor(timeDifference / minute)} minutes ago`;

      default:
        return `Updated ${secondsDifference} seconds ago`;
    }
  } else {
    return `Updated on ${repoDate.getDate()} ${monthNames[dateMonth]
      } ${repoDate.getFullYear()}`;
  }
}

  const renderUserData = ({ data: { user } }) => {
    return `<section class="user-info switch-row-col dflex justify-start full-width">
    <div class="profile-picture">
      <div class="avatar">
        <img
          src=${user.avatarUrl}
          alt="avatar" />
      </div>
      ${user.status ? `<div class="status dflex justify-start">
        <span class="status-icon">
          ${user.status.emojiHTML}
        </span>
        <p class="x-small-text">${user.status.message}</p>
      </div>` : ''}
    </div>
    <div class="user-bio">
      <h2>${user.name ? user.name : ''}</h2>
      <p>${user.login ? user.login : ''}</p>
    </div>
  </section>
  <section class="profile-details dflex flex-col align-start full-width mb">
    <p class="mb">${user.bio ? user.bio : ''}</p>
    <button class="btn full-width">Edit profile</button>
    <div class="details-list dflex flex-col align-start">
      <div class="dflex flex-col show-hide">
        ${user.company ? `<div class="list-item dflex justify-start">
          <svg class="list-item-icon icon-organization mr-0-4" viewBox="0 0 16 16" version="1.1" width="16"
            height="16" aria-hidden="true">
            <path fill-rule="evenodd"
              d="M1.5 14.25c0 .138.112.25.25.25H4v-1.25a.75.75 0 01.75-.75h2.5a.75.75 0 01.75.75v1.25h2.25a.25.25 0 00.25-.25V1.75a.25.25 0 00-.25-.25h-8.5a.25.25 0 00-.25.25v12.5zM1.75 16A1.75 1.75 0 010 14.25V1.75C0 .784.784 0 1.75 0h8.5C11.216 0 12 .784 12 1.75v12.5c0 .085-.006.168-.018.25h2.268a.25.25 0 00.25-.25V8.285a.25.25 0 00-.111-.208l-1.055-.703a.75.75 0 11.832-1.248l1.055.703c.487.325.779.871.779 1.456v5.965A1.75 1.75 0 0114.25 16h-3.5a.75.75 0 01-.197-.026c-.099.017-.2.026-.303.026h-3a.75.75 0 01-.75-.75V14h-1v1.25a.75.75 0 01-.75.75h-3zM3 3.75A.75.75 0 013.75 3h.5a.75.75 0 010 1.5h-.5A.75.75 0 013 3.75zM3.75 6a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zM3 9.75A.75.75 0 013.75 9h.5a.75.75 0 010 1.5h-.5A.75.75 0 013 9.75zM7.75 9a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zM7 6.75A.75.75 0 017.75 6h.5a.75.75 0 010 1.5h-.5A.75.75 0 017 6.75zM7.75 3a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5z">
            </path>
          </svg>
          <p class="small-text"><strong>${user.company}</strong></p>
        </div>` : ''}
        ${user.location ? `<div class="list-item dflex justify-start">
          <svg class="list-item-icon icon-location mr-0-4" viewBox="0 0 16 16" version="1.1" width="16"
            height="16" aria-hidden="true">
            <path fill-rule="evenodd"
              d="M11.536 3.464a5 5 0 010 7.072L8 14.07l-3.536-3.535a5 5 0 117.072-7.072v.001zm1.06 8.132a6.5 6.5 0 10-9.192 0l3.535 3.536a1.5 1.5 0 002.122 0l3.535-3.536zM8 9a2 2 0 100-4 2 2 0 000 4z">
            </path>
          </svg>
          <p class="small-text">${user.location}</p>
        </div>` : ''}
      </div>
      ${user.email ? `<div class="list-item dflex justify-start">
        <svg class="list-item-icon icon-mail mr-0-4" viewBox="0 0 16 16" version="1.1" width="16" height="16"
          aria-hidden="true">
          <path fill-rule="evenodd"
            d="M1.75 2A1.75 1.75 0 000 3.75v.736a.75.75 0 000 .027v7.737C0 13.216.784 14 1.75 14h12.5A1.75 1.75 0 0016 12.25v-8.5A1.75 1.75 0 0014.25 2H1.75zM14.5 4.07v-.32a.25.25 0 00-.25-.25H1.75a.25.25 0 00-.25.25v.32L8 7.88l6.5-3.81zm-13 1.74v6.441c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V5.809L8.38 9.397a.75.75 0 01-.76 0L1.5 5.809z">
          </path>
        </svg>
        <p class="small-text">${user.email}</p>
      </div>` : ''}
      ${user.websiteUrl ? `<div class="list-item dflex justify-start">
        <svg class="list-item-icon icon-web mr-0-4" viewBox="0 0 16 16" version="1.1" width="16" height="16"
          aria-hidden="true">
          <path fill-rule="evenodd"
            d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z">
          </path>
        </svg>
        <p class="small-text">${user.websiteUrl}</p>
      </div>` : ''}
      <div class="list-group dflex flex-wrap justify-start">
        ${user.followers ? `<div class="list-item dflex justify-start">
          <svg class="list-item-icon icon-user mr-0-4" height="16" viewBox="0 0 16 16" version="1.1" width="16"
            aria-hidden="true">
            <path fill-rule="evenodd"
              d="M5.5 3.5a2 2 0 100 4 2 2 0 000-4zM2 5.5a3.5 3.5 0 115.898 2.549 5.507 5.507 0 013.034 4.084.75.75 0 11-1.482.235 4.001 4.001 0 00-7.9 0 .75.75 0 01-1.482-.236A5.507 5.507 0 013.102 8.05 3.49 3.49 0 012 5.5zM11 4a.75.75 0 100 1.5 1.5 1.5 0 01.666 2.844.75.75 0 00-.416.672v.352a.75.75 0 00.574.73c1.2.289 2.162 1.2 2.522 2.372a.75.75 0 101.434-.44 5.01 5.01 0 00-2.56-3.012A3 3 0 0011 4z">
            </path>
          </svg>
          <p class="small-text"><strong>${user.followers.totalCount}</strong> followers</p>
        </div>` : ''}
        ${user.following ? `·
        <div class="list-item dflex justify-start">
          <p class="small-text"><strong>${user.following.totalCount}</strong> following</p>
        </div>` : ''}
        ${user.starredRepositories ? `·
        <div class="list-item dflex justify-start">
          <svg class="list-item-icon icon-rate mr-0-4" height="16" viewBox="0 0 16 16" version="1.1" width="16"
            aria-hidden="true">
            <path fill-rule="evenodd"
              d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z">
            </path>
          </svg>
          <p class="small-text"><strong>${user.starredRepositories.totalCount}</strong></p>
        </div>` : ''}
      </div>
    </div>
  </section>`
  }

  const renderRepos = ({ data: { user: { repositories } } }) => {
    const { edges } = repositories;
    return edges.map(({ node }) => {
      return `<div class="repo dflex align-start justify-between full-width">
      <div class="repo-details dflex flex-col align-start">
        <h3 class="repo-title dflex justify-start">
          <a href="/">${node.name}</a>
          ${node.isPrivate ? `<span class="badge dflex ml-0-4">Private</span>` : ''}
        </h3>
        ${node.shortDescriptionHTML ? `<p class="repo-description small-text mt-0-8">${node.shortDescriptionHTML}</p>` : ''}
        <div class="repo-meta dflex justify-start mt-0-4 flex-wrap">
          ${node.primaryLanguage ? `<div class="meta-box dflex justify-start mr-1 mt-0-4">
            <span class="language-color mr-0-4" style="background-color: ${node.primaryLanguage?.color}"></span>
            <p class="x-small-text">${node.primaryLanguage?.name}</p>
          </div>` : ""}
          ${node.stargazerCount ? `<div class="meta-box dflex justify-start mr-1 mt-0-4">
            <svg class="svg-icon icon-star mr-0-4" viewBox="0 0 16 16" version="1.1" width="16" height="16"
              aria-hidden="true">
              <path fill-rule="evenodd"
                d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z">
              </path>
            </svg>
            <p class="x-small-text">${node.stargazerCount}</p>
          </div>` : ''}
          ${node.forkCount ? `<div class="meta-box dflex justify-start mr-1 mt-0-4">
            <svg aria-label="fork" class="svg-icon icon-forked-repo mr-0-4" viewBox="0 0 16 16" version="1.1"
              width="16" height="16" role="img">
              <path fill-rule="evenodd"
                d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z">
              </path>
            </svg>
            <p class="x-small-text">${node.forkCount}</p>
          </div>` : ''}
          ${node.licenseInfo ? `<div class="meta-box dflex justify-start mr-1 mt-0-4">
          <svg class="svg-icon icon-law mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.75.75a.75.75 0 00-1.5 0V2h-.984c-.305 0-.604.08-.869.23l-1.288.737A.25.25 0 013.984 3H1.75a.75.75 0 000 1.5h.428L.066 9.192a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.514 3.514 0 00.686.45A4.492 4.492 0 003 11c.88 0 1.556-.22 2.023-.454a3.515 3.515 0 00.686-.45l.045-.04.016-.015.006-.006.002-.002.001-.002L5.25 9.5l.53.53a.75.75 0 00.154-.838L3.822 4.5h.162c.305 0 .604-.08.869-.23l1.289-.737a.25.25 0 01.124-.033h.984V13h-2.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-2.5V3.5h.984a.25.25 0 01.124.033l1.29.736c.264.152.563.231.868.231h.162l-2.112 4.692a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.517 3.517 0 00.686.45A4.492 4.492 0 0013 11c.88 0 1.556-.22 2.023-.454a3.512 3.512 0 00.686-.45l.045-.04.01-.01.006-.005.006-.006.002-.002.001-.002-.529-.531.53.53a.75.75 0 00.154-.838L13.823 4.5h.427a.75.75 0 000-1.5h-2.234a.25.25 0 01-.124-.033l-1.29-.736A1.75 1.75 0 009.735 2H8.75V.75zM1.695 9.227c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L3 6.327l-1.305 2.9zm10 0c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L13 6.327l-1.305 2.9z"></path></svg>
            <p class="x-small-text">${node.licenseInfo?.name}</p>
          </div>` : ''}
          <div class="meta-box dflex justify-start mr-0-8 mt-0-4">
            <p class="x-small-text">${updatedAt(node.pushedAt)}</p>
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
    }).join('')
  }

  const config = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      //Change Token here to be able to see list of repositories
      "Authorization": `Bearer [token]`
    },
    body: JSON.stringify({
      // Change username here to fetch github user repos - last:20
      query: getRepos("mrtoluadesina"),
    }),
  }

  fetch('https://api.github.com/graphql', config)
    .then(res => res.json())
    .then(res => {
      let userDetailsContainer = document.querySelector("#user-details");
      let repoContainer = document.querySelector('#repo-container');
      userDetailsContainer.innerHTML = renderUserData(res);
      repoContainer.innerHTML = renderRepos(res);
    });

})();